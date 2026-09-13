'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bookmark, Play } from 'lucide-react';
import { ChatMessage } from '@/types/sync';
import { formatTime } from '@/lib/formatters';

interface ChatPanelProps {
  messages: ChatMessage[];
  participantsCount: number;
  currentTime?: number;
  onSendMessage: (text: string, jumpTime?: number) => void;
  onTriggerReaction: (emoji: string) => void;
  onJumpToTime?: (time: number) => void;
}

const QUICK_REACTIONS = ['🍿', '😂', '💖', '👍', '🎉', '🔥'];

export function ChatPanel({
  messages,
  participantsCount,
  currentTime,
  onSendMessage,
  onTriggerReaction,
  onJumpToTime,
}: ChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handlePinCurrentMoment = () => {
    if (currentTime === undefined) return;
    const timeFormatted = formatTime(currentTime);
    onSendMessage(`📍 Moment pinned at ${timeFormatted}`, currentTime);
  };

  return (
    <div className="flex flex-col h-full min-h-0 rounded-2xl glass-panel border-white/10 overflow-hidden">
      {/* Header ("Room Chat" + Pin Moment) - shrink-0 */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-gray-200">Room Chat</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono">
            {participantsCount}
          </span>
        </div>

        {/* Pin Moment Button */}
        {currentTime !== undefined && (
          <button
            onClick={handlePinCurrentMoment}
            aria-label="Pin current video timestamp to chat"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg glass-pill hover:bg-white/15 text-[11px] text-amber-300 border-amber-500/30 transition shadow-[0_0_8px_rgba(245,158,11,0.2)] cursor-pointer"
            title="Save and share this current timestamp in chat"
          >
            <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400/40" />
            <span>Pin Moment</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area - flex-1 min-h-0 overflow-y-auto */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 flex flex-col gap-2.5">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center text-center p-6 text-xs text-gray-500">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2.5 text-cyan-400/50">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="font-medium text-gray-300">No messages yet</p>
            <p className="mt-1 text-[11px] text-gray-500">Say hi or pin a moment to get the chat started!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col text-xs ${msg.isSelf ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5 px-1">
                <span className="font-semibold text-gray-400 text-[11px]">
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-gray-600">{msg.timestamp}</span>
              </div>
              <div
                className={`px-3.5 py-2 rounded-2xl max-w-[85%] wrap-break-word leading-relaxed ${
                  msg.isSelf
                    ? 'bg-linear-to-r from-cyan-600/80 to-blue-600/80 text-white rounded-tr-xs shadow-[0_2px_12px_rgba(0,242,254,0.15)]'
                    : 'bg-white/10 text-gray-200 rounded-tl-xs border border-white/5'
                }`}
              >
                <p>{msg.text}</p>
                {/* Clickable Moment Button */}
                {msg.jumpTime !== undefined && onJumpToTime && (
                  <button
                    onClick={() => onJumpToTime(msg.jumpTime!)}
                    className="mt-1.5 px-2 py-1 rounded-md bg-black/40 hover:bg-black/60 border border-amber-400/40 text-[11px] font-mono font-semibold text-amber-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Jump to {formatTime(msg.jumpTime)}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions Bar (Inline horizontal above input) */}
      <div className="shrink-0 px-3 py-1.5 border-t border-white/5 bg-black/20 flex items-center justify-between gap-1">
        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider shrink-0">
          React
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onTriggerReaction(emoji)}
              aria-label={`React with ${emoji}`}
              className="w-7 h-7 rounded-lg hover:bg-white/10 hover:scale-125 hover:shadow-[0_0_8px_rgba(255,255,255,0.15)] transition active:scale-95 flex items-center justify-center text-sm cursor-pointer"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field (Pinned at bottom) */}
      <form onSubmit={handleSend} className="shrink-0 p-2.5 border-t border-white/10 bg-white/2 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          aria-label="Send message"
          className="p-2 rounded-xl bg-linear-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
