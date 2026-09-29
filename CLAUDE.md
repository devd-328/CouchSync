# CouchSync Live — Project Intelligence & Master Knowledge Base

> **CouchSync Live** is a cinema-grade, real-time synchronized movie watch-party platform featuring peer-to-peer video/voice mesh calling, live chat, floating emoji reactions, interactive multiplayer movie trivia, live audience polls, screen sharing, zero-upload local file playback, and a warm luxury dark aesthetic — running 100% client-side with zero cloud media server costs.

---

## 1. Project Identity & Overview

| Attribute | Specification |
|---|---|
| **Product Name** | **CouchSync Live** (couchsync.live) |
| **Taglines** | *"Watch Movies Together in Real-Time Sync"* • *"Watch Together, Even When You're Apart"* |
| **Brand Mark** | Custom Option 06 Play-C logo (`src/components/brand/CouchSyncLogo.tsx`) with coral/amber origami gradients (`#FF5722` / `#FF8A65` / `#FFA000`) and live pulsing broadcast dot |
| **Status** | Active production-ready development, v0.1.0 |
| **Target Users** | Long-distance couples, movie clubs, study groups, and remote watch communities |
| **Core Value** | Sub-150ms sync latency, crystal-clear WebRTC mesh video/audio, zero-upload local media streaming, $0 infrastructure overhead |

---

## 2. Tech Stack & Dependencies

| Layer | Technology | Version | Purpose & Architecture |
|---|---|---|---|
| **Framework** | Next.js (App Router) | `16.3.4` | App Directory, Turbopack/Webpack dev, React Server Components + Client Boundary |
| **UI Library** | React 19 | `19.2.8` | React 19 hooks (`use()`, compiler optimizations, transitions) |
| **Language** | TypeScript | `^5.0.0` | Strict type checking, centralized models in `src/types/sync.ts` |
| **Styling** | Tailwind CSS v4 + PostCSS | `^4.0.0` | `@tailwindcss/postcss`, CSS variables, dynamic glassmorphism |
| **Video Engine** | HLS.js | `^1.7.2` | Adaptive bitrate video streaming (`.m3u8`), subtitle parsing |
| **Icons** | Lucide React | `^1.43.0` | Unified icon library across landing and room UI |
| **Signaling** | Supabase Realtime | `^2.116.0` | Ephemeral Broadcast & Presence channels (zero persistent DB required) |
| **Local Fallback** | Native BroadcastChannel | Browser API | 100% offline & multi-tab local development without credentials |
| **Video Mesh** | Native WebRTC | Browser API | `RTCPeerConnection`, Google STUN, direct P2P mesh audio/video |
| **Audio Engine** | Web Audio API | Browser API | `AudioContext`, `AnalyserNode` for VAD & dynamic ducking |
| **Telemetry** | @vercel/speed-insights | `^2.0.0` | Core Web Vitals monitoring |
| **Utilities** | clsx & tailwind-merge | `^2.1.1`, `^3.7.0` | Safe dynamic class concatenation (`cn()`) |

### Critical Next.js 16 & React 19 Rules
1. **Dynamic Route Parameters**: `params` in dynamic routes (`room/[roomId]/page.tsx`) is a **Promise** — always unwrap with `use(params)`.
2. **Client Components**: Any file utilizing browser APIs (`window`, `localStorage`, `AudioContext`, `RTCPeerConnection`), React state, or hooks MUST declare `"use client"` at line 1.
3. **Dev Server Execution**: Next.js runs with `next dev --webpack` to ensure stable bundling with WebRTC, Web Audio, and HLS.js.

---

## 3. Theme & Design System

