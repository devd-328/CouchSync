# Watch-Together App — Design & Architecture

## 1. Core Concept

Two people, anywhere, watching the same video in sync while seeing and hearing each other in real time via live video/audio call and chat. Each person streams video at whatever quality their own connection supports. Nobody uploads raw files to each other. The app owns the video source, keeps two independent players locked to the same timestamp, and facilitates a direct peer-to-peer (P2P) video call between them.

Three separate systems working seamlessly together:

- **Media pipeline**: get video in, transcode it, serve adaptive streams (HLS via CDN)
- **Sync layer**: keep two players in the same state (play, pause, seek, buffering) in near real time via low-latency WebSocket broadcast
- **Presence & Communication layer**: WebRTC P2P video/voice call + real-time chat & emoji reactions, using the sync channel for WebRTC signaling

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           WebRTC P2P Media Stream                       │
│                        (Webcam Video & Mic Audio)                       │
│                                                                         │
│         ┌─────────────┐                           ┌─────────────┐       │
│         │  Person A   │◄═════════════════════════►│  Person B   │       │
│         │  Browser    │                           │  Browser    │       │
│         │  (hls.js)   │◄────────► ┌─────────────┐ ◄──────────►│ │ (hls.js)   │       │
│         └──────┬──────┘   WS/RT   │ Sync Server │   WS/RT   └──────┬──────┘       │
│                │                  │ & Signaling │                  │              │
│                │                  │(Supabase RT)│                  │              │
│                │                  └─────────────┘                  │              │
└────────────────┼───────────────────────────────────────────────────┼──────────────┘
                 │                                                   │
                 │         Independent HLS Pulls (Adaptive)          │
                 ▼                                                   ▼
                ┌─────────────────────────────────────────────────────┐
                │             CDN (Cloudflare / Bunny)                │
                │             Serves .m3u8 + .ts segments             │
                └─────────────────────────┬───────────────────────────┘
                                          │
                ┌─────────────────────────▼───────────────────────────┐
                │          Transcoding (ffmpeg / Mux)                 │
                │          → 240p / 480p / 720p / 1080p               │
                └─────────────────────────┬───────────────────────────┘
                                          │
                ┌─────────────────────────▼───────────────────────────┐
                │         Storage (S3 / Cloudflare R2)                │
                │         Original upload + HLS output                │
                └─────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

### 3.1 Frontend (Next.js + TypeScript + Tailwind)

- **Room page** (`/room/[roomId]`):
  - **Video Stage**: `hls.js` attached to a native `<video>` element (lightweight, fine-grained control over playback, buffering, and time updates).
  - **Video Call Overlay / Sidebar**:
    - *Theater View*: Movie takes primary viewport (~75%), right sidebar displays partner's video feed, self-preview, and live chat.
    - *Picture-in-Picture (PiP)*: Draggable floating webcam bubbles over the video with minimize/expand toggles.
  - **Call Controls**: Quick mute/unmute mic, toggle webcam, device selector, and separate volume sliders for Movie vs. Partner voice.
  - **Interactive Chat**: Live text message feed + instant floating emoji reactions (😂, 😱, ❤️, 🍿) overlaid on stream.

- **Sync & Call Hooks**:
  - `useSyncedPlayback`: handles player events, remote sync event listeners, drift compensation, and echo-prevention lock.
  - `useWebRTCCall`: manages local `MediaStream` (camera/mic), RTCPeerConnection lifecycle, ICE candidate gathering, and remote stream rendering.

### 3.2 Sync & Signaling Layer (Supabase Realtime)

Use a Realtime "Presence + Broadcast" channel per room for **both playback sync and WebRTC signaling**:

- **Presence**: Track who is online, joined, left, or reconnecting.
- **Playback Broadcast**: Ephemeral low-latency player state events.
- **WebRTC Signaling Broadcast**: Exchange SDP offers, answers, and ICE candidates between peers without needing a separate signaling server.

#### Event Schema:

```typescript
// Playback Sync Events
type PlaybackSyncEvent =
  | { type: 'play'; time: number; senderId: string; ts: number }
  | { type: 'pause'; time: number; senderId: string; ts: number }
  | { type: 'seek'; time: number; senderId: string; ts: number }
  | { type: 'buffering'; senderId: string; ts: number }
  | { type: 'ready'; time: number; senderId: string; ts: number }
  | { type: 'heartbeat'; time: number; senderId: string; ts: number };

// WebRTC Signaling Events (via same Realtime Broadcast channel)
type WebRTCSignalEvent =
  | { type: 'signal-offer'; sdp: RTCSessionDescriptionInit; senderId: string }
  | { type: 'signal-answer'; sdp: RTCSessionDescriptionInit; senderId: string }
  | { type: 'signal-ice'; candidate: RTCIceCandidateInit; senderId: string }
  | { type: 'media-toggle'; audio: boolean; video: boolean; senderId: string };

// In-Room Social Events
type SocialEvent =
  | { type: 'chat-message'; id: string; senderId: string; senderName: string; text: string; ts: number }
  | { type: 'emoji-reaction'; emoji: string; senderId: string; ts: number };
```

