import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://couchsync.live';
const siteDescription =
  'Host synchronized watch parties with friends in real-time sync. Watch local movies from your PC, stream YouTube, or share your screen with peer-to-peer (P2P) video calls, live chat, and interactive movie trivia — 100% free with no sign-up.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'CouchSync Live — Synchronized Watch Party & P2P Video Calls',
  description: siteDescription,
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.png',
  },
  openGraph: {
    title: 'CouchSync Live — Synchronized Watch Party & P2P Video Calls',
    description: siteDescription,
    url: siteUrl,
    siteName: 'CouchSync Live',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CouchSync Live — Synchronized Watch Party with P2P Video Calls & Movie Trivia',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CouchSync Live — Synchronized Watch Party & P2P Video Calls',
    description: siteDescription,
    images: ['/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CouchSync Live',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  url: siteUrl,
  description: siteDescription,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FAF8F5] text-gray-900 antialiased flex flex-col selection:bg-orange-500/20 selection:text-orange-900">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
