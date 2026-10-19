import {
  participantRoleByAudienceType,
  type PublicAudienceType,
} from './constants';

export const PROGRAM_CODES = {
  base: 'BASE_MARKETPLACE_ACCESS',
  launchBenefit: 'LAUNCH_BENEFIT_90D',
  founding100: 'FOUNDING_100_RECOGNITION',
  referralBonus: 'REFERRAL_BONUS_10D',
  legacyContractorWaiver: 'FOUNDING_12_MONTH_PLATFORM_FEE_WAIVER',
} as const;

export const LAUNCH_BENEFIT_POLICY_VERSION = 'LAUNCH_BENEFIT_2026_10_V1';
export const REFERRAL_BONUS_POLICY_VERSION = 'VERIFIED_REFERRAL_10D_V3';
export const LAUNCH_BENEFIT_BASE_DAYS = 90;
export const REFERRAL_BONUS_DAYS = 10;
export const JOB_POSTING_FEE_CENTS = 1_000;
export const MONTHLY_MEMBERSHIP_FEE_CENTS = 0;

export const FOUNDING_100_CAPACITY = 100;

export type AudienceType = PublicAudienceType;

export type LegacyBillingClass =
  | 'WORKER'
  | 'INDEPENDENT_CONTRACTOR'
  | 'INDIVIDUAL'
  | 'SERVICE_BUSINESS'
  | 'HIRING_ORGANIZATION';

export function billingClassForAudience(
  audience: AudienceType,
): LegacyBillingClass {
  switch (audience) {
    case 'WORKER':
      return 'WORKER';
    case 'CONTRACTOR':
      return 'INDEPENDENT_CONTRACTOR';
    case 'BUSINESS':
      return 'SERVICE_BUSINESS';
    case 'HIRING_FIRM':
      return 'HIRING_ORGANIZATION';
  }
}

export function identityKindForAudience(
  audience: AudienceType,
): 'PERSON' | 'ORGANIZATION' {
  return audience === 'WORKER' || audience === 'CONTRACTOR'
    ? 'PERSON'
    : 'ORGANIZATION';
}

export function launchBenefitCapCents(
  audience: AudienceType | 'CLIENT',
): number {
  if (audience === 'CLIENT') return 50_000;
  const role = participantRoleByAudienceType(audience);
  if (!role) throw new Error(`Unsupported participant audience: ${audience}`);
  return role.launchBenefitCapCents;
}

export type VerificationTimestamps = Readonly<{
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  fullyVerifiedAt: Date | null;
}>;

/**
 * Sets fullyVerifiedAt only the first time both current primary contacts are
 * verified. Reverification after a contact change must not rewrite it.
 */
export function deriveVerificationTimestamps(
  current: VerificationTimestamps,
  change:
    | { kind: 'EMAIL_VERIFIED'; at: Date }
    | { kind: 'PHONE_VERIFIED'; at: Date }
    | { kind: 'EMAIL_INVALIDATED' }
    | { kind: 'PHONE_INVALIDATED' },
): VerificationTimestamps {
  const next = { ...current };

  if (change.kind === 'EMAIL_VERIFIED') next.emailVerifiedAt = change.at;
  if (change.kind === 'PHONE_VERIFIED') next.phoneVerifiedAt = change.at;
  if (change.kind === 'EMAIL_INVALIDATED') next.emailVerifiedAt = null;
  if (change.kind === 'PHONE_INVALIDATED') next.phoneVerifiedAt = null;

  if (!next.fullyVerifiedAt && next.emailVerifiedAt && next.phoneVerifiedAt) {
    next.fullyVerifiedAt = new Date(
      Math.max(next.emailVerifiedAt.valueOf(), next.phoneVerifiedAt.valueOf()),
    );
  }

  return next;
}

