import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Clapperboard,
  Camera,
  Share2,
  Tv,
  Zap,
  Gamepad2,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Keyboard,
  Play,
  CheckCircle2,
  Sparkles,
  Radio,
} from 'lucide-react';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export const metadata: Metadata = {
  title: 'How It Works — CouchSync Cinema Lounge',
  description: 'Step-by-step guide to hosting synchronized watch parties with friends: room setup, device testing, media streaming, and keyboard shortcuts.',
};

const STEPS = [
  {
    step: '01',
    title: 'Create or Join a Room',
    badge: 'Step 1',
    color: 'cyan',
    icon: Clapperboard,
    subtitle: 'Instant setup with zero registration',
    description:
      'Launch a customized cinema room in one click, or join a friend’s lounge by pasting their room code or invite URL. No email, passwords, or personal accounts required.',
    highlights: ['One-click room generation', 'Custom room titles', 'Saved recent room history'],
  },
  {
    step: '02',
    title: 'Hardware & Device Pre-Check',
    badge: 'Step 2',
    color: 'emerald',
    icon: Camera,
    subtitle: 'Crystal clear video & studio-grade audio',
    description:
      'Test your camera and microphone in the pre-flight lobby before entering. Verify audio input meters, toggle push-to-talk, and benefit from built-in acoustic echo cancellation and noise suppression.',
    highlights: ['Real-time audio level meter', 'Camera & mic preview', 'Hardware toggle hotkeys'],
  },
  {
    step: '03',
    title: 'Invite Your Watch Partners',
    badge: 'Step 3',
    color: 'violet',
    icon: Share2,
    subtitle: 'Shareable links for instant connection',
    description:
      'Copy your unique room link with a single tap and share it with friends via messaging apps. Guests connect straight from their browser on desktop or mobile without downloading any apps.',
    highlights: ['Instant link clipboard copy', 'Cross-browser compatibility', 'Automatic peer presence'],
  },
  {
    step: '04',
    title: 'Pick Your Media Source',
    badge: 'Step 4',
    color: 'amber',
    icon: Tv,
    subtitle: 'Cinema streams, YouTube, or screen share',
    description:
      'Stream high-definition HLS video streams with multiple subtitle tracks, paste any YouTube video link for an instant watch party, or share your entire screen, browser tab, or app natively.',
    highlights: ['Adaptive bitrate HLS & local files', 'Full YouTube player integration', 'Native 60fps screen sharing'],
  },
  {
    step: '05',
    title: 'Sub-Second Playback Sync',
    badge: 'Step 5',
    color: 'cyan',
    icon: Zap,
    subtitle: 'Lockstep play, pause, seek & speed',
    description:
      'Every pause, play, seek, and playback rate adjustment propagates to your partner in under 150 milliseconds. Smart drift tolerance prevents micro-stutters, while cooperative buffering pauses both viewers if either connection slows down.',
    highlights: ['< 150ms sync latency', 'Automatic drift reconciliation', 'Smart cooperative buffering'],
  },
  {
    step: '06',
    title: 'Hangout, Chat & Mini-Games',
    badge: 'Step 6',
    color: 'rose',
    icon: Gamepad2,
    subtitle: 'Interactive live lounge experience',
    description:
      'Chat in real-time with timestamped video jumping, send floating emoji reactions that burst over the cinema screen, launch interactive audience polls, or play movie trivia during movie intermissions.',
    highlights: ['Smart audio ducking when speaking', 'Timestamp-linked chat messages', 'Multiplayer movie trivia'],
  },
];

