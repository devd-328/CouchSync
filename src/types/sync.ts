export type ControlMode = 'shared' | 'host-only';
export type ThemeMode = 'obsidian' | 'cyberpunk' | 'retro' | 'oled';
export type MediaSourceType = 'hls' | 'youtube' | 'screenshare' | 'trivia';
export type RoomLayoutMode = 'cinema' | 'lounge' | 'focus';

export type PlaybackAction =
  | { type: 'play'; time: number; senderId: string; ts: number }
  | { type: 'pause'; time: number; senderId: string; ts: number }
  | { type: 'seek'; time: number; senderId: string; ts: number }
  | { type: 'speed'; speed: number; senderId: string; ts: number }
  | { type: 'buffering'; senderId: string; ts: number }
  | { type: 'ready'; time: number; senderId: string; ts: number }
  | { type: 'heartbeat'; time: number; isPlaying: boolean; speed?: number; senderId: string; ts: number };

export type WebRTCSignalAction =
  | { type: 'signal-offer'; sdp: RTCSessionDescriptionInit; senderId: string; targetId?: string }
  | { type: 'signal-answer'; sdp: RTCSessionDescriptionInit; senderId: string; targetId?: string }
  | { type: 'signal-ice'; candidate: RTCIceCandidateInit; senderId: string; targetId?: string }
  | { type: 'media-toggle'; audio: boolean; video: boolean; senderId: string };

export type ScreenShareAction =
  | { type: 'screenshare-start'; presenterId: string; presenterName: string }
  | { type: 'screenshare-stop'; presenterId: string };

export type MediaSourceChangeAction = {
  type: 'media-source-change';
  source: MediaSourceType;
  youtubeId?: string;
  youtubeTitle?: string;
  senderId: string;
};

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

export type TriviaAction =
  | { type: 'trivia-start'; questionIndex: number; senderId: string }
  | { type: 'trivia-score'; userId: string; userName: string; score: number }
  | { type: 'trivia-next'; questionIndex: number }
  | { type: 'trivia-end' };

export type SocialAction =
  | { type: 'chat-message'; id: string; senderId: string; senderName: string; text: string; ts: number; jumpTime?: number }
  | { type: 'emoji-reaction'; emoji: string; senderId: string; senderName: string; ts: number };

export type RoomControlAction = {
  type: 'control-mode-change';
  mode: ControlMode;
  senderId: string;
};

export interface RoomPoll {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>; // userId -> optionIndex
  creatorId: string;
  createdAt: number;
  isActive: boolean;
}

export type PollAction =
  | { type: 'poll-create'; poll: RoomPoll }
  | { type: 'poll-vote'; pollId: string; optionIndex: number; userId: string }
  | { type: 'poll-close'; pollId: string };

export type SyncMessage =
  | PlaybackAction
  | WebRTCSignalAction
  | ScreenShareAction
  | MediaSourceChangeAction
  | TriviaAction
  | SocialAction
  | RoomControlAction
  | PollAction;

export interface RoomParticipant {
  id: string;
  name: string;
  isHost: boolean;
  avatar?: string;
  isMicOn: boolean;
  isCamOn: boolean;
  isSpeaking?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
  jumpTime?: number;
}

export interface FloatingEmoji {
  id: string;
  emoji: string;
  xOffset: number; // percentage from left
}

export interface VideoMedia {
  id: string;
  title: string;
  src: string;
  poster?: string;
  duration?: string;
  category?: string;
  isLocalFile?: boolean;
}
