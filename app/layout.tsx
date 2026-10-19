import type { Metadata, Viewport } from 'next';
import { AttributionCapture } from '@/components/attribution-capture';
import { SiteVisitCapture } from '@/components/site-visit-capture';
import { organizationStructuredData } from '@/lib/company-profile';
import { getSiteOrigin } from '@/lib/site-url';
import { siteRobotsMetadata } from '@/lib/indexing-policy';
import { inter } from './fonts';
import './globals.css';
import '@/design-system/tokens.css';
import '@/design-system/site.css';
import '@/design-system/tiles.css';
import '@/design-system/interactions.css';
import '@/design-system/forms.css';

const publicSiteUrl = new URL(getSiteOrigin());

const siteStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationStructuredData(publicSiteUrl.origin),
    {
      '@type': 'WebSite',
      '@id': `${publicSiteUrl.origin}/#website`,
      name: 'LaborTrader',
      url: publicSiteUrl.origin,
      publisher: { '@id': `${publicSiteUrl.origin}/#organization` },
      inLanguage: 'en-US',
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: publicSiteUrl,
  title: {
    default: 'Skilled Labor Marketplace | Find Work & Hire | LaborTrader',
    template: '%s | LaborTrader',
  },
  description:
    'Pre-register nationwide for LaborTrader — the skilled labor marketplace connecting workers, contractors, service businesses, hiring organizations, and project owners. Oklahoma launches February 2027.',
  applicationName: 'LaborTrader',
  robots: siteRobotsMetadata(),
  keywords: [
    'skilled labor marketplace',
    'hire skilled workers',
    'find trade jobs',
    'HVAC jobs',
    'contractor marketplace',
    'LaborTrader',
    'Oklahoma skilled labor',
  ],
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      {
        url: '/brand/labortrader-mark-inverse.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    shortcut: '/favicon.ico',
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  openGraph: {
    type: 'website',
    siteName: 'LaborTrader',
    locale: 'en_US',
    images: [
      {
        url: '/brand/labortrader-social-cover-1200x630.jpg',
        width: 1200,
        height: 630,
        alt: 'LaborTrader: The Skilled Labor Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/brand/labortrader-social-cover-1200x630.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#171916',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteStructuredData).replaceAll(
              '<',
              '\\u003c',
            ),
          }}
        />
        <AttributionCapture />
        <SiteVisitCapture />
        {children}
      </body>
    </html>
  );
}
