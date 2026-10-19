'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { useEffect, useRef, useState } from 'react';
import { InquiryConsentFields } from '@/components/inquiry-consent-fields';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { readAttribution } from '@/lib/client-attribution';
import { createIdempotencyKey } from '@/lib/client-id';
import { focusFirstFormError } from '@/lib/form-feedback';

function formText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

const investorFieldIds = {
  name: 'investor-name',
  email: 'investor-email',
  organization: 'investor-organization',
  role: 'investor-role',
  investorType: 'investor-type',
  areasOfInterest: 'investor-interest',
  interest: 'investor-interest',
  message: 'investor-message',
  privacyAcknowledged: 'investor-privacyAcknowledged',
  contactRequested: 'investor-contactRequested',
} as const;

const investorTypes = [
  ['angel', 'Angel investor'],
  ['family-office', 'Family office'],
  ['venture-capital', 'Venture capital'],
  ['strategic-corporate', 'Strategic or corporate investor'],
  ['private-investment-group', 'Private investment group'],
  ['industry-operator', 'Industry operator'],
  ['other', 'Other'],
] as const;

const interests = [
  ['marketplace-model', 'Marketplace model'],
  ['skilled-trades-market', 'Skilled-trades market'],
  ['business-revenue-model', 'Business model'],
  ['product-technology', 'Product and technology'],
  ['founding-market-data', 'Current market data'],
  ['funding-discussion', 'Funding discussion'],
  ['strategic-partnership', 'Investment and partnership'],
] as const;

