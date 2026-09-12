'use client';

import React from 'react';
import { Wifi, AlertCircle, Loader2 } from 'lucide-react';

interface SyncStatusBadgeProps {
  partnerName?: string;
  partnerStatus: string;
  latencyMs: number;
  isPartnerBuffering: boolean;
  isConnected: boolean;
}

export function SyncStatusBadge({
  partnerName = 'Partner',
  partnerStatus,
  latencyMs,
  isPartnerBuffering,
  isConnected,
}: SyncStatusBadgeProps) {
  if (!isConnected) {
    return (
      <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-gray-400">
        <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" />
        <span>Waiting for partner to join...</span>
      </div>
    );
  }

  if (isPartnerBuffering) {
    return (
      <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2 text-xs text-amber-300 bg-amber-950/40 border-amber-500/30">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
        <span>Waiting for {partnerName} to buffer...</span>
      </div>
    );
  }

  return (
    <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/30 border-emerald-500/30 shadow-[0_0_12px_rgba(0,230,118,0.15)]">
      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00E676] animate-pulse" />
      <span>
        Synced with {partnerName} ({latencyMs}ms)
      </span>
      <Wifi className="w-3 h-3 text-emerald-400/80 ml-0.5" />
    </div>
  );
}
