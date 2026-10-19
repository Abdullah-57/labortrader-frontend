'use client';

import { useEffect } from 'react';
import { readAttribution, writeAttribution } from '@/lib/client-attribution';
import {
  REFERRAL_ATTRIBUTION_MAX_AGE_SECONDS,
  REFERRAL_CANDIDATE_COOKIE,
} from '@/lib/referral-attribution';

const KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'promo',
  'source',
  'ref',
] as const;

export function AttributionCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stored = readAttribution();
    for (const key of KEYS) {
      const value = params.get(key);
      if (value && !stored[key]) stored[key] = value.slice(0, 160);
    }
    // Never retain arbitrary query parameters. Verification links carry bearer
    // tokens in the query string; only the route and the allowlisted campaign
    // values above belong in attribution storage.
    stored.landing_page ??= window.location.pathname.slice(0, 500);
    writeAttribution(stored);

    const firstReferralCode = stored.ref?.trim().slice(0, 35);
    if (!firstReferralCode) return;

    const hasCandidate = document.cookie
      .split(';')
      .some(
        (part) => part.trim().split('=', 1)[0] === REFERRAL_CANDIDATE_COOKIE,
      );
    if (!hasCandidate) {
      document.cookie = [
        `${REFERRAL_CANDIDATE_COOKIE}=${encodeURIComponent(firstReferralCode)}`,
        `Max-Age=${REFERRAL_ATTRIBUTION_MAX_AGE_SECONDS}`,
        'Path=/',
        'SameSite=Lax',
        ...(window.location.protocol === 'https:' ? ['Secure'] : []),
      ].join('; ');
    }

    // Upgrade the candidate to a validated HttpOnly cookie as soon as the
    // database-backed referral service is available. The API preserves an
    // existing valid first-touch cookie and never trusts this client value.
    void fetch('/api/referrals/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: firstReferralCode }),
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  return null;
}
