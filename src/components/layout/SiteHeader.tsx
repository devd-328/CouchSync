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
    <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b border-white/5 gap-4">
      {/* Brand logo & title */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,242,254,0.3)] border border-cyan-500/30 shrink-0 bg-black/50 group-hover:border-cyan-400/60 transition">
          <Image
            src="/icon.png"
            alt="CouchSync Logo"
            width={40}
            height={40}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-300 transition">
              CouchSync
            </span>
            {badgeText && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-400 font-medium">Virtual Cinema &amp; Hangout Lounge</p>
        </div>
      </Link>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl glass-panel border-white/8">
        {NAV_LINKS.map((link) => {
          const isActive = currentPage === link.id;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-xs'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-linear-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-white text-xs font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Room</span>
        </Link>
      </div>
    </header>
  );
}
