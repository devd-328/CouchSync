'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { CouchSyncMark } from '@/components/brand/CouchSyncLogo';

interface NavbarProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function Navbar({ onCreateRoom, onJoinRoom }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-30 w-full px-3 sm:px-8 pt-3 sm:pt-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4 py-1.5 sm:py-3">
        {/* Official CouchSync Live Brand Logo (Option 06) */}
        <Link
          href="/"
          className="group flex items-center gap-1.5 min-w-0 select-none"
          aria-label="CouchSync Live Home"
        >
          <CouchSyncMark size={34} className="w-7 h-7 sm:w-[34px] sm:h-[34px]" />
          <div className="flex items-center gap-1 sm:gap-1.5 leading-none min-w-0">
            <span className="text-lg sm:text-2xl font-black tracking-tight text-gray-950 truncate sm:overflow-visible">
              Couch<span className="bg-gradient-to-r from-[#FF5722] via-[#FF7043] to-[#FF8A65] bg-clip-text text-transparent">Sync</span>
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-linear-to-r from-[#FF5722] to-[#E64A19] text-white shadow-[0_2px_8px_rgba(255,87,34,0.35)] shrink-0">
              LIVE
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-700">
          <Link
            href="/features"
            className="hover:text-[#FF5722] transition"
          >
            Features
          </Link>
          <Link
            href="/#modes"
            className="hover:text-[#FF5722] transition"
          >
            Activities
          </Link>
          <Link
            href="/how-it-works"
            className="hover:text-[#FF5722] transition"
          >
            How it works
          </Link>
          <Link
            href="/about"
            className="hover:text-[#FF5722] transition"
          >
            About
          </Link>
          <Link
            href="/#faq"
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

        {/* Right CTA Area: Orange Gradient Pill Button */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <button
            onClick={onCreateRoom}
            type="button"
            className="whitespace-nowrap shrink-0 px-4 py-2 sm:px-7 sm:py-2.5 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white text-sm font-bold shadow-[0_4px_16px_rgba(255,87,34,0.3)] sm:shadow-[0_6px_20px_rgba(255,87,34,0.35)] transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span className="sm:hidden">Create</span>
            <span className="hidden sm:inline">Create Room</span>
          </button>

          {/* Mobile hamburger - min 44x44px tap target */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl text-gray-700 hover:bg-black/5 transition shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 p-5 rounded-2xl bg-white/95 border border-black/8 shadow-xl flex flex-col gap-3">
          <Link
            href="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            Features
          </Link>
          <Link
            href="/#modes"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            Activities
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            How it works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-medium text-gray-700 hover:text-[#FF5722]"
          >
            About
          </Link>
          <Link
            href="/#faq"
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
