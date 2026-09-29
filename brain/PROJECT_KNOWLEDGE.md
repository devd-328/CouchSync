# CouchSync Live — Complete Project Knowledge Base & Architecture Manual

> **CouchSync Live** (`couchsync.live`) is an ultra-low-latency, zero-cloud-cost synchronized movie watch-party web application. It combines adaptive bitrate streaming, zero-upload local file playback, synchronized YouTube viewing, and WebRTC peer-to-peer audio/video calls with smart audio ducking, live interactive trivia, live polls, timestamped chat, and an ambient warm-luxury dark aesthetic.

---

## 1. Project Vision & Identity

| Property | Detail |
|---|---|
| **Product Name** | **CouchSync Live** |
| **Domain** | `https://couchsync.live` |
| **Taglines** | *"Watch Movies Together in Real-Time Sync"* • *"Watch Together, Even When You're Apart"* |
| **Core Architecture Principle** | **Zero Server Cost & Privacy-First**: Video and voice flow directly peer-to-peer via WebRTC. Synchronization signals are broadcast ephemerally (via Supabase Realtime or browser `BroadcastChannel`). No user accounts, database tables, or cloud media storage required. |
| **Target Audience** | Long-distance partners, movie discussion clubs, study pairs, and watch party communities. |
| **Brand Identity** | Option 06 Play-C logo (`src/components/brand/CouchSyncLogo.tsx`) featuring coral-to-amber origami gradients (`#FF5722` to `#FF8A65`), sleek obsidian surfaces, and a live broadcast indicator. |

---

## 2. Technology Stack & Runtime Matrix

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 16.3.4 (App Router)                   │
│                          React 19.2.8 + React Compiler                 │
├────────────────────────────────────────────────────────────────────────┤
│  Styling & UI       Tailwind CSS v4 (@tailwindcss/postcss)             │
│                     Lucide React 1.43.0                                │
│                     Custom Glassmorphism & Micro-animations            │
├────────────────────────────────────────────────────────────────────────┤
│  Video & Media      HLS.js 1.7.2 (Adaptive Bitrate m3u8)               │
│                     YouTube IFrame Player API                          │
│                     Local File URL.createObjectURL Streamer            │
│                     getDisplayMedia Screen Sharing                     │
├────────────────────────────────────────────────────────────────────────┤
│  Real-Time Comms    Native WebRTC (RTCPeerConnection multi-peer mesh)  │
│                     Web Audio API (AnalyserNode, VAD, Dynamic Ducking) │
│                     Supabase Realtime 2.116.0 (Broadcast & Presence)   │
│                     Native BroadcastChannel API (Zero-Config Fallback) │
├────────────────────────────────────────────────────────────────────────┤
│  Performance & SEO  @vercel/speed-insights 2.0.0                       │
│                     Edge OpenGraph Image Generator                     │
│                     Dynamic Sitemap & Robots XML                       │
└────────────────────────────────────────────────────────────────────────┘
```

### Detailed Dependency Breakdown (`package.json`)
- `next`: `16.3.4` — App Router, server components, client boundary isolation, dynamic route `use(params)`.
- `react` & `react-dom`: `19.2.8` — Latest React 19 architecture with compiler optimizations enabled in `next.config.ts`.
- `hls.js`: `^1.7.2` — Full HLS protocol client for adaptive video playback, buffer monitoring, and subtitle track selection.
- `@supabase/supabase-js`: `^2.116.0` — Ephemeral room channels using Presence and Broadcast events without SQL/database dependency.
- `lucide-react`: `^1.43.0` — Consistent iconography across all components.
- `@vercel/speed-insights`: `^2.0.0` — Core Web Vitals telemetry.
- `clsx` (`^2.1.1`) & `tailwind-merge` (`^3.7.0`) — Dynamic class merging helper `cn()`.
- `tailwindcss`: `^4` + `@tailwindcss/postcss`: `^4` — Modern CSS engine configured via PostCSS.

---

## 3. Design System & Visual Architecture

CouchSync Live features a distinctive **Warm Sunset Ambient Canvas with Floating Porcelain Cream Island & Embedded Cinema Dark Player**:
1. **Outer Ambient Sunset Frame**: A vibrant sunset gradient background (`bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C]`) that creates an energetic, warm living-room ambiance around the entire screen.
2. **Floating Porcelain Cream Canvas (`#FAF8F5`)**: An elevated luxury rounded island (`rounded-[28px] sm:rounded-[44px]`, `border-white/60`, `shadow-[0_30px_90px_rgba(0,0,0,0.22)]`) hosting crisp high-contrast dark editorial typography (`text-gray-950`, `#111827`, `#4B5563`), clean pill buttons, and soft floating cards (`.card-floating`).
3. **Embedded Cinema Dark Player Surfaces (`#0B0D14`, `#121622`)**: The media player modules (the 3D WorksWheel reel, video player container, and WebRTC video tiles) are rendered in deep obsidian dark mode with glowing cyan speaking pulses (`#00F2FE`), giving users a theater-grade video viewing experience nestled inside the warm luxury canvas.

