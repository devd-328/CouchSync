import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';
import { CouchSyncLogo } from '@/components/brand/CouchSyncLogo';

export function SiteFooter() {
  return (
    <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-10 px-4 border-t border-black/6 space-y-4">
      {/* Navigation Links */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-gray-600">
        <Link href="/" className="hover:text-[#FF5722] transition">
          Home
        </Link>
        <span className="text-gray-300">•</span>
        <Link href="#how-it-works" className="hover:text-[#FF5722] transition">
          How It Works
        </Link>
        <span className="text-gray-300">•</span>
        <Link href="#features" className="hover:text-[#FF5722] transition">
          Features
        </Link>
        <span className="text-gray-300">•</span>
        <Link href="#modes" className="hover:text-[#FF5722] transition">
          Activities
        </Link>
        <span className="text-gray-300">•</span>
        <Link href="#faq" className="hover:text-[#FF5722] transition">
          FAQ
        </Link>
        <span className="text-gray-300">•</span>
        <Link href="/about" className="hover:text-[#FF5722] transition">
          About
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>End-to-end WebRTC encryption</span>
        </div>
        <span className="hidden sm:inline text-gray-300">•</span>
        <div className="flex items-center gap-1.5 text-[#E64A19]">
          <Lock className="w-3.5 h-3.5 text-[#FF5722]" />
          <span>Always free · No account needed</span>
        </div>
        <span className="hidden sm:inline text-gray-300">•</span>
        <span>Acoustic echo cancellation active</span>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <CouchSyncLogo markSize={24} showBadge={true} theme="light" />
        </div>
        <p className="font-medium text-gray-400">
          CouchSync Live | Watch Movies Together in Real-Time Sync · WebRTC P2P
        </p>
      </div>
    </footer>
  );
}
