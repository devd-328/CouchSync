'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Bookmark } from 'lucide-react';
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
    <div className="flex flex-col h-full min-h-0 rounded-2xl bg-white border border-black/8 shadow-xs overflow-hidden text-gray-900">
      {/* Header ("Room Chat" + Pin Moment) */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50/70">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-sm font-bold text-gray-900">Room Chat</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#E64A19] font-mono font-bold">
            {participantsCount}
          </span>
        </div>

        {/* Pin Moment Button */}
        {currentTime !== undefined && (
          <button
            onClick={handlePinCurrentMoment}
            aria-label="Pin current video timestamp to chat"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[11px] font-semibold text-amber-800 border border-amber-200 transition cursor-pointer"
            title="Save and share this current timestamp in chat"
          >
            <Bookmark className="w-3 h-3 text-amber-600 fill-amber-500/40" />
            <span>Pin Moment</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3.5 flex flex-col gap-2.5">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center text-center p-6 text-xs text-gray-500">
            <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-2.5 text-[#FF5722]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="font-bold text-gray-800">No messages yet</p>
            <p className="mt-1 text-[11px] text-gray-500">Say hi or pin a moment to get the chat started!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col text-xs ${msg.isSelf ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-0.5 px-1">
                <span className="font-bold text-gray-700 text-[11px]">
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
              </div>
              <div
                className={`px-3.5 py-2 rounded-2xl max-w-[85%] wrap-break-word leading-relaxed text-xs ${
                  msg.isSelf
                    ? 'bg-linear-to-r from-[#FF5722] to-[#FF7043] text-white rounded-tr-xs shadow-xs font-medium'
                    : 'bg-gray-100 text-gray-900 rounded-tl-xs border border-gray-200/80 font-normal'
                }`}
              >
                {msg.text}
                {msg.jumpTime !== undefined && (
                  <button
                    onClick={() => onJumpToTime?.(msg.jumpTime!)}
                    className="mt-1 text-[10px] underline block font-semibold hover:opacity-80"
                  >
                    Jump to {formatTime(msg.jumpTime)}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Bar */}
      <div className="px-3 py-1.5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-around gap-1 shrink-0">
        {QUICK_REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onTriggerReaction(emoji)}
            className="p-1.5 rounded-lg hover:bg-orange-100/60 transition text-base leading-none cursor-pointer transform hover:scale-125"
            title={`Send ${emoji} reaction`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-2.5 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Say something to the room..."
          className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
