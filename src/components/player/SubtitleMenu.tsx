'use client';

import React, { useState, useRef } from 'react';
import { Subtitles, Upload, Check, RotateCcw, X } from 'lucide-react';
import { parseAndOffsetSubtitles, createSubtitleBlob } from '@/lib/subtitles';

interface SubtitleMenuProps {
  onSubtitleTrackChange: (trackUrl: string | null) => void;
}

export function SubtitleMenu({ onSubtitleTrackChange }: SubtitleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawSubtitleText, setRawSubtitleText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [offsetSec, setOffsetSec] = useState<number>(0);
  const [isSubtitlesEnabled, setIsSubtitlesEnabled] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawSubtitleText(content);
      applySubtitles(content, offsetSec);
    };
    reader.readAsText(file);
  };

  const applySubtitles = (content: string, offset: number) => {
    try {
      const vtt = parseAndOffsetSubtitles(content, offset);
      const blobUrl = createSubtitleBlob(vtt);
      onSubtitleTrackChange(blobUrl);
      setIsSubtitlesEnabled(true);
    } catch (err) {
      console.error('Failed to parse subtitles:', err);
    }
  };

  const handleOffsetChange = (newOffset: number) => {
    setOffsetSec(newOffset);
    if (rawSubtitleText && isSubtitlesEnabled) {
      applySubtitles(rawSubtitleText, newOffset);
    }
  };

  const handleToggleSubtitles = () => {
    if (!rawSubtitleText) return;
    if (isSubtitlesEnabled) {
      setIsSubtitlesEnabled(false);
      onSubtitleTrackChange(null);
    } else {
      setIsSubtitlesEnabled(true);
      applySubtitles(rawSubtitleText, offsetSec);
    }
  };

  const handleClear = () => {
    setRawSubtitleText(null);
    setFileName(null);
    setOffsetSec(0);
    setIsSubtitlesEnabled(false);
    onSubtitleTrackChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1.5 rounded-lg border transition ${
          fileName && isSubtitlesEnabled
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
            : 'hover:bg-white/15 text-white/80 border-transparent hover:border-white/10'
        }`}
        title="Subtitles (.srt / .vtt) & Timing Offset"
      >
        <Subtitles className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute bottom-10 right-0 w-72 p-3.5 rounded-2xl glass-panel border-white/10 shadow-2xl bg-black/80 backdrop-blur-xl z-50 flex flex-col gap-3 text-xs text-gray-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-semibold flex items-center gap-1.5 text-cyan-300">
              <Subtitles className="w-3.5 h-3.5" />
              Subtitles & Offset
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Upload File Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.vtt"
            onChange={handleFileUpload}
            className="hidden"
          />

          {!fileName ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-xl border border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-300 flex items-center justify-center gap-2 font-medium transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Load .srt or .vtt file</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="truncate max-w-45 font-mono text-[11px] text-gray-300">
                  {fileName}
                </span>
                <button
                  onClick={handleClear}
                  className="text-[10px] text-rose-400 hover:text-rose-300 transition"
                >
                  Remove
                </button>
              </div>

              {/* Subtitle On/Off Toggle */}
              <button
                onClick={handleToggleSubtitles}
                className={`w-full py-1.5 rounded-lg border text-[11px] font-medium transition flex items-center justify-center gap-1.5 ${
                  isSubtitlesEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <Check className="w-3 h-3" />
                <span>{isSubtitlesEnabled ? 'Subtitles Displaying' : 'Subtitles Hidden'}</span>
              </button>
            </div>
          )}

          {/* Timing Offset Slider */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>Timing Sync Offset</span>
              <span className="font-mono text-cyan-300 font-semibold">
                {offsetSec > 0 ? `+${offsetSec.toFixed(1)}s` : `${offsetSec.toFixed(1)}s`}
              </span>
            </div>
            <input
              type="range"
              min={-5}
              max={5}
              step={0.1}
              value={offsetSec}
              onChange={(e) => handleOffsetChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>Earlier (-5s)</span>
              <button
                onClick={() => handleOffsetChange(0)}
                className="hover:text-cyan-400 flex items-center gap-1 transition text-[10px]"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset (0s)
              </button>
              <span>Later (+5s)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
