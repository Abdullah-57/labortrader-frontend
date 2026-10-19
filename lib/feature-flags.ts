import 'server-only';

export type FeatureFlag =
  | 'EMAIL_DELIVERY'
  | 'SMS_OTP'
  | 'SMS_OPPORTUNITY_ALERTS'
  | 'PUBLIC_COUNTERS'
  | 'FOUNDING_ALLOCATION'
  | 'REFERRALS'
  | 'MARKETPLACE_ACTIVATION';

const ENV_KEYS: Record<FeatureFlag, string> = {
  EMAIL_DELIVERY: 'FEATURE_EMAIL_DELIVERY',
  SMS_OTP: 'FEATURE_SMS_OTP',
  SMS_OPPORTUNITY_ALERTS: 'FEATURE_SMS_OPPORTUNITY_ALERTS',
  PUBLIC_COUNTERS: 'FEATURE_PUBLIC_COUNTERS',
  FOUNDING_ALLOCATION: 'FEATURE_FOUNDING_ALLOCATION',
  REFERRALS: 'FEATURE_REFERRALS',
  MARKETPLACE_ACTIVATION: 'FEATURE_MARKETPLACE_ACTIVATION',
};

export function featureEnabled(
  flag: FeatureFlag,
  environment: NodeJS.ProcessEnv = process.env,
) {
  return environment[ENV_KEYS[flag]]?.trim().toLowerCase() === 'true';
}

export function publicFeatureConfiguration(
  environment: NodeJS.ProcessEnv = process.env,
) {
  return {
    publicCounters: featureEnabled('PUBLIC_COUNTERS', environment),
    foundingAllocation: featureEnabled('FOUNDING_ALLOCATION', environment),
    referrals: featureEnabled('REFERRALS', environment),
  };
}