The application features a distinctive **Warm Sunset Ambient Canvas with Floating Porcelain Cream Island & Embedded Cinema Dark Player**:
- **Outer Ambient Sunset Frame**: A vibrant sunset gradient backdrop (`bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C]`) framing the entire viewport.
- **Floating Porcelain Cream Canvas (`#FAF8F5`)**: An elevated luxury rounded island (`rounded-[28px] sm:rounded-[44px]`, `border-white/60`, `shadow-[0_30px_90px_rgba(0,0,0,0.22)]`) hosting crisp dark typography (`text-gray-950`, `#111827`, `#4B5563`), clean pill buttons, and soft floating cards (`.card-floating`).
- **Embedded Cinema Dark Player Surfaces (`#0B0D14`, `#121622`)**: The media player modules (the 3D WorksWheel reel, video player container, and WebRTC video tiles) are rendered in deep obsidian dark mode with glowing cyan speaking pulses (`#00F2FE`), giving users a theater-grade video viewing experience nestled inside the warm luxury canvas.

### 3.1 Color Palette & CSS Variables (`src/app/globals.css`)

```css
:root {
  /* Canvas & Base Surfaces */
  --background: #0B0E14;              /* Primary deep slate background */
  --foreground: #F3F4F6;              /* Crisp high-contrast foreground text */
  --bg-base: #0B0D14;                 /* Room cinema base background */
  --bg-surface: #121622;              /* Card & panel surface background */
  --bg-surface-glass: rgba(18, 22, 34, 0.92); /* Glassmorphic backdrop */
  --border-glass: rgba(255, 255, 255, 0.12);   /* Glass border highlight */

  /* Warm Luxury Accents */
  --bg-warm-ambient: #EA580C;          /* Warm glow radial center */
  --accent-coral: #FF6B4A;            /* Primary brand coral */
  --accent-orange: #F97316;           /* Vivid amber-orange */
  --accent-amber: #F59E0B;            /* Warm honey amber */

  /* Activity Neon Accents */
  --accent-cyan: #00F2FE;             /* HLS Stream / Active Voice Speaking glow */
  --accent-violet: #7F00FF;           /* Screen share activity accent */
  --accent-emerald: #00E676;          /* Synced status & low latency indicator */
}
```

### 3.2 Key UI Components & Visual Features
- **3D WorksWheel Reel** (`src/components/ui/works-wheel.tsx`): 3D perspective drum cylinder showcasing interactive watch party modes (4K Cinema, YouTube, Screen Share, Trivia) with drag, touch, mouse wheel, and snap physics.
- **Glass Panels & Pills**: `.glass-panel` and `.glass-pill` with `backdrop-filter: blur(16px)` and subtle borders.
- **Active Speaker Border** (`.speaking-border`): Keyframed cyan pulse ring (`speaking-pulse`) when WebRTC Voice Activity Detection exceeds threshold.
- **Floating Reactions** (`.animate-float-up`): Floating emoji bursts with cubic-bezier easing upward across the theater view.
- **Warm Dual Volume Sliders** (`.slider-warm`, `.slider-warm-partner`): Custom-styled range sliders with coral and amber glowing thumbs for independent media vs. partner voice balancing.
- **Bento Grid Shimmer** (`.bento-sync-bar`): 200% gradient shimmer demonstrating sub-150ms sync latency.

---

## 4. Complete Repository File Structure

