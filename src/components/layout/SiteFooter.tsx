import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-8 px-4 border-t border-white/5 space-y-4">
      {/* Navigation Links */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-gray-400">
        <Link href="/" className="hover:text-cyan-300 transition">
          Home
        </Link>
        <span className="text-gray-700">•</span>
        <Link href="/how-it-works" className="hover:text-cyan-300 transition">
          How It Works
        </Link>
        <span className="text-gray-700">•</span>
        <Link href="/features" className="hover:text-violet-300 transition">
          Features
        </Link>
        <span className="text-gray-700">•</span>
        <Link href="/#faq" className="hover:text-amber-300 transition">
          FAQ
        </Link>
        <span className="text-gray-700">•</span>
        <Link href="/about" className="hover:text-rose-300 transition">
          About
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5 text-emerald-400/90">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>End-to-end WebRTC encryption</span>
        </div>
        <span className="hidden sm:inline text-gray-700">•</span>
        <div className="flex items-center gap-1.5 text-cyan-400/90">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Always free · No account needed</span>
        </div>
        <span className="hidden sm:inline text-gray-700">•</span>
        <span>Acoustic echo cancellation active</span>
      </div>

      <div className="text-[10px] text-gray-600 font-medium">
        CouchSync Live — Watch Movies Together in Real-Time Sync
      </div>
    </footer>
  );
}