### 3.3 WebRTC Video & Voice Call Layer

- **P2P Direct Connection**: Webcam and mic media stream directly between browser peers via `RTCPeerConnection`.
  - **Zero server bandwidth cost** for video/audio calls.
  - Sub-100ms conversational latency.
- **Audio Management & Echo Cancellation**:
  - `getUserMedia` constraints:
    ```typescript
    const audioConstraints = {
      echoCancellation: true,   // Essential: prevents movie audio through speakers from looping into mic
      noiseSuppression: true,   // Filters background noise
      autoGainControl: true,
    };
    ```
  - **Independent Volume Mixing**: Movie volume and Friend's call volume are managed on separate audio elements/nodes.
  - **Smart Audio Ducking**: Dynamically lower movie audio volume by ~25% when partner's audio input level crosses an activity threshold.
- **NAT Traversal**:
  - Free public Google STUN servers (`stun:stun.l.google.com:19302`).
  - TURN fallback server (e.g., Cloudflare Calls or Metered.ca TURN) for users behind symmetric NATs or strict cellular firewalls.

### 3.4 Drift Correction Logic

- **Tolerance Band**: If remote timestamp and local timestamp differ by $< 1.5\text{s}$, do nothing (prevents micro-stutters).
- **Hard Resync**: If drift exceeds $1.5\text{s}$, smoothly seek to the remote timestamp.
- **Cooperative Buffering**: If a `buffering` event arrives from the peer, pause locally even if your local buffer is healthy. Wait for their `ready` event before resuming both.
- **Heartbeat Reconciliation**: Host/controller broadcasts heartbeat every 1–2s to keep timestamps tightly locked.

### 3.5 Media Pipeline

- **Upload**: Single upload to S3 / Cloudflare R2 / Supabase Storage.
- **Transcode**: Worker or managed service (Mux / Cloudflare Stream / FFmpeg) outputs multi-bitrate HLS renditions (`240p`, `480p`, `720p`, `1080p`).
- **Serve**: `.m3u8` manifest and `.ts`/`.fmp4` segments distributed globally via CDN; `hls.js` automatically adapts quality per viewer.

### 3.6 Backend / Database (Supabase Postgres)

```sql
rooms (id, video_id, host_id, created_at)
room_members (room_id, user_id, joined_at)
videos (id, owner_id, title, hls_manifest_url, status, duration)
messages (id, room_id, sender_id, content, created_at)  -- persisted chat history
```

*Note: Playback sync, WebRTC signaling, and emoji reactions are ephemeral and travel exclusively over Supabase Realtime Broadcast (no DB writes).*

---

## 4. End-to-End Workflows

### 4.1 Playback Synchronization Flow (e.g., Person A pauses)
1. Person A clicks pause $\rightarrow$ `<video>` fires native `pause` event.
2. `useSyncedPlayback` broadcasts `{ type: 'pause', time: 142.3, senderId: A, ts: Date.now() }`.
3. Supabase Realtime relays to Person B (~50–150ms).
4. Person B's hook receives event, sets local `ignoreNextPause` lock (prevents echo loop), pauses player, and checks drift.

### 4.2 WebRTC Call Establishment Flow
1. Person A creates room and joins channel.
2. Person B opens room URL and joins channel via Presence.
3. Person A detects new peer $\rightarrow$ calls `peerConnection.createOffer()` $\rightarrow$ sends `signal-offer` via Broadcast.
4. Person B receives offer $\rightarrow$ sets remote description $\rightarrow$ calls `peerConnection.createAnswer()` $\rightarrow$ sends `signal-answer`.
5. Both exchange ICE candidates via `signal-ice`.
6. P2P media stream connects $\rightarrow$ live webcam and audio appear in UI.

---

## 5. Key Tradeoffs & Considerations

- **Bandwidth Usage**: While HLS stream downloads adapt to connection speeds, WebRTC video calling requires ~0.5–1.5 Mbps upload/download per user. Users on very weak connections can easily toggle off camera to switch to audio-only mode.
- **Acoustic Feedback**: Laptop speakers playing movies directly into laptop microphones can cause echo if hardware echo cancellation fails. Ensuring WebRTC's browser-level `echoCancellation: true` is strictly enforced is mandatory.
- **TURN Relay Necessity**: ~10–15% of peer connections fail direct P2P due to strict corporate or cellular NATs. A basic TURN relay ensures 100% call reliability.
