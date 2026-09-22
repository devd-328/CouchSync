'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Globe, Menu, X, Sparkles, Play } from 'lucide-react';

interface NavbarProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function Navbar({ onCreateRoom, onJoinRoom }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-30 w-full px-4 sm:px-8 pt-4 sm:pt-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-2 sm:py-3">
        {/* Brand Logo matching ChatNest style */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white font-black text-lg shadow-[0_4px_12px_rgba(255,87,34,0.35)] shrink-0">
            <span className="text-white text-base">✕</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Couch<span className="text-[#FF5722]">Sync</span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links with dropdown caret */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-gray-700">
          <Link
            href="#how-it-works"
            className="flex items-center gap-1 text-[#FF5722] font-semibold hover:text-[#E64A19] transition"
          >
            <span>Home</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </Link>
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
            className="flex items-center gap-1 hover:text-[#FF5722] transition cursor-pointer"
          >
            <span>Join Room</span>
            <ChevronDown className="w-3.5 h-3.5" />
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
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm font-semibold text-[#FF5722]"
          >
            Home
          </Link>
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
