import type { MetadataRoute } from 'next';
import { isIndexingDisabled } from '@/lib/indexing-policy';
import { getSiteUrl, type SitePath } from '@/lib/site-url';

/** Canonical public marketing URLs only — never admin/API/portal. */
const publicRoutes: SitePath[] = [
  '',
  '/how-it-works',
  '/market-scan',
  '/trades/hvac',
  '/trades/electrical',
  '/trades/plumbing',
  '/industries/oil-gas',
  '/pro-shop',
  '/advertise',
  '/for-clients',
  '/for-workers',
  '/for-contractors',
  '/for-businesses',
  '/for-hiring-firms',
  '/about',
  '/partners',
  '/investors',
  '/contact',
  '/trust-safety',
  '/accessibility',
  '/faq',
  '/early-access',
  '/launch-benefits',
  '/referrals',
  '/trades/other',
  '/privacy',
  '/terms',
  '/sms-terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (isIndexingDisabled()) return [];
  const lastModified = new Date();
  return publicRoutes.map((path, index) => ({
    url: getSiteUrl(path),
    lastModified,
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority:
      index === 0
        ? 1
        : path === '/early-access' || path === '/referrals'
          ? 0.95
          : 0.75,
  }));
}
