import { z } from 'zod';

export const AWARD_RECONCILIATION_KINDS = ['FOUNDING_100'] as const;

export type AwardReconciliationKind =
  (typeof AWARD_RECONCILIATION_KINDS)[number];

export const AWARD_RECONCILIATION_MODES = ['DRY_RUN', 'APPLY'] as const;
export type AwardReconciliationMode =
  (typeof AWARD_RECONCILIATION_MODES)[number];

export const FOUNDING_PUBLIC_STATES = [
  'AWARDED',
  'FULL',
  'WAITING',
  'SUSPENDED',
  'FEATURE_DISABLED',
  'NOT_METRO',
  'INELIGIBLE',
] as const;

export type FoundingPublicState = (typeof FOUNDING_PUBLIC_STATES)[number];

export const awardReconciliationDryRunSchema = z.object({
  action: z.literal('DRY_RUN'),
  kind: z.enum(AWARD_RECONCILIATION_KINDS),
  scopeId: z.uuid(),
  idempotencyKey: z.string().trim().min(8).max(160),
});

export const awardReconciliationApplySchema = z.object({
  action: z.literal('APPLY'),
  dryRunId: z.uuid(),
  confirmation: z.string().trim().max(80),
  idempotencyKey: z.string().trim().min(8).max(160),
});

export const awardReconciliationCommandSchema = z.discriminatedUnion('action', [
  awardReconciliationDryRunSchema,
  awardReconciliationApplySchema,
]);

export function reconciliationConfirmation(kind: AwardReconciliationKind) {
  return kind === 'FOUNDING_100' ? 'APPLY FOUNDING 100' : '';
}

export function confirmationMatches(
  kind: AwardReconciliationKind,
  confirmation: string,
) {
  return confirmation.trim() === reconciliationConfirmation(kind);
}

type SharedEligibility = Readonly<{
  status: string;
  canonicalMarketId: string | null;
  primaryTradeSlug: string | null;
  firstSubmittedAt: Date;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  fullyVerifiedAt: Date | null;
  fullRegistrationCompletedAt: Date | null;
  termsAcceptedAt: Date | null;
  privacyAcknowledgedAt: Date | null;
  imported: boolean;
  importApprovedAt: Date | null;
  isTest: boolean;
  isSpam: boolean;
  isDuplicate: boolean;
  isFraudulent: boolean;
  deletedAt: Date | null;
}>;

export type FoundingReconciliationEvaluation =
  | 'EXISTING_AWARDED'
  | 'ELIGIBLE_AWARD'
  | 'ELIGIBLE_REINSTATEMENT'
  | 'FULL'
  | 'REVOKED_REQUIRES_MANUAL_REVIEW'
  | 'NOT_METRO'
  | 'EMAIL_NOT_VERIFIED'
  | 'PHONE_NOT_VERIFIED'
  | 'FULLY_VERIFIED_AT_MISSING'
  | 'FULL_REGISTRATION_REQUIRED'
  | 'TERMS_NOT_ACCEPTED'
  | 'PRIVACY_NOT_ACKNOWLEDGED'
  | 'TRADE_MISSING'
  | 'INVALID_LIFECYCLE'
  | 'TEST_RECORD'
  | 'SPAM_RECORD'
  | 'DUPLICATE_RECORD'
  | 'FRAUDULENT_RECORD'
  | 'DELETED_RECORD'
  | 'IMPORT_NOT_APPROVED'
  | 'ALLOCATION_MARKET_CHANGED_REQUIRES_MANUAL_REVIEW';

