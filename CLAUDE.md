# CouchSync — Project Intelligence for AI Assistants

> **CouchSync** is a real-time synchronized movie watch-party platform with peer-to-peer video/voice calling, live chat, emoji reactions, movie trivia, screen sharing, and cinema-quality theming — all running in the browser.

---

## 1. Project Identity & Goals

| Field | Value |
|---|---|
| **Name** | CouchSync |
| **Tagline** | "Watch Movies Together in Real-Time Sync" |
| **Branding** | Kosmi Lounge — premium cinema aesthetic |
| **Current Stage** | Active development, v0.1.0 |
| **Target Users** | Friends who want to watch movies/videos simultaneously from different locations |
| **Core Promise** | Ultra-low latency (<150 ms) playback sync, crystal-clear P2P video calls, zero server cost |

---

## 2. Tech Stack (Exact Versions)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.3.4 |
| React | React 19 | 19.2.8 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 + vanilla CSS custom properties | ^4 |
| Video Player | HLS.js (adaptive bitrate streaming) | ^1.7.2 |
| Icons | Lucide React | ^1.43.0 |
| Real-time | Supabase Realtime (Broadcast + Presence channels) | ^2.116.0 |
| Video Calls | Native WebRTC (RTCPeerConnection, getUserMedia) | Browser API |
| Audio | Web Audio API (AudioContext, AnalyserNode for VAD) | Browser API |
| NAT Traversal | Google public STUN servers | Free |
| Package Manager | npm | — |
| Build Tool | Next.js built-in (Turbopack dev) | — |

### Critical: Next.js 16 Breaking Changes
- This is **Next.js 16**, NOT the Next.js you may have trained on. APIs, conventions, and file structure may differ.
- Always read the relevant guide in `node_modules/next/dist/docs/` before writing code.
- The `params` prop in dynamic routes is now a **Promise** — use `use(params)` to unwrap.
- Heed all deprecation notices.

---

## 3. Project Structure (Complete File Map)

```
couchsync/
├── .env.local                          # Supabase credentials (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
├── AGENTS.md                           # Next.js auto-generated agent rules
├── CLAUDE.md                           # THIS FILE — project intelligence
├── README.md                           # Public README with features & setup
├── docs/
│   └── watch-together-architecture.md  # Full system design & architecture doc
├── next.config.ts                      # Next.js configuration
├── package.json                        # Dependencies & scripts
├── postcss.config.mjs                  # PostCSS + Tailwind plugin
├── tsconfig.json                       # TypeScript configuration
├── public/                             # Static assets (SVGs)
└── src/
    ├── app/
    │   ├── globals.css                 # Global CSS: design system, themes, animations, scrollbars
    │   ├── layout.tsx                  # Root layout (metadata, dark theme, font stack)
    │   ├── page.tsx                    # HOMEPAGE — lobby with Create/Join room cards
    │   └── room/
    │       └── [roomId]/
    │           └── page.tsx            # ROOM PAGE — main watch party experience
    ├── components/
    │   ├── chat/
    │   │   └── ChatPanel.tsx           # Live text chat with timestamped messages & emoji reactions
    │   ├── controls/
    │   │   └── DualVolumeMixer.tsx     # Movie volume + partner voice volume + audio ducking controls
    │   ├── games/
    │   │   └── MovieTrivia.tsx         # Interactive multiplayer movie trivia mini-game
    │   ├── lobby/
    │   │   ├── DeviceCheck.tsx         # Camera/mic hardware test component
    │   │   ├── DeviceCheckModal.tsx    # Modal wrapper for device pre-check
    │   │   └── RoomSetupCard.tsx       # Room creation setup card
    │   ├── player/
    │   │   ├── PlayerControls.tsx      # Play/pause, seek bar, speed, fullscreen controls
    │   │   ├── ScreenSharePlayer.tsx   # Screen share video renderer
    │   │   ├── SubtitleMenu.tsx        # Multi-track subtitle selector + custom VTT/SRT upload
    │   │   ├── SyncStatusBadge.tsx     # Real-time sync latency & partner status badge
    │   │   ├── VideoPlayer.tsx         # Main video player hub (HLS, YouTube, ScreenShare, Trivia)
    │   │   └── YouTubePlayer.tsx       # YouTube iframe API wrapper with sync
    │   ├── reactions/
    │   │   └── FloatingReactions.tsx   # Animated emoji burst overlay
    │   ├── room/
    │   │   ├── RoomHeader.tsx          # Room toolbar: source selector, theme, layout, settings
    │   │   ├── RoomPoll.tsx            # In-stream interactive polls with real-time voting
    │   │   ├── ThemeSelector.tsx       # Cinema theme picker (Obsidian, Cyberpunk, Retro, OLED)
    │   │   └── VideoSettingsModal.tsx  # Video source picker + local file upload modal
    │   └── video-call/
    │       └── WebRTCCall.tsx          # WebRTC video call UI with local/remote streams
    ├── config/
    │   └── constants.ts               # Central config: SYNC_CONFIG, AUDIO_CONFIG, WEBRTC_CONFIG, STORAGE_KEYS
    ├── hooks/
    │   ├── useAudioMeter.ts           # Audio input visualizer (AnalyserNode bars)
    │   ├── useKeyboardShortcuts.ts    # Global keyboard hotkey handler
    │   ├── useSyncedPlayback.ts       # Core sync engine: play/pause/seek/speed/buffering/heartbeat
    │   └── useWebRTC.ts              # WebRTC peer connection lifecycle, screen sharing, VAD
    ├── lib/
    │   ├── formatters.ts              # Time formatting, ID generation utilities
    │   ├── sample-media.ts            # Sample HLS video catalog (Mux test streams)
    │   ├── session.ts                 # User session persistence (sessionStorage + localStorage)
    │   ├── subtitles.ts               # SRT/VTT subtitle parser
    │   ├── supabase.ts                # Supabase client initialization with fallback detection
    │   └── sync-channel.ts            # Room channel abstraction (Supabase Realtime OR BroadcastChannel fallback)
    └── types/
        └── sync.ts                    # ALL TypeScript type definitions for the entire app
```