export type EligibilityRecord = Readonly<{
  status: string;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  fullyVerifiedAt: Date | null;
  primaryAudienceType: AudienceType | null;
  canonicalMarketId: string | null;
  primaryTradeSlug: string | null;
  firstSubmittedAt: Date;
  termsAcceptedAt: Date | null;
  imported: boolean;
  importApprovedAt: Date | null;
  isTest: boolean;
  isSpam: boolean;
  isDuplicate: boolean;
  isFraudulent: boolean;
  deletedAt: Date | null;
}>;

/** Basic + verified members count publicly; email confirmation is not required. */
const PUBLIC_COUNTER_STATUSES = new Set([
  'PENDING_EMAIL_VERIFICATION',
  'EMAIL_VERIFIED',
  'PENDING_PHONE_VERIFICATION',
  'FULLY_CONTACT_VERIFIED',
  'LAUNCH_INVITED',
  'ACTIVATED',
]);

/** Contact-verified statuses used by Founding and similar post-verify programs. */
const PUBLIC_VERIFIED_STATUSES = new Set([
  'EMAIL_VERIFIED',
  'PENDING_PHONE_VERIFICATION',
  'FULLY_CONTACT_VERIFIED',
  'LAUNCH_INVITED',
  'ACTIVATED',
]);

export function isCleanEligibleMember(record: EligibilityRecord): boolean {
  return (
    !record.isTest &&
    !record.isSpam &&
    !record.isDuplicate &&
    !record.isFraudulent &&
    !record.deletedAt &&
    (!record.imported || Boolean(record.importApprovedAt))
  );
}

export function isPublicCounterEligible(record: EligibilityRecord): boolean {
  return (
    isCleanEligibleMember(record) &&
    PUBLIC_COUNTER_STATUSES.has(record.status) &&
    Boolean(record.primaryAudienceType) &&
    Boolean(record.canonicalMarketId)
  );
}

export function isEarlyRegistrationEligible(
  record: EligibilityRecord,
  immutableCutoffAt: Date | null,
): boolean {
  return (
    Boolean(immutableCutoffAt) &&
    isCleanEligibleMember(record) &&
    Boolean(record.emailVerifiedAt) &&
    Boolean(record.primaryAudienceType) &&
    Boolean(record.primaryTradeSlug) &&
    Boolean(record.canonicalMarketId) &&
    Boolean(record.termsAcceptedAt) &&
    record.firstSubmittedAt < immutableCutoffAt! &&
    record.emailVerifiedAt! < immutableCutoffAt!
  );
}

export function isFoundingEligible(record: EligibilityRecord): boolean {
  return (
    isCleanEligibleMember(record) &&
    PUBLIC_VERIFIED_STATUSES.has(record.status) &&
    Boolean(record.emailVerifiedAt) &&
    Boolean(record.phoneVerifiedAt) &&
    Boolean(record.fullyVerifiedAt) &&
    Boolean(record.primaryAudienceType) &&
    Boolean(record.canonicalMarketId)
  );
}

export type FoundingAllocationPlan =
  | { outcome: 'INELIGIBLE'; ordinal: null; nextOrdinal: number }
  | { outcome: 'FULL'; ordinal: null; nextOrdinal: 101 }
  | { outcome: 'EXISTING'; ordinal: number; nextOrdinal: number }
  | { outcome: 'AWARDED'; ordinal: number; nextOrdinal: number };

/**
 * Pure mirror of the database allocator. The database function performs this
 * decision while holding the cohort row FOR UPDATE.
 */
export function planFoundingAllocation(input: {
  eligible: boolean;
  existingOrdinal: number | null;
  nextOrdinal: number;
}): FoundingAllocationPlan {
  if (input.existingOrdinal !== null) {
    return {
      outcome: 'EXISTING',
      ordinal: input.existingOrdinal,
      nextOrdinal: input.nextOrdinal,
    };
  }
  if (!input.eligible) {
    return {
      outcome: 'INELIGIBLE',
      ordinal: null,
      nextOrdinal: input.nextOrdinal,
    };
  }
  if (input.nextOrdinal > FOUNDING_100_CAPACITY) {
    return { outcome: 'FULL', ordinal: null, nextOrdinal: 101 };
  }

  return {
    outcome: 'AWARDED',
    ordinal: input.nextOrdinal,
    nextOrdinal: input.nextOrdinal + 1,
  };
}

