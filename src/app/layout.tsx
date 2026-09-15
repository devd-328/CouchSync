import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://couchsync.live'),
  title: 'CouchSync — Watch Movies & Videos Together with Friends',
  description: 'Host virtual movie nights with friends in perfect sync! Watch movies from your PC, stream YouTube, or share your screen with live video call & chat — 100% free with no sign-up.',
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
    title: 'CouchSync — Watch Movies & Videos Together with Friends',
    description: 'Host virtual movie nights with friends in perfect sync! Watch movies from your PC, stream YouTube, or share your screen with live video call & chat — 100% free with no sign-up.',
    url: 'https://couchsync.live',
    siteName: 'CouchSync',
    images: [
      {
        url: '/og-image.png',
        width: 1024,
        height: 1024,
        alt: 'CouchSync — Watch Movies Together',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CouchSync — Watch Movies & Videos Together with Friends',
    description: 'Host virtual movie nights with friends in perfect sync! Watch movies from your PC, stream YouTube, or share your screen with live video call & chat — 100% free with no sign-up.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-screen bg-[#0B0D14] text-gray-100 antialiased flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
