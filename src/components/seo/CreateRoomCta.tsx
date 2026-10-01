'use client';

import React from 'react';
import { useRoomModals } from '@/components/landing/RoomModalsProvider';
import { MediaSourceType } from '@/types/sync';
import { cn } from '@/lib/utils';

export interface CreateRoomCtaProps {
  className?: string;
  children?: React.ReactNode;
  mode?: MediaSourceType;
}

export function CreateRoomCta({
  className,
  children = 'Create a free room',
  mode,
}: CreateRoomCtaProps) {
  const { openCreateRoom } = useRoomModals();

  return (
    <button
      type="button"
      onClick={() => openCreateRoom(mode)}
      className={cn(
        'w-full sm:w-auto px-7 py-3 rounded-full bg-[#111827] hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-xl transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer inline-flex items-center justify-center',
        className
      )}
    >
      {children}
    </button>
  );
}