```
couchsync/
├── .env.local                          # Supabase URL & Anon Key (optional for local multi-tab)
├── .gitignore                          # Standard Next.js/node ignore rules
├── AGENTS.md                           # Tooling guidelines
├── CLAUDE.md                           # Master Project Intelligence document
├── README.md                           # Public repository introduction & quickstart
├── eslint.config.mjs                   # ESLint flat config
├── next.config.ts                      # Security headers, CSP, redirects, compiler options
├── package.json                        # Dependencies, scripts, package metadata
├── postcss.config.mjs                  # PostCSS plugins (@tailwindcss/postcss)
├── tsconfig.json                       # TypeScript compiler options
├── brain/
│   └── PROJECT_KNOWLEDGE.md            # Deep architectural reference and system documentation
├── docs/
│   └── watch-together-architecture.md  # Original watch-party system specifications
├── promo-video/                        # Video assets and promo materials
├── public/                             # Public static assets
│   ├── couchsync-brandmark.svg         # Standalone SVG brand icon
│   ├── landing/                        # High-definition showcase crops
│   │   ├── chat-crop-hd.png            # HD chat drawer preview
│   │   ├── player-crop-hd.png          # HD cinema player preview
│   │   └── room-showcase-hd.png        # HD full watch party preview
│   └── mockups/                        # UI mockup preview assets
└── src/
    ├── app/                            # Next.js App Router
    │   ├── layout.tsx                  # Root layout: metadata, Inter font, JSON-LD, Speed Insights
    │   ├── page.tsx                    # Landing Page: Hero, 3D Wheel, Showcase, FAQ, CTA
    │   ├── globals.css                 # Master design tokens, animations, custom scrollbars
    │   ├── robots.ts                   # Dynamic robots.txt
    │   ├── sitemap.ts                  # Dynamic sitemap.xml
    │   ├── opengraph-image.tsx         # Edge-generated OpenGraph preview card
    │   ├── twitter-image.tsx           # Edge-generated Twitter summary card
    │   ├── icon.png                    # Brand favicon icon
    │   ├── apple-icon.png              # Apple touch icon
    │   ├── favicon.ico                 # Multi-resolution favicon
    │   ├── about/page.tsx              # About page (mission, privacy-first architecture)
    │   ├── features/page.tsx           # Features page (detailed capabilities breakdown)
    │   ├── how-it-works/page.tsx       # How It Works page (step-by-step workflow guide)
    │   └── room/[roomId]/page.tsx      # Core Watch Party Room experience
    ├── components/
    │   ├── brand/
    │   │   └── CouchSyncLogo.tsx       # Option 06 Play-C logo with animated gradient badge
    │   ├── chat/
    │   │   ├── ChatPanel.tsx           # Real-time text chat, timestamp jumps, reaction bar
    │   │   └── FloatingChatOverlay.tsx # In-theater message toasts during fullscreen
    │   ├── controls/
    │   │   └── DualVolumeMixer.tsx     # Independent media vs. voice volume + smart ducking
    │   ├── games/
    │   │   └── MovieTrivia.tsx         # Multiplayer movie trivia game with timer & scoring
    │   ├── landing/
    │   │   ├── CapabilityStrip.tsx     # Feature badges strip
    │   │   ├── CreateRoomModal.tsx     # Room configuration & creation modal
    │   │   ├── FaqSection.tsx          # Interactive accordion FAQ
    │   │   ├── FinalCTA.tsx            # Bottom conversion call-to-action
    │   │   ├── HeroSection.tsx         # Hero with headline, badges, and 3D WorksWheel
    │   │   ├── HowItWorks.tsx          # 3-step workflow diagram section
    │   │   ├── JoinRoomModal.tsx       # Room join modal with code input & recent rooms
    │   │   ├── MoreThanMovies.tsx      # Feature grid highlighting games, calls, sharing
    │   │   ├── Navbar.tsx              # Universal navigation with mobile drawer
    │   │   ├── ProductShowcase.tsx     # Interactive UI product preview mockup
    │   │   └── SocialShowcase.tsx      # Social proof and live interaction highlights
    │   ├── layout/
    │   │   └── SiteFooter.tsx          # Unified site footer with links and brand info
    │   ├── lobby/
    │   │   ├── DeviceCheck.tsx         # Camera/mic preview with live audio visualizer
    │   │   ├── DeviceCheckModal.tsx    # Modal wrapper for device pre-flight check
    │   │   └── RoomSetupCard.tsx       # Quick room creation card
    │   ├── player/
    │   │   ├── PlayerControls.tsx      # Scrubber, play/pause, skip, speed, theater mode
    │   │   ├── ScreenSharePlayer.tsx   # WebRTC screen share renderer
    │   │   ├── SubtitleMenu.tsx        # Multi-track selector + local VTT/SRT file parser
    │   │   ├── SyncStatusBadge.tsx     # Real-time sync latency & peer status badge
    │   │   ├── VideoPlayer.tsx         # Multi-source player hub (HLS, Local, YouTube, Trivia)
    │   │   └── YouTubePlayer.tsx       # YouTube IFrame API wrapper with synchronized playback
    │   ├── reactions/
    │   │   └── FloatingReactions.tsx   # Floating emoji burst engine (🍿 ❤️ 😂 😱 🔥 👏)
    │   ├── room/
    │   │   ├── RoomHeader.tsx          # Top bar: media switcher, room code, layout, settings
    │   │   ├── RoomPoll.tsx            # Live interactive audience voting polls
    │   │   ├── RoomSettingsModal.tsx   # Room configuration (nickname, hotkeys, ducking)
    │   │   └── VideoSettingsModal.tsx  # Video source modal (HLS URL, YouTube URL, local file)
    │   ├── ui/
    │   │   └── works-wheel.tsx         # 3D interactive portfolio drum cylinder
    │   └── video-call/
    │       └── WebRTCCall.tsx          # Multi-peer WebRTC video tiles with speaking glow
    ├── config/
    │   └── constants.ts                # Single source of truth for all thresholds & constants
    ├── hooks/
    │   ├── useAudioMeter.ts            # Web Audio API volume visualizer hook
    │   ├── useKeyboardShortcuts.ts     # Global hotkeys handler (Space, K, M, F, C, T, arrows)
    │   ├── useModalBehavior.ts         # Standardized modal behavior (Escape, outside click, lock)
    │   ├── useSyncedPlayback.ts        # Core sync engine (<1.5s tolerance, heartbeat, buffer sync)
    │   └── useWebRTC.ts                # WebRTC mesh lifecycle: SDP negotiation, STUN, VAD
    ├── lib/
    │   ├── formatters.ts               # Time string formatting (HH:MM:SS), nanoid generation
    │   ├── sample-media.ts             # Curated demo HLS streams (Mux test videos)
    │   ├── session.ts                  # Session persistence & validation
    │   ├── subtitles.ts                # SRT & WebVTT parsing utilities
    │   ├── supabase.ts                 # Supabase client with anonymous real-time channel helper
    │   ├── sync-channel.ts             # Unified room sync abstraction (Supabase or BroadcastChannel)
    │   └── utils.ts                    # Class name merge utilities (clsx + tailwind-merge)
    └── types/
        └── sync.ts                     # Single source of truth for all TypeScript interfaces
```

