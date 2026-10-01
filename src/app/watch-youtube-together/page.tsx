import React from 'react';
import type { Metadata } from 'next';
import { UseCasePage } from '@/components/seo/UseCasePage';

export const metadata: Metadata = {
  title: 'Watch YouTube Together Online, Free and in Sync | CouchSync Live',
  description:
    'Watch YouTube videos together in sync with friends or your partner. No account, no extension. Create a free room and share the link.',
  alternates: {
    canonical: 'https://couchsync.live/watch-youtube-together',
  },
};

const STEPS = [
  {
    title: 'Create a free room',
    body: 'No account needed.',
  },
  {
    title: 'Choose YouTube as the source',
    body: 'Paste a video link.',
  },
  {
    title: 'Send the room link',
    body: 'When anyone plays, pauses, or skips ahead, everyone follows.',
  },
];

const SECTIONS = [
  {
    heading: 'What you get',
    bullets: [
      'Synced playback for everyone in the room',
      'Built-in voice and video calls, connected directly between participants',
      'Live chat and emoji reactions',
      'Smart audio ducking that lowers the video when someone is talking',
      'No browser extension and no sign-up',
    ],
  },
  {
    heading: 'Good to know',
    body: "The video plays through YouTube's own player, so YouTube's rules apply. Ads are controlled by YouTube and may appear at different times for different people. Some videos have embedding turned off by their owners, so if a link does not play, try a different video.",
  },
];

const FAQS = [
  {
    q: 'Do I need an account?',
    a: 'No. Create a room, share the link, and start watching.',
  },
  {
    q: 'Do we need a browser extension?',
    a: 'No. CouchSync Live works in your browser.',
  },
  {
    q: 'Is it free?',
    a: 'Yes, CouchSync Live is free to use.',
  },
  {
    q: 'How many people can join?',
    a: 'Calls connect directly between everyone, so it works best with small groups of friends or family.',
  },
  {
    q: 'Can we watch something other than YouTube?',
    a: 'Yes. You can also play a video file from your own computer, where each person selects the same file and CouchSync Live keeps everyone in sync.',
  },
];

const RELATED_LINKS = [
  { label: 'Long distance movie night', href: '/long-distance-movie-night' },
  { label: 'Features', href: '/features' },
  { label: 'How it works', href: '/how-it-works' },
];

export default function WatchYouTubeTogetherPage() {
  return (
    <UseCasePage
      h1="Watch YouTube together, in sync"
      intro="Want to watch a video with someone in another city? With CouchSync Live you paste a YouTube link, share a room link, and watch together. Play, pause, and seek stay in sync for everyone, and you can talk on a built-in video call while you watch."
      steps={STEPS}
      sections={SECTIONS}
      faqs={FAQS}
      related={RELATED_LINKS}
      defaultMode="youtube"
    />
  );
}
