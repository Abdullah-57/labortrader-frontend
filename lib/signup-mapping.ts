import type {
  EarlyAccessInput,
  ImportEarlyAccessInput,
  ProgressiveEarlyAccessInput,
} from './validation';

export const CONSENT_COPY_VERSION = '2026-10-02-v3';
export const SERVICE_MESSAGES_NOTICE_VERSION = '2026-10-02-v2';
export const REGISTRATION_TERMS_VERSION = '2026-09-29-v2';
export const PRIVACY_NOTICE_VERSION = '2026-10-02-v4';
export const FULL_REGISTRATION_POLICY_VERSION = '2026-09-27-v1';

type SignupPersistenceInput =
  | EarlyAccessInput
  | ProgressiveEarlyAccessInput
  | ImportEarlyAccessInput;

type PersistenceOptions = {
  imported?: boolean;
  importBatchId?: string;
  approvedForCount?: boolean;
  now?: Date;
};

export function resolveOrganizationCapabilityIntent(
  capabilities: readonly string[],
  fallback: 'WORK' | 'HIRE' | 'BOTH' | null,
) {
  const supplies = capabilities.includes('workforce-supply');
  const hires = capabilities.includes('hiring-demand');
  if (supplies && hires) return 'BOTH';
  if (supplies) return 'WORK';
  if (hires) return 'HIRE';
  // Payroll support is a capability, not a marketplace side. Keep the
  // registrant's explicit/default intent when payroll is selected by itself.
  return fallback;
}

function cleanText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

export function resolveSignupIntent(
  input: SignupPersistenceInput,
): 'WORK' | 'HIRE' | 'BOTH' | null {
  if (input.audienceType === 'WORKER') return 'WORK';
  if (input.audienceType !== 'HIRING_FIRM') return input.intent ?? null;

  const capabilities = input.organizationCapabilities ?? [];
  if (!capabilities.length) return input.intent ?? null;
  return resolveOrganizationCapabilityIntent(
    capabilities,
    input.intent ?? null,
  );
}

/**
 * Produces the non-secret waitlist row shared by public registration and CSV
 * import. Approximate location is persisted only after it reaches the editable
 * city/state form fields; raw IP data is neither accepted nor returned here.
 */
export function mapSignupToWaitlistRow(
  input: SignupPersistenceInput,
  options: PersistenceOptions = {},
) {
  const now = options.now ?? new Date();
  const imported = Boolean(options.imported);
  const emailConsent =
    !imported &&
    'emailMarketingConsent' in input &&
    input.emailMarketingConsent;
  const termsAccepted =
    !imported && 'termsAccepted' in input && input.termsAccepted;
  const privacyAcknowledged =
    !imported && 'privacyAcknowledged' in input && input.privacyAcknowledged;
  const serviceMessagesAcknowledged =
    !imported &&
    'serviceMessagesAcknowledged' in input &&
    input.serviceMessagesAcknowledged;
  const smsConsent = imported
    ? false
    : Boolean(input.mobile && input.smsConsent);

  return {
    audienceType: input.audienceType,
    intent: resolveSignupIntent(input),
    name: input.name,
    email: input.email,
    normalizedEmail: input.email.trim().toLowerCase(),
    mobile: cleanText(input.mobile),
    normalizedMobileE164: cleanText(input.mobile),
    city: input.city,
    state: input.state,
    zip: input.zip,
    primaryTradeSlug: input.primaryTradeSlug,
    secondaryTradeSlug: cleanText(input.secondaryTradeSlug),
    otherTrade: cleanText(input.otherTrade),
    referredByCode: cleanText(input.referredByCode)?.toUpperCase() ?? null,
    idempotencyKey: input.idempotencyKey,
    acquisitionSource: cleanText(input.acquisitionSource) ?? 'direct',
    landingPage: cleanText(input.landingPage),
    utmSource: cleanText(input.utmSource),
    utmMedium: cleanText(input.utmMedium),
    utmCampaign: cleanText(input.utmCampaign),
    utmContent: cleanText(input.utmContent),
    utmTerm: cleanText(input.utmTerm),
    promoCode: cleanText(input.promoCode),
    emailConsent,
    emailConsentAt: emailConsent ? now : null,
    smsConsent,
    smsConsentAt: smsConsent ? now : null,
    consentCopyVersion:
      emailConsent || smsConsent ? CONSENT_COPY_VERSION : null,
    serviceMessagesAcknowledgedAt: serviceMessagesAcknowledged ? now : null,
    serviceMessagesNoticeVersion: serviceMessagesAcknowledged
      ? SERVICE_MESSAGES_NOTICE_VERSION
      : null,
    termsAcceptedAt: termsAccepted ? now : null,
    termsVersion: termsAccepted ? REGISTRATION_TERMS_VERSION : null,
    privacyAcknowledgedAt: privacyAcknowledged ? now : null,
    privacyVersion: privacyAcknowledged ? PRIVACY_NOTICE_VERSION : null,
    imported,
    importBatchId: options.importBatchId ?? null,
    approvedForCount: options.approvedForCount ?? (imported ? false : true),
  };
}

/** Older required email acknowledgements must not become marketing permission. */
export function hasCurrentEmailMarketingConsent(record: {
  emailConsent: boolean;
  consentCopyVersion: string | null;
}) {
  return (
    record.emailConsent && record.consentCopyVersion === CONSENT_COPY_VERSION
  );
}
