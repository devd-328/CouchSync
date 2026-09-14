/**
 * CouchSync Live - Centralized Platform Constants & Configuration
 * Following the KISS principle: single source of truth for all parameters.
 */

export const SYNC_CONFIG = {
  // Discrepancies under this threshold (in seconds) will NOT trigger seeking to prevent jitter
  DRIFT_TOLERANCE_SECONDS: 1.5,
  // Frequency of background heartbeats to reconcile playback across clients
  HEARTBEAT_INTERVAL_MS: 1500,
  // Echo prevention lockout window after applying remote playback actions
  REMOTE_LOCKOUT_MS: 150,
  // Latency calculation floor
  MIN_LATENCY_MS: 8,
};

export const AUDIO_CONFIG = {
  // Volume multiplier applied to movie when partner speaks (Audio Ducking)
  DUCKING_MULTIPLIER: 0.65,
  // Voice activity detection threshold (0-255 byte average)
  VAD_THRESHOLD: 18,
  DEFAULT_MOVIE_VOLUME: 0.8,
  DEFAULT_PARTNER_VOLUME: 0.7,
  AUDIO_METER_BARS: 18,
};

export const WEBRTC_CONFIG = {
  ICE_SERVERS: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  MEDIA_CONSTRAINTS: {
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      frameRate: { ideal: 24 },
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  },
};

export const STORAGE_KEYS = {
  USER_NAME: 'couchsync_user_name',
  ROOM_NAME: 'couchsync_room_name',
  VIDEO_URL: 'couchsync_video_url',
  VIDEO_POSTER: 'couchsync_video_poster',
  VIDEO_TITLE: 'couchsync_video_title',
  MIC_MUTED: 'couchsync_mic_muted',
  CAM_OFF: 'couchsync_cam_off',
  IS_HOST: 'couchsync_is_host',
  // In-room first-use hint dismissal flags (one per feature)
  HINT_CHAT: 'couchsync_hint_chat',
  HINT_REACTIONS: 'couchsync_hint_reactions',
  HINT_TRIVIA: 'couchsync_hint_trivia',
  HINT_VOLUME: 'couchsync_hint_volume_mixer',
};

/**
 * Per-media-source-type color tokens — single source of truth used across
 * the homepage activity cards, RoomHeader source selector, and feature grid.
 * Keys map to MediaSourceType values: 'hls' | 'youtube' | 'screenshare' | 'trivia'
 */
export const SOURCE_COLORS: Record<
  string,
  { bg: string; border: string; shadow: string; text: string; icon: string }
> = {
  hls: {
    bg: 'bg-cyan-500/20',
    border: 'border-cyan-400/50',
    shadow: 'shadow-[0_0_18px_rgba(0,242,254,0.22)]',
    text: 'text-cyan-300',
    icon: 'text-cyan-400',
  },
  youtube: {
    bg: 'bg-rose-500/20',
    border: 'border-rose-400/50',
    shadow: 'shadow-[0_0_18px_rgba(244,63,94,0.22)]',
    text: 'text-rose-300',
    icon: 'text-rose-400',
  },
  screenshare: {
    bg: 'bg-violet-500/20',
    border: 'border-violet-400/50',
    shadow: 'shadow-[0_0_18px_rgba(139,92,246,0.22)]',
    text: 'text-violet-300',
    icon: 'text-violet-400',
  },
  trivia: {
    bg: 'bg-amber-500/20',
    border: 'border-amber-400/50',
    shadow: 'shadow-[0_0_18px_rgba(245,158,11,0.22)]',
    text: 'text-amber-300',
    icon: 'text-amber-400',
  },
};