---

## 4. Architecture Overview

### 4.1 Three Core Systems

```
┌──────────────────────────────────────────────────────────────────┐
│                    WebRTC P2P Video/Voice Stream                  │
│              (Direct browser-to-browser, zero server cost)       │
│                                                                  │
│    ┌──────────┐                              ┌──────────┐       │
│    │ Person A │◄════════════════════════════►│ Person B │       │
│    │ Browser  │                              │ Browser  │       │
│    └────┬─────┘                              └────┬─────┘       │
│         │         ┌──────────────────┐            │              │
│         └────────►│ Supabase Realtime│◄───────────┘              │
│                   │ (Sync + Signal)  │                           │
│                   └──────────────────┘                           │
└──────────────────────────────────────────────────────────────────┘
```

1. **Media Pipeline**: HLS adaptive bitrate streaming via CDN (hls.js) + YouTube iframe API + native screen sharing
2. **Sync Layer**: Supabase Realtime Broadcast channels (ephemeral events, no DB writes) with BroadcastChannel API local fallback
3. **Communication Layer**: WebRTC P2P video/voice + real-time chat + emoji reactions + polls + trivia

### 4.2 Sync Engine — How It Works

The sync engine lives in `useSyncedPlayback.ts`. Key mechanics:

- **Drift Tolerance**: If timestamps differ by <1.5s, do nothing (prevents micro-stutters)
- **Hard Resync**: If drift >1.5s, seek to remote timestamp
- **Cooperative Buffering**: When partner buffers, pause locally; wait for their `ready` event
- **Heartbeat**: Host broadcasts playback state every 1.5s for continuous reconciliation
- **Echo Prevention**: `isHandlingRemoteAction` ref lock prevents feedback loops (150ms lockout)
- **Event Types**: `play`, `pause`, `seek`, `speed`, `buffering`, `ready`, `heartbeat`

### 4.3 Channel Abstraction (`sync-channel.ts`)

The `subscribeToRoom()` function auto-detects whether Supabase is configured:
- **Supabase available**: Uses Supabase Realtime channel with Presence tracking + Broadcast events
- **Supabase unavailable**: Falls back to local `BroadcastChannel` API + `localStorage` presence with 3s heartbeat

