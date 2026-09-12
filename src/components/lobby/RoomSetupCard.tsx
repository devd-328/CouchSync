'use client';

import React, { useState } from 'react';
import { Copy, Check, Film, Sparkles, ChevronRight } from 'lucide-react';
import { VideoMedia } from '@/types/sync';
import { SAMPLE_VIDEOS } from '@/lib/sample-media';

interface RoomSetupCardProps {
  userName: string;
  roomName: string;
  roomId: string;
  selectedVideo: VideoMedia;
  onUserNameChange: (name: string) => void;
  onRoomNameChange: (name: string) => void;
  onSelectVideo: (video: VideoMedia) => void;
  onJoinRoom: () => void;
}

export function RoomSetupCard({
  userName,
  roomName,
  roomId,
  selectedVideo,
  onUserNameChange,
  onRoomNameChange,
  onSelectVideo,
  onJoinRoom,
}: RoomSetupCardProps) {
  const [copied, setCopied] = useState(false);
  const [showVideoSelector, setShowVideoSelector] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/room/${roomId}`
    : `https://couchsync.tv/room/${roomId}`;

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onSelectVideo({
      id: `custom-${Date.now()}`,
      title: 'Custom Stream Video',
      src: customUrl.trim(),
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
      duration: 'Custom Duration',
      category: 'Custom HLS / Video',
    });
    setShowVideoSelector(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Room Setup
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure your session and invite your friend
        </p>
      </div>

      {/* User Name & Room Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Your Nickname
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => onUserNameChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-100 focus:outline-none focus:border-cyan-400/50 transition"
            placeholder="e.g. Alex"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Room Name
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => onRoomNameChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-100 focus:outline-none focus:border-cyan-400/50 transition"
            placeholder="e.g. Cosmic Nights"
          />
        </div>
      </div>

      {/* Selected Video Card */}
      <div className="flex flex-col gap-1.5">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Featured Stream
        </label>
        <div className="flex items-center gap-3 p-2.5 rounded-xl glass-panel border-white/10 bg-white/[0.02]">
          <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedVideo.poster}
              alt={selectedVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
              <span className="text-[9px] font-mono text-cyan-300 bg-black/60 px-1 rounded-xs">
                HLS Ready
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-gray-200 truncate">
              {selectedVideo.title}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
              <span>{selectedVideo.duration}</span>
              <span>•</span>
              <span className="text-emerald-400">Ready</span>
            </div>
            <button
              onClick={() => setShowVideoSelector(!showVideoSelector)}
              className="mt-1.5 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <Film className="w-3 h-3" />
              <span>Change Video</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Video Selector Dropdown */}
        {showVideoSelector && (
          <div className="p-3 rounded-xl glass-panel border-white/10 bg-black/40 flex flex-col gap-3 mt-1">
            <span className="text-[11px] font-medium text-gray-400">Select a preloaded movie:</span>
            <div className="grid grid-cols-1 gap-2">
              {SAMPLE_VIDEOS.map((vid) => (
                <button
                  key={vid.id}
                  onClick={() => {
                    onSelectVideo(vid);
                    setShowVideoSelector(false);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition ${
                    selectedVideo.id === vid.id
                      ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs truncate">{vid.title}</span>
                </button>
              ))}
            </div>

            {/* Custom URL Input */}
            <form onSubmit={handleCustomUrlSubmit} className="flex gap-2 pt-1 border-t border-white/10">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Or paste custom .m3u8 or .mp4 URL..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-500 transition"
              >
                Use
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Invite Link Box */}
      <div className="flex flex-col gap-1.5">
        <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Invite Link
        </label>
        <div className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-black/40 border border-white/10">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 bg-transparent text-xs text-gray-300 select-all focus:outline-none truncate font-mono"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Join Action Button */}
      <button
        onClick={onJoinRoom}
        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:via-blue-400 hover:to-violet-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
      >
        <span>Join Watch Party</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
