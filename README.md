<div align="center">

# 🍿 CouchSync Live

### **Watch Movies Together in Real-Time Sync**
*Zero-Server Cost • Crystal-Clear P2P Video/Voice • <150ms Lockstep Sync*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P_Mesh-333333?style=for-the-badge&logo=webrtc&logoColor=white)](https://webrtc.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br />

<p align="center">
  <a href="#-key-features"><b>Key Features</b></a> •
  <a href="#-architecture"><b>Architecture</b></a> •
  <a href="#-quick-start"><b>Quick Start</b></a> •
  <a href="#-media-sources"><b>Media Sources</b></a> •
  <a href="#-keyboard-shortcuts"><b>Hotkeys</b></a> •
  <a href="#-cinema-themes"><b>Themes</b></a>
</p>

</div>

---

## ✨ Overview

**CouchSync Live** is a modern, privacy-first virtual cinema lounge built for friends and communities who want to experience movies, YouTube videos, screen-shared games, and multiplayer trivia together without lag or desync.

Unlike traditional watch party tools that route high-bandwidth media through costly cloud servers or require browser extensions, CouchSync Live runs **100% in the browser** using direct device-to-device connections, high-definition streaming, and instant real-time synchronization.

---

## 🚀 Key Features

<table>
  <tr>
    <td width="50%">
      <h3>⏱️ Instant Playback Sync</h3>
      <p>Synchronizes play, pause, seek, and speed instantly in real time. Continuous background checks seamlessly keep everyone aligned without stutter or audio echo.</p>
    </td>
    <td width="50%">
      <h3>📹 Private Video & Voice Calls</h3>
      <p>Crystal-clear, 100% private direct video and voice chat with audio waveforms, speaking indicators, and custom picture-in-picture bubbles.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎚️ Smart Voice Auto-Quiet</h3>
      <p>Automatically lowers movie volume by <b>35%</b> whenever someone in your call speaks, so you can chat naturally without shouting over loud scenes.</p>
    </td>
    <td width="50%">
      <h3>📺 YouTube & Screen Sharing</h3>
      <p>Watch synchronized YouTube videos together or stream your desktop, app window, or browser tab in smooth high quality.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎮 Movie Trivia & Live Polls</h3>
      <p>Host-driven multiplayer trivia mini-games with countdown timers, live scoreboards, and real-time community polls.</p>
    </td>
    <td width="50%">
      <h3>💬 Live Chat & Floating Reactions</h3>
      <p>Interactive text chat with clickable scene timestamps and animated emoji bursts (🍿 ❤️ 😂 😱 🔥 👏) that float across the screen.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🎨 Ambient Cinema Themes</h3>
      <p>4 custom-tailored cinema themes (<b>Obsidian</b>, <b>Cyberpunk Neon</b>, <b>Retro Warm</b>, and <b>OLED Pure Black</b>) with glassmorphism UI.</p>
    </td>
    <td width="50%">
      <h3>📂 Zero-Upload Local Video Play</h3>
      <p>Drag and drop any local movie file (<code>.mp4</code>, <code>.mkv</code>, <code>.webm</code>) to play directly from your PC with $0 cloud storage.</p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                      WebRTC P2P Video/Voice Mesh                       │
│             (Direct browser-to-browser, DTLS-SRTP Encrypted)           │
│                                                                        │
│    ┌────────────┐                                ┌────────────┐        │
│    │  Person A  │◄══════════════════════════════►│  Person B  │        │
│    │  (Browser) │                                │  (Browser) │        │
│    └─────┬──────┘                                └─────┬──────┘        │
│          │             ┌──────────────────┐            │               │
│          └────────────►│ Supabase / Local │◄───────────┘               │
│                        │ Realtime Channel │                            │
│                        └──────────────────┘                            │
│                 (Presence • Broadcast • &lt;150ms Sync)                   │
└────────────────────────────────────────────────────────────────────────┘
```

- **Media Pipeline**: Adaptive bitrate HLS streaming via `hls.js`, official YouTube IFrame API integration (`window.YT.Player`), and native `getDisplayMedia` screen sharing.
- **Sync Engine**: Lightweight broadcast events with echo lockout prevention (150ms) and cooperative buffer pausing.
- **Local Fallback**: Auto-detects whether Supabase is configured; falls back to the native `BroadcastChannel` API for 100% offline or local development.

---

## 🎬 Supported Media Sources

| Source | Description | Features |
|---|---|---|
| **HLS Stream** | Adaptive bitrate `.m3u8` streams | Auto-bitrate switching, custom `.vtt` / `.srt` subtitle parser |
| **Local File** | Play directly from your hard drive | Drag & drop, 0s upload time, zero server bandwidth |
| **YouTube Party** | Synchronized YouTube videos | Live timestamp polling, scrubbing, speed control, universal fullscreen |
| **Screen Share** | HD display / window / tab share | Native system audio capture, low-latency WebRTC track pipeline |
| **Movie Trivia** | Multiplayer quiz game | Live leaderboard, timer countdowns, interactive question bank |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Space</kbd> / <kbd>K</kbd> | Toggle Play / Pause |
| <kbd>F</kbd> | Toggle Fullscreen Theater Mode |
| <kbd>M</kbd> | Mute / Unmute Media Audio |
| <kbd>C</kbd> | Toggle Live Chat Panel |
| <kbd>←</kbd> / <kbd>→</kbd> | Seek backward / forward 5 seconds |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Adjust volume ±10% |
| <kbd>T</kbd> | Push-to-Talk (hold to speak) |

---

## 🎨 Cinema Themes

- 🌌 **Obsidian** *(Default)* — Deep midnight navy with cyan neon accents
- ⚡ **Cyberpunk Neon** — High-contrast electric purple and hot pink aesthetic
- 🎞️ **Retro Cinema** — Warm amber and golden lounge tones reminiscent of 70s cinema
- 🖤 **OLED Pure Black** — True `#000000` background optimized for OLED displays and battery savings

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** (or `pnpm` / `yarn` / `bun`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/devd-328/CouchSync.git
cd CouchSync/couchsync

# Install dependencies
npm install
```

### 3. Environment Variables (Optional)
CouchSync Live works out-of-the-box locally with `BroadcastChannel`. To enable multi-device cloud rooms, add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Multi-Tab Local Testing
1. Create a room in Tab 1.
2. Copy the room invite URL (or room ID).
3. Open the URL in Tab 2 to verify synchronized playback, WebRTC video calling, and real-time chat!

---

## 🔒 Privacy & Security

- 🛡️ **End-to-End Encrypted Calls**: All video and microphone audio is encrypted in transit via DTLS-SRTP.
- 🚫 **No Server Storage**: No camera feeds, voice recordings, or private video files are ever saved on an intermediate server.
- 🔑 **No Sign-up Required**: Create or join any room in seconds with zero accounts, credit cards, or tracking cookies.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for cinephiles and distant friends everywhere.</sub>
</div>
