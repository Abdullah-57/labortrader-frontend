import type { Metadata } from 'next';

/** Preview builds are crawlable enough to read noindex, but never indexable. */
export function isIndexingDisabled(
  environment: NodeJS.ProcessEnv = process.env,
) {
  return (
    environment.VERCEL_ENV === 'preview' ||
    environment.SITE_INDEXING_DISABLED?.trim().toLowerCase() === 'true'
  );
}

export function siteRobotsMetadata(): Metadata['robots'] {
  if (isIndexingDisabled()) return { index: false, follow: false, noarchive: true };
  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}
