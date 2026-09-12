import { VideoMedia } from '@/types/sync';

export const SAMPLE_VIDEOS: VideoMedia[] = [
  {
    id: 'space-odyssey',
    title: 'Interstellar Odyssey (1080p HLS Ready)',
    src: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    duration: '02h 15m',
    category: 'Sci-Fi / Adventure',
  },
  {
    id: 'sintel-chronicles',
    title: 'Sintel: Dragon Guardian (4K Remaster)',
    src: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    duration: '01h 52m',
    category: 'Fantasy / Animation',
  },
  {
    id: 'tears-of-steel',
    title: 'Tears of Steel: Cyber Resistance',
    src: 'https://cdn.jwplayer.com/manifests/pZxKAyUc.m3u8',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
    duration: '02h 04m',
    category: 'Cyberpunk Action',
  },
];

export const DEFAULT_VIDEO = SAMPLE_VIDEOS[0];
