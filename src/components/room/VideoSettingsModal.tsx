'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Film, FolderOpen, Upload, X, Check, Globe, Sparkles, HardDrive, AlertCircle } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProcessFile = useCallback((file: File) => {
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
  }, [onSelectVideo, onClose]);

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('video/') || /\.(mp4|mkv|webm)$/i.test(file.name))) {
      handleProcessFile(file);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-2xl glass-panel border border-cyan-500/30 p-5 sm:p-6 flex flex-col gap-4 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-[#0C101C] my-auto relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,242,254,0.3)]">
              <FolderOpen className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Select Movie or Upload from PC
              </h2>
              <p className="text-[11px] text-gray-400">
                Choose a video from your computer or pick an online stream to watch together
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HERO SECTION: Pick Video from PC (Zero-Cloud Mode) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              Option 1: Play File from PC (Recommended)
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Zero Cloud Cost
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/x-matroska,.mkv,.mp4,.webm"
            onChange={handleLocalFileChange}
            className="hidden"
          />

          {/* Interactive Drag & Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 sm:p-6 flex flex-col items-center justify-center text-center transition-all group select-none ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/25 scale-[1.01] shadow-[0_0_25px_rgba(0,242,254,0.4)]'
                : 'border-cyan-500/40 hover:border-cyan-400 bg-linear-to-b from-cyan-950/30 to-blue-950/20 hover:from-cyan-950/50 hover:to-blue-950/40 shadow-inner'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 group-hover:bg-cyan-500/30 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)] group-hover:scale-110 transition-transform mb-3">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>

            <p className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
              Click to Browse Video File from PC
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-md">
              or simply drag and drop your movie file here (<span className="text-cyan-300 font-mono">.mp4</span>, <span className="text-cyan-300 font-mono">.mkv</span>, <span className="text-cyan-300 font-mono">.webm</span>)
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                🔒 100% Private (stays on your PC)
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                ⚡ Ultra-Fast Playback
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                👥 Both select same file to sync
              </span>
            </div>
          </div>

          <div className="flex items-start gap-1.5 px-2 text-[10px] text-gray-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Tip:</strong> If both participants select their own local copy of the same movie, you watch in synchronized harmony with zero bandwidth lag! MP4 (H.264/AAC) provides the best audio/video compatibility.
            </span>
          </div>
        </div>

        {/* SECTION 2: Preset Online Streams */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-gray-400" />
            Option 2: Or Choose a Preset Demo Movie
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SAMPLE_VIDEOS.map((vid) => {
              const isSelected = currentVideoSrc === vid.src;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => {
                    onSelectVideo(vid);
                    onClose();
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left border transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 shadow-[0_0_10px_rgba(0,242,254,0.15)]'
                      : 'bg-white/5 border-white/8 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                    <Film className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{vid.title}</p>
                    <p className="text-[10px] text-gray-400 truncate">{vid.category} • {vid.duration}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mr-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Custom URL Stream */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            Option 3: Custom Online Stream URL
          </span>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste direct .mp4 or HLS .m3u8 link..."
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 transition"
            />
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-bold rounded-xl text-xs transition shadow-[0_0_12px_rgba(0,242,254,0.25)] cursor-pointer"
            >
              Play Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
