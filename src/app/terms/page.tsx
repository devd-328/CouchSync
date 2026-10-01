import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, type LegalSection } from '@/components/legal/LegalPage';
import { LEGAL_CONFIG } from '@/config/constants';

export const metadata: Metadata = {
  title: 'Terms of Service | CouchSync Live',
  description:
    'Read the terms of service and acceptable use guidelines for CouchSync Live.',
  alternates: {
    canonical: 'https://couchsync.live/terms',
  },
};

const sections: LegalSection[] = [
  {
    id: 'service',
    heading: 'What CouchSync Live is',
    body: (
      <p>
        CouchSync Live is a free tool that lets people watch videos together in sync and talk to each other. We provide the synchronization and connection tools. We do not provide, host, or license any movies, shows, or other media.
      </p>
    ),
  },
  {
    id: 'eligibility',
    heading: 'Who can use it',
    body: (
      <p>
        You must be at least {LEGAL_CONFIG.MIN_AGE} years old (or the minimum age required where you live) to use CouchSync Live. If you are under the age of majority in your country, use it with a parent or guardian&apos;s permission.
      </p>
    ),
  },
  {
    id: 'rooms',
    heading: 'Rooms and room codes',
    body: (
      <p>
        Anyone with a room link or code can join that room, so share it only with people you trust. You are responsible for who you invite. There are no accounts, so we cannot recover a lost room or identify participants after a session ends.
      </p>
    ),
  },
  {
    id: 'acceptable-use',
    heading: 'Acceptable use',
    body: (
      <div className="space-y-3">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            harass, threaten, or abuse other people, or share hateful or sexually explicit content;
          </li>
          <li>
            share content involving the exploitation of minors, or any content that is illegal;
          </li>
          <li>use the service to distribute pirated or infringing material;</li>
          <li>
            attempt to disrupt, overload, or break the service, or to access rooms you were not invited to;
          </li>
          <li>
            reverse engineer or abuse the service in ways that harm other users or us;
          </li>
          <li>
            record or redistribute other people&apos;s video, voice, or chat without their consent.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'content',
    heading: 'Content you play or share',
    body: (
      <p>
        You are solely responsible for the videos, files, links, screen shares, camera, microphone, and messages you bring into a room. Only play content you have the right to watch and share with your group. Content from services such as YouTube, Netflix, or other streaming platforms is governed by those services&apos; own terms, and you are responsible for following them. CouchSync Live is not affiliated with, endorsed by, or sponsored by any streaming service.
      </p>
    ),
  },
  {
    id: 'copyright',
    heading: 'Copyright concerns',
    body: (
      <p>
        If you believe content is being shared through the service in a way that infringes your rights, contact us at{' '}
        <a
          href={`mailto:${LEGAL_CONFIG.CONTACT_EMAIL}`}
          className="text-[#EA580C] hover:underline font-semibold"
        >
          {LEGAL_CONFIG.CONTACT_EMAIL}
        </a>{' '}
        with details and we will review it. Because media is shared directly between participants and not stored by us, we may be limited in what we can remove, but we will act on valid reports where we can.
      </p>
    ),
  },
  {
    id: 'privacy',
    heading: 'Your privacy',
    body: (
      <p>
        How we handle information is described in our{' '}
        <Link href="/privacy" className="text-[#EA580C] hover:underline font-semibold">
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    id: 'warranty',
    heading: 'No warranty',
    body: (
      <p>
        CouchSync Live is provided &quot;as is&quot; and &quot;as available,&quot; without promises that it will be uninterrupted, error free, or perfectly synchronized. Performance depends on your devices, browsers, and network. Direct connections may not work on some networks or firewalls.
      </p>
    ),
  },
  {
    id: 'liability',
    heading: 'Limitation of liability',
    body: (
      <p>
        To the fullest extent allowed by law, CouchSync Live and its creator are not liable for any indirect, incidental, or consequential damages, or for loss of data or content, arising from your use of the service, including anything that happens between you and other participants.
      </p>
    ),
  },
  {
    id: 'termination',
    heading: 'Ending access',
    body: (
      <p>
        You can stop using the service at any time. We may limit or block access to the service, including for people who break these terms or harm others, and we may change or discontinue features at any time.
      </p>
    ),
  },
  {
    id: 'changes',
    heading: 'Changes to these terms',
    body: (
      <p>
        We may update these terms. The &quot;Last updated&quot; date shows the latest version, and continued use after a change means you accept it.
      </p>
    ),
  },
  {
    id: 'governing-law',
    heading: 'Governing law',
    body: (
      <p>
        These terms and your use of CouchSync Live are governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
      </p>
    ),
  },
  {
    id: 'contact',
    heading: 'Contact',
    body: (
      <p>
        Questions about these terms:{' '}
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

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={LEGAL_CONFIG.LAST_UPDATED}
      intro="These terms are the ground rules for using CouchSync Live at couchsync.live. By using the service you agree to them. If you do not agree, please do not use it."
      sections={sections}
    />
  );
}
