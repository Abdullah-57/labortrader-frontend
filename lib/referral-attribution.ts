export type ReferralAttributionSource = 'EXISTING_COOKIE' | 'REQUEST';

/**
 * A short-lived browser-readable first-touch candidate bridges the first page
 * view and the validated HttpOnly referral cookie. The server always validates
 * this value before attribution, so it is not a trust boundary.
 */
export const REFERRAL_CANDIDATE_COOKIE = 'lt_ref_candidate';
// This limits browser attribution persistence only. A referral saved to the
// database has no qualification deadline.
export const REFERRAL_ATTRIBUTION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export type ReferralAttributionResolution = Readonly<{
  code: string | null;
  source: ReferralAttributionSource | null;
  shouldSetCookie: boolean;
}>;

type ReferralCodeValidator = (candidate: string) => Promise<string | null>;

function candidateCode(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/**
 * Preserves the first still-valid referral cookie. A later URL or manual code
 * is considered only when the browser has no valid first-touch attribution.
 */
export async function resolveFirstValidReferralAttribution(input: {
  existingCookieCode: unknown;
  requestedCode: unknown;
  validate: ReferralCodeValidator;
}): Promise<ReferralAttributionResolution> {
  const existingCandidate = candidateCode(input.existingCookieCode);
  if (existingCandidate) {
    const existingCode = await input.validate(existingCandidate);
    if (existingCode) {
      return {
        code: existingCode,
        source: 'EXISTING_COOKIE',
        shouldSetCookie: false,
      };
    }
  }

  const requestedCandidate = candidateCode(input.requestedCode);
  if (requestedCandidate) {
    const requestedCode = await input.validate(requestedCandidate);
    if (requestedCode) {
      return {
        code: requestedCode,
        source: 'REQUEST',
        shouldSetCookie: true,
      };
    }
  }

  return { code: null, source: null, shouldSetCookie: false };
}