export type ReferralBeneficiarySnapshot = Readonly<{
  memberId: string;
  audienceType: AudienceType;
}>;

export type ReferralRewardPlan = Readonly<{
  side: 'REFERRER';
  memberId: string;
  status: 'AWARDED';
  daysAwarded: 10;
  capIncreaseCents: 0;
  billingClass: LegacyBillingClass;
  idempotencyKey: string;
}>;

export function planReferralOwnerReward(input: {
  referralId: string;
  referrer: ReferralBeneficiarySnapshot;
}): ReferralRewardPlan {
  return {
    side: 'REFERRER',
    memberId: input.referrer.memberId,
    status: 'AWARDED',
    daysAwarded: REFERRAL_BONUS_DAYS,
    capIncreaseCents: 0,
    billingClass: billingClassForAudience(input.referrer.audienceType),
    idempotencyKey: `referral:${input.referralId}:owner:10-days:v3`,
  };
}

/** Adds calendar months in UTC and clamps dates such as January 31 safely. */
export function addCalendarMonthsClamped(date: Date, months: number): Date {
  if (!Number.isInteger(months) || months < 0) {
    throw new Error('Calendar month count must be a non-negative integer.');
  }

  const targetMonthIndex = date.getUTCMonth() + months;
  const targetYear = date.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDay = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0),
  ).getUTCDate();
  const targetDay = Math.min(date.getUTCDate(), lastDay);

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      targetDay,
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  );
}

export type LaunchBenefitWindow = Readonly<{
  id: string;
  status:
    | 'RESERVED'
    | 'SCHEDULED'
    | 'ACTIVE'
    | 'EXHAUSTED'
    | 'EXPIRED'
    | 'REVOKED';
  startsAt: Date | null;
  endsAt: Date | null;
}>;

export function entitlementActivationStart(input: {
  authorizedMarketLiveAt: Date | null;
  marketplaceAccountActivatedAt: Date | null;
}): Date | null {
  if (!input.authorizedMarketLiveAt || !input.marketplaceAccountActivatedAt) {
    return null;
  }

  return new Date(
    Math.max(
      input.authorizedMarketLiveAt.valueOf(),
      input.marketplaceAccountActivatedAt.valueOf(),
    ),
  );
}

export function scheduleLaunchBenefit(input: {
  readyAt: Date;
  referralBonusDays: number;
}): {
  startsAt: Date;
  endsAt: Date;
} {
  if (
    !Number.isSafeInteger(input.referralBonusDays) ||
    input.referralBonusDays < 0 ||
    input.referralBonusDays % REFERRAL_BONUS_DAYS !== 0
  ) {
    throw new Error('Referral days must be a non-negative multiple of ten.');
  }
  const startsAt = new Date(input.readyAt);
  const endsAt = new Date(
    startsAt.valueOf() +
      (LAUNCH_BENEFIT_BASE_DAYS + input.referralBonusDays) * 86_400_000,
  );
  return { startsAt, endsAt };
}

export function isLaunchBenefitActive(
  grants: readonly LaunchBenefitWindow[],
  at = new Date(),
): boolean {
  return grants.some(
    (grant) =>
      grant.status === 'ACTIVE' &&
      grant.startsAt !== null &&
      grant.endsAt !== null &&
      grant.startsAt <= at &&
      at < grant.endsAt,
  );
}

export const V1_ACTIVATION_EVENT_VERSION = 1;

export type MarketplaceActivationEventV1 = Readonly<{
  version: typeof V1_ACTIVATION_EVENT_VERSION;
  source: string;
  correlationId: string;
  idempotencyKey: string;
  memberId: string;
  marketplaceAccountId: string;
  activatedAt: string;
  issuedAt: string;
  signatureAlgorithm: 'HMAC-SHA256';
  signatureKeyId: string;
  signature: string;
}>;

