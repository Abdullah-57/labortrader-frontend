import type { Metadata } from 'next';
import { siteRobotsMetadata } from './indexing-policy';

const socialImage = {
  url: '/brand/labortrader-social-cover-1200x630.jpg',
  width: 1200,
  height: 630,
  alt: 'LaborTrader: The Skilled Labor Marketplace',
} as const;

type PageMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | '/';
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | LaborTrader`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    robots: siteRobotsMetadata(),
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'LaborTrader',
      locale: 'en_US',
      title: socialTitle,
      description,
      url: path,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [socialImage],
    },
  };
}