This means the app works **100% locally** without any backend for development and testing.

### 4.4 WebRTC Call Flow

Managed by `useWebRTC.ts`:
1. Local media acquired via `getUserMedia` with echo cancellation + noise suppression
2. When partner detected via Presence, initiator creates SDP offer
3. Signaling exchanged over same Supabase Realtime channel (no separate signaling server)
4. ICE candidates gathered via Google STUN servers
5. Voice Activity Detection (VAD) via `AnalyserNode` with 120ms polling interval
6. Smart audio ducking: movie volume × 0.65 when partner is speaking

---

## 5. Key Patterns & Conventions

### 5.1 Component Architecture
- All interactive components use `'use client'` directive
- Root layout (`layout.tsx`) is a server component with metadata
- Components are organized by **feature domain**: `chat/`, `controls/`, `games/`, `lobby/`, `player/`, `reactions/`, `room/`, `video-call/`
- Props interfaces are defined inline in the same file as the component

### 5.2 State Management
- **No external state library** — all state is React `useState` + `useRef` + `useCallback`
- Session data persisted to `sessionStorage` (ephemeral per tab) and `localStorage` (persistent across sessions)
- Room state lives in the Room page component and flows down via props
- Real-time state comes from Supabase channel subscriptions

### 5.3 Styling Approach
- **Tailwind CSS v4** with `@import "tailwindcss"` (NOT v3 config-based)
- CSS custom properties in `globals.css` for theming (`--bg-base`, `--bg-surface`, `--accent-cyan`, etc.)
- Glassmorphism design system: `.glass-panel` and `.glass-pill` utility classes
- Theme classes: `.theme-obsidian`, `.theme-cyberpunk`, `.theme-retro`, `.theme-oled`
- Premium dark mode aesthetic with HSL color values, gradients, and `blur()` backdrop filters
- Animations: `speaking-pulse`, `floatUp` for reactions, smooth transitions everywhere

### 5.4 TypeScript Patterns
- All types centralized in `src/types/sync.ts`
- Discriminated unions for message types (`SyncMessage = PlaybackAction | WebRTCSignalAction | ...`)
- Type guards via `msg.type` string literal matching
- Strict TypeScript with proper null handling

### 5.5 Configuration
- All magic numbers centralized in `src/config/constants.ts`
- Sync tolerance: 1.5s drift, 1.5s heartbeat interval, 150ms echo lockout
- Audio: 0.65x ducking multiplier, 18 VAD threshold, 18 meter bars
- WebRTC: 640×480@24fps video, echo/noise/gain audio constraints
- Storage keys namespaced with `couchsync_` prefix

---

## 6. Data Flow & Message Protocol

### 6.1 SyncMessage Union Type (all real-time messages)

```typescript
type SyncMessage =
  | PlaybackAction     // play, pause, seek, speed, buffering, ready, heartbeat
  | WebRTCSignalAction // signal-offer, signal-answer, signal-ice, media-toggle
  | ScreenShareAction  // screenshare-start, screenshare-stop
  | MediaSourceChangeAction  // media-source-change (hls/youtube/screenshare/trivia)
  | TriviaAction       // trivia-start, trivia-score, trivia-next, trivia-end
  | SocialAction       // chat-message, emoji-reaction
  | RoomControlAction  // control-mode-change (shared/host-only)
  | PollAction         // poll-create, poll-vote, poll-close
```

### 6.2 Session Persistence

| Storage | Key Pattern | Purpose |
|---|---|---|
| `sessionStorage` | `couchsync_user_name`, `couchsync_room_name`, `couchsync_video_url`, etc. | Current tab session (user name, selected video, mic/cam state, host flag) |
| `localStorage` | `couchsync_recent_rooms` | Recent room history (persists across sessions) |
| `localStorage` | `couchsync_resume_<roomId>` | Resume playback timestamp per room |
| `localStorage` | `couchsync-presence-<roomId>` | Local presence heartbeat (BroadcastChannel fallback only) |

---

## 7. Homepage (`page.tsx`) — Current Structure & UX Guide

