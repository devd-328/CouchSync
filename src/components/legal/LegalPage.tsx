import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { cn } from '@/lib/utils';

export interface LegalSection {
  id: string;
  heading: string;
  body: React.ReactNode;
}

export interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
  className?: string;
}

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
  className,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-4 lg:p-6 flex flex-col justify-between overflow-x-hidden selection:bg-[#EA580C] selection:text-white">
      <div className="w-full max-w-[1580px] mx-auto bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-white/60 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[calc(100vh-2rem)]">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main
          className={cn(
            'relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16',
            className
          )}
        >
          {/* Header */}
          <div className="max-w-3xl mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs text-[#EA580C] font-bold shadow-2xs mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Legal and Privacy</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl text-gray-950 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="mt-3 text-xs sm:text-sm font-medium text-gray-500">
              Last updated: {lastUpdated}
            </p>
            {intro && (
              <div className="mt-5 text-sm sm:text-base text-gray-600 leading-relaxed border-l-2 border-orange-400 pl-4 py-1 bg-orange-50/40 rounded-r-xl">
                {intro}
              </div>
            )}
          </div>

          {/* Content Layout: Sticky TOC on large screens + Prose Content */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-start">
            {/* Table of contents */}
            <aside className="lg:col-span-4 lg:sticky lg:top-8 mb-8 lg:mb-0">
              <nav
                aria-label="Table of contents"
                className="bg-white rounded-3xl p-5 sm:p-6 border border-black/8 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-black/5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Table of contents
                  </h2>
                  <span className="text-[11px] font-semibold text-[#EA580C] bg-orange-50 px-2 py-0.5 rounded-full">
                    {sections.length} sections
                  </span>
                </div>
                <ol className="space-y-1 text-xs text-gray-600 max-h-[60vh] lg:max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
                  {sections.map((section, idx) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex items-start gap-2 py-1.5 px-2.5 rounded-xl text-gray-700 hover:text-[#EA580C] hover:bg-orange-50/80 transition"
                      >
                        <span className="text-gray-400 font-mono text-[11px] group-hover:text-[#EA580C] shrink-0 pt-0.5">
                          {idx + 1}.
                        </span>
                        <span className="leading-snug group-hover:font-medium">
                          {section.heading}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* Sections Prose */}
            <div className="lg:col-span-8 max-w-3xl space-y-6 sm:space-y-8">
              {sections.map((section, idx) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-2xs transition hover:border-orange-200"
                >
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-xs font-mono font-bold text-[#EA580C] bg-orange-100/70 border border-orange-200/60 px-2.5 py-0.5 rounded-lg">
                      {idx + 1}
                    </span>
                    <h2 className="font-display text-xl sm:text-2xl text-gray-950 tracking-tight">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-3">
                    {section.body}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <SiteFooter />
      </div>
    </div>
  );
}
