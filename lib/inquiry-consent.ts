import { PRIVACY_NOTICE_VERSION } from './signup-mapping';
export const INQUIRY_CONSENT_VERSION = 'INQUIRY_EMAIL_2026_10_02_V2';
export const INQUIRY_PRIVACY_VERSION = PRIVACY_NOTICE_VERSION;

/** Server timestamps; historical inquiries remain unknown, never backfilled. */
export function inquiryConsentRecord(
  input: {
    privacyAcknowledged: true;
    contactRequested: true;
    emailMarketingConsent: boolean;
  },
  now = new Date(),
) {
  return {
    privacyAcknowledgedAt: now,
    privacyVersion: INQUIRY_PRIVACY_VERSION,
    contactRequestedAt: now,
    consentCopyVersion: INQUIRY_CONSENT_VERSION,
    emailMarketingConsent: input.emailMarketingConsent,
    emailMarketingConsentAt: input.emailMarketingConsent ? now : null,
  };
}
