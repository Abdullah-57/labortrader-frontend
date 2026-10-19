export const INDUSTRY_TRADES = {
  hvac: ['hvac-mechanical', 'refrigeration', 'controls-bas'],
  electrical: ['electrical'],
  plumbing: ['plumbing'],
  'oil-gas': ['oil-gas-field-operations'],
} as const;
export type SignupCountScope = 'all' | keyof typeof INDUSTRY_TRADES | 'other';
export type SignupCounts = {
  signups: number;
  states: number;
  specialties: number;
};

/** Public numeric totals appear once at least this many basic signups are counted. */
export const DEFAULT_PUBLIC_COUNTER_DISPLAY_MINIMUM = 1;

export function publicCounterDisplayMinimum(
  environment: NodeJS.ProcessEnv | Record<string, string | undefined> = process
    .env,
) {
  const raw = environment.PUBLIC_COUNTER_DISPLAY_MINIMUM?.trim();
  const parsed = raw ? Number(raw) : DEFAULT_PUBLIC_COUNTER_DISPLAY_MINIMUM;
  return Number.isSafeInteger(parsed) && parsed >= 1
    ? parsed
    : DEFAULT_PUBLIC_COUNTER_DISPLAY_MINIMUM;
}

export function publicCountsAreVisible(
  counts: SignupCounts | null | undefined,
  minimum = publicCounterDisplayMinimum(),
) {
  return Boolean(
    counts && validSignupCounts(counts) && counts.signups >= minimum,
  );
}

export function industryForTrade(
  slug: string,
): Exclude<SignupCountScope, 'all'> {
  for (const [industry, slugs] of Object.entries(INDUSTRY_TRADES)) {
    if ((slugs as readonly string[]).includes(slug))
      return industry as keyof typeof INDUSTRY_TRADES;
  }
  return 'other';
}

export function validSignupCounts(value: SignupCounts) {
  return (
    Object.values(value).every((n) => Number.isSafeInteger(n) && n >= 0) &&
    value.states <= 51 &&
    value.states <= value.signups &&
    value.specialties <= value.signups &&
    (value.signups === 0 ? value.states === 0 : value.states > 0)
  );
}
