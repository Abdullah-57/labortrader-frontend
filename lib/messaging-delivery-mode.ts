/**
 * Mock vs live messaging is driven only by runtime environment — not feature
 * flags. Development/test and Vercel Preview never send Twilio/Loops traffic.
 * Hosted production always uses live providers (credentials still required).
 *
 * Next.js sets NODE_ENV=development for `npm run dev` (not "dev").
 * Vercel Preview builds use NODE_ENV=production but VERCEL_ENV=preview — mock.
 */

export type MessagingDeliveryMode = 'mock' | 'live';

function normalizedNodeEnv(environment: NodeJS.ProcessEnv) {
  return environment.NODE_ENV?.trim().toLowerCase() || '';
}

function vercelEnv(environment: NodeJS.ProcessEnv) {
  return environment.VERCEL_ENV?.trim().toLowerCase() || '';
}

/** Public production only — never Preview/dev. */
export function isHostedProductionRuntime(
  environment: NodeJS.ProcessEnv = process.env,
) {
  return vercelEnv(environment) === 'production';
}

/** Local `next dev`, unit tests, or Vercel Preview. */
export function isMessagingMockRuntime(
  environment: NodeJS.ProcessEnv = process.env,
) {
  if (isHostedProductionRuntime(environment)) return false;
  const nodeEnv = normalizedNodeEnv(environment);
  const ve = vercelEnv(environment);
  if (ve === 'preview' || ve === 'development') return true;
  if (nodeEnv === 'development' || nodeEnv === 'dev' || nodeEnv === 'test') {
    return true;
  }
  // Non-Vercel non-production hosts (local production builds) stay mock-safe.
  if (!environment.VERCEL && nodeEnv !== 'production') return true;
  // Vercel without VERCEL_ENV is treated as non-production → mock.
  if (environment.VERCEL && ve !== 'production') return true;
  return false;
}

export function resolveMessagingDeliveryMode(
  environment: NodeJS.ProcessEnv = process.env,
): MessagingDeliveryMode {
  return isMessagingMockRuntime(environment) ? 'mock' : 'live';
}

export function isMessagingMockMode(
  environment: NodeJS.ProcessEnv = process.env,
) {
  return resolveMessagingDeliveryMode(environment) === 'mock';
}

/**
 * Live Loops dispatch. Production kill-switch FEATURE_EMAIL_DELIVERY still
 * applies; mock runtimes (local/preview) never send — use
 * /dev/participant-verification instead.
 */
export function liveEmailDeliveryEnabled(
  environment: NodeJS.ProcessEnv = process.env,
) {
  if (isMessagingMockMode(environment)) return false;
  return environment.FEATURE_EMAIL_DELIVERY?.trim().toLowerCase() === 'true';
}

/**
 * Live Twilio Verify. Production kill-switch FEATURE_SMS_OTP still applies;
 * mock runtimes never call Twilio.
 */
export function liveSmsOtpEnabled(
  environment: NodeJS.ProcessEnv = process.env,
) {
  if (isMessagingMockMode(environment)) return false;
  return environment.FEATURE_SMS_OTP?.trim().toLowerCase() === 'true';
}

/** OTP request budgets: generous in mock, strict (but usable) in production. */
export function otpRequestRateBudget(
  environment: NodeJS.ProcessEnv = process.env,
) {
  if (isMessagingMockMode(environment)) {
    return { limit: 40, windowMs: 60 * 60_000 };
  }
  // 3 codes / hour / client fingerprint — enough for typos, not SMS pumping.
  return { limit: 3, windowMs: 60 * 60_000 };
}