export function evaluateFoundingReconciliationCandidate(
  record: SharedEligibility & {
    marketKind: string | null;
    allocationStatus: 'AWARDED' | 'SUSPENDED' | 'REVOKED' | null;
    allocationMarketId: string | null;
    projectedOrdinal: number | null;
    capacity: number;
  },
): FoundingReconciliationEvaluation {
  if (record.allocationStatus === 'AWARDED') return 'EXISTING_AWARDED';
  if (record.allocationStatus === 'REVOKED') {
    return 'REVOKED_REQUIRES_MANUAL_REVIEW';
  }
  if (
    record.allocationStatus === 'SUSPENDED' &&
    record.allocationMarketId !== record.canonicalMarketId
  ) {
    return 'ALLOCATION_MARKET_CHANGED_REQUIRES_MANUAL_REVIEW';
  }
  if (!record.canonicalMarketId || record.marketKind !== 'METRO') {
    return 'NOT_METRO';
  }
  if (!record.emailVerifiedAt) return 'EMAIL_NOT_VERIFIED';
  if (!record.phoneVerifiedAt) return 'PHONE_NOT_VERIFIED';
  if (!record.fullyVerifiedAt) return 'FULLY_VERIFIED_AT_MISSING';
  if (!record.allocationStatus && !record.fullRegistrationCompletedAt) {
    return 'FULL_REGISTRATION_REQUIRED';
  }
  if (!record.termsAcceptedAt) return 'TERMS_NOT_ACCEPTED';
  if (!record.privacyAcknowledgedAt) return 'PRIVACY_NOT_ACKNOWLEDGED';
  if (!record.primaryTradeSlug) return 'TRADE_MISSING';
  if (record.isTest) return 'TEST_RECORD';
  if (record.isSpam) return 'SPAM_RECORD';
  if (record.isDuplicate) return 'DUPLICATE_RECORD';
  if (record.isFraudulent) return 'FRAUDULENT_RECORD';
  if (record.deletedAt) return 'DELETED_RECORD';
  if (record.imported && !record.importApprovedAt) {
    return 'IMPORT_NOT_APPROVED';
  }
  if (
    !['FULLY_CONTACT_VERIFIED', 'LAUNCH_INVITED', 'ACTIVATED'].includes(
      record.status,
    )
  ) {
    return 'INVALID_LIFECYCLE';
  }
  if (record.allocationStatus === 'SUSPENDED') {
    return 'ELIGIBLE_REINSTATEMENT';
  }
  if (
    record.projectedOrdinal === null ||
    record.projectedOrdinal > record.capacity
  ) {
    return 'FULL';
  }
  return 'ELIGIBLE_AWARD';
}

export type FoundingEvaluationView = Readonly<{
  state: FoundingPublicState;
  reasonCode: string;
  marketName: string | null;
  ordinal: number | null;
}>;

export function foundingEvaluationCopy(evaluation: FoundingEvaluationView) {
  const market = evaluation.marketName || 'your confirmed market';
  switch (evaluation.state) {
    case 'AWARDED':
      return {
        eyebrow: 'Founding 100 awarded',
        heading: evaluation.ordinal
          ? `${market} Founding participant #${evaluation.ordinal}`
          : `${market} Founding 100 participant`,
        body: 'Your place is recorded. Founding recognition is separate from license verification, launch-benefit eligibility, equity, or guaranteed work.',
      };
    case 'FULL':
      return {
        eyebrow: 'Founding 100 status',
        heading: `${market} has filled its first 100 positions`,
        body: 'Your verified registration still keeps its launch benefits and market notifications. Founding 100 is recognition only.',
      };
    case 'WAITING':
      return {
        eyebrow: 'Founding 100 evaluation',
        heading: 'Your place is being evaluated in verified order',
        body: `LaborTrader is reviewing qualifying participant accounts in ${market}. A position is awarded only after the full role-specific registration and both email and phone verification are complete.`,
      };
    case 'SUSPENDED':
      return {
        eyebrow: 'Founding 100 status',
        heading: 'Recognition is temporarily paused',
        body: 'Complete any requested contact re-verification. A valid reinstatement restores the same historical place; it does not create a new ordinal.',
      };
    case 'FEATURE_DISABLED':
      return {
        eyebrow: 'Founding 100 evaluation',
        heading: 'Founding allocation is not open yet',
        body: 'Your verified registration remains saved. LaborTrader will evaluate eligible registrations in their original verified order when this program is operationally enabled.',
      };
    case 'NOT_METRO':
      return {
        eyebrow: 'Founding 100 market scope',
        heading: 'A qualifying local market is still required',
        body: 'Your registration is saved. Founding 100 is allocated by supported local market, so this registration cannot be evaluated until it is assigned to one. This does not affect other launch benefits.',
      };
    case 'INELIGIBLE':
      if (evaluation.reasonCode === 'FULL_REGISTRATION_REQUIRED') {
        return {
          eyebrow: 'Founding 100 eligibility',
          heading: 'Complete your full registration to qualify',
          body: 'Your basic registration and launch-benefit eligibility remain saved. Complete the role-specific participant profile and verify both email and phone to be considered for Founding 100.',
        };
      }
      return {
        eyebrow: 'Founding 100 eligibility',
        heading: 'More verification is required',
        body: 'Founding 100 requires a complete role-specific participant registration, current email and phone verification, and a qualifying local market position. Your other registration benefits remain separate.',
      };
  }
}
