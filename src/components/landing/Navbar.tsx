'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Globe, Menu, X, Sparkles, Play } from 'lucide-react';
import { CouchSyncLogo } from '@/components/brand/CouchSyncLogo';

interface NavbarProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function Navbar({ onCreateRoom, onJoinRoom }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 pt-4 sm:pt-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-2 sm:py-3">
        {/* Official CouchSync Live Brand Logo (Option 06) */}
        <Link href="/" className="group flex items-center" aria-label="CouchSync Live Home">
          <CouchSyncLogo markSize={36} showBadge={true} theme="light" />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-700">
          <Link
            href="#features"
            className="hover:text-[#FF5722] transition"
          >
            Features
          </Link>
          <Link
            href="#modes"
            className="hover:text-[#FF5722] transition"
          >
            Activities
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-[#FF5722] transition"
          >
            How it works
          </Link>
          <Link
            href="#faq"
            className="hover:text-[#FF5722] transition"
          >
            FAQ
          </Link>
          <button
            type="button"
            onClick={onJoinRoom}
            className="hover:text-[#FF5722] transition cursor-pointer font-medium"
          >
            Join Room
          </button>
        </nav>

        {/* Right CTA Area: Globe picker + Orange Gradient Pill Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1 text-gray-600 hover:text-gray-900 cursor-pointer text-sm font-medium">
            <Globe className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </div>

          <button
            onClick={onCreateRoom}
            type="button"
            className="px-6 sm:px-7 py-2.5 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(255,87,34,0.35)] transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Create Room
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-black/5 transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-5 rounded-2xl bg-white/95 border border-black/8 shadow-xl flex flex-col gap-3">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            Features
          </Link>
          <Link
            href="#modes"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            Activities
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            How it works
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            FAQ
          </Link>
          <div className="pt-2 border-t border-black/6 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onJoinRoom();
              }}
              className="w-full py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Join Room with Code
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onCreateRoom();
              }}
              className="w-full py-2.5 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] text-white text-sm font-bold shadow-md"
            >
              Create Room
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
