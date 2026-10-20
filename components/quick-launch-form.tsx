'use client';

import { fetchWithTimeout } from '@/lib/browser-request';
import { UsMobileField } from '@/components/us-mobile-field';
import { markRegistrationSaved } from '@/lib/registration-reminder';

import Link from 'next/link';
import { MarketingConsentFields } from '@/components/marketing-consent-fields';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { readAttribution } from '@/lib/client-attribution';
import { createIdempotencyKey } from '@/lib/client-id';
import {
  FOUNDING_STATES,
  PUBLIC_PARTICIPANT_ROLES,
  QUICK_TRADES,
  US_STATES,
  participantRoleByAudienceType,
  type PublicAudienceType,
} from '@/lib/constants';
import { focusFirstFormError } from '@/lib/form-feedback';
import { sanitizeQueryText } from '@/lib/query-text';
import { normalizeUsPhoneToE164 } from '@/lib/verification-domain';

type ErrorMap = Record<string, string[]>;

const TRADE_CATEGORIES = Array.from(
  new Set(QUICK_TRADES.map((trade) => trade.category)),
);

function audienceFromQuery(value: string | null): PublicAudienceType | '' {
  const normalized = value?.trim().toLowerCase().replaceAll('_', '-');
  if (normalized === 'worker') return 'WORKER';
  if (normalized === 'contractor' || normalized === 'independent-contractor')
    return 'CONTRACTOR';
  if (normalized === 'business' || normalized === 'service-business')
    return 'BUSINESS';
  if (normalized === 'hiring-firm' || normalized === 'hiring-organization')
    return 'HIRING_FIRM';
  return '';
}

function tradeFromQuery(value: string | null) {
  const normalized = sanitizeQueryText(value, 100);
  return QUICK_TRADES.some((trade) => trade.value === normalized)
    ? normalized
    : '';
}

function formText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

