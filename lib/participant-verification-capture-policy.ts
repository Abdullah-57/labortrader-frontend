import { isMessagingMockMode } from '@/lib/messaging-delivery-mode';

/**
 * Captures verification links/OTP codes for /dev/participant-verification.
 * Always on in mock runtimes (local/dev/preview). Never on Vercel production.
 */
export function participantVerificationCaptureEnabled(
  environment: Pick<NodeJS.ProcessEnv, 'NODE_ENV'> &
    Record<string, string | undefined> = process.env,
) {
  return isMessagingMockMode(environment);
}
