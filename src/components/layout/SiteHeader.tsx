import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface SiteHeaderProps {
  currentPage?: 'home' | 'how-it-works' | 'features' | 'about';
  badgeText?: string;
}

export function SiteHeader({ currentPage, badgeText }: SiteHeaderProps) {
  const NAV_LINKS = [
    { label: 'How It Works', href: '/how-it-works', id: 'how-it-works' },
    { label: 'Features', href: '/features', id: 'features' },
    { label: 'FAQ', href: '/#faq', id: 'faq' },
    { label: 'About', href: '/about', id: 'about' },
  ];

  return (
    <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-black/6 gap-4">
      {/* Brand logo & title */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-xs border border-orange-200/80 shrink-0 bg-orange-50 group-hover:scale-105 transition">
          <Image
            src="/icon.png"
            alt="CouchSync Live Logo"
            width={40}
            height={40}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-gray-950 group-hover:text-[#EA580C] transition">
              CouchSync Live
            </span>
            {badgeText && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#EA580C] border border-orange-200">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 font-medium">Virtual Cinema &amp; Hangout Lounge</p>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-gray-100/90 border border-black/5 shadow-2xs">
        {NAV_LINKS.map((link) => {
          const isActive = currentPage === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-white text-[#EA580C] border border-black/5 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-950 hover:bg-white/60'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right Action */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-xs font-bold shadow-[0_4px_16px_rgba(255,87,34,0.3)] transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Room</span>
        </Link>
      </div>
    </header>
  );
}
