'use client';

import { useEffect, useRef } from 'react';

interface UseKeyboardShortcutsOptions {
  isEnabled?: boolean;
  isPushToTalkActive: boolean;
  onTogglePlay: () => void;
  onToggleFullscreen: () => void;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onSeekRelative: (seconds: number) => void;
  onAdjustVolume: (delta: number) => void;
  onPushToTalkDown: () => void;
  onPushToTalkUp: () => void;
}

export function useKeyboardShortcuts({
  isEnabled = true,
  isPushToTalkActive,
  onTogglePlay,
  onToggleFullscreen,
  onToggleMic,
  onToggleCam,
  onSeekRelative,
  onAdjustVolume,
  onPushToTalkDown,
  onPushToTalkUp,
}: UseKeyboardShortcutsOptions) {
  const isHoldingPTT = useRef(false);

  useEffect(() => {
    if (!isEnabled) return;

    const isTyping = (target: EventTarget | null) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tagName = target.tagName.toUpperCase();
      return (
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        target.isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;

      // Push-to-talk handler (Hold 'T')
      if (isPushToTalkActive && e.code === 'KeyT') {
        if (!isHoldingPTT.current) {
          isHoldingPTT.current = true;
          onPushToTalkDown();
        }
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'KeyF':
          e.preventDefault();
          onToggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          onToggleMic();
          break;
        case 'KeyV':
          e.preventDefault();
          onToggleCam();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onSeekRelative(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          onSeekRelative(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onAdjustVolume(0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          onAdjustVolume(-0.05);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isPushToTalkActive && e.code === 'KeyT') {
        if (isHoldingPTT.current) {
          isHoldingPTT.current = false;
          onPushToTalkUp();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    isEnabled,
    isPushToTalkActive,
    onTogglePlay,
    onToggleFullscreen,
    onToggleMic,
    onToggleCam,
    onSeekRelative,
    onAdjustVolume,
    onPushToTalkDown,
    onPushToTalkUp,
  ]);
}