export function InvestorInquiryForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const idempotencyKey = useRef('');
  const errorSummary = useRef<HTMLParagraphElement>(null);
  const successSummary = useRef<HTMLElement>(null);

  useEffect(() => {
    if (message) errorSummary.current?.focus();
    if (sent) successSummary.current?.focus();
  }, [message, sent]);

  function validateInvestorForm(formElement: HTMLFormElement) {
    const form = new FormData(formElement);
    const nextErrors: Record<string, string[]> = {};
    const name = formText(form, 'name').trim();
    const email = formText(form, 'email').trim();
    const organization = formText(form, 'organization').trim();
    const role = formText(form, 'role').trim();
    const investorType = formText(form, 'investorType').trim();
    const interest = formText(form, 'interest').trim();

    if (name.length < 2) nextErrors.name = ['Enter your name.'];
    if (!/^\S+@\S+\.\S+$/u.test(email)) {
      nextErrors.email = ['Enter a valid work email address.'];
    }
    if (organization.length < 2)
      nextErrors.organization = ['Enter your organization name.'];
    if (role.length < 2) nextErrors.role = ['Enter your title or role.'];
    if (!investorType) nextErrors.investorType = ['Choose an investor type.'];
    if (!interest)
      nextErrors.areasOfInterest = ['Choose your primary interest.'];
    if (form.get('privacyAcknowledged') !== 'on') {
      nextErrors.privacyAcknowledged = [
        'Acknowledge the Privacy Policy to continue.',
      ];
    }
    if (form.get('contactRequested') !== 'on') {
      nextErrors.contactRequested = [
        'Confirm that LaborTrader may email you about this inquiry.',
      ];
    }
    return nextErrors;
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const conditionalErrors = validateInvestorForm(formElement);
    if (Object.keys(conditionalErrors).length > 0) {
      setErrors(conditionalErrors);
      setMessage(
        'Complete the required fields highlighted below and try again.',
      );
      focusFirstFormError({
        summary: errorSummary.current,
        errors: conditionalErrors,
        fieldIds: investorFieldIds,
      });
      return;
    }
    setSending(true);
    setMessage('');
    setErrors({});
    const form = new FormData(formElement);
    const attribution = readAttribution();

    const payload = {
      privacyAcknowledged: form.get('privacyAcknowledged') === 'on',
      contactRequested: form.get('contactRequested') === 'on',
      emailMarketingConsent: form.get('emailMarketingConsent') === 'on',
      name: form.get('name'),
      organization: form.get('organization'),
      role: form.get('role'),
      email: form.get('email'),
      investorType: form.get('investorType'),
      areasOfInterest: [form.get('interest')],
      preferredNextStep: 'request-materials',
      message: form.get('message'),
      idempotencyKey:
        idempotencyKey.current ||
        (idempotencyKey.current = createIdempotencyKey()),
      acquisitionSource: attribution.source || attribution.utm_source || '',
      landingPage: attribution.landing_page || '',
      utmSource: attribution.utm_source || '',
      utmMedium: attribution.utm_medium || '',
      utmCampaign: attribution.utm_campaign || '',
      utmContent: attribution.utm_content || '',
      utmTerm: attribution.utm_term || '',
      website: form.get('website'),
    };

    try {
      const response = await fetchWithTimeout('/api/inquiries/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        const nextErrors = data.errors || {};
        setMessage(
          data.message ||
            'Your request was not submitted. Review the information and try again.',
        );
        setErrors(nextErrors);
        focusFirstFormError({
          summary: errorSummary.current,
          errors: nextErrors,
          fieldIds: investorFieldIds,
        });
        return;
      }
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
        className="lt-surface-light block border border-foreground/14 bg-card p-7 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-9 lt-form-panel"
      >
        <Check className="size-7 text-primary" />
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
          Request Received
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Your Request Is In.
        </h3>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Your investor request is saved and a confirmation email is on the way.
          Open that message to verify your email for next steps. Check spam or
          promotions if you do not see it within a minute. If you already
          confirmed this address, you are set—no second confirmation email is
          sent.
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
      className="lt-surface-light min-w-0 max-w-full border border-foreground/14 bg-card p-5 text-foreground sm:p-8 lt-form-panel"
      noValidate
    >
      <div className="grid min-w-0 max-w-full gap-5 sm:grid-cols-2">
        <Field className="min-w-0">
          <FieldLabel htmlFor="investor-name" className="form-label">
            Name
          </FieldLabel>
          <Input
            id="investor-name"
            name="name"
            autoComplete="name"
            className="form-input"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'investor-name-error' : undefined}
          />
          <FieldError id="investor-name-error">{errors.name?.[0]}</FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="investor-email" className="form-label">
            Work Email
          </FieldLabel>
          <Input
            id="investor-email"
            name="email"
            type="email"
            autoComplete="email"
            className="form-input"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'investor-email-error' : undefined}
          />
          <FieldError id="investor-email-error">{errors.email?.[0]}</FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="investor-organization" className="form-label">
            Organization
          </FieldLabel>
          <Input
            id="investor-organization"
            name="organization"
            autoComplete="organization"
            className="form-input"
            required
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={
              errors.organization ? 'investor-organization-error' : undefined
            }
          />
          <FieldError id="investor-organization-error">
            {errors.organization?.[0]}
          </FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="investor-role" className="form-label">
            Title or Role
          </FieldLabel>
          <Input
            id="investor-role"
            name="role"
            autoComplete="organization-title"
            className="form-input"
            required
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? 'investor-role-error' : undefined}
          />
          <FieldError id="investor-role-error">{errors.role?.[0]}</FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="investor-type" className="form-label">
            Investor Type
          </FieldLabel>
          <NativeSelect
            id="investor-type"
            name="investorType"
            className="form-select"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.investorType)}
            aria-describedby={
              errors.investorType ? 'investor-type-error' : undefined
            }
          >
            <NativeSelectOption value="" disabled>
              Select one
            </NativeSelectOption>
            {investorTypes.map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError id="investor-type-error">
            {errors.investorType?.[0]}
          </FieldError>
        </Field>
        <Field className="min-w-0 sm:col-span-2">
          <FieldLabel htmlFor="investor-interest" className="form-label">
            Primary Interest
          </FieldLabel>
          <NativeSelect
            id="investor-interest"
            name="interest"
            className="form-select"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.areasOfInterest)}
            aria-describedby={
              errors.areasOfInterest ? 'investor-interest-error' : undefined
            }
          >
            <NativeSelectOption value="" disabled>
              Select one
            </NativeSelectOption>
            {interests.map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError id="investor-interest-error">
            {errors.areasOfInterest?.[0]}
          </FieldError>
        </Field>
        <Field className="min-w-0 sm:col-span-2">
          <FieldLabel htmlFor="investor-message" className="form-label">
            What Would You Like to Discuss? <span>Optional</span>
          </FieldLabel>
          <Textarea
            id="investor-message"
            name="message"
            className="form-textarea min-h-28"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? 'investor-message-error' : undefined
            }
          />
          <FieldError id="investor-message-error">
            {errors.message?.[0]}
          </FieldError>
        </Field>
      </div>

      <input
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <InquiryConsentFields prefix="investor" errors={errors} />

      {message && (
        <p
          ref={errorSummary}
          role="alert"
          tabIndex={-1}
          className="mt-5 border-l-2 border-destructive pl-3 text-sm font-semibold text-destructive focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring"
        >
          {message}
        </p>
      )}

      <Button
        type="submit"
        disabled={sending}
        className="mt-7 h-13 w-full rounded-none bg-primary px-6 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary/90"
      >
        {sending ? 'Submitting…' : 'Request Investor Materials'}
        {!sending && <ArrowRight className="size-4" />}
      </Button>
      <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
        This request is for information only. It is not an investment commitment
        or an offer to sell securities.
      </p>
    </form>
  );
}