The homepage serves as the **lobby** where users:

### Current Sections (top to bottom):
1. **Navbar**: CouchSync logo + "Kosmi Lounge" badge + cam/mic test button + editable nickname
2. **Hero Section**: Tagline "Your Virtual Cinema & Hangout Lounge" + feature pill (HLS, YouTube, Screen Share, P2P Video)
3. **Dual Hub Cards**:
   - **Create a Cinema Room**: Room name input (randomizable), starting activity selector (Cinema Movie / YouTube Party / Screen Share / Movie Trivia), Launch button
   - **Join with Link or Code**: Room code/URL input, recent rooms list with re-join, Connect button
4. **Feature Highlights Grid**: 4 cards (Sub-Second Sync, P2P Video & Voice, Screen Sharing, Movie Trivia & Polls)
5. **Footer**: Security badges, free cost, echo cancellation

### Improvement Opportunities for Homepage:
- **Add "How to Use" Guide Section**: Step-by-step visual guide showing users how to create/join rooms, use video chat, share screens, etc.
- **Add Feature Showcase**: Animated demos or screenshots of key features (sync, video calls, reactions, trivia)
- **Add Social Proof**: User testimonials, usage statistics, or community size
- **Add FAQ Section**: Common questions about privacy, security, browser support, etc.
- **Improve Onboarding Flow**: First-time user tutorial or guided walkthrough
- **Add Keyboard Shortcuts Quick-Reference**: Show hotkeys on homepage
- **Better Mobile UX**: Ensure all cards and inputs work smoothly on small screens
- **Add "Quick Start" CTA**: One-click room creation for returning users

---

## 8. Security Hardening Guide

### 8.1 Current Security Features
- ✅ WebRTC P2P encryption (DTLS-SRTP) — all video/voice is end-to-end encrypted
- ✅ Echo cancellation, noise suppression, auto gain control
- ✅ No raw video uploads between users
- ✅ Supabase uses JWT-based anonymous authentication
- ✅ Room codes are randomly generated (not sequential)

### 8.2 Security Improvements to Implement

#### Input Validation & Sanitization
- **Room names**: Sanitize user input — strip HTML tags, limit length (max 50 chars), alphanumeric + spaces only
- **Chat messages**: Escape all HTML entities before rendering. Use `textContent` or React's built-in JSX escaping (already safe, but validate on input side too)
- **Nicknames**: Validate length (3-25 chars), strip special characters, prevent impersonation
- **Room codes**: Validate format (alphanumeric only, max 20 chars) before routing
- **YouTube URLs**: Validate against YouTube URL regex patterns, extract video IDs safely
- **File uploads (subtitles)**: Validate file type (only .srt, .vtt), max file size (2MB), parse content safely

#### Environment & Secrets
- ✅ Supabase keys are already `NEXT_PUBLIC_` (anon keys, designed for client-side use)
- ⚠️ **Never** expose service_role keys in client code
- ⚠️ Add `.env.local` to `.gitignore` (already done via standard Next.js gitignore)
- 🔒 Consider Supabase Row Level Security (RLS) policies if adding database tables

#### WebRTC Security
- ✅ DTLS-SRTP encryption is enforced by browsers automatically
- 🔒 Add TURN server fallback for users behind strict NATs (currently STUN-only)
- 🔒 Consider ICE candidate filtering to prevent IP leaks in privacy-sensitive contexts
- 🔒 Implement connection timeout handling (reject stale offers)

#### Content Security
- 🔒 Add Content Security Policy (CSP) headers in `next.config.ts`
- 🔒 Add X-Frame-Options, X-Content-Type-Options, Referrer-Policy headers
- 🔒 Validate HLS manifest URLs against an allowlist of trusted CDN domains
- 🔒 Rate-limit chat messages (max 5/second per user) to prevent spam flooding
- 🔒 Rate-limit emoji reactions (max 3/second per user)
- 🔒 Add profanity/spam filter for chat messages (optional, configurable)

