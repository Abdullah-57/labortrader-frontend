'use client';

import { fetchWithTimeout } from '@/lib/browser-request';
import { markRegistrationSaved } from '@/lib/registration-reminder';

import Link from 'next/link';
import { MarketingConsentFields } from '@/components/marketing-consent-fields';
import { UsMobileField } from '@/components/us-mobile-field';
import { ArrowRight, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { readAttribution } from '@/lib/client-attribution';
import { createIdempotencyKey } from '@/lib/client-id';
import { US_STATES } from '@/lib/constants';
import { focusFirstFormError } from '@/lib/form-feedback';

export function ClientPreregistrationForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [requiredAcknowledgement, setRequiredAcknowledgement] = useState(false);
  const [emailMarketingConsent, setEmailMarketingConsent] = useState(false);
  const [smsMarketingConsent, setSmsMarketingConsent] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const idempotencyKey = useRef('');
  const errorSummary = useRef<HTMLParagraphElement>(null);
  const successSummary = useRef<HTMLElement>(null);

  useEffect(() => {
    if (message) errorSummary.current?.focus();
    if (sent) successSummary.current?.focus();
  }, [message, sent]);

  function validateClientForm(formElement: HTMLFormElement) {
    const form = new FormData(formElement);
    const nextErrors: Record<string, string[]> = {};
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const city = String(form.get('city') || '').trim();
    const state = String(form.get('state') || '')
      .trim()
      .toUpperCase();

    if (name.length < 2) nextErrors.name = ['Enter your name.'];
    if (!/^\S+@\S+\.\S+$/u.test(email)) {
      nextErrors.email = ['Enter a valid email address.'];
    }
    if (!phone) nextErrors.phone = ['Enter your mobile number.'];
    if (!city || city.length < 2) nextErrors.city = ['Enter your city.'];
    if (!US_STATES.includes(state as (typeof US_STATES)[number])) {
      nextErrors.state = ['Choose a valid state.'];
    }
    if (!requiredAcknowledgement) {
      nextErrors.termsAccepted = [
        'Agree to the Website Terms and acknowledge the Privacy Policy to continue.',
      ];
    }
    return nextErrors;
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const conditionalErrors = validateClientForm(formElement);
    if (Object.keys(conditionalErrors).length > 0) {
      setErrors(conditionalErrors);
      setMessage('Complete the required fields highlighted below and try again.');
      focusFirstFormError({
        summary: errorSummary.current,
        errors: conditionalErrors,
        fieldIds: {
          name: 'client-name',
          email: 'client-email',
          phone: 'client-phone',
          city: 'client-city',
          state: 'client-state',
          termsAccepted: 'client-registration-acknowledgement',
        },
      });
      return;
    }

    setSending(true);
    setMessage('');
    setErrors({});
    const form = new FormData(formElement);
    const attribution = readAttribution();

    try {
      const response = await fetchWithTimeout('/api/client-preregistrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          city: form.get('city'),
          state: form.get('state'),
          termsAccepted: requiredAcknowledgement,
          privacyAcknowledged: requiredAcknowledgement,
          serviceMessagesAcknowledged: requiredAcknowledgement,
          emailMarketingConsent,
          smsMarketingConsent,
          idempotencyKey:
            idempotencyKey.current ||
            (idempotencyKey.current = createIdempotencyKey()),
          acquisitionSource: attribution.source || attribution.utm_source || '',
          landingPage: attribution.landing_page || window.location.pathname,
          utmSource: attribution.utm_source || '',
          utmMedium: attribution.utm_medium || '',
          utmCampaign: attribution.utm_campaign || '',
          utmContent: attribution.utm_content || '',
          utmTerm: attribution.utm_term || '',
          website: form.get('website'),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(
          data?.message ||
            'We could not save your client preregistration. Review the information and try again.',
        );
        setErrors(data?.errors || {});
        return;
      }
      markRegistrationSaved();
      setSent(true);
    } catch {
      setMessage(
        'LaborTrader could not be reached. Check your connection and try again.',
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <section
        ref={successSummary}
        aria-live="polite"
        tabIndex={-1}
        className="lt-surface-light border border-foreground/14 bg-card p-7 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-9 lt-form-panel"
      >
        <span className="grid size-11 place-items-center bg-primary text-primary-foreground">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
          Client Preregistration Received
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Your Client Preregistration Is Saved.
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          Your details are saved and a confirmation email is on the way. Open
          that message to verify your email. Check spam or promotions if you do
          not see it within a minute. If you already confirmed this address,
          you are set—no second confirmation email is sent.
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em]"
          href="/"
        >
          Return Home <ArrowRight className="size-4 text-primary" />
        </Link>
      </section>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="lt-surface-light min-w-0 border border-foreground/14 bg-card p-5 text-foreground shadow-2xl sm:p-8 lt-form-panel"
      noValidate
    >
      <div className="mb-7 border-l-2 border-primary bg-primary/8 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          Client Launch Offer
        </p>
        <p className="mt-2 text-lg font-semibold tracking-[-0.025em]">
          Reserve your client launch benefit.
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Up to 90 days of eligible platform use, capped at $500. Starts after
          verification, approval, and market launch.
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          No monthly membership fee.
        </p>
      </div>
      <div className="grid min-w-0 gap-5 sm:grid-cols-2">
        <Field className="min-w-0">
          <FieldLabel htmlFor="client-name" className="form-label">
            Your Name
          </FieldLabel>
          <Input
            id="client-name"
            name="name"
            autoComplete="name"
            className="form-input"
            minLength={2}
            maxLength={120}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'client-name-error' : undefined}
          />
          <FieldError id="client-name-error">{errors.name?.[0]}</FieldError>
        </Field>

        <Field className="min-w-0">
          <FieldLabel htmlFor="client-email" className="form-label">
            Email
          </FieldLabel>
          <Input
            id="client-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="form-input"
            maxLength={254}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'client-email-error' : undefined}
          />
          <FieldError id="client-email-error">{errors.email?.[0]}</FieldError>
        </Field>

        <UsMobileField
          id="client-phone"
          name="phone"
          label="Mobile phone"
          required
          error={errors.phone?.[0]}
          onChange={() => setSmsMarketingConsent(false)}
        />

        <Field className="min-w-0">
          <FieldLabel htmlFor="client-city" className="form-label">
            City
          </FieldLabel>
          <Input
            id="client-city"
            name="city"
            autoComplete="address-level2"
            className="form-input"
            minLength={2}
            maxLength={100}
            required
            aria-invalid={Boolean(errors.city)}
            aria-describedby={errors.city ? 'client-city-error' : undefined}
          />
          <FieldError id="client-city-error">{errors.city?.[0]}</FieldError>
        </Field>

        <Field className="min-w-0 sm:col-span-2">
          <FieldLabel htmlFor="client-state" className="form-label">
            State
          </FieldLabel>
          <NativeSelect
            id="client-state"
            name="state"
            className="form-select"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.state)}
            aria-describedby={errors.state ? 'client-state-error' : undefined}
          >
            <NativeSelectOption value="" disabled>
              Select your state
            </NativeSelectOption>
            {US_STATES.map((state) => (
              <NativeSelectOption key={state} value={state}>
                {state}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError id="client-state-error">{errors.state?.[0]}</FieldError>
        </Field>
      </div>

      <input
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="mt-7 grid gap-3">
        <div className="flex items-start gap-3 border border-foreground/12 bg-white/[0.03] p-4 text-xs leading-5 text-muted-foreground">
          <Checkbox
            id="client-registration-acknowledgement"
            checked={requiredAcknowledgement}
            onCheckedChange={(checked) =>
              setRequiredAcknowledgement(Boolean(checked))
            }
            className="mt-0.5"
            aria-required="true"
            aria-invalid={Boolean(
              errors.termsAccepted ||
              errors.privacyAcknowledged ||
              errors.serviceMessagesAcknowledged,
            )}
            aria-describedby={
              errors.termsAccepted ||
              errors.privacyAcknowledged ||
              errors.serviceMessagesAcknowledged
                ? 'client-registration-acknowledgement-error'
                : undefined
            }
          />
          <div className="min-w-0">
            <label
              htmlFor="client-registration-acknowledgement"
              className="cursor-pointer"
            >
              I agree to the{' '}
              <Link className="font-semibold underline" href="/terms">
                Website Terms
              </Link>{' '}
              and acknowledge the{' '}
              <Link className="font-semibold underline" href="/privacy">
                Privacy Policy
              </Link>
              . LaborTrader will email me about my preregistration and essential
              account notices. Marketing emails and texts are optional below.
              Providing a number does not enroll me in text messages.
            </label>
            <FieldError id="client-registration-acknowledgement-error">
              {errors.termsAccepted?.[0] ||
                errors.privacyAcknowledged?.[0] ||
                errors.serviceMessagesAcknowledged?.[0]}
            </FieldError>
          </div>
        </div>

        <MarketingConsentFields
          prefix="client"
          audience="client"
          emailConsent={emailMarketingConsent}
          onEmailChange={setEmailMarketingConsent}
          smsConsent={smsMarketingConsent}
          onSmsChange={setSmsMarketingConsent}
        />
      </div>

      {message && (
        <p
          ref={errorSummary}
          role="alert"
          tabIndex={-1}
          className="mt-5 border-l-2 border-destructive pl-3 text-sm font-semibold text-destructive outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={sending}
        className="mt-7 h-13 w-full rounded-none bg-primary px-6 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/90"
      >
        {sending ? 'Saving…' : 'Submit My Client Preregistration'}
        {!sending && <ArrowRight className="size-4" aria-hidden="true" />}
      </Button>
      <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
        One eligible benefit per verified client account.{' '}
        <Link
          href="/launch-benefits"
          className="font-semibold underline underline-offset-4"
        >
          Launch benefits and fees
        </Link>
      </p>
    </form>
  );
}
