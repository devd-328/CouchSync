import { supabase, isSupabaseConfigured } from './supabase';
import { SyncMessage, RoomParticipant } from '@/types/sync';

export interface ChannelSubscription {
  sendMessage: (msg: SyncMessage) => void;
  updatePresence: (user: RoomParticipant) => void;
  unsubscribe: () => void;
}

export function subscribeToRoom(
  roomId: string,
  currentUser: RoomParticipant,
  onMessage: (msg: SyncMessage) => void,
  onParticipantsChange: (participants: RoomParticipant[]) => void
): ChannelSubscription {
  let isUnsubscribed = false;
  let lastKnownParticipantsHash = '';

  const safeNotifyParticipants = (participants: RoomParticipant[]) => {
    if (isUnsubscribed) return;
    const hash = participants.map((p) => `${p.id}:${p.name}:${p.isMicOn}:${p.isCamOn}`).sort().join('|');
    if (hash !== lastKnownParticipantsHash) {
      lastKnownParticipantsHash = hash;
      onParticipantsChange(participants);
    }
  };

  if (isSupabaseConfigured && supabase) {
    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: currentUser.id },
      },
    });

    channel
      .on('broadcast', { event: 'sync-event' }, ({ payload }) => {
        if (!isUnsubscribed) onMessage(payload as SyncMessage);
      })
      .on('presence', { event: 'sync' }, () => {
        if (isUnsubscribed) return;
        const state = channel.presenceState();
        const activeMembers: RoomParticipant[] = [];
        for (const key in state) {
          const presences = state[key] as unknown as RoomParticipant[];
          if (presences && presences.length > 0) {
            activeMembers.push(presences[0]);
          }
        }
        safeNotifyParticipants(activeMembers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && !isUnsubscribed) {
          await channel.track(currentUser);
        }
      });

    return {
      sendMessage: (msg: SyncMessage) => {
        if (!isUnsubscribed) {
          channel.send({
            type: 'broadcast',
            event: 'sync-event',
            payload: msg,
          });
        }
      },
      updatePresence: async (user: RoomParticipant) => {
        if (!isUnsubscribed) await channel.track(user);
      },
      unsubscribe: () => {
        isUnsubscribed = true;
        channel.unsubscribe();
      },
    };
  }

  // --- Local BroadcastChannel Fallback (Multi-window sync) ---
  const broadcast = typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel(`couchsync-room-${roomId}`)
    : null;

  const presenceStorageKey = `couchsync-presence-${roomId}`;

  const readActiveParticipants = (): RoomParticipant[] => {
    if (typeof window === 'undefined') return [currentUser];
    try {
      const stored = JSON.parse(localStorage.getItem(presenceStorageKey) || '{}');
      const now = Date.now();
      const valid: RoomParticipant[] = [];
      for (const id in stored) {
        if (now - stored[id].lastSeen < 10000) {
          valid.push(stored[id]);
        }
      }
      return valid.length > 0 ? valid : [currentUser];
    } catch {
      return [currentUser];
    }
  };

  const registerLocalPresence = (user: RoomParticipant) => {
    if (typeof window === 'undefined' || isUnsubscribed) return;
    try {
      const stored = JSON.parse(localStorage.getItem(presenceStorageKey) || '{}');
      stored[user.id] = { ...user, lastSeen: Date.now() };
      localStorage.setItem(presenceStorageKey, JSON.stringify(stored));
      safeNotifyParticipants(readActiveParticipants());
    } catch {
      // ignore
    }
  };

  const removeLocalPresenceSilently = (userId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(localStorage.getItem(presenceStorageKey) || '{}');
      delete stored[userId];
      localStorage.setItem(presenceStorageKey, JSON.stringify(stored));
    } catch {
      // ignore
    }
  };

  // Initial presence registration
  registerLocalPresence(currentUser);

  // Heartbeat to keep presence alive in local testing
  const presenceInterval = setInterval(() => {
    registerLocalPresence(currentUser);
  }, 3000);

  if (broadcast) {
    broadcast.onmessage = (event) => {
      if (isUnsubscribed) return;
      const data = event.data;
      if (data && data._isPresencePing) {
        safeNotifyParticipants(readActiveParticipants());
      } else if (data) {
        onMessage(data as SyncMessage);
      }
    };
  }

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === presenceStorageKey && !isUnsubscribed) {
      safeNotifyParticipants(readActiveParticipants());
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
  }

  return {
    sendMessage: (msg: SyncMessage) => {
      if (broadcast && !isUnsubscribed) {
        broadcast.postMessage(msg);
      }
    },
    updatePresence: (user: RoomParticipant) => {
      if (!isUnsubscribed) {
        registerLocalPresence(user);
        if (broadcast) broadcast.postMessage({ _isPresencePing: true });
      }
    },
    unsubscribe: () => {
      isUnsubscribed = true;
      clearInterval(presenceInterval);
      removeLocalPresenceSilently(currentUser.id);
      if (broadcast) {
        broadcast.postMessage({ _isPresencePing: true });
        broadcast.close();
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    },
  };
}