#### Authentication & Authorization
- 🔒 Consider adding Supabase Auth for persistent user accounts (optional, currently anonymous)
- 🔒 Implement room passwords/PINs for private rooms
- 🔒 Add room capacity limits (configurable, e.g., max 10 participants)
- 🔒 Implement host-only room deletion/kick functionality
- 🔒 Add invite-only rooms with shareable invite tokens

#### Client-Side Protection
- 🔒 Implement graceful device permission denial handling (currently logs warning)
- 🔒 Add connection state recovery with automatic reconnection
- 🔒 Sanitize URL parameters (`initialMode`) against valid enum values (partially done)
- 🔒 Add XSS protection for any user-generated content displayed in UI
- 🔒 Implement session timeout for idle rooms (auto-cleanup after 24h of no activity)

---

## 9. Room Page (`room/[roomId]/page.tsx`) — Architecture

The Room page is the **heart of the application**. It orchestrates:

### State Management Hierarchy:
```
RoomPage (orchestrator)
├── currentUser (RoomParticipant)
├── participants[] (from Presence channel)
├── chatMessages[] (from Broadcast channel)
├── floatingReactions[] (ephemeral, auto-cleanup after 2.8s)
├── activePoll (RoomPoll | null)
├── mediaSource (hls | youtube | screenshare | trivia)
├── controlMode (shared | host-only)
├── currentTheme (obsidian | cyberpunk | retro | oled)
├── roomLayout (cinema | lounge | focus)
│
├── useSyncedPlayback() → videoRef, isPlaying, currentTime, duration, etc.
├── useWebRTC() → localStream, remoteStream, connectionState, etc.
├── useKeyboardShortcuts() → global hotkey bindings
│
└── subscribeToRoom() → channelRef for broadcasting messages
```

### Component Layout:
```
┌─────────────────────────────────────────────────────────────────┐
│ RoomHeader (source selector, theme, layout, settings)           │
├───────────────────────────────────────┬─────────────────────────┤
│ VideoPlayer (HLS/YouTube/Screen/Trivia) │ WebRTCCall (video feeds) │
│ 8/12 cols (cinema) or 12/12 (focus)    │ 4/12 cols               │
│                                        │ RoomPollComponent        │
│ DualVolumeMixer (below video)          │ ChatPanel (live chat)    │
├───────────────────────────────────────┴─────────────────────────┤
│ VideoSettingsModal (video source picker, local file upload)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Development Guide

### Running the Project
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
**Note**: The app works without Supabase credentials — it automatically falls back to `BroadcastChannel` API for local multi-tab testing.

### Testing Multi-User Sync Locally
1. Run `npm run dev`
2. Open two browser tabs at `http://localhost:3000`
3. Create a room in tab 1 → copy the room URL
4. Open the same room URL in tab 2
5. Both tabs sync via `BroadcastChannel` API (no Supabase needed)

### Keyboard Hotkeys
| Key | Action |
|---|---|
| `Space` / `K` | Play / Pause |
| `F` | Toggle Fullscreen |
| `M` | Mute / Unmute media |
| `C` | Toggle Chat |
| `←` / `→` | Seek ±5 seconds |
| `↑` / `↓` | Volume ±10% |

---

## 11. Coding Guidelines for AI Assistants

### DO:
- Use `'use client'` directive on all interactive components
- Follow existing component naming conventions (PascalCase files, PascalCase exports)
- Use Tailwind v4 utility classes for styling (NOT v3 config syntax)
- Use CSS custom properties from `globals.css` for theme-aware styling
- Use `glass-panel` and `glass-pill` classes for glassmorphism UI elements
- Keep all types in `src/types/sync.ts`
- Keep all configuration constants in `src/config/constants.ts`
- Use `lucide-react` for all icons (not heroicons, not fontawesome)
- Use `generateId()` from `src/lib/formatters.ts` for unique IDs
- Match the existing dark-mode, cyberpunk-cinema aesthetic
- Use HSL color values via Tailwind (cyan, violet, amber, emerald, rose palette)
- Always handle the `typeof window === 'undefined'` check for SSR safety
- Use `useCallback` for handler functions passed as props
- Use `useRef` for mutable values that shouldn't trigger re-renders
- Sanitize all user inputs before processing

