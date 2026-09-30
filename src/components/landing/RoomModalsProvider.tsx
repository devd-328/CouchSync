'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MediaSourceType } from '@/types/sync';
import { generateId } from '@/lib/formatters';
import {
  loadUserSession,
  saveUserSession,
  getRecentRooms,
  saveRecentRoom,
  removeRecentRoom,
  RecentRoom,
  isValidNickname,
} from '@/lib/session';
import { DEFAULT_VIDEO } from '@/lib/sample-media';
import { CreateRoomModal } from '@/components/landing/CreateRoomModal';
import { JoinRoomModal } from '@/components/landing/JoinRoomModal';

interface RoomModalsContextValue {
  openCreateRoom: (mode?: MediaSourceType) => void;
  openJoinRoom: () => void;
  closeModals: () => void;
}

const RoomModalsContext = createContext<RoomModalsContextValue | null>(null);

export function useRoomModals(): RoomModalsContextValue {
  const context = useContext(RoomModalsContext);
  if (!context) {
    throw new Error('useRoomModals must be used within a RoomModalsProvider');
  }
  return context;
}

export function RoomModalsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedCreateMode, setSelectedCreateMode] = useState<MediaSourceType>('hls');
  const [userName, setUserName] = useState('');
  const [recentRooms, setRecentRooms] = useState<RecentRoom[]>([]);

  useEffect(() => {
    const session = loadUserSession();
    if (session.userName && isValidNickname(session.userName)) {
      setUserName(session.userName);
    }
    setRecentRooms(getRecentRooms());
  }, []);

  const openCreateRoom = useCallback((mode: MediaSourceType = 'hls') => {
    setSelectedCreateMode(mode);
    setIsJoinOpen(false);
    setIsCreateOpen(true);
  }, []);

  const openJoinRoom = useCallback(() => {
    setRecentRooms(getRecentRooms());
    setIsCreateOpen(false);
    setIsJoinOpen(true);
  }, []);

  const closeModals = useCallback(() => {
    setIsCreateOpen(false);
    setIsJoinOpen(false);
  }, []);

  const handleSaveUserName = useCallback((name: string) => {
    setUserName(name);
    saveUserSession({ userName: name });
  }, []);

  const handleRemoveRecent = useCallback((id: string) => {
    removeRecentRoom(id);
    setRecentRooms(getRecentRooms());
  }, []);

  const handleExecuteCreate = useCallback(
    (roomName: string, mode: MediaSourceType, nick: string, youtubeVideoId?: string) => {
      setIsCreateOpen(false);
      const newRoomId = generateId('room').replace('room-', '');
      const cleanName = roomName.trim() || 'Cosmic Cinema';

      saveUserSession({
        userName: nick,
        roomName: cleanName,
        video: DEFAULT_VIDEO,
        isHost: true,
      });

      saveRecentRoom({ id: newRoomId, name: cleanName });
      const ytQuery = youtubeVideoId ? `&youtubeId=${encodeURIComponent(youtubeVideoId)}` : '';
      router.push(`/room/${newRoomId}?initialMode=${mode}${ytQuery}`);
    },
    [router]
  );

  const handleExecuteJoin = useCallback(
    (roomId: string, nick: string) => {
      setIsJoinOpen(false);
      saveUserSession({
        userName: nick,
        isHost: false,
      });

      saveRecentRoom({ id: roomId, name: `Room ${roomId}` });
      router.push(`/room/${roomId}`);
    },
    [router]
  );

  return (
    <RoomModalsContext.Provider value={{ openCreateRoom, openJoinRoom, closeModals }}>
      {children}
      <CreateRoomModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        userName={userName}
        onSaveUserName={handleSaveUserName}
        defaultMode={selectedCreateMode}
        onSubmit={handleExecuteCreate}
      />
      <JoinRoomModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        userName={userName}
        onSaveUserName={handleSaveUserName}
        recentRooms={recentRooms}
        onRemoveRecent={handleRemoveRecent}
        onSubmit={handleExecuteJoin}
      />
    </RoomModalsContext.Provider>
  );
}
