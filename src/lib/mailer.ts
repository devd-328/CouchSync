import nodemailer from 'nodemailer';

export interface FeedbackNotificationPayload {
  type: 'testimonial' | 'contact';
  rating?: number | null;
  subject?: string | null;
  message: string;
  nickname?: string | null;
  email?: string | null;
}

/**
 * Sends an email notification when feedback or a testimonial is submitted.
 * Designed to never throw so email failures do not interrupt user flows.
 */
export async function sendFeedbackNotification(
  payload: FeedbackNotificationPayload
): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  try {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;
    const to = process.env.FEEDBACK_NOTIFY_TO || user;

    if (!user || !pass || !to) {
      console.warn(
        '[Mailer] Email notification skipped: GMAIL_USER, GMAIL_APP_PASSWORD, or recipient not configured.'
      );
      return { sent: false, error: 'Credentials not configured' };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    // Create a dynamic, human-like subject line to avoid spam filters
    let emailSubject = '';
    const cleanSubject = payload.subject?.trim();

    if (payload.type === 'contact') {
      if (cleanSubject) {
        emailSubject = `[CouchSync Contact] ${cleanSubject}`;
      } else {
        const snippet = payload.message.slice(0, 45).replace(/[\r\n]+/g, ' ');
        const sender = payload.email ? payload.email.split('@')[0] : 'Visitor';
        emailSubject = `[CouchSync Contact] Message from ${sender}: "${snippet}..."`;
      }
    } else {
      const starRating = payload.rating ? `${payload.rating}★` : '';
      const author = payload.nickname?.trim() || 'Anonymous';
      emailSubject = `[CouchSync Review] ${starRating} Testimonial from ${author}`;
    }

    const lines: string[] = [
      `Type: ${payload.type.toUpperCase()}`,
      ...(cleanSubject ? [`Subject: ${cleanSubject}`] : []),
      ...(payload.rating != null ? [`Rating: ${payload.rating} / 5`] : []),
      `From: ${payload.nickname || payload.email || 'Anonymous'}`,
      `Reply-To Email: ${payload.email || 'None provided'}`,
      '',
      '--- Message Content ---',
      payload.message,
      '',
      '--------------------------------',
      'Sent via CouchSync Live Feedback Form (https://couchsync.live)',
    ];

    const info = await transporter.sendMail({
      from: `"CouchSync Live" <${user}>`,
      to,
      replyTo: payload.email?.trim() || undefined,
      subject: emailSubject,
      text: lines.join('\n'),
      headers: {
        'X-Mailer': 'CouchSync Mailer v1.0',
        'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      },
    });

    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Mailer] Failed to send feedback notification:', error);
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