### DON'T:
- Don't install new CSS frameworks (no Bootstrap, no Material UI, no Chakra)
- Don't add external state management (no Redux, no Zustand, no Jotai)
- Don't use `pages/` directory (App Router only)
- Don't use `getServerSideProps` or `getStaticProps` (App Router patterns only)
- Don't hard-code colors — use Tailwind classes or CSS custom properties
- Don't break the existing sync engine without understanding the echo prevention system
- Don't add server-side API routes for features that should remain P2P/ephemeral
- Don't expose sensitive keys or tokens in client-side code
- Don't trust user input without validation
- Don't use `dangerouslySetInnerHTML` unless absolutely necessary and properly sanitized
- Don't modify `AGENTS.md` — it's auto-generated by Next.js

### When Modifying Sync/WebRTC Code:
1. **Understand the echo prevention lock** (`isHandlingRemoteAction` ref) before changing play/pause logic
2. **Test with two tabs** to verify sync behavior after changes
3. **Preserve heartbeat mechanism** — it's critical for long-running sync accuracy
4. **Don't remove the remote lockout timeout** (150ms) — it prevents feedback loops
5. **Be careful with `useEffect` dependencies** — incorrect deps can cause infinite re-subscription loops

---

## 12. Supabase Configuration

### Current Setup
- **Project**: Supabase cloud instance
- **Channels**: Ephemeral Realtime Broadcast + Presence per room (`room:<roomId>`)
- **Database**: Not actively used (no tables created yet)
- **Auth**: Anonymous (no sign-up flow yet)

### Channel Configuration
```typescript
supabase.channel(`room:${roomId}`, {
  config: {
    broadcast: { self: false },           // Don't echo own messages back
    presence: { key: currentUser.id },     // Track by user ID
  },
});
```

### Potential Database Schema (for future features)
```sql
-- If persistent user accounts are added:
users (id UUID, display_name TEXT, avatar_url TEXT, created_at TIMESTAMP)

-- If room history needs to persist:
rooms (id TEXT PRIMARY KEY, name TEXT, host_id UUID, created_at TIMESTAMP, is_private BOOLEAN)
room_members (room_id TEXT, user_id UUID, joined_at TIMESTAMP)

-- If chat history should persist:
messages (id UUID, room_id TEXT, sender_id UUID, content TEXT, created_at TIMESTAMP)
```

---

## 13. Important File Details

### `src/types/sync.ts` — The Type Bible
This file defines EVERY type used across the app. Key types:
- `MediaSourceType`: `'hls' | 'youtube' | 'screenshare' | 'trivia'`
- `ThemeMode`: `'obsidian' | 'cyberpunk' | 'retro' | 'oled'`
- `ControlMode`: `'shared' | 'host-only'`
- `RoomLayoutMode`: `'cinema' | 'lounge' | 'focus'`
- `SyncMessage`: The discriminated union of ALL broadcast message types
- `RoomParticipant`: User identity in a room (id, name, isHost, isMicOn, isCamOn)
- `ChatMessage`: Chat message structure with optional `jumpTime` for timestamp linking
- `FloatingEmoji`: Ephemeral emoji reaction with position data
- `VideoMedia`: Video source with title, URL, poster, optional local file flag

### `src/config/constants.ts` — The Numbers Bible
All tunable parameters in one place:
- `SYNC_CONFIG.DRIFT_TOLERANCE_SECONDS = 1.5`
- `SYNC_CONFIG.HEARTBEAT_INTERVAL_MS = 1500`
- `SYNC_CONFIG.REMOTE_LOCKOUT_MS = 150`
- `AUDIO_CONFIG.DUCKING_MULTIPLIER = 0.65`
- `AUDIO_CONFIG.VAD_THRESHOLD = 18`
- `WEBRTC_CONFIG.ICE_SERVERS` (3 Google STUN servers)
- `WEBRTC_CONFIG.MEDIA_CONSTRAINTS` (640×480@24fps, echo cancellation enabled)

### `src/app/globals.css` — The Design System
- 4 cinema themes via CSS custom properties
- `glass-panel`: Glassmorphism container (blur + transparency + border)
- `glass-pill`: Smaller glassmorphism element for pills/badges
- `speaking-pulse`: Animated glow for speaking indicator
- `animate-float-up`: Floating emoji reaction animation (2.8s cubic-bezier)
- Custom scrollbar styling (thin, dark, rounded)
- Custom range input styling (glowing cyan thumb)

