export const DEFAULT_SITE_ORIGIN = 'https://labortraders.com';

export type SitePath = '' | '/' | `/${string}`;

export function normalizeSiteOrigin(value: string) {
  const url = new URL(value.trim());

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('The public site URL must use HTTP or HTTPS.');
  }

  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    !/^\/*$/u.test(url.pathname)
  ) {
    throw new Error(
      'The public site URL must be an origin without credentials, a path, query, or fragment.',
    );
  }

  return url.origin;
}

export function getSiteOrigin() {
  const origin = normalizeSiteOrigin(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_ORIGIN,
  );
  if (
    process.env.VERCEL_ENV === 'production' &&
    origin !== DEFAULT_SITE_ORIGIN
  ) {
    throw new Error(
      'Production NEXT_PUBLIC_SITE_URL must be https://labortraders.com.',
    );
  }
  return origin;
}

export function getSiteUrl(path: SitePath, origin = getSiteOrigin()) {
  const normalizedOrigin = normalizeSiteOrigin(origin);

  if (path === '') return normalizedOrigin;

  const url = new URL(path, `${normalizedOrigin}/`);
  if (
    !path.startsWith('/') ||
    path.startsWith('//') ||
    path.includes('\\') ||
    url.origin !== normalizedOrigin
  ) {
    throw new Error('Site links must remain on the configured origin.');
  }
  return url.toString();
}