function QuickField({
  id,
  name,
  label,
  error,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string;
  name: string;
  label: string;
  error?: string;
}) {
  const errorId = `${id}-error`;
  return (
    <Field className="min-w-0">
      <FieldLabel htmlFor={id} className="form-label">
        {label}
      </FieldLabel>
      <Input
        id={id}
        name={name}
        className="form-input min-w-0 max-w-full"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

export function QuickLaunchForm() {
  return (
    <Suspense
      fallback={
        <div
          className="h-[36rem] min-w-0 animate-pulse border border-background/10 bg-card"
          aria-label="Loading pre-registration form"
        />
      }
    >
      <QuickLaunchFormContent />
    </Suspense>
  );
}

function QuickLaunchFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isManaging = searchParams.get('manage') === '1';
  const queryCity = sanitizeQueryText(searchParams.get('city'), 100);
  const queryState = sanitizeQueryText(
    searchParams.get('state'),
    2,
  ).toUpperCase();
  const validQueryState = US_STATES.includes(queryState as never)
    ? queryState
    : '';
  const city = validQueryState ? queryCity : '';
  const querySource = sanitizeQueryText(searchParams.get('source'), 160);
  const referralCode = sanitizeQueryText(searchParams.get('ref'), 35);
  const [step, setStep] = useState(1);
  const [audienceType, setAudienceType] = useState<PublicAudienceType | ''>(
    () => audienceFromQuery(searchParams.get('role')),
  );
  const [primaryTradeSlug, setPrimaryTradeSlug] = useState(() =>
    tradeFromQuery(searchParams.get('trade')),
  );
  const [selectedState, setSelectedState] = useState(validQueryState);
  const [smsConsent, setSmsConsent] = useState(false);
  const [emailMarketingConsent, setEmailMarketingConsent] = useState(false);
  const [registrationAcknowledged, setRegistrationAcknowledged] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submittedMarket, setSubmittedMarket] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ErrorMap>({});
  const idempotencyKey = useRef('');
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!referralCode) return;
    void fetchWithTimeout('/api/referrals/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: referralCode }),
    }).catch(() => undefined);
  }, [referralCode]);

  if (isManaging) return null;

  const selectedParticipantRole = participantRoleByAudienceType(audienceType);
  const selectedTrade = QUICK_TRADES.find(
    (trade) => trade.value === primaryTradeSlug,
  );

  function focusStepHeading() {
    window.requestAnimationFrame(() => stepHeadingRef.current?.focus());
  }

  const quickFieldIds: Record<string, string> = {
    firstName: 'quick-first-name',
    lastName: 'quick-last-name',
    email: 'quick-email',
    state: 'quick-state',
    primaryTradeSlug: 'quick-primary-trade',
    otherTrade: 'quick-other-trade',
    organizationName: 'quick-organization-name',
    city: 'quick-city',
    zip: 'quick-zip',
    mobile: 'quick-mobile',
    termsAccepted: 'quick-registration-acknowledgement',
  };

  function showFieldErrors(nextErrors: ErrorMap, nextMessage: string) {
    setErrors(nextErrors);
    setMessage(nextMessage);
    focusFirstFormError({
      summary: statusRef.current,
      errors: nextErrors,
      fieldIds: quickFieldIds,
    });
  }

  function validateMarketStep(form: FormData) {
    const nextErrors: ErrorMap = {};
    const firstName = formText(form, 'firstName').trim();
    const lastName = formText(form, 'lastName').trim();
    const email = formText(form, 'email').trim();
    const state = formText(form, 'state').trim().toUpperCase();
    const otherTrade = formText(form, 'otherTrade').trim();

    if (firstName.length < 1) nextErrors.firstName = ['Enter your first name.'];
    if (lastName.length < 1) nextErrors.lastName = ['Enter your last name.'];
    if (!/^\S+@\S+\.\S+$/u.test(email)) {
      nextErrors.email = ['Enter a valid email address.'];
    }
    if (!US_STATES.includes(state as never)) {
      nextErrors.state = ['Choose a valid state.'];
    }
    if (!primaryTradeSlug) {
      nextErrors.primaryTradeSlug = ['Choose your primary trade or specialty.'];
    }
    if (primaryTradeSlug === 'other-skilled-trade' && !otherTrade) {
      nextErrors.otherTrade = [
        'Tell us which trade or specialty you perform or hire for.',
      ];
    }
    return nextErrors;
  }

  function continueFromMarket() {
    const form = formRef.current ? new FormData(formRef.current) : new FormData();
    const nextErrors = validateMarketStep(form);
    if (Object.keys(nextErrors).length > 0) {
      showFieldErrors(
        nextErrors,
        'Complete the required fields highlighted below and try again.',
      );
      return;
    }
    setErrors({});
    setMessage('');
    setStep(2);
    focusStepHeading();
  }

  function continueFromRole() {
    if (!audienceType) {
      showFieldErrors(
        { audienceType: ['Choose the account type that fits you.'] },
        'Choose your account type to continue.',
      );
      return;
    }
    if (audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM') {
      const form = formRef.current
        ? new FormData(formRef.current)
        : new FormData();
      const organizationName = formText(form, 'organizationName').trim();
      if (organizationName.length < 2) {
        showFieldErrors(
          { organizationName: ['Enter your organization name.'] },
          'Complete the required fields highlighted below and try again.',
        );
        return;
      }
    }
    setErrors({});
    setMessage('');
    setStep(3);
    focusStepHeading();
  }

  function goBack(nextStep: number) {
    setErrors({});
    setMessage('');
    setStep(nextStep);
    focusStepHeading();
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const nextErrors: ErrorMap = {
      ...validateMarketStep(form),
    };
    const cityValue = formText(form, 'city').trim();
    const zipValue = formText(form, 'zip').trim();
    if (!cityValue || cityValue.length < 2) {
      nextErrors.city = ['Enter your city.'];
    }
    if (!/^\d{5}(?:-\d{4})?$/u.test(zipValue)) {
      nextErrors.zip = ['Enter a valid ZIP code.'];
    }

    const rawMobile = form.get('mobile');
    const mobileValue = typeof rawMobile === 'string' ? rawMobile : '';
    if (!mobileValue.trim()) {
      nextErrors.mobile = ['Enter your mobile number.'];
    } else if (!normalizeUsPhoneToE164(mobileValue)) {
      nextErrors.mobile = [
        'Enter a complete 10-digit U.S. mobile number (example: 415 555 2671).',
      ];
    }
    if (!registrationAcknowledged) {
      nextErrors.termsAccepted = [
        'Agree to the Website Terms and acknowledge the Privacy Policy to continue.',
      ];
    }
    if (!audienceType) {
      nextErrors.audienceType = ['Choose the account type that fits you.'];
    }
    if (
      (audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM') &&
      formText(form, 'organizationName').trim().length < 2
    ) {
      nextErrors.organizationName = ['Enter your organization name.'];
    }
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.audienceType || nextErrors.organizationName) setStep(2);
      else if (
        nextErrors.firstName ||
        nextErrors.lastName ||
        nextErrors.email ||
        nextErrors.state ||
        nextErrors.primaryTradeSlug ||
        nextErrors.otherTrade
      ) {
        setStep(1);
      } else {
        setStep(3);
      }
      showFieldErrors(
        nextErrors,
        'Complete the required fields highlighted below and try again.',
      );
      return;
    }

    const firstName = formText(form, 'firstName').trim();
    const lastName = formText(form, 'lastName').trim();
    const submittedCity = formText(form, 'city').trim();
    const submittedState = formText(form, 'state').trim();

    setSubmitting(true);
    setMessage('');
    setErrors({});
    const attribution = readAttribution();
    const payload = {
      audienceType,
      name: `${firstName} ${lastName}`.trim(),
      organizationName: form.get('organizationName') || undefined,
      email: form.get('email'),
      mobile: form.get('mobile'),
      city: submittedCity,
      state: submittedState,
      zip: form.get('zip'),
      primaryTradeSlug: form.get('primaryTradeSlug'),
      otherTrade: form.get('otherTrade') || undefined,
      termsAccepted: registrationAcknowledged,
      privacyAcknowledged: registrationAcknowledged,
      launchEmailAcknowledged: registrationAcknowledged,
      serviceMessagesAcknowledged: registrationAcknowledged,
      emailMarketingConsent,
      smsConsent,
      idempotencyKey:
        idempotencyKey.current ||
        (idempotencyKey.current = createIdempotencyKey()),
      acquisitionSource:
        querySource === 'location_banner'
          ? 'location_banner'
          : attribution.source ||
            attribution.utm_source ||
            querySource ||
            'homepage_funnel',
      landingPage:
        attribution.landing_page ||
        `${window.location.pathname}${window.location.search}`,
      utmSource: attribution.utm_source || '',
      utmMedium: attribution.utm_medium || '',
      utmCampaign: attribution.utm_campaign || '',
      utmContent: attribution.utm_content || '',
      utmTerm: attribution.utm_term || '',
      promoCode: attribution.promo || '',
      referredByCode:
        attribution.ref || referralCode || form.get('referredByCode') || '',
      website: form.get('website'),
    };

    try {
      const response = await fetchWithTimeout('/api/launch-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        const responseErrors = data?.errors || {};
        showFieldErrors(
          responseErrors,
          data?.message || 'We could not save your pre-registration.',
        );
        return;
      }

      markRegistrationSaved();
      if (data.outcome !== 'SAVED') {
        router.push('/portal?access=required');
        return;
      }

      setSubmittedMarket(`${submittedCity}, ${submittedState}`);
      setSaved(true);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setMessage(
        'We could not reach LaborTrader. Check your connection and try again.',
      );
      window.requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  }

  if (saved) {
    return (
      <section
        ref={statusRef}
        tabIndex={-1}
        aria-live="polite"
        className="lt-surface-light min-w-0 border border-primary/45 border-t-4 border-t-primary bg-card p-6 text-foreground shadow-[0_28px_80px_rgba(0,0,0,.28)] outline-none focus-visible:ring-3 focus-visible:ring-ring sm:p-8"
      >
        <CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.17em] text-primary">
          Pre-registration received
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
          Your pre-registration is saved for {submittedMarket}.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
          We sent a confirmation email to the address you used. Open that
          message to verify your email and continue. Check spam or promotions if
          you do not see it within a minute.
        </p>
        <Link
          href={`/early-access/complete?submitted=1&registration=basic&city=${encodeURIComponent(submittedMarket.split(',')[0]?.trim() || '')}&state=${encodeURIComponent(submittedMarket.split(',')[1]?.trim() || '')}`}
          className="button-dark mt-6 w-full sm:w-auto"
        >
          Continue after email confirmation
        </Link>
      </section>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      aria-busy={submitting}
      className="lt-quick-registration lt-form-panel"
    >
      <div className="lt-form-heading">
        <strong className="text-xs font-black uppercase tracking-[0.12em]">
          Get in early
        </strong>
        <div className="lt-form-progress">
          <progress
            className="sr-only"
            aria-label="Pre-registration progress"
            max={3}
            value={step}
          >
            Step {step} of 3
          </progress>
          {[1, 2, 3].map((number) => (
            <span
              key={number}
              data-active={number <= step}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <div className="lt-form-body">
        <fieldset hidden={step !== 1} className="min-w-0 border-0 p-0">
          <legend className="sr-only">Step 1: Start with your market</legend>
          <p className="sr-only">Step 1 of 3</p>
          <h2
            ref={step === 1 ? stepHeadingRef : undefined}
            tabIndex={-1}
            className="lt-form-title"
          >
            Your next chapter starts here.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Join the skilled labor marketplace being built around you.
          </p>
          <div className="lt-registration-fields mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <QuickField
              id="quick-first-name"
              name="firstName"
              label="First name"
              placeholder="First name"
              autoComplete="given-name"
              required
              error={errors.firstName?.[0] || errors.name?.[0]}
            />
            <QuickField
              id="quick-last-name"
              name="lastName"
              label="Last name"
              placeholder="Last name"
              autoComplete="family-name"
              required
              error={errors.lastName?.[0] || errors.name?.[0]}
            />
            <div className="sm:col-span-2">
              <QuickField
                id="quick-email"
                name="email"
                label="Email address"
                placeholder="you@example.com"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                error={errors.email?.[0]}
              />
            </div>
            <Field className="lt-market-field min-w-0">
              <FieldLabel htmlFor="quick-state" className="form-label">
                Primary state
              </FieldLabel>
              <NativeSelect
                id="quick-state"
                name="state"
                className="form-select min-w-0 max-w-full"
                value={selectedState}
                onChange={(event) => setSelectedState(event.target.value)}
                autoComplete="address-level1"
                required
                aria-invalid={Boolean(errors.state)}
              >
                <NativeSelectOption value="" disabled>
                  Select state
                </NativeSelectOption>
                <NativeSelectOptGroup label="Initial markets">
                  {FOUNDING_STATES.map((stateCode) => (
                    <NativeSelectOption key={stateCode} value={stateCode}>
                      {stateCode}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
                <NativeSelectOptGroup label="All other states">
                  {US_STATES.filter(
                    (stateCode) =>
                      !FOUNDING_STATES.includes(stateCode as never),
                  ).map((stateCode) => (
                    <NativeSelectOption key={stateCode} value={stateCode}>
                      {stateCode}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              </NativeSelect>
              <FieldError>{errors.state?.[0]}</FieldError>
            </Field>
            <Field className="lt-market-field min-w-0">
              <FieldLabel htmlFor="quick-primary-trade" className="form-label">
                Industry
              </FieldLabel>
              <NativeSelect
                id="quick-primary-trade"
                name="primaryTradeSlug"
                className="form-select min-w-0 max-w-full"
                value={primaryTradeSlug}
                onChange={(event) => setPrimaryTradeSlug(event.target.value)}
                required
                aria-invalid={Boolean(errors.primaryTradeSlug)}
              >
                <NativeSelectOption value="" disabled>
                  Select industry
                </NativeSelectOption>
                {TRADE_CATEGORIES.map((category) => (
                  <NativeSelectOptGroup key={category} label={category}>
                    {QUICK_TRADES.filter(
                      (trade) => trade.category === category,
                    ).map((trade) => (
                      <NativeSelectOption key={trade.value} value={trade.value}>
                        {trade.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelectOptGroup>
                ))}
              </NativeSelect>
              <FieldError>{errors.primaryTradeSlug?.[0]}</FieldError>
            </Field>
            {primaryTradeSlug === 'other-skilled-trade' && (
              <div className="sm:col-span-2">
                <QuickField
                  id="quick-other-trade"
                  name="otherTrade"
                  label="Describe your trade or specialty"
                  placeholder="Your specialty"
                  required
                  error={errors.otherTrade?.[0]}
                />
              </div>
            )}
          </div>
          <Button
            type="button"
            onClick={continueFromMarket}
            className="mt-6 min-h-12 w-full rounded-lg bg-primary text-xs font-black uppercase tracking-[0.09em] text-primary-foreground hover:bg-foreground hover:text-background shadow-md"
          >
            <span>Continue &amp; Choose My Path</span>{' '}
            <ArrowRight aria-hidden="true" />
          </Button>
          <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">
            Hiring for a project?{' '}
            <Link
              className="font-black underline decoration-primary decoration-2 underline-offset-4"
              href="/for-clients#client-preregistration"
            >
              Start Client pre-registration
            </Link>
            .
          </p>
        </fieldset>

        <fieldset hidden={step !== 2} className="min-w-0 border-0 p-0">
          <legend className="sr-only">Step 2: Choose your account type</legend>
          <p className="sr-only">Step 2 of 3</p>
          <h2
            ref={step === 2 ? stepHeadingRef : undefined}
            tabIndex={-1}
            className="lt-form-title"
          >
            Choose your path.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Choose the account that fits you. Add more details later.
          </p>
          <div className="mt-5 grid min-w-0 gap-2 sm:grid-cols-2">
            {PUBLIC_PARTICIPANT_ROLES.map((role) => {
              const active = audienceType === role.audienceType;
              return (
                <label
                  key={role.audienceType}
                  className={`intent-card ${active ? 'intent-card-active' : ''}`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="audienceType"
                    value={role.audienceType}
                    checked={active}
                    onChange={() => setAudienceType(role.audienceType)}
                  />
                  <span className="block text-sm font-semibold">
                    {role.label}
                  </span>
                  <span
                    className={`mt-2 block text-xs leading-5 text-muted-foreground`}
                  >
                    {role.description}
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError className="mt-2">{errors.audienceType?.[0]}</FieldError>

          {(audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM') && (
            <div className="mt-5">
              <QuickField
                id="quick-organization-name"
                name="organizationName"
                label={
                  audienceType === 'BUSINESS'
                    ? 'Service business name'
                    : 'Hiring organization name'
                }
                autoComplete="organization"
                required
                error={errors.organizationName?.[0]}
              />
            </div>
          )}

          <div className="mt-6 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => goBack(1)}
              className="min-h-12 rounded-lg border-foreground/30 bg-transparent px-5 text-xs font-black uppercase tracking-[0.09em]"
            >
              <ArrowLeft aria-hidden="true" /> Back
            </Button>
            <Button
              type="button"
              onClick={continueFromRole}
              className="min-h-12 rounded-lg bg-primary text-xs font-black uppercase tracking-[0.09em] text-primary-foreground hover:bg-foreground hover:text-background shadow-md"
            >
              Add my contact details <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </fieldset>

        <fieldset hidden={step !== 3} className="min-w-0 border-0 p-0">
          <legend className="sr-only">
            Step 3: Finish your pre-registration
          </legend>
          <p className="sr-only">Step 3 of 3</p>
          <h2
            ref={step === 3 ? stepHeadingRef : undefined}
            tabIndex={-1}
            className="lt-form-title"
          >
            Finish your pre-registration.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Add your city, ZIP code, and mobile number so we can place you in
            the right market.
          </p>
          <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
            <QuickField
              id="quick-city"
              name="city"
              label="City"
              autoComplete="address-level2"
              defaultValue={city}
              required
              error={errors.city?.[0]}
            />
            <QuickField
              id="quick-zip"
              name="zip"
              label="ZIP code"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]{5}(-[0-9]{4})?"
              required
              error={errors.zip?.[0]}
            />
            <div className="sm:col-span-2">
              <UsMobileField
                id="quick-mobile"
                name="mobile"
                label="Mobile phone"
                required
                error={errors.mobile?.[0]}
                onChange={() => setSmsConsent(false)}
              />
            </div>
            <div className="sm:col-span-2">
              <QuickField
                id="quick-referral-code"
                name="referredByCode"
                label="Referral code (optional)"
                defaultValue={referralCode}
                autoCapitalize="characters"
                autoComplete="off"
                error={errors.referredByCode?.[0]}
              />
            </div>
          </div>

          <dl className="lt-registration-summary mt-5 grid grid-cols-3 rounded-lg border border-foreground/12 overflow-hidden">
            <div className="min-w-0 border-r border-foreground/12 p-3">
              <dt className="text-[9px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Market
              </dt>
              <dd className="mt-1 truncate text-xs font-black">
                {selectedState || 'Not selected'}
              </dd>
            </div>
            <div className="min-w-0 border-r border-foreground/12 p-3">
              <dt className="text-[9px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Path
              </dt>
              <dd className="mt-1 truncate text-xs font-black">
                {selectedParticipantRole?.label || 'Not selected'}
              </dd>
            </div>
            <div className="min-w-0 p-3">
              <dt className="text-[9px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Industry
              </dt>
              <dd className="mt-1 truncate text-xs font-black">
                {selectedTrade?.label || 'Not selected'}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex min-w-0 items-start gap-3 rounded-lg border border-input bg-white/[0.03] p-4 text-xs leading-5 text-muted-foreground">
            <Checkbox
              id="quick-registration-acknowledgement"
              checked={registrationAcknowledged}
              onCheckedChange={(checked) =>
                setRegistrationAcknowledged(Boolean(checked))
              }
              className="mt-0.5"
              aria-required="true"
              aria-invalid={Boolean(errors.termsAccepted)}
            />
            <div className="min-w-0">
              <label
                htmlFor="quick-registration-acknowledgement"
                className="min-w-0 cursor-pointer"
              >
                I agree to the{' '}
                <Link className="font-bold underline" href="/terms">
                  Website Terms
                </Link>{' '}
                and acknowledge the{' '}
                <Link className="font-bold underline" href="/privacy">
                  Privacy Policy
                </Link>
                . LaborTrader will email me to confirm my registration, verify
                my email, and provide essential account or onboarding notices.
                Marketing updates are optional below. A phone verification text
                is sent only when I request a code.
              </label>
              <FieldError>{errors.termsAccepted?.[0]}</FieldError>
            </div>
          </div>

          <MarketingConsentFields
            prefix="quick"
            emailConsent={emailMarketingConsent}
            onEmailChange={setEmailMarketingConsent}
            smsConsent={smsConsent}
            onSmsChange={setSmsConsent}
          />

          <input
            name="website"
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {message && (
            <div
              ref={statusRef}
              tabIndex={-1}
              role="alert"
              className="mt-5 border-l-2 border-destructive pl-4 text-sm font-semibold leading-6 text-destructive outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {message}
              {Object.keys(errors).length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {Object.entries(errors).map(([field, fieldErrors]) => (
                    <li key={field}>{fieldErrors[0]}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="mt-6 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)]">
            <Button
              type="button"
              variant="outline"
              onClick={() => goBack(2)}
              className="min-h-12 rounded-lg border-foreground/30 bg-transparent px-5 text-xs font-black uppercase tracking-[0.09em]"
            >
              <ArrowLeft aria-hidden="true" /> Back
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="min-h-12 whitespace-normal rounded-lg bg-primary px-5 py-3 text-center text-xs font-black uppercase tracking-[0.09em] text-primary-foreground hover:bg-foreground hover:text-background shadow-md"
            >
              {submitting ? 'Saving…' : 'Submit my pre-registration'}
              {!submitting && <ArrowRight aria-hidden="true" />}
            </Button>
          </div>
          <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
            <ShieldCheck
              className="mt-0.5 size-3.5 shrink-0"
              aria-hidden="true"
            />
            Submission starts email verification. Phone ownership verification
            is a separate step.
          </p>
        </fieldset>
      </div>
      <div className="lt-registration-other-paths">
        Joining as a{' '}
        <Link href="/for-clients#client-preregistration">client</Link>,{' '}
        <Link href="/advertise#provider-application">vendor</Link>,{' '}
        <Link href="/partners#partner-inquiry">partner</Link>, or{' '}
        <Link href="/investors#investor-inquiry">investor</Link>?
      </div>
    </form>
  );
}
