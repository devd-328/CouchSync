import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendFeedbackNotification } from '@/lib/mailer';

// In-memory rate limiting map: IP address -> timestamp (ms)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const {
      type,
      rating,
      subject,
      message,
      nickname,
      email,
      show_publicly = false,
      hp,
    } = body || {};

    // 1. Honeypot check: If the hidden honeypot field is filled, silently return 200 without saving
    if (typeof hp === 'string' && hp.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 2. Validate 'type'
    if (type !== 'testimonial' && type !== 'contact') {
      return NextResponse.json(
        { error: 'Type must be either "testimonial" or "contact".' },
        { status: 400 }
      );
    }

    // 3. Validate 'rating' (required only for testimonials, 1-5 integer)
    let validatedRating: number | null = null;
    if (type === 'testimonial') {
      const numRating = Number(rating);
      if (
        rating === undefined ||
        rating === null ||
        !Number.isInteger(numRating) ||
        numRating < 1 ||
        numRating > 5
      ) {
        return NextResponse.json(
          { error: 'Rating must be an integer between 1 and 5 for testimonials.' },
          { status: 400 }
        );
      }
      validatedRating = numRating;
    }

    // 4. Validate 'message' (10 - 500 characters after trimming)
    if (typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be text.' },
        { status: 400 }
      );
    }
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10 || trimmedMessage.length > 500) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 500 characters long.' },
        { status: 400 }
      );
    }

    // 5. Validate 'nickname' (optional, max 60 chars)
    let trimmedNickname: string | null = null;
    if (nickname !== undefined && nickname !== null && nickname !== '') {
      if (typeof nickname !== 'string' || nickname.trim().length > 60) {
        return NextResponse.json(
          { error: 'Nickname must not exceed 60 characters.' },
          { status: 400 }
        );
      }
      trimmedNickname = nickname.trim();
    }

    // 6. Validate 'email' (required for contact, optional for testimonial)
    let trimmedEmail: string | null = null;
    if (type === 'contact') {
      if (!email || typeof email !== 'string' || !email.trim()) {
        return NextResponse.json(
          { error: 'Email is required so we can reply to you.' },
          { status: 400 }
        );
      }
      const cleanEmail = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address.' },
          { status: 400 }
        );
      }
      trimmedEmail = cleanEmail;
    } else if (email !== undefined && email !== null && email !== '') {
      if (typeof email !== 'string') {
        return NextResponse.json(
          { error: 'Invalid email format.' },
          { status: 400 }
        );
      }
      const cleanEmail = email.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return NextResponse.json(
          { error: 'Please provide a valid email address.' },
          { status: 400 }
        );
      }
      trimmedEmail = cleanEmail;
    }

    // 7. Validate 'subject' (required for contact, max 100 chars, min 3 chars)
    let trimmedSubject: string | null = null;
    if (type === 'contact') {
      if (!subject || typeof subject !== 'string' || !subject.trim()) {
        return NextResponse.json(
          { error: 'Subject is required for contact messages.' },
          { status: 400 }
        );
      }
      const cleanSubject = subject.trim();
      if (cleanSubject.length < 3 || cleanSubject.length > 100) {
        return NextResponse.json(
          { error: 'Subject must be between 3 and 100 characters.' },
          { status: 400 }
        );
      }
      trimmedSubject = cleanSubject;
    } else if (subject !== undefined && subject !== null && subject !== '') {
      if (typeof subject === 'string') {
        trimmedSubject = subject.trim().slice(0, 100);
      }
    }

    // 8. Rate limiting: 60-second cooldown per client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded
      ? forwarded.split(',')[0].trim()
      : request.headers.get('x-real-ip') || 'unknown-client';

    const now = Date.now();

    // Clean up stale rate limit entries older than the window
    for (const [ipKey, timestamp] of rateLimitMap.entries()) {
      if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(ipKey);
      }
    }

    const lastSubmission = rateLimitMap.get(clientIp);
    if (lastSubmission && now - lastSubmission < RATE_LIMIT_WINDOW_MS) {
      const remainingSec = Math.ceil(
        (RATE_LIMIT_WINDOW_MS - (now - lastSubmission)) / 1000
      );
      return NextResponse.json(
        {
          error: `Please wait ${remainingSec}s before submitting again.`,
        },
        { status: 429 }
      );
    }

    // 9. Insert into Supabase 'feedback' table
    if (!supabase) {
      console.error('[API/feedback] Supabase is not configured.');
      return NextResponse.json(
        { error: 'Database service is temporarily unavailable.' },
        { status: 500 }
      );
    }

    const insertPayload: Record<string, unknown> = {
      type,
      rating: validatedRating,
      message: trimmedMessage,
      nickname: trimmedNickname,
      email: trimmedEmail,
      show_publicly: Boolean(show_publicly),
    };

    if (trimmedSubject) {
      insertPayload.subject = trimmedSubject;
    }

    let { error: dbError } = await supabase.from('feedback').insert(insertPayload);

    // If the 'subject' column doesn't exist yet in the database, retry without it
    if (dbError && dbError.code === '42703' && trimmedSubject) {
      console.warn(
        '[API/feedback] "subject" column does not exist on "feedback" table. Inserting without subject column.'
      );
      const fallbackPayload = { ...insertPayload };
      delete fallbackPayload.subject;
      const fallbackResult = await supabase.from('feedback').insert(fallbackPayload);
      dbError = fallbackResult.error;
    }

    if (dbError) {
      console.error('[API/feedback] Database insert error:', dbError);
      return NextResponse.json(
        { error: 'Failed to submit feedback. Please try again.' },
        { status: 500 }
      );
    }

    // Mark successful submission timestamp for rate limiting
    rateLimitMap.set(clientIp, now);

    // 10. Dispatch email notification in background (never blocks or fails the request)
    try {
      await sendFeedbackNotification({
        type,
        rating: validatedRating,
        subject: trimmedSubject,
        message: trimmedMessage,
        nickname: trimmedNickname,
        email: trimmedEmail,
      });
    } catch (mailErr) {
      console.error('[API/feedback] Non-blocking mailer error:', mailErr);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[API/feedback] Unexpected route error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