### 3.1 Color Tokens & CSS Variables (`src/app/globals.css`)

```css
:root {
  /* Canvas & Background Surfaces */
  --background: #0B0E14;              /* Deep slate background */
  --foreground: #F3F4F6;              /* High-contrast off-white text */
  --muted: #1A202C;                   /* Muted card surface */
  --muted-foreground: #9CA3AF;        /* Subtitle / secondary text */
  --bg-base: #0B0D14;                 /* Cinema canvas background */
  --bg-surface: #121622;              /* Card & widget surface */
  --bg-surface-glass: rgba(18, 22, 34, 0.92); /* Glass backdrop */
  --border-glass: rgba(255, 255, 255, 0.12);   /* Glass border */

  /* Warm Luxury Accents */
  --bg-warm-ambient: #EA580C;          /* Warm glow radial center */
  --bg-canvas: #FAF8F5;               /* Warm light hero badge tint */
  --accent-coral: #FF6B4A;            /* Primary brand coral */
  --accent-orange: #F97316;           /* Amber-orange accent */
  --accent-amber: #F59E0B;            /* Honey amber accent */

  /* Activity State Neon Tokens */
  --accent-cyan: #00F2FE;             /* HLS Stream / Active Voice Speaking glow */
  --accent-violet: #7F00FF;           /* Screen share activity */
  --accent-emerald: #00E676;          /* Low latency / perfectly synced badge */
}
```

### 3.2 Visual Utility Classes & Micro-Interactions
1. **Glassmorphism**:
   - `.glass-panel`: `backdrop-filter: blur(16px)` with `rgba(18, 22, 34, 0.92)` background and subtle glass border.
   - `.glass-pill`: Pill button containers with `backdrop-filter: blur(12px)`.
2. **Dynamic 3D WorksWheel** (`src/components/ui/works-wheel.tsx`):
   - Interactive rotating drum cylinder showing cinema watch modes.
   - Computes 3D transform matrices with perspective bow, drag-to-spin, mouse wheel deceleration, and snap-to-card physics.
3. **Voice Activity Speaking Border** (`.speaking-border`):
   - Keyframed cyan pulse animation (`speaking-pulse`) that glows around video tiles when a peer's mic input exceeds threshold.
4. **Floating Emoji Reactions** (`.animate-float-up`):
   - Physics-inspired float-up animation with cubic-bezier easing (`cubic-bezier(0.22, 1, 0.36, 1)`) moving upward over 2.8s.
5. **Warm Dual Volume Sliders** (`.slider-warm`, `.slider-warm-partner`):
   - Custom-styled range slider rails with glowing circular thumbs for independent movie and partner audio balance.
