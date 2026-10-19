export type NotificationOutboxStatus =
  | 'ACCEPTED'
  | 'PENDING'
  | 'PROCESSING'
  | 'DELIVERED'
  | 'FAILED'
  | 'DEAD_LETTER'
  | 'SUPPRESSED';

const OUTBOX_TRANSITIONS: Record<
  NotificationOutboxStatus,
  ReadonlySet<NotificationOutboxStatus>
> = {
  ACCEPTED: new Set(['DELIVERED', 'FAILED', 'SUPPRESSED']),
  // ACCEPTED is allowed for Twilio Verify OTP side-channel reconciliation
  // (SMS is not drained by the Loops email worker).
  // FAILED covers Twilio Verify start rejection before Loops ever claims the row.
  PENDING: new Set([
    'PROCESSING',
    'ACCEPTED',
    'FAILED',
    'DEAD_LETTER',
    'SUPPRESSED',
  ]),
  PROCESSING: new Set([
    'ACCEPTED',
    'DELIVERED',
    'FAILED',
    'DEAD_LETTER',
    'SUPPRESSED',
  ]),
  DELIVERED: new Set(),
  FAILED: new Set(['PROCESSING', 'DEAD_LETTER', 'SUPPRESSED']),
  DEAD_LETTER: new Set(['PENDING', 'SUPPRESSED']),
  SUPPRESSED: new Set(),
};

export function canTransitionNotification(
  from: NotificationOutboxStatus,
  to: NotificationOutboxStatus,
): boolean {
  return OUTBOX_TRANSITIONS[from].has(to);
}

/**
 * All inputs must be opaque database/domain identifiers. Never pass an email,
 * phone number, token, or message body into a deduplication key.
 */
export function buildNotificationDeduplicationKey(input: {
  businessEventId: string;
  channel: 'EMAIL' | 'SMS' | 'INTERNAL_EMAIL' | 'WEBHOOK';
  templateKey: string;
  recipientReference: string;
}): string {
  const parts = [
    'notify:v1',
    input.businessEventId,
    input.channel,
    input.templateKey,
    input.recipientReference,
  ];

  if (parts.some((part) => !part || /[\r\n]/u.test(part))) {
    throw new Error('Notification deduplication inputs must be non-empty.');
  }

  return parts.join(':');
}

export function notificationRetryDelayMs(
  attemptCount: number,
  baseDelayMs = 30_000,
  maximumDelayMs = 60 * 60 * 1_000,
): number {
  if (!Number.isInteger(attemptCount) || attemptCount < 1) {
    throw new Error('Attempt count must be a positive integer.');
  }

  return Math.min(maximumDelayMs, baseDelayMs * 2 ** (attemptCount - 1));
}

export function nextNotificationFailureState(input: {
  attemptCount: number;
  maxAttempts: number;
}): 'FAILED' | 'DEAD_LETTER' {
  return input.attemptCount >= input.maxAttempts ? 'DEAD_LETTER' : 'FAILED';
}
