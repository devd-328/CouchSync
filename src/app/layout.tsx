import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CouchSync — Watch Movies Together in Real-Time Sync',
  description: 'Synchronized HLS video playback with peer-to-peer WebRTC video calling, low-latency live chat, and audio ducking.',
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
