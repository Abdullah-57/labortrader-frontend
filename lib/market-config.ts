export const MARKET_CONFIG_VERSION = '2026-09-15.v1';
export const FOUNDING_100_PROGRAM_CAPACITY = 100;
// SOW Section 6: initial public display minimum is 15 eligible email-verified
// records unless Client changes it before launch.
export const DEFAULT_PUBLIC_COUNT_THRESHOLD = 15;

export const MARKET_WAVE_STATUSES = [
  'PREREGISTRATION',
  'SCHEDULED',
  'READY',
  'LIVE',
  'PAUSED',
  'CLOSED',
] as const;

export type MarketWaveStatus = (typeof MARKET_WAVE_STATUSES)[number];

export const MARKET_PUBLIC_PRECISIONS = [
  'MONTH',
  'EXACT_DATE',
  'EXACT_TIME',
] as const;

export type MarketPublicPrecision = (typeof MARKET_PUBLIC_PRECISIONS)[number];

export type MarketWaveDefinition = Readonly<{
  code: string;
  displayName: string;
  stateCodes: readonly string[];
  targetLocalDate: string;
  targetOpeningAt: string | null;
  timeZone: string;
  publicMonthLabel: string | null;
  publicLaunchLabel: string;
  publicPrecision: MarketPublicPrecision;
  status: MarketWaveStatus;
  operationalLive: boolean;
  earlyRegistrationCutoffAt: string | null;
  foundingCapacity: typeof FOUNDING_100_PROGRAM_CAPACITY;
  minimumPublicCount: number;
  configVersion: typeof MARKET_CONFIG_VERSION;
}>;

const US_STATE_CODES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'GA',
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
  'OH',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
] as const;

function wave(
  definition: Omit<
    MarketWaveDefinition,
    | 'targetOpeningAt'
    | 'publicPrecision'
    | 'status'
    | 'operationalLive'
    | 'earlyRegistrationCutoffAt'
    | 'foundingCapacity'
    | 'minimumPublicCount'
    | 'configVersion'
  >,
): MarketWaveDefinition {
  return Object.freeze({
    ...definition,
    // The approved dates do not yet include an activation time. Keeping this
    // null prevents a date-only value from being interpreted as UTC midnight.
    targetOpeningAt: null,
    publicPrecision: 'MONTH',
    status: 'PREREGISTRATION',
    operationalLive: false,
    // This is frozen separately by an administrator. A mutable target date is
    // never used as an eligibility cutoff implicitly.
    earlyRegistrationCutoffAt: null,
    foundingCapacity: FOUNDING_100_PROGRAM_CAPACITY,
    minimumPublicCount: DEFAULT_PUBLIC_COUNT_THRESHOLD,
    configVersion: MARKET_CONFIG_VERSION,
  });
}

// Future targetLocalDate values remain internal planning records for database
// compatibility. A null publicMonthLabel keeps unapproved months off the site.
export const MARKET_WAVES = Object.freeze([
  wave({
    code: 'OK_2027_01',
    displayName: 'Oklahoma',
    stateCodes: ['OK'],
    targetLocalDate: '2027-01-19',
    timeZone: 'America/Chicago',
    publicMonthLabel: 'February 2027',
    publicLaunchLabel: 'Target launch: February 2027',
  }),
  wave({
    code: 'TX_2027_03',
    displayName: 'Texas',
    stateCodes: ['TX'],
    targetLocalDate: '2027-03-16',
    timeZone: 'America/Chicago',
    publicMonthLabel: null,
    publicLaunchLabel: 'Waitlist Open',
  }),
  wave({
    code: 'FL_2027_05',
    displayName: 'Florida',
    stateCodes: ['FL'],
    targetLocalDate: '2027-05-18',
    timeZone: 'America/New_York',
    publicMonthLabel: null,
    publicLaunchLabel: 'Waitlist Open',
  }),
  wave({
    code: 'US_REMAINDER_2027_07',
    displayName: 'Nationwide',
    stateCodes: US_STATE_CODES,
    targetLocalDate: '2027-07-20',
    timeZone: 'America/Chicago',
    publicMonthLabel: null,
    publicLaunchLabel: 'Waitlist Open',
  }),
]) satisfies readonly MarketWaveDefinition[];

export function findMarketWaveForState(
  stateCode: string | null | undefined,
): MarketWaveDefinition | null {
  const normalizedState = stateCode?.trim().toUpperCase();
  if (!normalizedState) return null;

  return (
    MARKET_WAVES.find((candidate) =>
      candidate.stateCodes.includes(normalizedState),
    ) ?? null
  );
}

export function isMarketOperationallyLive(
  market: Pick<
    MarketWaveDefinition,
    'status' | 'operationalLive' | 'targetOpeningAt'
  >,
  now = new Date(),
): boolean {
  if (
    market.status !== 'LIVE' ||
    !market.operationalLive ||
    !market.targetOpeningAt
  ) {
    return false;
  }

  const opensAt = new Date(market.targetOpeningAt);
  return !Number.isNaN(opensAt.valueOf()) && opensAt <= now;
}

export function getPublicMarketTiming(
  stateCode: string | null | undefined,
): string | null {
  return findMarketWaveForState(stateCode)?.publicMonthLabel ?? null;
}
