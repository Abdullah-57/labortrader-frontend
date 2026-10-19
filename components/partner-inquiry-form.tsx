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

const partnerTypes = [
  ['staffing-payroll', 'Staffing or payrolling organization'],
  ['supply-distributor', 'Supply house or distributor'],
  ['trade-school', 'Trade school or training organization'],
  ['industry-association', 'Industry association'],
  ['contractor-business', 'Contractor or service business'],
  ['equipment-rental', 'Equipment or rental provider'],
  ['technology-integration', 'Technology provider'],
  ['insurance-financial', 'Insurance or financial services'],
  ['business-service', 'Business-service provider'],
  ['local-market-leader', 'Local trade-market leader'],
  ['other', 'Other'],
] as const;

function formText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

export function PartnerInquiryForm() {
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

  function validatePartnerForm(formElement: HTMLFormElement) {
    const form = new FormData(formElement);
    const nextErrors: Record<string, string[]> = {};
    const organization = formText(form, 'organization').trim();
    const partnerType = formText(form, 'partnerType').trim();
    const name = formText(form, 'name').trim();
    const email = formText(form, 'email').trim();
    const role = formText(form, 'role').trim();
    const idea = formText(form, 'idea').trim();

    if (organization.length < 2)
      nextErrors.organization = ['Enter your organization name.'];
    if (!partnerType) nextErrors.partnerType = ['Choose a partner type.'];
    if (name.length < 2) nextErrors.name = ['Enter your contact name.'];
    if (!/^\S+@\S+\.\S+$/u.test(email)) {
      nextErrors.email = ['Enter a valid work email address.'];
    }
    if (role.length < 2) nextErrors.role = ['Enter your title or role.'];
    if (idea.length < 20) {
      nextErrors.audience = [
        'Tell us who you reach and what we can build together (at least 20 characters).',
      ];
    }
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
    const conditionalErrors = validatePartnerForm(formElement);
    if (Object.keys(conditionalErrors).length > 0) {
      setErrors(conditionalErrors);
      setMessage(
        'Complete the required fields highlighted below and try again.',
      );
      focusFirstFormError({
        summary: errorSummary.current,
        errors: conditionalErrors,
        idPrefix: 'partner',
        fieldIds: {
          organization: 'partner-organization',
          partnerType: 'partner-type',
          name: 'partner-name',
          email: 'partner-email',
          role: 'partner-role',
          audience: 'partner-idea',
          proposedRelationship: 'partner-idea',
          privacyAcknowledged: 'partner-privacyAcknowledged',
          contactRequested: 'partner-contactRequested',
        },
      });
      return;
    }
    setSending(true);
    setMessage('');
    setErrors({});
    const form = new FormData(formElement);
    const attribution = readAttribution();
    const idea = formText(form, 'idea');
    const partnerType = formText(form, 'partnerType');

    const payload = {
      privacyAcknowledged: form.get('privacyAcknowledged') === 'on',
      contactRequested: form.get('contactRequested') === 'on',
      emailMarketingConsent: form.get('emailMarketingConsent') === 'on',
      name: form.get('name'),
      organization: form.get('organization'),
      role: form.get('role'),
      email: form.get('email'),
      partnerType,
      organizationWebsite: '',
      geographicFootprint: form.get('geographicFootprint') || 'Not specified',
      audience: idea,
      audienceSize: '',
      partnershipInterests:
        partnerType === 'staffing-payroll'
          ? ['staffing-payroll-support']
          : ['strategic-relationship'],
      proposedRelationship: idea,
      activationCapacity: '',
      successDefinition: '',
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
      const response = await fetchWithTimeout('/api/inquiries/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        const nextErrors = data.errors || {};
        setMessage(
          data.message ||
            'Your inquiry was not submitted. Review the information and try again.',
        );
        setErrors(nextErrors);
        focusFirstFormError({
          summary: errorSummary.current,
          errors: nextErrors,
          idPrefix: 'partner',
          fieldIds: {
            organization: 'partner-organization',
            partnerType: 'partner-type',
            name: 'partner-name',
            email: 'partner-email',
            role: 'partner-role',
            audience: 'partner-idea',
            proposedRelationship: 'partner-idea',
            privacyAcknowledged: 'partner-privacyAcknowledged',
            contactRequested: 'partner-contactRequested',
          },
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
          Inquiry Received
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Your Opportunity Is on Our Radar.
        </h3>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          Your partnership inquiry is saved and a confirmation email is on the
          way. Open that message to verify your email so we can review your
          proposal. Check spam or promotions if you do not see it within a
          minute. If you already confirmed this address, you are set—no second
          confirmation email is sent.
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
          <FieldLabel htmlFor="partner-organization" className="form-label">
            Organization
          </FieldLabel>
          <Input
            id="partner-organization"
            name="organization"
            autoComplete="organization"
            className="form-input"
            required
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={
              errors.organization ? 'partner-organization-error' : undefined
            }
          />
          <FieldError id="partner-organization-error">
            {errors.organization?.[0]}
          </FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="partner-type" className="form-label">
            Partner Type
          </FieldLabel>
          <NativeSelect
            id="partner-type"
            name="partnerType"
            className="form-select"
            defaultValue=""
            required
            aria-invalid={Boolean(errors.partnerType)}
            aria-describedby={
              errors.partnerType ? 'partner-type-error' : undefined
            }
          >
            <NativeSelectOption value="" disabled>
              Select one
            </NativeSelectOption>
            {partnerTypes.map(([value, label]) => (
              <NativeSelectOption key={value} value={value}>
                {label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <FieldError id="partner-type-error">
            {errors.partnerType?.[0]}
          </FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="partner-name" className="form-label">
            Contact Name
          </FieldLabel>
          <Input
            id="partner-name"
            name="name"
            autoComplete="name"
            className="form-input"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'partner-name-error' : undefined}
          />
          <FieldError id="partner-name-error">{errors.name?.[0]}</FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="partner-email" className="form-label">
            Work Email
          </FieldLabel>
          <Input
            id="partner-email"
            name="email"
            type="email"
            autoComplete="email"
            className="form-input"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'partner-email-error' : undefined}
          />
          <FieldError id="partner-email-error">{errors.email?.[0]}</FieldError>
        </Field>
        <Field className="min-w-0">
          <FieldLabel htmlFor="partner-role" className="form-label">
            Title or Role
          </FieldLabel>
          <Input
            id="partner-role"
            name="role"
            autoComplete="organization-title"
            className="form-input"
            required
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? 'partner-role-error' : undefined}
          />
          <FieldError id="partner-role-error">{errors.role?.[0]}</FieldError>
        </Field>
        <Field className="min-w-0 sm:col-span-2">
          <FieldLabel htmlFor="partner-geography" className="form-label">
            Markets or Regions <span>Optional</span>
          </FieldLabel>
          <Input
            id="partner-geography"
            name="geographicFootprint"
            className="form-input"
            placeholder="City, region, or state"
            aria-invalid={Boolean(errors.geographicFootprint)}
            aria-describedby={
              errors.geographicFootprint ? 'partner-geography-error' : undefined
            }
          />
          <FieldError id="partner-geography-error">
            {errors.geographicFootprint?.[0]}
          </FieldError>
        </Field>
        <Field className="min-w-0 sm:col-span-2">
          <FieldLabel htmlFor="partner-idea" className="form-label">
            Who Do You Reach, and What Can We Build Together?
          </FieldLabel>
          <Textarea
            id="partner-idea"
            name="idea"
            className="form-textarea min-h-32"
            minLength={20}
            required
            aria-invalid={Boolean(
              errors.audience || errors.proposedRelationship,
            )}
            aria-describedby={
              errors.audience || errors.proposedRelationship
                ? 'partner-idea-error'
                : undefined
            }
          />
          <FieldError id="partner-idea-error">
            {errors.audience?.[0] || errors.proposedRelationship?.[0]}
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

      <InquiryConsentFields prefix="partner" errors={errors} />

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
        {sending ? 'Submitting…' : 'Submit Partnership Opportunity'}
        {!sending && <ArrowRight className="size-4" />}
      </Button>
      <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
        This inquiry opens a discussion. Any partnership or commitment requires
        a separate written agreement.
      </p>
    </form>
  );
}
