import React from 'react';
import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { LEGAL_CONFIG } from '@/config/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | CouchSync Live',
  description:
    'Learn how CouchSync Live protects your privacy with peer-to-peer streaming and zero data collection.',
  alternates: {
    canonical: 'https://couchsync.live/privacy',
  },
};

const sections: LegalSection[] = [
  {
    id: 'summary',
    heading: 'The short version',
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>
          You do not need an account, and we do not ask for your name, email, or phone number to watch with friends.
        </li>
        <li>
          Video and voice calls go directly between participants (peer to peer). They do not pass through our servers.
        </li>
        <li>
          Movie files you pick from your own computer are never uploaded anywhere.
        </li>
        <li>We do not sell your data and we do not show ads.</li>
      </ul>
    ),
  },
  {
    id: 'not-collected',
    heading: 'What we do not collect',
    body: (
      <p>
        We do not run user accounts, we do not keep a database of rooms or participants, and we do not store chat messages, call audio, call video, or the contents of any file you play.
      </p>
    ),
  },
  {
    id: 'in-a-room',
    heading: 'What happens inside a room',
    body: (
      <ul className="list-disc pl-5 space-y-2.5">
        <li>
          <strong className="text-gray-900">Video and voice:</strong> When you turn on your camera or microphone, your browser connects directly to the other people in the room using WebRTC. These streams are encrypted in transit by WebRTC.
        </li>
        <li>
          <strong className="text-gray-900">Playback sync, chat, reactions, polls, and trivia:</strong> These small messages (for example &quot;play&quot;, &quot;pause&quot;, &quot;seek to 12:30&quot;, a chat line, or an emoji) are relayed between participants through a realtime messaging service (Supabase Realtime) so everyone stays in sync. They are ephemeral. We do not save them, and they disappear when the room empties.
        </li>
        <li>
          <strong className="text-gray-900">Presence:</strong> The room shows who is currently connected, using the nickname you chose. This information exists only while you are in the room.
        </li>
        <li>
          <strong className="text-gray-900">Local files:</strong> A file you select is played in your own browser. Only playback timing (such as the current timestamp) is shared with others, never the file.
        </li>
        <li>
          <strong className="text-gray-900">Screen sharing:</strong> If you share your screen, the stream goes directly to the other participants and only for as long as you share.
        </li>
      </ul>
    ),
  },
  {
    id: 'device-storage',
    heading: 'Information stored on your device',
    body: (
      <p>
        CouchSync Live saves a few preferences in your browser&apos;s local storage and session storage so you do not have to set them again, such as your nickname, volume settings, audio ducking preference, interface layout, and recently used room codes. This data stays on your device. You can clear it at any time from your browser settings.
      </p>
    ),
  },
  {
    id: 'third-parties',
    heading: 'Third-party services',
    body: (
      <div className="space-y-3">
        <p>
          We rely on a small number of services to run the site. Each has its own privacy policy.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-gray-900">Vercel:</strong> hosts the website and provides performance measurement (Vercel Speed Insights), which collects anonymous page performance data such as load times.
          </li>
          <li>
            <strong className="text-gray-900">Supabase:</strong> provides the realtime message relay described above.
          </li>
          <li>
            <strong className="text-gray-900">Google STUN servers:</strong> help your browser discover how to connect directly to other participants.
          </li>
          <li>
            <strong className="text-gray-900">YouTube:</strong> when you watch a YouTube video together, the video is played through YouTube&apos;s embedded player. YouTube may collect data according to its own policies.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'ip-addresses',
    heading: 'IP addresses and direct connections',
    body: (
      <p>
        Because calls are peer to peer, the other people in your room may be able to see your network (IP) address through the connection process. Only join rooms with people you trust. Google&apos;s STUN servers also see the connection request used to find your public address.
      </p>
    ),
  },
  {
    id: 'feedback',
    heading: 'Feedback and contact messages',
    body: (
      <p>
        If you send us feedback or a bug report, we receive the message you wrote and the email address you provide (if any). We use it only to read, respond to, and improve CouchSync Live. If you submit a testimonial, it may be shown publicly on the site after we approve it, along with the name you provide.
      </p>
    ),
  },
  {
    id: 'cookies',
    heading: 'Cookies',
    body: (
      <p>
        We do not use advertising or tracking cookies. Embedded content such as YouTube may set its own cookies when you choose to play it.
      </p>
    ),
  },
  {
    id: 'children',
    heading: 'Children',
    body: (
      <p>
        CouchSync Live is not intended for children under {LEGAL_CONFIG.MIN_AGE} (or the minimum age required in your country). If you believe a child has used the service in a way that concerns you, contact us.
      </p>
    ),
  },
  {
    id: 'your-choices',
    heading: 'Your choices',
    body: (
      <p>
        You can use CouchSync Live without sharing your camera or microphone, leave a room at any time, and clear saved preferences from your browser. Because we do not keep accounts or room data, there is generally nothing for us to delete, but you can contact us with any privacy question or request.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to this policy',
    body: (
      <p>
        If we change how the service handles information, we will update this page and the &quot;Last updated&quot; date.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <p>
        Questions about privacy:{' '}
        <a
          href={`mailto:${LEGAL_CONFIG.CONTACT_EMAIL}`}
          className="text-[#EA580C] hover:underline font-semibold"
        >
          {LEGAL_CONFIG.CONTACT_EMAIL}
        </a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LEGAL_CONFIG.LAST_UPDATED}
      intro="CouchSync Live is built so that your movie night stays between you and your friends. This page explains, in plain language, what happens to your information when you use couchsync.live."
      sections={sections}
    />
  );
}
