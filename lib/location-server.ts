import 'server-only';
import { cookies, headers } from 'next/headers';
import { LOCATION_BANNER_COOKIE, parseVercelLocationHeaders } from './location';

/**
 * Read request-time location and the matching first-party dismissal cookie in
 * one place so the homepage can avoid a banner flash on return visits.
 */
export async function getLocationBannerContext() {
  const [requestHeaders, cookieStore] = await Promise.all([
    headers(),
    cookies(),
  ]);
  const location = parseVercelLocationHeaders(requestHeaders);
  const dismissedSignature =
    cookieStore.get(LOCATION_BANNER_COOKIE)?.value ?? null;

  return { location, dismissedSignature };
}
