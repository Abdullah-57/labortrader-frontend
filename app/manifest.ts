import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LaborTrader: The Skilled Labor Marketplace',
    short_name: 'LaborTrader',
    description:
      'Pre-register for the work-verified marketplace connecting Clients & Project Owners with Workers, Independent Contractors, Service Businesses, and Hiring Organizations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#171916',
    theme_color: '#171916',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/brand/labortrader-mark-social.jpg',
        sizes: '2000x2000',
        type: 'image/jpeg',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
