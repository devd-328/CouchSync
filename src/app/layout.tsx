import type { Metadata } from 'next';
import { Fraunces, Instrument_Sans, DM_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from '@/lib/utils';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://couchsync.live';
const siteTitle = 'CouchSync Live — Watch Movies Together in Real-Time Sync';
const siteDescription =
  'Host a synchronized watch party to watch movies together online with P2P video call, live chat, and trivia. Free, no signup watch party in real-time sync.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: 'https://couchsync.live',
  },
  keywords: [
    'watch movies together online',
    'synchronized watch party',
    'P2P video call while watching',
    'no signup watch party',
    'watch party with video chat',
    'real-time sync',
    'movie trivia',
    'screen share with friends',
    'co-watch YouTube',
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'CouchSync Live',
    url: 'https://couchsync.live',
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/twitter-image'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CouchSync Live',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  url: 'https://couchsync.live',
  description: siteDescription,
  image: `${siteUrl}/opengraph-image`,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Real-time synchronized playback (<150ms drift)',
    'P2P video and voice calling via WebRTC',
    'Live chat with emoji reactions',
    'Interactive movie trivia',
    'Screen sharing',
    'Cinema-style themes',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn('h-full', fraunces.variable, instrumentSans.variable, dmMono.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-gray-900 antialiased flex flex-col selection:bg-orange-500/20 selection:text-orange-900 font-sans">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