---

## 14. Feature-Specific Context

### Video Player Hub (`VideoPlayer.tsx`)
The main player is a **multi-source hub** that conditionally renders:
- HLS video via `hls.js` + native `<video>` element
- YouTube videos via iframe API wrapper (`YouTubePlayer.tsx`)
- Screen share streams via `ScreenSharePlayer.tsx`
- Movie trivia game via `MovieTrivia.tsx`

### WebRTC Call (`useWebRTC.ts`)
- Creates `RTCPeerConnection` with Google STUN servers
- Handles `signal-offer` → `signal-answer` → `signal-ice` negotiation
- Includes screen sharing via `getDisplayMedia`
- VAD (Voice Activity Detection) runs every 120ms via `AnalyserNode`
- Clean up: All tracks stopped, AudioContext closed, intervals cleared on unmount

### Chat System (`ChatPanel.tsx`)
- Messages stored in local React state (not persisted to database)
- Each message has optional `jumpTime` — clickable timestamps that seek the video
- Emoji reaction bar with 6 reactions: 🍿 ❤️ 😂 😱 🔥 👏
- Messages broadcast via sync channel, received by all room members

### Cinema Themes (`ThemeSelector.tsx`)
Themes apply CSS custom properties via class on root `<div>`:
1. **Obsidian** (default): Deep blue-black
2. **Cyberpunk Neon**: Purple-black with neon accents
3. **Retro**: Warm brown cinema tones
4. **OLED**: Pure black for OLED displays

### Polls (`RoomPoll.tsx`)
- Host creates a poll with question + options
- All members vote in real-time
- Results update live via sync channel broadcast
- Host can close the poll

### Movie Trivia (`MovieTrivia.tsx`)
- Multiple-choice movie questions with countdown timers
- Score tracking per user
- Start/next/end actions broadcast to all room members

---

## 15. Common Task Recipes

### Adding a New Media Source Type
1. Add the new type to `MediaSourceType` in `src/types/sync.ts`
2. Create the player component in `src/components/player/`
3. Add conditional rendering in `VideoPlayer.tsx`
4. Add mode button to `RoomHeader.tsx` source selector
5. Add activity card to homepage `page.tsx` mode grid

### Adding a New Theme
1. Add the theme name to `ThemeMode` in `src/types/sync.ts`
2. Add CSS custom properties in `globals.css` (`.theme-<name>`)
3. Add option to `ThemeSelector.tsx`

### Adding a New Sync Message Type
1. Define the new action type in `src/types/sync.ts`
2. Add it to the `SyncMessage` union type
3. Handle it in the Room page's `onMessage` callback
4. Broadcast it via `channelRef.current?.sendMessage()`

### Adding a New Room Feature
1. Add state in Room page (`room/[roomId]/page.tsx`)
2. Create component in appropriate `src/components/` subdirectory
3. Wire up broadcast/receive in the Room page's channel subscription
4. Pass state and handlers down via props

---

## 16. Performance Considerations

- **Heartbeat interval** (1.5s) — don't reduce below 1s, it creates excess traffic
- **VAD polling** (120ms) — don't reduce below 80ms, it impacts CPU
- **Floating reactions** auto-remove after 2.8s — prevent memory leaks
- **Video time updates** come from native `timeupdate` events (~4Hz) — don't add extra intervals
- **Remote lockout** (150ms) — critical for preventing sync feedback loops
- **BroadcastChannel fallback** uses localStorage with 3s heartbeat — adequate for local testing only

---

## 17. Browser Compatibility

- Chrome 90+ (full WebRTC, HLS.js, BroadcastChannel)
- Firefox 85+ (full WebRTC, HLS.js, BroadcastChannel)
- Safari 15+ (WebRTC supported, HLS native + hls.js fallback)
- Edge 90+ (Chromium-based, same as Chrome)
- **No IE11 support** — WebRTC and modern CSS features required

---

@AGENTS.md