6. **Bento Shimmer Animation** (`.bento-sync-bar`):
   - Smooth 200% green gradient shimmer illustrating continuous sub-150ms synchronization.

---

## 4. Directory & File Catalog

### 4.1 Root & Configuration Files
- [`next.config.ts`](file:///e:/MovieWatcher/couchsync/next.config.ts): Content Security Policy (CSP), permissions policy (camera, mic, display-capture), domain redirects, React Compiler flag.
- [`package.json`](file:///e:/MovieWatcher/couchsync/package.json): Project dependencies and scripts (`dev: "next dev --webpack"`).
- [`postcss.config.mjs`](file:///e:/MovieWatcher/couchsync/postcss.config.mjs): PostCSS pipeline with Tailwind CSS v4.
- [`tsconfig.json`](file:///e:/MovieWatcher/couchsync/tsconfig.json): TypeScript configuration with `@/*` path mapping to `./src/*`.
- [`CLAUDE.md`](file:///e:/MovieWatcher/couchsync/CLAUDE.md): Direct project intelligence for AI coding agents.

### 4.2 App Router (`src/app/`)
- [`src/app/layout.tsx`](file:///e:/MovieWatcher/couchsync/src/app/layout.tsx): Root HTML skeleton, Inter font styling, SEO meta tags, JSON-LD `SoftwareApplication` structured schema, Speed Insights integration.
- [`src/app/page.tsx`](file:///e:/MovieWatcher/couchsync/src/app/page.tsx): Main landing page composing Navbar, HeroSection, CapabilityStrip, ProductShowcase, MoreThanMovies, FaqSection, FinalCTA, and SiteFooter.
- [`src/app/globals.css`](file:///e:/MovieWatcher/couchsync/src/app/globals.css): CSS variables, utility tokens, keyframes, scrollbar styling, custom slider inputs.
- [`src/app/about/page.tsx`](file:///e:/MovieWatcher/couchsync/src/app/about/page.tsx): About page presenting CouchSync's privacy-first architecture, zero server costs, and mission.
- [`src/app/features/page.tsx`](file:///e:/MovieWatcher/couchsync/src/app/features/page.tsx): Comprehensive feature breakdown page (WebRTC mesh, HLS, local playback, trivia, polls).
- [`src/app/how-it-works/page.tsx`](file:///e:/MovieWatcher/couchsync/src/app/how-it-works/page.tsx): 3-step guide and technical architecture breakdown for users.
- [`src/app/room/[roomId]/page.tsx`](file:///e:/MovieWatcher/couchsync/src/app/room/[roomId]/page.tsx): The central watch party room interface orchestrating player, WebRTC call, chat drawer, controls, trivia, and polls.
- [`src/app/robots.ts`](file:///e:/MovieWatcher/couchsync/src/app/robots.ts): Search engine indexing policy (disallowing private `/room/*` routes, allowing marketing pages).
- [`src/app/sitemap.ts`](file:///e:/MovieWatcher/couchsync/src/app/sitemap.ts): Dynamic XML sitemap generator with priority rankings.
- [`src/app/opengraph-image.tsx`](file:///e:/MovieWatcher/couchsync/src/app/opengraph-image.tsx): Dynamic Edge-rendered Open Graph preview banner (1200×630).
- [`src/app/twitter-image.tsx`](file:///e:/MovieWatcher/couchsync/src/app/twitter-image.tsx): Dynamic Edge-rendered Twitter summary card.

### 4.3 UI & Brand Components (`src/components/`)
- **Brand**:
  - [`CouchSyncLogo.tsx`](file:///e:/MovieWatcher/couchsync/src/components/brand/CouchSyncLogo.tsx): Option 06 Play-C vector logo with animated gradient badge.
- **Landing**:
  - [`Navbar.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/Navbar.tsx): Universal navigation bar with active route pills and responsive mobile drawer.
  - [`HeroSection.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/HeroSection.tsx): Headline, CTA triggers, and the 3D WorksWheel interactive reel.
  - [`CreateRoomModal.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/CreateRoomModal.tsx): Modal dialog for configuring room name, nickname, and initial media mode.
  - [`JoinRoomModal.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/JoinRoomModal.tsx): Room join modal with room code parser and recent rooms history.
  - [`CapabilityStrip.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/CapabilityStrip.tsx): Feature badges strip highlight.
  - [`ProductShowcase.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/ProductShowcase.tsx): Interactive UI product demo preview.
  - [`MoreThanMovies.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/MoreThanMovies.tsx): Feature grid displaying Trivia, Screen Share, and WebRTC calls.
  - [`SocialShowcase.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/SocialShowcase.tsx): Social proof and real-time interaction metrics.
  - [`HowItWorks.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/HowItWorks.tsx): 3-step diagrammatic onboarding section.
  - [`FaqSection.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/FaqSection.tsx): Accordion FAQ answering common questions.
  - [`FinalCTA.tsx`](file:///e:/MovieWatcher/couchsync/src/components/landing/FinalCTA.tsx): High-conversion call-to-action banner.
- **Player & Media**:
  - [`VideoPlayer.tsx`](file:///e:/MovieWatcher/couchsync/src/components/player/VideoPlayer.tsx): Master player container switching between HLS, Local Files, YouTube, Screen Share, and Trivia.
  - [`PlayerControls.tsx`](file:///e:/MovieWatcher/couchsync/src/components/player/PlayerControls.tsx): Video scrub bar, play/pause, 10s skip, time display, playback speed selector, fullscreen toggle, theater mode toggle.
  - [`YouTubePlayer.tsx`](file:///e:/MovieWatcher/couchsync/src/components/player/YouTubePlayer.tsx): Synchronized YouTube player wrapping YouTube IFrame API.
  - [`ScreenSharePlayer.tsx`](file:///e:/MovieWatcher/couchsync/src/components/player/ScreenSharePlayer.tsx): WebRTC screen sharing renderer.
  - [`SubtitleMenu.tsx`](file:///e:/MovieWatcher/couchsync/src/components/player/SubtitleMenu.tsx): Subtitle track selector supporting embedded tracks and custom VTT/SRT file uploads.
  - [`SyncStatusBadge.tsx`](file:///e:/MovieWatcher/couchsync/src/components/player/SyncStatusBadge.tsx): Visual status badge showing peer latency and synchronization health.
- **WebRTC & Video Call**:
  - [`WebRTCCall.tsx`](file:///e:/MovieWatcher/couchsync/src/components/video-call/WebRTCCall.tsx): Multi-peer video grid with speaking glow, mic/camera mute badges, and full call controls.
- **Controls & Audio**:
  - [`DualVolumeMixer.tsx`](file:///e:/MovieWatcher/couchsync/src/components/controls/DualVolumeMixer.tsx): Dual slider control for movie vs. voice volume, plus automatic audio ducking toggle.
- **Chat & Reactions**:
  - [`ChatPanel.tsx`](file:///e:/MovieWatcher/couchsync/src/components/chat/ChatPanel.tsx): Live text chat with auto-scrolling, emoji reaction picker, and timestamp jumps to video moments.
  - [`FloatingChatOverlay.tsx`](file:///e:/MovieWatcher/couchsync/src/components/chat/FloatingChatOverlay.tsx): Subtle toast notification overlay for incoming chat messages during theater/focus mode.
  - [`FloatingReactions.tsx`](file:///e:/MovieWatcher/couchsync/src/components/reactions/FloatingReactions.tsx): Real-time floating emoji particle burst engine.
- **Room Management**:
  - [`RoomHeader.tsx`](file:///e:/MovieWatcher/couchsync/src/components/room/RoomHeader.tsx): Top navigation bar with media source switcher, invite link generator, layout switchers (Cinema, Lounge, Focus), and settings button.
  - [`RoomPoll.tsx`](file:///e:/MovieWatcher/couchsync/src/components/room/RoomPoll.tsx): Real-time audience voting poll component with instant percentage calculations.
  - [`RoomSettingsModal.tsx`](file:///e:/MovieWatcher/couchsync/src/components/room/RoomSettingsModal.tsx): Settings dialog for user nickname, audio ducking preferences, and keyboard shortcuts guide.
  - [`VideoSettingsModal.tsx`](file:///e:/MovieWatcher/couchsync/src/components/room/VideoSettingsModal.tsx): Video selector dialog allowing users to enter custom HLS stream URLs, YouTube links, or pick local video files.
- **Interactive Games**:
  - [`MovieTrivia.tsx`](file:///e:/MovieWatcher/couchsync/src/components/games/MovieTrivia.tsx): Multiplayer synchronized movie trivia game with synchronized 15-second timer and live scoring.
- **Lobby & Pre-flight Check**:
  - [`DeviceCheck.tsx`](file:///e:/MovieWatcher/couchsync/src/components/lobby/DeviceCheck.tsx): Pre-join webcam video mirror and real-time microphone volume visualizer.
  - [`DeviceCheckModal.tsx`](file:///e:/MovieWatcher/couchsync/src/components/lobby/DeviceCheckModal.tsx): Modal wrapper for pre-flight device diagnostics.
- **UI Primitives & 3D**:
  - [`works-wheel.tsx`](file:///e:/MovieWatcher/couchsync/src/components/ui/works-wheel.tsx): 3D rotating portfolio drum component with cross-browser gesture support.
- **Layout**:
  - [`SiteFooter.tsx`](file:///e:/MovieWatcher/couchsync/src/components/layout/SiteFooter.tsx): Unified site footer with navigation links and brand attribution.

### 4.4 Hooks (`src/hooks/`)
- [`useSyncedPlayback.ts`](file:///e:/MovieWatcher/couchsync/src/hooks/useSyncedPlayback.ts): Heart of playback synchronization. Handles play, pause, seek, speed, buffering states, heartbeat intervals, drift snapping, and echo lockout windows.
- [`useWebRTC.ts`](file:///e:/MovieWatcher/couchsync/src/hooks/useWebRTC.ts): WebRTC mesh engine managing `RTCPeerConnection`, ICE candidates, SDP offers/answers, mic/camera stream manipulation, and Web Audio API voice activity detection.
- [`useAudioMeter.ts`](file:///e:/MovieWatcher/couchsync/src/hooks/useAudioMeter.ts): Hook that connects to a media stream via `AnalyserNode` and outputs a normalized 0-100 volume level and frequency bars.
- [`useKeyboardShortcuts.ts`](file:///e:/MovieWatcher/couchsync/src/hooks/useKeyboardShortcuts.ts): Global hotkey listener managing shortcuts (Space, K, M, F, C, T, Arrow keys) while intelligently ignoring active text inputs.
- [`useModalBehavior.ts`](file:///e:/MovieWatcher/couchsync/src/hooks/useModalBehavior.ts): Accessibility and UX hook managing `Escape` key close, outside click dismissal, body scroll locking, and focus restoration.

### 4.5 Libraries & Utilities (`src/lib/`)
- [`sync-channel.ts`](file:///e:/MovieWatcher/couchsync/src/lib/sync-channel.ts): Universal messaging abstraction that automatically toggles between Supabase Realtime Broadcast & Presence and native browser `BroadcastChannel` with `localStorage` heartbeats.
- [`supabase.ts`](file:///e:/MovieWatcher/couchsync/src/lib/supabase.ts): Supabase client initialization.
- [`subtitles.ts`](file:///e:/MovieWatcher/couchsync/src/lib/subtitles.ts): Parser converting SRT and WebVTT subtitle files into browser-compatible VTT data URLs.
- [`sample-media.ts`](file:///e:/MovieWatcher/couchsync/src/lib/sample-media.ts): Curated list of high-definition HLS test streams (Mux test videos, Big Buck Bunny, Tears of Steel).
- [`session.ts`](file:///e:/MovieWatcher/couchsync/src/lib/session.ts): Persistent participant preferences (`localStorage` and `sessionStorage`).
- [`formatters.ts`](file:///e:/MovieWatcher/couchsync/src/lib/formatters.ts): Utility functions: `formatTime(seconds)`, unique ID generator `generateId()`.
- [`utils.ts`](file:///e:/MovieWatcher/couchsync/src/lib/utils.ts): `cn()` wrapper combining `clsx` and `tailwind-merge`.

### 4.6 Configuration & Types (`src/config/` & `src/types/`)
- [`constants.ts`](file:///e:/MovieWatcher/couchsync/src/config/constants.ts): Single source of truth for platform parameters:
  - `SYNC_CONFIG`: `DRIFT_TOLERANCE_SECONDS = 1.5`, `HEARTBEAT_INTERVAL_MS = 1500`, `REMOTE_LOCKOUT_MS = 150`, `MIN_LATENCY_MS = 8`.
  - `AUDIO_CONFIG`: `DUCKING_MULTIPLIER = 0.65`, `VAD_THRESHOLD = 18`, `DEFAULT_MOVIE_VOLUME = 0.8`, `DEFAULT_PARTNER_VOLUME = 0.7`.
  - `WEBRTC_CONFIG`: Google STUN servers (`stun:stun.l.google.com:19302`), media constraints.
  - `STORAGE_KEYS`: Namespaced keys for settings persistence.
  - `SOURCE_COLORS`: Per-source color themes (`hls`, `youtube`, `screenshare`, `trivia`).
- [`sync.ts`](file:///e:/MovieWatcher/couchsync/src/types/sync.ts): Single source of truth for TypeScript interfaces:
  - `PlaybackAction`, `WebRTCSignalAction`, `ScreenShareAction`, `MediaSourceChangeAction`, `TriviaAction`, `SocialAction`, `RoomControlAction`, `PollAction`.
  - `SyncMessage` union type.
  - `RoomParticipant`, `ChatMessage`, `FloatingEmoji`, `VideoMedia`, `RoomPoll`, `TriviaQuestion`.

---

## 5. Deep Architectural Subsystems

### 5.1 Sub-150ms Sync Engine (`useSyncedPlayback.ts`)

```
   Local Player Event                     Remote Peer Event
  (User presses Play)                   (Peer paused video)
          │                                      │
          ▼                                      ▼
┌──────────────────┐                   ┌──────────────────┐
│ Emit Local Action│                   │ Receive Message  │
└─────────┬────────┘                   └─────────┬────────┘
          │                                      │
          ▼                                      ▼
┌──────────────────┐                   ┌──────────────────┐
│ Send to Channel  │                   │ Check Lockout:   │
│ (Broadcast/Supa) │                   │ isHandlingRemote?│
└──────────────────┘                   └─────────┬────────┘
                                                 │ No
                                                 ▼
                                       ┌──────────────────┐
                                       │ Set Lockout = ON │
                                       │ Apply Seek/Play  │
                                       │ Timer: 150ms OFF │
                                       └──────────────────┘
```

1. **Drift Tolerance Threshold**:
   - Discrepancies under **1.5 seconds** (`DRIFT_TOLERANCE_SECONDS`) are deliberately ignored. This prevents the constant micro-stutters and audio cracking caused by slight clock variations.
2. **Hard Snap Resync**:
   - If drift exceeds 1.5s, the engine triggers an instant `video.currentTime = remoteTime` snap.
3. **Heartbeat Pulse**:
   - The room host broadcasts a lightweight heartbeat event every **1.5 seconds** containing current playback timestamp and playing state. Non-host peers check against this heartbeat to detect silent drift.
4. **Cooperative Buffering**:
   - If a peer's connection stalls and enters `buffering`, an event is emitted to all peers, automatically pausing their players. Once the buffering peer's video emits `canplaythrough`, a `ready` event resumes playback simultaneously.
5. **Echo Lockout Window**:
   - When a peer applies a remote seek or play action, local DOM event listeners (`onPlay`, `onSeeked`) would naturally fire and try to rebroadcast the action back to the sender, causing an infinite echo loop.
   - CouchSync Live solves this by setting `isHandlingRemoteAction.current = true` before mutating DOM video state, locking outbound transmissions for a 150ms window (`REMOTE_LOCKOUT_MS`).

---

### 5.2 WebRTC Mesh Video Calling & Smart Audio Ducking

1. **Multi-Peer Direct Mesh**:
   - Each client establishes direct `RTCPeerConnection` instances with every other peer in the room.
   - Signaling (SDP offers, answers, and ICE candidates) is routed transparently over the room's sync channel (`sync-channel.ts`).
   - STUN resolution uses Google's public infrastructure (`stun:stun.l.google.com:19302`), requiring zero signaling or media servers.
2. **Voice Activity Detection (VAD)**:
   - User microphone audio is split into a Web Audio API `AudioContext` and fed into an `AnalyserNode`.
   - Every 120ms, the frequency data is averaged. When it exceeds `AUDIO_CONFIG.VAD_THRESHOLD` (18), the peer is marked as `isSpeaking: true`.
   - Other clients receive this state and render the pulsing cyan speaking border (`.speaking-border`).
3. **Dynamic Voice Ducking**:
   - In movie watch parties, loud action scenes often drown out partner voices.
   - When any remote peer speaks, CouchSync Live dynamically ducks the movie volume by **35%** (`movieVolume * 0.65`).
   - When everyone stops speaking, the movie volume smoothly returns to its original user-selected level.

---

### 5.3 Zero-Upload Local File Streaming

- Users can watch personal high-bitrate video files (e.g. 4K `.mp4`, `.mkv`, `.webm`) by selecting a file from their local disk.
- CouchSync Live creates an in-memory blob URL using `URL.createObjectURL(file)`.
- **Zero Cloud Bandwidth**: The video file is **never uploaded** to any server. Peers who have the same movie file on their respective computers both select the file locally; CouchSync Live synchronizes their playhead timestamps and playback states in frame-accurate real time.
- **Chromium Infinity Duration Fix**: Certain local media containers cause Chromium browsers to report `duration: Infinity`. CouchSync Live detects this and forces a brief seek to compute the true finite duration.

---

### 5.4 Dual Signaling Architecture & Zero-Config Offline Fallback

```
                    ┌────────────────────────────┐
                    │      sync-channel.ts       │
                    └──────────────┬─────────────┘
                                   │
             ┌─────────────────────┴─────────────────────┐
             ▼                                           ▼
┌────────────────────────────┐              ┌────────────────────────────┐
│   Supabase Realtime Mode   │              │ Local BroadcastChannel Mode│
│ (NEXT_PUBLIC_SUPABASE_URL) │              │   (Zero-Config Fallback)   │
├────────────────────────────┤              ├────────────────────────────┤
│ • Cloud multi-network sync │              │ • 100% offline & local     │
│ • Realtime Broadcast       │              │ • Cross-tab communication  │
│ • Ephemeral Presence       │              │ • localStorage heartbeats  │
└────────────────────────────┘              └────────────────────────────┘
```

- When Supabase credentials exist in `.env.local`: Real-time signaling routes via Supabase Realtime broadcast channels.
- When Supabase credentials are not set or disconnected: The app seamlessly falls back to the native browser `BroadcastChannel` API.
- **Immediate Developer Experience**: You can clone the repo and run `npm run dev` immediately — open two browser tabs to test complete multi-user sync with zero account creation or cloud configuration.

---

## 6. Security, SEO & Production Configuration

### 6.1 Content Security Policy & Security Headers (`next.config.ts`)
- `Content-Security-Policy`: Strictly scoped allowing YouTube IFrame embeds, Supabase WebSockets (`wss://*.supabase.co`), Vercel Speed Insights (`https://va.vercel-scripts.com`), and local blob/data media streams.
- `Permissions-Policy`: Explicitly permits `camera=(self), microphone=(self), display-capture=(self)` for WebRTC while blocking unauthorized cross-origin access.
- `X-Frame-Options`: `SAMEORIGIN` prevents clickjacking.
- `X-Content-Type-Options`: `nosniff` prevents MIME sniffing.
- Domain canonicalization: Automatically redirects `www.couchsync.live` to `https://couchsync.live`.

### 6.2 SEO Architecture
- **Dynamic OpenGraph Preview** (`src/app/opengraph-image.tsx`): Generated on the Edge runtime using `@vercel/og`, producing customized 1200×630 cards with typography and gradient badges.
- **Dynamic Twitter Cards** (`src/app/twitter-image.tsx`): Optimized summary large image cards.
- **Structured Data**: JSON-LD `SoftwareApplication` embedded in `src/app/layout.tsx`.
- **Search Engine Indexing**: `src/app/robots.ts` restricts crawlers from private `/room/*` paths while allowing indexing of marketing pages.

---

## 7. Developer Invariants & Coding Guidelines

### Always Do:
1. **Declare `"use client"`** on all components containing hooks, browser APIs, or local state.
2. **Unwrap Next.js 16 dynamic route params** with `use(params)`:
   ```tsx
   export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
     const resolvedParams = use(params);
     const roomId = resolvedParams.roomId;
     // ...
   }
   ```
3. **Use `useModalBehavior`** on all modal dialogs to ensure consistent `Escape` key closing, background click dismissal, and background scroll locking.
4. **Centralize Types**: Always import shared types from `@/types/sync`.
5. **Centralize Constants**: Keep all numeric thresholds in `@/config/constants`.
6. **Use `cn()`**: Always combine Tailwind classes with `cn()` from `@/lib/utils`.

### Never Do:
1. **Never install external state managers** (Redux, Zustand). React hooks and refs provide optimal performance and zero bundle bloat.
2. **Never create backend server APIs for ephemeral sync state** — keep CouchSync 100% serverless and zero-cost.
3. **Never alter or remove the `isHandlingRemoteAction` lockout window** in `useSyncedPlayback.ts` without accounting for echo feedback loops.
4. **Never hard-code color hex values** across arbitrary components — utilize predefined CSS variables and Tailwind utility tokens.

---

## 8. Keyboard Shortcuts Reference

| Key Combination | Function | Target Area |
|---|---|---|
| <kbd>Space</kbd> / <kbd>K</kbd> | Toggle Play / Pause | Video Player |
| <kbd>F</kbd> | Toggle Fullscreen / Theater Mode | Video Player |
| <kbd>M</kbd> | Mute / Unmute Media Volume | Video Player |
| <kbd>C</kbd> | Toggle Chat Panel Drawer | Room |
| <kbd>T</kbd> | Push-to-Talk (unmutes mic while held) | WebRTC Call |
| <kbd>←</kbd> / <kbd>→</kbd> | Seek backward / forward 10 seconds | Video Player |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Adjust movie volume ±10% | Video Player |
| <kbd>1</kbd> - <kbd>5</kbd> | Set playback speed (0.75x, 1x, 1.25x, 1.5x, 2x) | Video Player |
| <kbd>Esc</kbd> | Dismiss any open modal dialog or menu | Global |

---

*This document is the authoritative project knowledge repository for CouchSync Live. Keep this document updated whenever new features, hooks, or architectural layers are introduced.*