/** Stable field order for the future signed V1 webhook adapter. */
export function activationEventSigningPayload(
  event: Omit<MarketplaceActivationEventV1, 'signature'>,
): string {
  return JSON.stringify({
    version: event.version,
    source: event.source,
    correlationId: event.correlationId,
    idempotencyKey: event.idempotencyKey,
    memberId: event.memberId,
    marketplaceAccountId: event.marketplaceAccountId,
    activatedAt: event.activatedAt,
    issuedAt: event.issuedAt,
    signatureAlgorithm: event.signatureAlgorithm,
    signatureKeyId: event.signatureKeyId,
  });
}

export function isActivationEventStructurallyValid(
  event: MarketplaceActivationEventV1,
): boolean {
  if (!event || typeof event !== 'object') return false;
  const activatedAt = new Date(event.activatedAt);
  const issuedAt = new Date(event.issuedAt);

  return (
    event.version === V1_ACTIVATION_EVENT_VERSION &&
    event.signatureAlgorithm === 'HMAC-SHA256' &&
    [
      event.source,
      event.correlationId,
      event.idempotencyKey,
      event.memberId,
      event.marketplaceAccountId,
      event.signatureKeyId,
      event.signature,
    ].every((value) => typeof value === 'string' && value.trim().length > 0) &&
    !Number.isNaN(activatedAt.valueOf()) &&
    !Number.isNaN(issuedAt.valueOf())
  );
}

export type RoleTotals = Readonly<{
  worker: number;
  contractor: number;
  serviceBusiness: number;
  hiringOrganization: number;
}>;

export function reconcileRoleTotals(roleTotals: RoleTotals): number {
  const values = Object.values(roleTotals);
  if (values.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new Error('Public counter values must be non-negative integers.');
  }
  return values.reduce((sum, value) => sum + value, 0);
}

export type PublicCountSnapshot = Readonly<{
  counts: Readonly<{ total: number; roleTotals: RoleTotals }>;
  marketsRepresented: number;
  verifiedThisWeek: number | null;
  smallCellSuppressed: boolean;
}>;

/**
 * Keeps aggregate and zero counts exact while marking positive role cells below
 * the public threshold for masking by the renderer.
 */
export function buildPublicCountSnapshot(
  input: Readonly<{
    total: number;
    roleTotals: RoleTotals;
    marketsRepresented: number;
    verifiedThisWeek: number;
  }>,
  minimumCellCount: number,
): PublicCountSnapshot {
  const reconciledTotal = reconcileRoleTotals(input.roleTotals);

  const aggregateValues = [
    input.total,
    input.marketsRepresented,
    input.verifiedThisWeek,
  ];
  if (
    aggregateValues.some(
      (value) => !Number.isSafeInteger(value) || value < 0,
    ) ||
    !Number.isSafeInteger(minimumCellCount) ||
    minimumCellCount < 1
  ) {
    throw new Error(
      'Public counter values and thresholds must be non-negative integers.',
    );
  }

  if (input.total !== reconciledTotal) {
    throw new Error('Public counter role totals must reconcile to the total.');
  }

  if (input.marketsRepresented > input.total) {
    throw new Error(
      'Public counter market totals cannot exceed the registration total.',
    );
  }

  if (input.verifiedThisWeek > input.total) {
    throw new Error(
      'Public counter weekly totals cannot exceed the registration total.',
    );
  }

  return {
    counts: {
      total: input.total,
      roleTotals: input.roleTotals,
    },
    marketsRepresented: input.marketsRepresented,
    verifiedThisWeek:
      input.verifiedThisWeek >= minimumCellCount
        ? input.verifiedThisWeek
        : null,
    smallCellSuppressed: Object.values(input.roleTotals).some(
      (value) => value > 0 && value < minimumCellCount,
    ),
  };
}
