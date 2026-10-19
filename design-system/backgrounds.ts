// Canonical page imagery and crop positions; retain shared backdrop styling and motion.
const landing = '/design-lab/industrial-atmosphere-v1.webp';
export const siteBackgrounds = {
  landing: { src: landing, position: 'center', status: 'approved' },
  investors: {
    src: '/backgrounds/investors-atmosphere-v2.webp',
    position: '44% center',
    status: 'approved',
  },
  'pro-shop': {
    src: '/backgrounds/pro-shop-atmosphere-v2.webp',
    position: 'center',
    status: 'approved',
  },
  hvac: {
    src: '/backgrounds/hvac-atmosphere-v2.webp',
    position: '42% center',
    status: 'approved',
  },
  electrical: {
    src: '/backgrounds/electrical-atmosphere-v2.webp',
    position: '60% center',
    status: 'approved',
  },
  plumbing: {
    src: '/backgrounds/plumbing-atmosphere-v2.webp',
    position: 'center',
    status: 'approved',
  },
  'oil-gas': {
    src: '/backgrounds/oil-gas-atmosphere-v2.webp',
    position: '34% center',
    status: 'approved',
  },
  other: {
    src: '/backgrounds/other-atmosphere-v2.webp',
    position: '44% center',
    status: 'approved',
  },
  workers: {
    src: '/backgrounds/workers-atmosphere-v2.webp',
    position: '54% center',
    status: 'approved',
  },
  contractors: {
    src: '/backgrounds/contractors-atmosphere-v2.webp',
    position: 'center',
    status: 'approved',
  },
  businesses: {
    src: '/backgrounds/businesses-atmosphere-v2.webp',
    position: '44% center',
    status: 'approved',
  },
  hiring: {
    src: '/backgrounds/hiring-atmosphere-v2.webp',
    position: '54% center',
    status: 'approved',
  },
  clients: {
    src: '/backgrounds/clients-atmosphere-v2.webp',
    position: 'center',
    status: 'approved',
  },
  partners: {
    src: '/backgrounds/partners-atmosphere-v2.webp',
    position: 'center',
    status: 'approved',
  },
  'market-scan': {
    src: '/backgrounds/market-scan-atmosphere-v2.webp',
    position: '68% center',
    status: 'approved',
  },
} as const;
export type SiteBackground = keyof typeof siteBackgrounds;
