'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';

const subjects = {
  participant: 'market-opening updates and matched opportunities',
  client: 'market-opening and client-access updates',
  vendor:
    'Pro Shop partner news, promotional opportunities, and program updates',
};

/** Each channel is an independent, optional choice; neither is preselected. */
export function MarketingConsentFields({
  prefix,
  audience = 'participant',
  emailConsent,
  onEmailChange,
  smsConsent,
  onSmsChange,
  showSms = true,
}: {
  prefix: string;
  audience?: keyof typeof subjects;
  emailConsent: boolean;
  onEmailChange: (checked: boolean) => void;
  smsConsent: boolean;
  onSmsChange: (checked: boolean) => void;
  showSms?: boolean;
}) {
  return (
    <fieldset className="lt-consent-options mt-4">
      <legend>
        Stay in the loop <span>Optional</span>
      </legend>
      <div className="lt-consent-option">
        <Checkbox
          id={`${prefix}-email-updates`}
          checked={emailConsent}
          onCheckedChange={(checked) => onEmailChange(Boolean(checked))}
        />
        <label htmlFor={`${prefix}-email-updates`}>
          <strong>Email updates</strong>
          <span>
            Email me LaborTrader {subjects[audience]}. Unsubscribe using the
            link in any update.
          </span>
        </label>
      </div>
      {showSms && (
        <div className="lt-consent-option">
          <Checkbox
            id={`${prefix}-sms-consent`}
            checked={smsConsent}
            onCheckedChange={(checked) => onSmsChange(Boolean(checked))}
          />
          <label htmlFor={`${prefix}-sms-consent`}>
            <strong>Text updates</strong>
            <span>
              Send me recurring automated LaborTrader {subjects[audience]} by
              text at the number provided. Message frequency varies. Message and
              data rates may apply. Reply STOP to opt out or HELP for help.
              Consent is not a condition of registration, applying, purchasing,
              or receiving an eligible benefit. See the{' '}
              <Link href="/sms-terms">SMS Terms</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>.
            </span>
          </label>
        </div>
      )}
    </fieldset>
  );
}
