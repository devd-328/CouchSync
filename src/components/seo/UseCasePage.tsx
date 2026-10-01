import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CreateRoomCta } from '@/components/seo/CreateRoomCta';
import { MediaSourceType } from '@/types/sync';
import { cn } from '@/lib/utils';

export interface UseCaseStep {
  title: string;
  body: string;
}

export interface UseCaseSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface UseCaseFaq {
  q: string;
  a: string;
}

export interface UseCaseRelatedLink {
  label: string;
  href: string;
}

export interface UseCasePageProps {
  h1: string;
  intro: string;
  steps?: UseCaseStep[];
  sections: UseCaseSection[];
  faqs: UseCaseFaq[];
  related: UseCaseRelatedLink[];
  defaultMode?: MediaSourceType;
  className?: string;
}

function renderFaqAnswer(answer: string) {
  const privacyMatch = answer.split('Privacy Policy (/privacy)');
  if (privacyMatch.length === 2) {
    return (
      <p>
        {privacyMatch[0]}
        <Link href="/privacy" className="text-[#EA580C] underline hover:text-[#C2410C]">
          Privacy Policy
        </Link>
        {privacyMatch[1]}
      </p>
    );
  }
  return <p>{answer}</p>;
}

export function UseCasePage({
  h1,
  intro,
  steps,
  sections,
  faqs,
  related,
  defaultMode,
  className,
}: UseCasePageProps) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-4 lg:p-6 flex flex-col justify-between overflow-x-hidden selection:bg-[#EA580C] selection:text-white',
        className
      )}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className="w-full max-w-[1580px] mx-auto bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-white/60 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[calc(100vh-2rem)]">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 space-y-12 sm:space-y-16">
          {/* Hero Block */}
          <section className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-5">
            <h1 className="font-display text-3xl sm:text-5xl text-gray-950 tracking-tight leading-tight">
              {h1}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {intro}
            </p>
            <div className="pt-2 flex justify-center">
              <CreateRoomCta mode={defaultMode}>Create a free room</CreateRoomCta>
            </div>
          </section>

          {/* Numbered Steps */}
          {steps && steps.length > 0 && (
            <section aria-label="Steps" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs flex flex-col"
                  >
                    <div className="w-9 h-9 rounded-2xl bg-orange-100 border border-orange-200 text-[#EA580C] font-mono font-bold flex items-center justify-center text-sm mb-4 shrink-0">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    {step.title && (
                      <h3 className="font-display text-lg sm:text-xl text-gray-950 mb-2">
                        {step.title}
                      </h3>
                    )}
                    {step.body && (
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {step.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Content Sections */}
          <section aria-label="Details" className="space-y-6 sm:space-y-8">
            {sections.map((section, idx) => (
              <article
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs space-y-4"
              >
                <h2 className="font-display text-xl sm:text-2xl text-gray-950 tracking-tight">
                  {section.heading}
                </h2>
                {section.body && (
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {section.body}
                  </p>
                )}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-3 pt-1">
                    {section.bullets.map((bullet, bulletIdx) => (
                      <li
                        key={bulletIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </section>

          {/* FAQ Accordions */}
          <section aria-label="Frequently Asked Questions" className="space-y-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl text-gray-950 tracking-tight text-center sm:text-left">
                Frequently asked questions
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white rounded-2xl p-5 border border-black/8 shadow-2xs transition open:border-orange-300"
                >
                  <summary className="font-display text-sm sm:text-base text-gray-950 font-semibold cursor-pointer list-none flex items-center justify-between gap-4 select-none">
                    <span>{faq.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs shrink-0">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-black/5 pt-3">
                    {renderFaqAnswer(faq.a)}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Closing CTA Band */}
          <section
            aria-label="Create a room"
            className="bg-linear-to-r from-orange-50 via-white to-amber-50 rounded-3xl p-8 sm:p-10 text-center border border-orange-200/80 relative overflow-hidden shadow-2xs space-y-4"
          >
            <h2 className="font-display text-2xl sm:text-3xl text-gray-950 tracking-tight">
              Ready to watch together?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Create a free room in seconds. No account, no extension, zero hassle.
            </p>
            <div className="pt-2 flex justify-center">
              <CreateRoomCta mode={defaultMode}>Create a free room</CreateRoomCta>
            </div>
          </section>

          {/* Related Links Row */}
          {related && related.length > 0 && (
            <div className="pt-6 border-t border-black/6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 text-center sm:text-left">
                Related
              </h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                {related.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-black/8 hover:border-orange-300 text-xs font-semibold text-gray-700 hover:text-[#EA580C] hover:bg-orange-50/60 shadow-2xs transition"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
}
