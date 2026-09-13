'use client';

import React, { useState, useRef } from 'react';
import { Film, HardDrive, Upload } from 'lucide-react';
import { VideoMedia } from '@/types/sync';
import { SAMPLE_VIDEOS } from '@/lib/sample-media';

interface VideoSettingsModalProps {
  isOpen: boolean;
  currentVideoSrc: string;
  onClose: () => void;
  onSelectVideo: (video: VideoMedia) => void;
}

export function VideoSettingsModal({
  isOpen,
  currentVideoSrc,
  onClose,
  onSelectVideo,
}: VideoSettingsModalProps) {
  const [customUrl, setCustomUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    onSelectVideo({
      id: `custom-${Date.now()}`,
      title: 'Custom Stream',
      src: customUrl.trim(),
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    });
    onClose();
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    onSelectVideo({
      id: `local-${Date.now()}`,
      title: file.name,
      src: blobUrl,
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
      category: 'Local Movie File',
      isLocalFile: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl glass-panel border-white/10 p-6 flex flex-col gap-4 shadow-2xl bg-[#0F1320] my-auto">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-cyan-400" />
            Change Video Source
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>

        {/* Local File Selector (Zero-Cloud Mode) */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs">
            <HardDrive className="w-4 h-4" />
            <span>Local Movie File (Zero-Cloud Mode)</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Pick a movie file from your computer. If both people pick their own local copy of the same movie, you can watch in perfect sync with $0 cloud storage!
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/x-matroska,.mkv,.mp4,.webm"
            onChange={handleLocalFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-1 py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Choose Video File (.mp4, .mkv, .webm)</span>
          </button>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Tip: MP4 (H.264/AAC) and WebM provide optimal in-browser playback. MKV files with multichannel DTS/AC3 audio may play video without audio due to browser codec constraints.
          </p>
        </div>

        {/* Preset Streams */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs text-gray-400 font-medium">Or choose a preset online stream:</span>
          <div className="grid grid-cols-1 gap-2">
            {SAMPLE_VIDEOS.map((vid) => (
              <button
                key={vid.id}
                onClick={() => {
                  onSelectVideo(vid);
                  onClose();
                }}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-left border transition ${
                  currentVideoSrc === vid.src
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <Film className="w-4 h-4 shrink-0 text-cyan-400" />
                <div className="flex-1 truncate">
                  <p className="text-xs font-semibold">{vid.title}</p>
                  <p className="text-[10px] text-gray-400">{vid.category} • {vid.duration}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Custom URL Input */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-2 border-t border-white/10">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Or enter custom .m3u8 or .mp4 URL..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition"
            >
              Use
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
}