---

## 5. Architectural Subsystems

### 5.1 Real-Time Synchronization Protocol (`useSyncedPlayback.ts`)
- **Drift Tolerance Band (1.5s)**: Small discrepancies under 1.5 seconds (`SYNC_CONFIG.DRIFT_TOLERANCE_SECONDS`) are ignored to eliminate micro-stutters and audio crackle.
- **Hard Snap Seek**: When local time diverges from remote time by $> 1.5$s, the engine seeks to match the peer.
- **Heartbeat Reconciliation**: Host automatically emits playback state every 1.5 seconds (`HEARTBEAT_INTERVAL_MS`).
- **Cooperative Buffering**: If any peer enters the `buffering` state, playback automatically pauses across all peers until all peers report `ready`.
- **Echo Prevention Lock**: When applying a remote action, `isHandlingRemoteAction` ref lock engages for 150ms (`REMOTE_LOCKOUT_MS`) to prevent feedback loops.

### 5.2 Signaling & Offline Fallback (`sync-channel.ts`)
- **Cloud Mode**: If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided, the channel connects to Supabase Realtime Broadcast & Presence.
- **Local Mode**: If Supabase credentials are missing or disconnected, the system automatically falls back to native browser `BroadcastChannel` (`couchsync_room_${roomId}`) with `localStorage` presence heartbeats. **The app is 100% testable across multiple tabs with zero external accounts.**

### 5.3 WebRTC Video/Voice Mesh & Audio Ducking (`useWebRTC.ts`, `WebRTCCall.tsx`)
- **P2P Mesh**: Browser-to-browser peer connections via Google public STUN (`stun:stun.l.google.com:19302`).
- **Voice Activity Detection (VAD)**: Analyzes mic stream via `AnalyserNode`. When average frequency exceeds `AUDIO_CONFIG.VAD_THRESHOLD` (18), the peer is flagged as `isSpeaking`.
- **Smart Voice Ducking**: When any peer speaks, the movie audio automatically scales down to 65% (`AUDIO_CONFIG.DUCKING_MULTIPLIER = 0.65`) so conversations remain crystal clear.

