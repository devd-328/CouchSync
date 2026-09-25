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
  title: 'How It Works | CouchSync Live',
  description: 'Learn how to host virtual movie nights with friends: 1-click room setup, syncing local movie files or YouTube, video calling, and controls.',
  alternates: {
    canonical: 'https://couchsync.live/how-it-works',
  },
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
      'Launch a customized cinema room in one click, or join a friend’s lounge by pasting their room code or invite link. No email, passwords, or personal accounts required.',
    highlights: ['One-click room creation', 'Custom room titles', 'Saved recent room history'],
  },
  {
    step: '02',
    title: 'Quick Camera & Mic Check',
    badge: 'Step 2',
    color: 'emerald',
    icon: Camera,
    subtitle: 'Crystal-clear video & voice preview',
    description:
      'Check your camera and microphone in the room lobby before entering. See real-time volume levels, turn mic/camera on or off, and enjoy built-in noise reduction and echo prevention.',
    highlights: ['Live volume meter', 'Camera & mic preview', 'Easy keyboard mute toggles'],
  },
  {
    step: '03',
    title: 'Invite Your Friends',
    badge: 'Step 3',
    color: 'violet',
    icon: Share2,
    subtitle: 'Shareable link for instant watching',
    description:
      'Copy your unique room link with a single click and send it to friends on WhatsApp, Discord, or text. Friends join instantly right in their browser without downloading any apps.',
    highlights: ['Instant link copy', 'Works on any device & browser', 'See who joins in real time'],
  },
  {
    step: '04',
    title: 'Pick What to Watch',
    badge: 'Step 4',
    color: 'amber',
    icon: Tv,
    subtitle: 'Cinema movies, YouTube, or your screen',
    description:
      'Watch high-definition movie streams with subtitles, play your own video files from your computer, paste any YouTube link, or share your entire screen or app window in smooth quality.',
    highlights: ['High-definition video links & local files', 'Full YouTube player support', 'Smooth high-quality screen sharing'],
  },
  {
    step: '05',
    title: 'Instant Playback Sync',
    badge: 'Step 5',
    color: 'cyan',
    icon: Zap,
    subtitle: 'Play, pause, skip & speed stay together',
    description:
      'Every pause, play, rewind, and fast-forward syncs to your friends instantly with zero noticeable delay. If someone’s internet slows down, the video gently pauses for everyone so nobody misses a moment.',
    highlights: ['Instant zero-lag sync', 'Automatic seamless catch-up', 'Smart auto-pause if a friend buffers'],
  },
  {
    step: '06',
    title: 'Hangout, Chat & Mini-Games',
    badge: 'Step 6',
    color: 'rose',
    icon: Gamepad2,
    subtitle: 'Interactive virtual movie lounge',
    description:
      'Chat in real time with clickable scene timestamps, send floating emoji reactions that pop on screen, create live audience polls, or play movie trivia during intermissions.',
    highlights: ['Auto-lowers movie volume when friends speak', 'Jump to scenes from chat timestamps', 'Multiplayer movie trivia'],
  },
];

