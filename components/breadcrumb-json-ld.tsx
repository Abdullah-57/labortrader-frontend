import { getSiteOrigin, getSiteUrl, type SitePath } from '@/lib/site-url';

export type BreadcrumbItem = Readonly<{
  name: string;
  path: Exclude<SitePath, ''>;
}>;

export function breadcrumbStructuredData(
  items: readonly [BreadcrumbItem, BreadcrumbItem, ...BreadcrumbItem[]],
  origin = getSiteOrigin(),
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getSiteUrl(item.path, origin),
    })),
  } as const;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: readonly [BreadcrumbItem, BreadcrumbItem, ...BreadcrumbItem[]];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(breadcrumbStructuredData(items)),
      }}
    />
  );
}
