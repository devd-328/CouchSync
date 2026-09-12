import { STORAGE_KEYS } from '@/config/constants';
import { VideoMedia } from '@/types/sync';
import { DEFAULT_VIDEO } from './sample-media';

export interface UserSessionData {
  userName: string;
  roomName: string;
  video: VideoMedia;
  isMicMuted: boolean;
  isCamOff: boolean;
  isHost: boolean;
}

export function loadUserSession(): UserSessionData {
  if (typeof window === 'undefined') {
    return {
      userName: 'Alex',
      roomName: 'Cosmic Nights',
      video: DEFAULT_VIDEO,
      isMicMuted: false,
      isCamOff: false,
      isHost: false,
    };
  }

  const userName = sessionStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Alex';
  const roomName = sessionStorage.getItem(STORAGE_KEYS.ROOM_NAME) || 'Cosmic Nights';
  const isHost = sessionStorage.getItem(STORAGE_KEYS.IS_HOST) === 'true';
  const videoUrl = sessionStorage.getItem(STORAGE_KEYS.VIDEO_URL);
  const videoPoster = sessionStorage.getItem(STORAGE_KEYS.VIDEO_POSTER);
  const videoTitle = sessionStorage.getItem(STORAGE_KEYS.VIDEO_TITLE);
  const isMicMuted = sessionStorage.getItem(STORAGE_KEYS.MIC_MUTED) === 'true';
  const isCamOff = sessionStorage.getItem(STORAGE_KEYS.CAM_OFF) === 'true';

  const video: VideoMedia = videoUrl
    ? {
        id: 'session-video',
        title: videoTitle || 'Selected Stream',
        src: videoUrl,
        poster: videoPoster || DEFAULT_VIDEO.poster,
      }
    : DEFAULT_VIDEO;

  return {
    userName,
    roomName,
    video,
    isMicMuted,
    isCamOff,
    isHost,
  };
}

export function saveUserSession(data: {
  userName?: string;
  roomName?: string;
  video?: VideoMedia;
  isMicMuted?: boolean;
  isCamOff?: boolean;
  isHost?: boolean;
}) {
  if (typeof window === 'undefined') return;

  if (data.userName) sessionStorage.setItem(STORAGE_KEYS.USER_NAME, data.userName);
  if (data.roomName) sessionStorage.setItem(STORAGE_KEYS.ROOM_NAME, data.roomName);
  if (data.isHost !== undefined) {
    sessionStorage.setItem(STORAGE_KEYS.IS_HOST, data.isHost ? 'true' : 'false');
  }
  if (data.video) {
    sessionStorage.setItem(STORAGE_KEYS.VIDEO_URL, data.video.src);
    if (data.video.poster) sessionStorage.setItem(STORAGE_KEYS.VIDEO_POSTER, data.video.poster);
    sessionStorage.setItem(STORAGE_KEYS.VIDEO_TITLE, data.video.title);
  }
  if (data.isMicMuted !== undefined) {
    sessionStorage.setItem(STORAGE_KEYS.MIC_MUTED, data.isMicMuted ? 'true' : 'false');
  }
  if (data.isCamOff !== undefined) {
    sessionStorage.setItem(STORAGE_KEYS.CAM_OFF, data.isCamOff ? 'true' : 'false');
  }
}

export interface RecentRoom {
  id: string;
  name: string;
  lastVisited: number;
}

const RECENT_ROOMS_KEY = 'couchsync_recent_rooms';

export function getRecentRooms(): RecentRoom[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_ROOMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveRecentRoom(room: { id: string; name: string }) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentRooms().filter((r) => r.id !== room.id);
    const updated = [{ ...room, lastVisited: Date.now() }, ...existing].slice(0, 5);
    localStorage.setItem(RECENT_ROOMS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function removeRecentRoom(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const updated = getRecentRooms().filter((r) => r.id !== id);
    localStorage.setItem(RECENT_ROOMS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

