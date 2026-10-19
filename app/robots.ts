import type { MetadataRoute } from 'next';
import { getSiteOrigin, getSiteUrl } from '@/lib/site-url';
import { isIndexingDisabled } from '@/lib/indexing-policy';

/**
 * Crawl policy (web-quality-skills / SEO):
 * - Allow public marketing pages so Google can render and index.
 * - Disallow admin, APIs, and private verification/portal surfaces.
 * - Always publish Sitemap on indexable production.
 */
export default function robots(): MetadataRoute.Robots {
  // Previews stay crawlable enough to read global noindex headers.
  if (isIndexingDisabled()) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/dev/', '/portal'],
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/',
        '/api/',
        '/dev/',
        '/portal',
        '/portal/',
        '/early-access/complete',
        '/early-access/verify-email',
        '/pro-shop/verify-email',
        '/confirm-email',
        '/r/',
      ],
    },
    sitemap: getSiteUrl('/sitemap.xml'),
    host: getSiteOrigin(),
  };
}
