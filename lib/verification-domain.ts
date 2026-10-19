/**
 * Normalizes a United States phone number to E.164 without assuming that
 * providing a number grants SMS marketing consent.
 */
export function normalizeUsPhoneToE164(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/(?:ext\.?|x)\s*\d+$/iu.test(trimmed)) return null;

  const digits = trimmed.replace(/\D/gu, '');

  // Explicit +country form must be exactly +1 and 10 subscriber digits.
  if (trimmed.startsWith('+')) {
    if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
    return null;
  }

  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;

  return null;
}

export type VerificationChallengeState =
  | 'PENDING'
  | 'CONSUMED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'FAILED';

export function getVerificationChallengeState(input: {
  status: VerificationChallengeState;
  expiresAt: Date;
  attemptCount: number;
  maxAttempts: number;
  now?: Date;
}): VerificationChallengeState {
  if (input.status !== 'PENDING') return input.status;
  if (input.attemptCount >= input.maxAttempts) return 'FAILED';
  if (input.expiresAt <= (input.now ?? new Date())) return 'EXPIRED';
  return 'PENDING';
}

export function canConsumeVerificationChallenge(input: {
  status: VerificationChallengeState;
  expiresAt: Date;
  attemptCount: number;
  maxAttempts: number;
  now?: Date;
}): boolean {
  return getVerificationChallengeState(input) === 'PENDING';
}
