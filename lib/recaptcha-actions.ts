/** Public intake and resend actions share one browser/server contract. */
export const RECAPTCHA_ACTIONS = {
  '/api/launch-interest': 'launch_signup',
  '/api/early-access': 'participant_signup',
  '/api/client-preregistrations': 'client_signup',
  '/api/inquiries/partners': 'partner_inquiry',
  '/api/inquiries/investors': 'investor_inquiry',
  '/api/pro-shop/partners': 'vendor_application',
  '/api/verification/email/request': 'email_access',
  '/api/verification/intake/request': 'intake_email_access',
  '/api/verification/intake/phone/request': 'phone_verification',
  '/api/verification/phone/request': 'phone_verification',
} as const;

export function recaptchaActionForPath(path: string) {
  return RECAPTCHA_ACTIONS[path as keyof typeof RECAPTCHA_ACTIONS] ?? null;
}
