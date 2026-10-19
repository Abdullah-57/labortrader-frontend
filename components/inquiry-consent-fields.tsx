import Link from 'next/link';

export function InquiryConsentFields({
  prefix,
  errors,
}: {
  prefix: string;
  errors: Record<string, string[]>;
}) {
  return (
    <fieldset className="mt-7 space-y-4 border-t border-foreground/15 pt-6 text-sm leading-6">
      <legend className="sr-only">Contact preferences</legend>
      {(
        [
          [
            'privacyAcknowledged',
            <>
              I acknowledge the{' '}
              <Link className="underline underline-offset-4" href="/privacy">
                Privacy Policy
              </Link>
              .
            </>,
          ],
          [
            'contactRequested',
            <>I ask LaborTrader to email me about this inquiry.</>,
          ],
        ] as const
      ).map(([name, label]) => (
        <div key={name}>
          <label
            className="flex items-start gap-3"
            htmlFor={`${prefix}-${name}`}
          >
            <input
              className="mt-1 size-4 shrink-0 accent-primary"
              type="checkbox"
              id={`${prefix}-${name}`}
              name={name}
              required
              aria-invalid={Boolean(errors[name])}
              aria-describedby={
                errors[name] ? `${prefix}-${name}-error` : undefined
              }
            />
            <span>
              {label}{' '}
              <span className="text-xs text-muted-foreground">Required</span>
            </span>
          </label>
          {errors[name] && (
            <p className="mt-1 text-destructive" id={`${prefix}-${name}-error`}>
              {errors[name][0]}
            </p>
          )}
        </div>
      ))}
      <label
        className="flex items-start gap-3"
        htmlFor={`${prefix}-emailMarketingConsent`}
      >
        <input
          className="mt-1 size-4 shrink-0 accent-primary"
          type="checkbox"
          id={`${prefix}-emailMarketingConsent`}
          name="emailMarketingConsent"
        />
        <span>
          Also email me LaborTrader news and opportunities.{' '}
          <span className="text-xs text-muted-foreground">
            Optional. Unsubscribe anytime.
          </span>
        </span>
      </label>
    </fieldset>
  );
}
