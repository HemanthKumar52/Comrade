import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Partner - Travel Together. Explore Beyond.',
    short_name: 'Partner',
    description: 'Next-gen travel companion with smart maps, partner matching, gamification & more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1A3C5E',
    theme_color: '#1A3C5E',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };
}
