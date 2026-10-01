import React from 'react';
import type { Metadata } from 'next';
import { UseCasePage } from '@/components/seo/UseCasePage';

export const metadata: Metadata = {
  title: 'Long Distance Movie Night: Watch Together Online | CouchSync Live',
  description:
    'Plan a long distance movie night with your partner. Watch in sync, talk on video, and react together. Free, no account or extension needed.',
  alternates: {
    canonical: 'https://couchsync.live/long-distance-movie-night',
  },
};

const STEPS = [
  {
    title: 'Create a free room',
    body: 'Send the link to your partner.',
  },
  {
    title: 'Pick what to watch',
    body: 'A YouTube video or a video file you both have.',
  },
  {
    title: 'Press play together',
    body: 'Everything stays in sync while you talk.',
  },
];

const SECTIONS = [
  {
    heading: 'Ways to watch',
    bullets: [
      'YouTube: paste a link and watch together.',
      'Your own video file: each of you selects the same file on your own computer. Nothing is uploaded, and CouchSync Live keeps both playbacks in sync.',
      'Screen sharing: share your screen with the room for things you have the right to show.',
    ],
  },
  {
    heading: 'Make it feel like a date',
    bullets: [
      'Video and voice calls inside the room',
      'Emoji reactions that float across the screen',
      'Chat with timestamps you can jump back to',
      'Movie trivia and quick polls for the in-between moments',
      'Audio ducking that lowers the movie when someone speaks',
    ],
  },
  {
    heading: 'Tips for a smooth night',
    bullets: [
      'Use headphones to avoid echo on the call.',
      'Run the device check in the lobby to test your camera and microphone before you start.',
      'For video files, make sure you both have the same file.',
      'A stable internet connection helps most. If someone\'s connection stalls, playback pauses for everyone and resumes together.',
    ],
  },
];

const FAQS = [
  {
    q: 'Do we both need the movie file?',
    a: 'For your own video files, yes. Each person selects the same file on their own computer. For YouTube, you just share a link.',
  },
  {
    q: 'Is it private?',
    a: 'Calls go directly between participants and we do not store your video, voice, or chat. See our Privacy Policy (/privacy) for details.',
  },
  {
    q: 'Do we need accounts or extensions?',
    a: 'No. You only need a modern browser and the room link.',
  },
  {
    q: 'Is it free?',
    a: 'Yes, CouchSync Live is free to use.',
  },
];

const RELATED_LINKS = [
  { label: 'Watch YouTube together', href: '/watch-youtube-together' },
  { label: 'Features', href: '/features' },
  { label: 'How it works', href: '/how-it-works' },
];

export default function LongDistanceMovieNightPage() {
  return (
    <UseCasePage
      h1="A long distance movie night that feels like being together"
      intro="Distance does not have to cancel movie night. CouchSync Live keeps your video in sync, lets you talk and see each other while it plays, and adds reactions, chat, and small games so the night feels shared."
      steps={STEPS}
      sections={SECTIONS}
      faqs={FAQS}
      related={RELATED_LINKS}
    />
  );
}