const KEYBOARD_SHORTCUTS = [
  { keys: ['Space', 'K'], action: 'Play / Pause Video', note: 'Syncs instantly to all participants' },
  { keys: ['F'], action: 'Toggle Fullscreen', note: 'Immersive cinema viewing mode' },
  { keys: ['M'], action: 'Mute / Unmute Media', note: 'Silences video sound without affecting voice chat' },
  { keys: ['C'], action: 'Toggle Chat Panel', note: 'Show or collapse live conversation sidebar' },
  { keys: ['←', '→'], action: 'Seek ±5 Seconds', note: 'Quick replay or skip forward in perfect sync' },
  { keys: ['↑', '↓'], action: 'Volume ±10%', note: 'Fine-tune movie audio level' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#EA580C] via-[#F97316] to-[#FB923C] p-2 sm:p-4 lg:p-6 flex flex-col justify-between overflow-x-hidden selection:bg-[#EA580C] selection:text-white">
      <div className="w-full max-w-[1580px] mx-auto bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.22)] border border-white/60 p-4 sm:p-6 lg:p-8 flex flex-col justify-between min-h-[calc(100vh-2rem)]">
        {/* ── Top Header / Nav ─────────────────────────────────────────── */}
        <SiteHeader currentPage="how-it-works" badgeText="Guide" />

        {/* ── Hero Section ──────────────────────────────────────────────── */}
        <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs text-[#EA580C] font-bold shadow-2xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5722] animate-pulse" />
              <span>Complete Architecture &amp; User Manual</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight">
              How CouchSync Live Works
            </h1>
            <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
              Synchronized movie nights made effortless. From creating your first lounge to peer-to-peer audio ducking and hotkeys, here is the full walkthrough.
            </p>
          </div>

          {/* ── 6-Step Journey ────────────────────────────────────────────── */}
          <section aria-label="Step-by-step guide" className="space-y-6 mb-16">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5722] animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#EA580C]">
                The 6-Step Watch Party Flow
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.step}
                    className="bg-white card-hover rounded-3xl p-6 sm:p-7 border border-black/8 shadow-2xs hover:shadow-md hover:border-orange-300 transition flex flex-col justify-between relative overflow-hidden group"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl border border-orange-200/80 text-[#EA580C] bg-orange-50">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-orange-200 bg-orange-100/80 text-[#EA580C]">
                            {item.badge}
                          </span>
                          <span className="text-xl font-black text-gray-300 font-mono">
                            {item.step}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-gray-950 group-hover:text-[#EA580C] transition">
                        {item.title}
                      </h3>
                      <p className="text-xs font-semibold text-gray-500 mt-0.5 mb-3">
                        {item.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                        {item.description}
                      </p>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-black/5">
                      <ul className="space-y-1.5">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
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
            <div className="rounded-3xl p-6 sm:p-8 border border-orange-200/80 bg-linear-to-r from-orange-50/80 via-white to-amber-50/80 relative overflow-hidden shadow-2xs">
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#EA580C] shrink-0 shadow-2xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                    <h2 className="text-lg sm:text-xl font-black text-gray-950 tracking-tight">
                      Works without an account. Works without a server.
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                      100% Private &amp; Free
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    CouchSync Live never passes your video or voice calls through a middleman server. All video and audio feeds are encrypted and sent directly between you and your friends. Your data stays on your own devices: nothing is recorded, tracked, or uploaded.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500">
                    <div className="flex items-center gap-1.5 text-[#EA580C]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>No accounts, tracking, or video logging</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Instant connection right in your browser</span>
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
                <div className="p-2 rounded-xl bg-orange-100 border border-orange-200 text-[#EA580C]">
                  <Keyboard className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-950">Keyboard Shortcuts</h2>
                  <p className="text-xs text-gray-500">Control your playback and lounge without touching the mouse</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-[#EA580C] font-semibold hidden sm:inline-block">
                Global Hotkeys
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-black/8 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-black/8 bg-gray-50/80 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4 sm:px-6">Key Binding</th>
                      <th className="py-3 px-4 sm:px-6">Action</th>
                      <th className="py-3 px-4 sm:px-6 hidden sm:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-xs sm:text-sm">
                    {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                      <tr key={index} className="hover:bg-orange-50/40 transition">
                        <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {shortcut.keys.map((k, kIdx) => (
                              <React.Fragment key={kIdx}>
                                <kbd className="px-2 py-1 rounded-md bg-gray-100 border border-gray-300 text-gray-800 font-mono text-xs font-bold shadow-2xs">
                                  {k}
                                </kbd>
                                {kIdx < shortcut.keys.length - 1 && (
                                  <span className="text-xs text-gray-400">or</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 font-bold text-gray-900">
                          {shortcut.action}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-gray-500 hidden sm:table-cell">
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
          <section aria-label="Start watching" className="bg-linear-to-r from-orange-50 via-white to-amber-50 rounded-3xl p-8 text-center border border-orange-200/80 relative overflow-hidden shadow-2xs">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
                Ready to Watch Together?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Host a room in 5 seconds. Share your link, choose a movie or YouTube video, and start your synchronized party now.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#FF5722] to-[#FF7043] hover:from-[#F4511E] hover:to-[#FF5722] text-white font-bold text-sm shadow-[0_6px_20px_rgba(255,87,34,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Create a Room</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-black/10 hover:border-orange-300 text-gray-700 hover:text-gray-950 font-bold text-sm bg-white hover:bg-gray-50 transition flex items-center justify-center gap-2"
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
    </div>
  );
}
