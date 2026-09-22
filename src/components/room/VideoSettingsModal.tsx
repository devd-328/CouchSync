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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl rounded-3xl bg-white border border-black/10 p-5 sm:p-7 flex flex-col gap-4 shadow-2xl my-auto relative animate-in fade-in zoom-in-95 duration-200 text-gray-950 font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/8 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#FF5722] shadow-2xs">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-950 tracking-tight flex items-center gap-2">
                Select Movie or Upload from PC
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Choose a video from your computer or pick an online stream to watch together
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HERO SECTION: Pick Video from PC (Zero-Cloud Mode) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              Option 1: Play File from PC (Recommended)
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-[#EA580C] border border-orange-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#FF5722]" />
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
                ? 'border-[#FF5722] bg-orange-100/70 scale-[1.01] shadow-md'
                : 'border-orange-300 hover:border-[#FF5722] bg-orange-50/50 hover:bg-orange-50 shadow-2xs'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 group-hover:bg-orange-200 border border-orange-300 flex items-center justify-center text-[#FF5722] shadow-2xs group-hover:scale-110 transition-transform mb-3">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>

            <p className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#EA580C] transition-colors">
              Click to Browse Video File from PC
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-md">
              or simply drag and drop your movie file here (<span className="text-[#EA580C] font-mono font-bold">.mp4</span>, <span className="text-[#EA580C] font-mono font-bold">.mkv</span>, <span className="text-[#EA580C] font-mono font-bold">.webm</span>)
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-black/10 text-gray-700 shadow-2xs">
                🔒 100% Private (stays on your PC)
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-black/10 text-gray-700 shadow-2xs">
                ⚡ Ultra-Fast Playback
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-black/10 text-gray-700 shadow-2xs">
                👥 Both select same file to sync
              </span>
            </div>
          </div>

          <div className="flex items-start gap-1.5 px-2 text-[10px] text-gray-500">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>Tip:</strong> If both participants select their own local copy of the same movie, you watch in synchronized harmony with zero bandwidth lag! MP4 (H.264/AAC) provides the best audio/video compatibility.
            </span>
          </div>
        </div>

        {/* SECTION 2: Preset Online Streams */}
        <div className="flex flex-col gap-2 pt-2 border-t border-black/8">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
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
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left border transition cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50 border-orange-300 text-[#EA580C] shadow-2xs font-bold'
                      : 'bg-gray-50 border-black/5 hover:bg-orange-50/40 text-gray-800 hover:text-[#EA580C]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white border border-black/8 flex items-center justify-center shrink-0">
                    <Film className={`w-4 h-4 ${isSelected ? 'text-[#FF5722]' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{vid.title}</p>
                    <p className="text-[10px] text-gray-500 truncate">{vid.category} • {vid.duration}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#FF5722] shrink-0 mr-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: Custom URL Stream */}
        <div className="flex flex-col gap-2 pt-2 border-t border-black/8">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-gray-400" />
            Option 3: Custom Online Stream URL
          </span>
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste direct .mp4 or HLS .m3u8 link..."
              className="flex-1 bg-gray-50 border border-black/10 rounded-xl px-3 py-2 text-xs text-gray-950 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] transition"
            />
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="px-4 py-2 bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] disabled:opacity-40 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer"
            >
              Play Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
