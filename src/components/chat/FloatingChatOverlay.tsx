'use client';

import React from 'react';

export interface FloatingChatMessage {
  id: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf?: boolean;
}

interface FloatingChatOverlayProps {
  messages: FloatingChatMessage[];
  isVisible?: boolean;
}

export function FloatingChatOverlay({ messages, isVisible = true }: FloatingChatOverlayProps) {
  if (!isVisible || messages.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="absolute bottom-22 left-4 sm:left-6 z-30 pointer-events-none flex flex-col gap-2 max-w-[85%] sm:max-w-md select-none"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="animate-chat-toast flex items-start gap-2.5 px-3.5 py-2 rounded-2xl glass-panel bg-[#0B0F1A]/90 backdrop-blur-md border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-cyan-300">
              {msg.senderName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-cyan-300 truncate">
                {msg.senderName}
              </span>
              <span className="text-[9px] text-gray-400 font-mono">
                {msg.timestamp}
              </span>
            </div>
            <p className="text-xs text-gray-100 wrap-break-word leading-snug">
              {msg.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
