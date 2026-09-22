'use client';

import React, { useState, useEffect } from 'react';
import { X, Radio, ArrowRight, History, Trash2, User, Link2 } from 'lucide-react';
import { RecentRoom, isValidNickname } from '@/lib/session';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onSaveUserName: (name: string) => void;
  recentRooms: RecentRoom[];
  onRemoveRecent: (id: string) => void;
  onSubmit: (roomId: string, userName: string) => void;
}

export function JoinRoomModal({
  isOpen,
  onClose,
  userName,
  onSaveUserName,
  recentRooms,
  onRemoveRecent,
  onSubmit,
}: JoinRoomModalProps) {
  const [joinInput, setJoinInput] = useState('');
  const [nameInput, setNameInput] = useState(userName);
  const [joinError, setJoinError] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  useEffect(() => {
    if (isOpen) {
      setJoinError('');
      setNameError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleJoin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setJoinError('');
    setNameError('');

    const cleanNick = nameInput.trim();
    if (!isValidNickname(cleanNick)) {
      setNameError('Nickname must be between 3 and 25 characters');
      return;
    }

    let parsedId = joinInput.trim();
    if (parsedId.includes('/room/')) {
      const parts = parsedId.split('/room/');
      parsedId = parts[1].split(/[?#]/)[0];
    } else {
      parsedId = parsedId.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    if (!parsedId) {
      setJoinError('Please enter a valid room code or invite URL');
      return;
    }

    onSaveUserName(cleanNick);
    onSubmit(parsedId, cleanNick);
  };

  const handleRejoinRecent = (room: RecentRoom) => {
    const cleanNick = nameInput.trim();
    if (!isValidNickname(cleanNick)) {
      setNameError('Please set your nickname before joining');
      return;
    }
    onSaveUserName(cleanNick);
    onSubmit(room.id, cleanNick);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white border border-black/8 p-6 sm:p-8 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-room-title"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-black/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF5722]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 id="join-room-title" className="text-lg font-bold text-gray-950">
              Join a Watch Room
            </h2>
            <p className="text-xs text-gray-500">
              Enter a friend&apos;s invite code or paste the room link
            </p>
          </div>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          {/* Nickname field */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Your Nickname
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  setNameError('');
                }}
                placeholder="Enter your name (3-25 chars)"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
              />
            </div>
            {nameError && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{nameError}</p>
            )}
          </div>

          {/* Room Code or URL */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Room Code or Invite URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={joinInput}
                onChange={(e) => {
                  setJoinInput(e.target.value);
                  setJoinError('');
                }}
                placeholder="e.g. r4ig6rd or paste full room link"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF5722] focus:bg-white transition"
              />
            </div>
            {joinError && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{joinError}</p>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-sm shadow-[0_6px_20px_rgba(255,87,34,0.3)] transition transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Radio className="w-4 h-4" />
              <span>Connect to Room</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Recent Rooms */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-[#FF5722]" />
              <span>Recent Rooms</span>
            </div>
            {recentRooms.length > 0 && (
              <span className="text-[10px] text-gray-400">{recentRooms.length} saved</span>
            )}
          </div>

          {recentRooms.length === 0 ? (
            <p className="text-xs text-gray-400 py-2">
              No recent rooms yet. Enter a room code above or ask a host for an invite link.
            </p>
          ) : (
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {recentRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => handleRejoinRecent(room)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 transition cursor-pointer group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="text-xs font-semibold text-gray-900 group-hover:text-[#FF5722] transition truncate">
                      {room.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 truncate">
                      ID: {room.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-medium text-[#FF5722] opacity-0 group-hover:opacity-100 transition">
                      Re-join →
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecent(room.id);
                      }}
                      aria-label={`Remove ${room.name}`}
                      className="p-1 rounded-lg text-gray-400 hover:text-rose-500 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
