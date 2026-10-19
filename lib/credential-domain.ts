import { z } from 'zod';

export const CREDENTIAL_KINDS = [
  'LICENSE',
  'CERTIFICATION',
  'CDL_CLASS',
  'ENDORSEMENT',
] as const;

export type CredentialKind = (typeof CREDENTIAL_KINDS)[number];

export const CREDENTIAL_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'NEEDS_INFORMATION',
  'VERIFIED',
  'REJECTED',
  'EXPIRED',
  'REVOKED',
  'WITHDRAWN',
] as const;

export type CredentialStatus = (typeof CREDENTIAL_STATUSES)[number];

export const CREDENTIAL_DECISION_TARGETS = [
  'UNDER_REVIEW',
  'NEEDS_INFORMATION',
  'VERIFIED',
  'REJECTED',
  'EXPIRED',
  'REVOKED',
] as const;

export type CredentialDecisionTarget =
  (typeof CREDENTIAL_DECISION_TARGETS)[number];

export const CREDENTIAL_EVIDENCE_SOURCE_TYPES = [
  'OFFICIAL_REGISTRY',
  'ISSUING_AUTHORITY',
  'EMPLOYER_RECORD',
  'OTHER_PUBLIC_SOURCE',
] as const;

const optionalShortText = z
  .string()
  .trim()
  .max(160)
  .optional()
  .transform((value) => value || undefined);

const optionalDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/u, 'Use a date in YYYY-MM-DD format.')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined);

export const credentialSubmissionSchema = z
  .object({
    idempotencyKey: z.uuid(),
    claimId: z.uuid().optional(),
    kind: z.enum(CREDENTIAL_KINDS),
    parentClaimId: z.uuid().optional(),
    tradeOrSpecialtySlug: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u),
    jurisdiction: optionalShortText,
    issuingAuthority: z.string().trim().min(2).max(160),
    credentialClass: optionalShortText,
    credentialName: z.string().trim().min(2).max(160),
    identifier: z
      .string()
      .trim()
      .max(160)
      .optional()
      .transform((value) => value || undefined),
    issuedOn: optionalDate,
    expiresOn: optionalDate,
    evidenceReference: z
      .url('Use a valid public-source URL.')
      .max(1_000)
      .refine((value) => value.startsWith('https://'), {
        message: 'Evidence references must use HTTPS.',
      }),
    evidenceSourceType: z.enum(CREDENTIAL_EVIDENCE_SOURCE_TYPES),
  })
  .superRefine((value, context) => {
    if (value.kind === 'ENDORSEMENT' && !value.parentClaimId) {
      context.addIssue({
        code: 'custom',
        path: ['parentClaimId'],
        message: 'Choose the license or CDL class this endorsement belongs to.',
      });
    }
    if (value.kind !== 'ENDORSEMENT' && value.parentClaimId) {
      context.addIssue({
        code: 'custom',
        path: ['parentClaimId'],
        message: 'Only endorsements may have a parent credential.',
      });
    }
    if (value.issuedOn && value.expiresOn && value.expiresOn < value.issuedOn) {
      context.addIssue({
        code: 'custom',
        path: ['expiresOn'],
        message: 'Expiration date cannot be before the issue date.',
      });
    }
  });

export type CredentialSubmissionInput = z.infer<
  typeof credentialSubmissionSchema
>;

export const credentialDecisionSchema = z.object({
  idempotencyKey: z.uuid(),
  expectedRevisionNumber: z.number().int().positive(),
  toStatus: z.enum(CREDENTIAL_DECISION_TARGETS),
  reason: z.string().trim().min(5).max(1_000),
  internalNotes: z
    .string()
    .trim()
    .max(4_000)
    .optional()
    .transform((value) => value || undefined),
});

export type CredentialDecisionInput = z.infer<typeof credentialDecisionSchema>;

const PARTICIPANT_REVISION_STATUSES: ReadonlySet<CredentialStatus> = new Set([
  'DRAFT',
  'NEEDS_INFORMATION',
  'VERIFIED',
  'REJECTED',
  'EXPIRED',
  'REVOKED',
]);

const ADMIN_TRANSITIONS: Record<
  CredentialStatus,
  ReadonlySet<CredentialDecisionTarget>
> = {
  DRAFT: new Set(),
  SUBMITTED: new Set([
    'UNDER_REVIEW',
    'NEEDS_INFORMATION',
    'VERIFIED',
    'REJECTED',
  ]),
  UNDER_REVIEW: new Set(['NEEDS_INFORMATION', 'VERIFIED', 'REJECTED']),
  NEEDS_INFORMATION: new Set(['REJECTED']),
  VERIFIED: new Set(['EXPIRED', 'REVOKED']),
  REJECTED: new Set(),
  EXPIRED: new Set(['REVOKED']),
  REVOKED: new Set(),
  WITHDRAWN: new Set(),
};

export function canSubmitCredentialRevision(status: CredentialStatus) {
  return PARTICIPANT_REVISION_STATUSES.has(status);
}

export function nextCredentialRevisionNumber(
  currentRevisionNumber: number,
  hasCurrentRevision: boolean,
) {
  if (!Number.isInteger(currentRevisionNumber) || currentRevisionNumber < 1) {
    throw new Error('Current revision number must be a positive integer.');
  }
  return hasCurrentRevision ? currentRevisionNumber + 1 : currentRevisionNumber;
}

export function canAdminDecideCredential(
  from: CredentialStatus,
  to: CredentialDecisionTarget,
) {
  return ADMIN_TRANSITIONS[from].has(to);
}

export function credentialKindLabel(kind: CredentialKind) {
  const labels: Record<CredentialKind, string> = {
    LICENSE: 'Professional license',
    CERTIFICATION: 'Certification',
    CDL_CLASS: 'CDL class',
    ENDORSEMENT: 'Endorsement',
  };
  return labels[kind];
}

export function credentialStatusLabel(status: CredentialStatus) {
  const labels: Record<CredentialStatus, string> = {
    DRAFT: 'Draft: details required',
    SUBMITTED: 'Submitted',
    UNDER_REVIEW: 'Under review',
    NEEDS_INFORMATION: 'Needs information',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected',
    EXPIRED: 'Expired',
    REVOKED: 'Revoked',
    WITHDRAWN: 'Withdrawn',
  };
  return labels[status];
}

export function maskCredentialIdentifier(lastFour: string | null | undefined) {
  return lastFour ? `•••• ${lastFour}` : 'Not supplied';
}

export function normalizeCredentialIdentifier(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/gu, '');
}
