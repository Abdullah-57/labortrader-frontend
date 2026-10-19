import 'server-only';

import {
  type SignupCounts,
  type SignupCountScope,
} from './signup-counts-domain';

/**
 * Frontend-experiment stub. Returns sample counters so marketing strips render
 * without a database. Set FEATURE_PUBLIC_COUNTERS=false in .env.local to hide them.
 */
const SAMPLE_COUNTS: SignupCounts = {
  signups: 128,
  states: 18,
  specialties: 24,
};

export async function getPublicSignupCounts(
  _scope: SignupCountScope,
): Promise<SignupCounts | null> {
  if (process.env.FEATURE_PUBLIC_COUNTERS?.trim().toLowerCase() === 'false') {
    return null;
  }
  return SAMPLE_COUNTS;
}
