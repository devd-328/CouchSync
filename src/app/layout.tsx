import type { Metadata } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://couchsync.live';
const siteTitle = "CouchSync Live | Watch Together, Even When You're Apart";
const siteDescription =
  'Host a synchronized watch party with friends. Watch local movies, stream YouTube, or share your screen with P2P video calls, live chat and movie trivia. Free, no sign-up.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    'synchronized watch party',
    'watch movies together',
    'P2P video call',
    'real-time sync',
    'movie trivia',
    'watch party free',
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
    url: siteUrl,
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
  url: siteUrl,
  description: siteDescription,
  image: `${siteUrl}/opengraph-image`,
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