const KEYBOARD_SHORTCUTS = [
  { keys: ['Space', 'K'], action: 'Play / Pause Video', note: 'Syncs instantly to all participants' },
  { keys: ['F'], action: 'Toggle Fullscreen', note: 'Immersive cinema viewing mode' },
  { keys: ['M'], action: 'Mute / Unmute Media', note: 'Silences video sound without affecting voice chat' },
  { keys: ['C'], action: 'Toggle Chat Panel', note: 'Show or collapse live conversation sidebar' },
  { keys: ['←', '→'], action: 'Seek ±5 Seconds', note: 'Quick replay or skip forward in lockstep' },
  { keys: ['↑', '↓'], action: 'Volume ±10%', note: 'Fine-tune movie audio level' },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen bg-linear-to-b from-[#07090E] via-[#0B0F1A] to-[#07090E] text-gray-100 overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Dynamic ambient glow orbs */}
      <div className="absolute top-0 left-1/4 w-150 h-150 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/5 w-150 h-150 bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/6 w-120 h-120 bg-emerald-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* ── Top Header / Nav ─────────────────────────────────────────── */}
      <SiteHeader currentPage="how-it-works" badgeText="Guide" />

      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/4 border border-white/10 text-xs text-cyan-300 backdrop-blur-md shadow-inner mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Complete Architecture &amp; User Manual</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How CouchSync Works
          </h1>
          <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
            Synchronized movie nights made effortless. From creating your first lounge to peer-to-peer audio ducking and hotkeys, here is the full walkthrough.
          </p>
        </div>

        {/* ── 6-Step Journey ────────────────────────────────────────────── */}
        <section aria-label="Step-by-step guide" className="space-y-6 mb-16">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              The 6-Step Watch Party Flow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {STEPS.map((item) => {
              const Icon = item.icon;
              const accentBorder =
                item.color === 'cyan'
                  ? 'border-cyan-400/30 text-cyan-400 bg-cyan-500/10'
                  : item.color === 'emerald'
                  ? 'border-emerald-400/30 text-emerald-400 bg-emerald-500/10'
                  : item.color === 'violet'
                  ? 'border-violet-400/30 text-violet-400 bg-violet-500/10'
                  : item.color === 'amber'
                  ? 'border-amber-400/30 text-amber-400 bg-amber-500/10'
                  : 'border-rose-400/30 text-rose-400 bg-rose-500/10';

              const badgeColor =
                item.color === 'cyan'
                  ? 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300'
                  : item.color === 'emerald'
                  ? 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300'
                  : item.color === 'violet'
                  ? 'bg-violet-500/15 border-violet-400/30 text-violet-300'
                  : item.color === 'amber'
                  ? 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                  : 'bg-rose-500/15 border-rose-400/30 text-rose-300';

              return (
                <article
                  key={item.step}
                  className="glass-panel card-hover rounded-3xl p-6 sm:p-7 border-white/10 flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl border ${accentBorder}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                          {item.badge}
                        </span>
                        <span className="text-xl font-black text-white/20 font-mono">
                          {item.step}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 mt-0.5 mb-3">
                      {item.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-white/5">
                    <ul className="space-y-1.5">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Callout: Works without an account, works without a server ── */}
        <section aria-label="Privacy and architecture guarantee" className="mb-16">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-cyan-500/20 bg-linear-to-r from-cyan-950/20 via-black/40 to-violet-950/20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_20px_rgba(0,242,254,0.25)]">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Works without an account. Works without a server.
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Zero-Cost P2P
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  CouchSync never routes your video or voice streams through a middleman server. All peer audio and video are encrypted point-to-point directly between viewers using standard WebRTC (DTLS-SRTP). Furthermore, when testing locally or in private environments, CouchSync uses the browser&apos;s native BroadcastChannel engine — functioning 100% offline without requiring any database or backend authentication.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <Lock className="w-3.5 h-3.5" />
                    <span>No data collection or video logging</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Radio className="w-3.5 h-3.5" />
                    <span>Instant offline multi-tab fallback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Keyboard Shortcuts Reference Section ──────────────────────── */}
        <section aria-label="Keyboard Shortcuts" className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-500/15 border border-violet-400/30 text-violet-400">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">Keyboard Shortcuts</h2>
                <p className="text-xs text-gray-400">Control your playback and lounge without touching the mouse</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 hidden sm:inline-block">
              Global Hotkeys
            </span>
          </div>

          <div className="glass-panel rounded-2xl border-white/10 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/3 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    <th className="py-3 px-4 sm:px-6">Key Binding</th>
                    <th className="py-3 px-4 sm:px-6">Action</th>
                    <th className="py-3 px-4 sm:px-6 hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                    <tr key={index} className="hover:bg-white/3 transition">
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {shortcut.keys.map((k, kIdx) => (
                            <React.Fragment key={kIdx}>
                              <kbd className="px-2 py-1 rounded-md bg-white/10 border border-white/20 text-cyan-300 font-mono text-xs font-bold shadow-inner">
                                {k}
                              </kbd>
                              {kIdx < shortcut.keys.length - 1 && (
                                <span className="text-xs text-gray-500">or</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-white">
                        {shortcut.action}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-400 hidden sm:table-cell">
                        {shortcut.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Bottom Call To Action (CTAs) ──────────────────────────────── */}
        <section aria-label="Start watching" className="glass-panel rounded-3xl p-8 text-center border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-violet-500/5 to-emerald-500/5 pointer-events-none" />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Watch Together?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Host a room in 5 seconds. Share your link, choose a movie or YouTube video, and start your synchronized party now.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-violet-600 hover:from-cyan-300 hover:via-blue-400 hover:to-violet-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Create a Room</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/15 hover:border-cyan-400/40 text-gray-300 hover:text-white font-bold text-sm bg-white/5 hover:bg-white/10 transition flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <SiteFooter />
    </div>
  );
}
