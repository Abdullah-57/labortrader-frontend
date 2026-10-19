export const LOCATION_BANNER_SOURCE = 'location_banner';
export const LOCATION_BANNER_COOKIE = 'lt_location_banner';
export const LOCATION_BANNER_DISMISSAL_DAYS = 14;

export const launchListRoles = [
  { value: 'worker', label: 'Worker' },
  { value: 'contractor', label: 'Independent Contractor' },
  { value: 'business', label: 'Service Business' },
  { value: 'hiring-firm', label: 'Hiring Organization' },
] as const;

export type LaunchListRole = (typeof launchListRoles)[number]['value'];

export type ApproximateLocation = {
  city: string;
  region: string;
  country: 'US';
};

type HeaderReader = Pick<Headers, 'get'>;

const US_REGION_CODES = new Set([
  'AL',
  'AK',
  'AS',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'GU',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'MP',
  'OH',
  'OK',
  'OR',
  'PA',
  'PR',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VI',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
]);

function decodeHeaderValue(value: string | null, maxLength: number) {
  if (!value || value.length > maxLength * 3) return null;

  try {
    const decoded = decodeURIComponent(value).normalize('NFC');
    const containsControlCharacter = Array.from(decoded).some((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint < 32 || codePoint === 127;
    });

    if (decoded.length > maxLength || containsControlCharacter) {
      return null;
    }

    return decoded.trim().replace(/\s+/gu, ' ') || null;
  } catch {
    return null;
  }
}

function normalizeCity(value: string | null) {
  const city = decodeHeaderValue(value, 100);

  if (
    !city ||
    !/[\p{L}\p{N}]/u.test(city) ||
    !/^[\p{L}\p{M}\p{N} .'’-]+$/u.test(city)
  ) {
    return null;
  }

  return city;
}

function normalizeRegion(value: string | null) {
  const region = decodeHeaderValue(value, 3)?.toUpperCase();
  return region && US_REGION_CODES.has(region) ? region : null;
}

/**
 * Converts Vercel's approximate request-location headers into a small, safe
 * display value. Raw IP addresses are never read or retained.
 */
export function parseVercelLocationHeaders(
  requestHeaders: HeaderReader,
): ApproximateLocation | null {
  const country = decodeHeaderValue(
    requestHeaders.get('x-vercel-ip-country'),
    2,
  )?.toUpperCase();

  if (country !== 'US') return null;

  const city = normalizeCity(requestHeaders.get('x-vercel-ip-city'));
  const region = normalizeRegion(
    requestHeaders.get('x-vercel-ip-country-region'),
  );

  if (!city || !region) return null;

  return { city, region, country: 'US' };
}

export function buildLaunchListHref(
  location: ApproximateLocation | null,
  role?: LaunchListRole,
) {
  const params = new URLSearchParams();

  if (role) params.set('role', role);
  if (location) {
    params.set('city', location.city);
    params.set('state', location.region);
  }
  params.set('source', LOCATION_BANNER_SOURCE);

  return `/early-access?${params.toString()}${role ? '#detailed-registration' : ''}`;
}

export function buildDifferentLocationHref(role?: LaunchListRole) {
  const params = new URLSearchParams();

  if (role) params.set('role', role);
  params.set('source', LOCATION_BANNER_SOURCE);
  params.set('changeLocation', '1');

  return `/early-access?${params.toString()}`;
}

/** A short opaque key lets dismissal state vary by detected location. */
export function getLocationDismissalSignature(
  location: ApproximateLocation | null,
) {
  const value = location
    ? `${location.region}|${location.city.toLocaleLowerCase('en-US')}`
    : 'generic';
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }

  return `v1-${(hash >>> 0).toString(36)}`;
}

export function getLocationDismissalStorageKey(
  location: ApproximateLocation | null,
) {
  return `labortrader:location-banner:${getLocationDismissalSignature(location)}`;
}

export function isLocationDismissalCurrent(
  storedAt: string | null,
  now = Date.now(),
) {
  if (!storedAt) return false;

  const dismissedAt = Number(storedAt);
  const maxAge = LOCATION_BANNER_DISMISSAL_DAYS * 24 * 60 * 60 * 1000;

  return (
    Number.isFinite(dismissedAt) &&
    dismissedAt <= now &&
    now - dismissedAt < maxAge
  );
}