### 5.4 Multi-Source Media Player Hub (`VideoPlayer.tsx`)
1. **HLS Streams (`hls.js`)**: Adaptive bitrate streaming with multi-track audio and custom VTT/SRT subtitles.
2. **Zero-Upload Local Video**: File streaming via `URL.createObjectURL(file)`. Solves Chromium's `Infinity` duration bug and syncs across peers with matching local files.
3. **YouTube Party (`YouTubePlayer.tsx`)**: Full synchronization using YouTube IFrame Player API.
4. **Screen Sharing (`ScreenSharePlayer.tsx`)**: High-frame-rate display capture streamed directly through WebRTC.
5. **Interactive Movie Trivia (`MovieTrivia.tsx`)**: Multiplayer quiz with synced question clock and leaderboard.

---

## 6. Coding Invariants & Development Guidelines

### DO:
- **Always use `'use client'`** on any component utilizing React state, effects, or browser APIs.
- **Unwrap dynamic route params** via `use(params)` for Next.js 16 App Router compliance.
- **Use `useModalBehavior`** for all modal overlays (handles `Escape`, outside click, body scroll lock, focus trapping).
- **Centralize types** in `src/types/sync.ts` — do not define ad-hoc interfaces in components.
- **Centralize numeric thresholds** in `src/config/constants.ts`.
- **Use `lucide-react`** exclusively for iconography.
- **Use `generateId()`** from `src/lib/formatters.ts` for unique IDs.
- **Verify SSR safety**: wrap `window`, `localStorage`, and `sessionStorage` in `typeof window !== 'undefined'`.
- **Merge Tailwind classes** using `cn()` from `src/lib/utils.ts`.

### DON'T:
- **Do NOT add external state managers** (no Redux, Zustand, Recoil). React state, refs, and custom hooks are sufficient.
- **Do NOT install new CSS frameworks** (no Tailwind v3 config, no Bootstrap, no Chakra, no Material UI).
- **Do NOT create server API routes for ephemeral sync data** — CouchSync Live is intentionally $0 server cost.
- **Do NOT bypass or shorten the `isHandlingRemoteAction` ref lock** in `useSyncedPlayback.ts`.
- **Do NOT hard-code color hex codes** in arbitrary components — use Tailwind utilities and CSS variables from `globals.css`.

---

## 7. Development Commands & Workflow

```bash
# Install dependencies
npm install

# Start development server with Webpack bundling
npm run dev

# Build for production
npm run build

# Run ESLint validation
npm run lint

# Start production server
npm run start
```

### Local Multi-Tab Testing Playbook
1. Start the dev server: `npm run dev`.
2. Open `http://localhost:3000` in Browser Tab 1.
3. Click **"Start a Room"** to generate a new room.
4. Copy the room URL (or room code) and open it in Browser Tab 2 (or an incognito window).
5. Both tabs synchronize instantly via `BroadcastChannel` with full play/pause/seek synchronization, live chat, and emoji bursts.

---

## 8. Keyboard Shortcuts Reference

| Shortcut | Action | Scope |
|---|---|---|
| <kbd>Space</kbd> / <kbd>K</kbd> | Toggle Play / Pause | Room playback |
| <kbd>F</kbd> | Toggle Fullscreen / Theater Mode | Room playback |
| <kbd>M</kbd> | Mute / Unmute Media Audio | Room playback |
| <kbd>C</kbd> | Toggle Live Chat Panel | Room |
| <kbd>T</kbd> | Push-to-Talk (hold to transmit mic audio) | Voice call |
| <kbd>←</kbd> / <kbd>→</kbd> | Seek backward / forward 10 seconds | Room playback |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Adjust media volume ±10% | Room playback |
| <kbd>1</kbd> - <kbd>5</kbd> | Set playback speed (0.75x to 2x) | Room playback |
| <kbd>Esc</kbd> | Close open modals or menus | Global |

---

@AGENTS.md
