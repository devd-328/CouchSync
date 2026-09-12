# CouchSync 🍿🎬

> Stream videos synchronously with friends anywhere in the world while enjoying low-latency WebRTC video & voice calls, real-time chat, floating reactions, interactive trivia, and customizable cinema visual themes.

---

## ✨ Features

- ⏱️ **Ultra-Low Latency Playback Sync**: Real-time host-to-peer sync engine keeping playback in sync within <150ms drift tolerance.
- 📹 **Built-in WebRTC Video & Voice Calls**: Direct peer-to-peer audio/video calling with mesh networking, camera/mic toggling, speaking indicators, and screen sharing.
- 💬 **Live Chat & Playlist Queue**: Tabbed room sidebar for real-time text messaging, room member presence list, and room media playlist queue.
- 🎉 **Floating Animated Emoji Reactions**: Interactive reaction physics engine bursting emojis (🍿, ❤️, 😂, 😱, 🔥, 👏) directly over the video player.
- 🎛️ **Dual Audio Mixer**: Independent volume control sliders for media sound vs peer voice chat, featuring smart audio ducking and master volume boost.
- 🎨 **Dynamic Cinema Themes**: 5 customizable visual themes (Dark Cinema, Cyberpunk Neon, Midnight OLED, Warm Cozy, Sunset Glow).
- 📝 **Advanced Subtitles & Custom VTT/SRT Support**: Multi-track subtitle selector with custom SRT/VTT file upload, customizable font size, text color, and background styling.
- 🎮 **Interactive Movie Trivia & Polls**: Host-driven room trivia mini-games with countdown timers, scores, and real-time polls for room voting.
- 🎧 **Device Pre-check Modal**: Comprehensive camera, microphone, and speaker hardware testing modal with audio input visualizer meter before entering a watch room.
- ⌨️ **Keyboard Shortcuts & Hotkeys**: Full media keyboard control scheme (Space: Play/Pause, M: Mute, F: Fullscreen, C: Chat toggle, Arrows: Seek/Volume).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Vanilla CSS Modules & Utility Classes with CSS Custom Properties, HSL Tailwind utilities, and Glassmorphism design system
- **Video Player**: Native HTML5 & HLS.js custom media controller with YouTube iframe API wrapper and Screen Share viewer
- **Sync & Realtime Engine**: Web BroadcastChannel API + Supabase Realtime Ephemeral Broadcast Channels
- **Peer-to-Peer Calls**: WebRTC (`RTCPeerConnection`, `getUserMedia`, Google STUN NAT traversal)
- **Audio Processing**: Web Audio API AudioContext, AnalyserNode for voice activity meters

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn / pnpm / bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/devd-328/CouchSync.git
   cd CouchSync
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional for Supabase Cloud integration):
   Copy `.env.local` or create a new `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *Note: CouchSync includes automatic fallback to local BroadcastChannel and mock engine if Supabase credentials are not provided.*

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⌨️ Keyboard Hotkeys

| Key | Action |
| --- | --- |
| `Space` / `K` | Play / Pause video |
| `F` | Toggle Fullscreen |
| `M` | Mute / Unmute media audio |
| `C` | Toggle Chat sidebar |
| `←` / `→` | Seek backward / forward 5 seconds |
| `↑` / `↓` | Increase / Decrease volume 10% |

---

## 📄 License

MIT License - feel free to use and adapt CouchSync for your own projects!
