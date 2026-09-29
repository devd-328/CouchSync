import React from 'react';
import type { Metadata } from 'next';
import { MessageSquareHeart } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { TestimonialsWall } from '@/components/feedback/TestimonialsWall';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Feedback & Reviews | CouchSync Live';
  const description =
    'Share your experience, leave a review, or send feedback to help shape the future of CouchSync Live.';

  return {
    title,
    description,
    alternates: {
      canonical: 'https://couchsync.live/feedback',
    },
    openGraph: {
      title,
      description,
      url: 'https://couchsync.live/feedback',
      siteName: 'CouchSync Live',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-4 lg:p-6 flex flex-col justify-between overflow-x-hidden selection:bg-[#EA580C] selection:text-white">
      <div className="w-full max-w-[1580px] mx-auto bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-white/60 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[calc(100vh-2rem)]">
        {/* ── Top Header / Nav ─────────────────────────────────────────── */}
        <Navbar currentPage="feedback" />

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs text-[#EA580C] font-bold shadow-2xs mb-4">
              <MessageSquareHeart className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Community &amp; Support</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl text-gray-950 tracking-tight leading-tight">
              We&apos;d love to hear from you
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              Have thoughts on your movie night? Leave a review or send us a message. Your feedback helps make CouchSync better for everyone.
            </p>
          </div>

          {/* ── Feedback Form ─────────────────────────────────────────── */}
          <FeedbackForm />

          {/* ── Testimonials Community Wall (renders 3+ approved items) ── */}
          <TestimonialsWall />
        </main>

        {/* ── Site Footer ──────────────────────────────────────────────── */}
        <SiteFooter />
      </div>
    </div>
  );
}
