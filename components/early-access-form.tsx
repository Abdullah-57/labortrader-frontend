'use client';

import { fetchWithTimeout } from '@/lib/browser-request';
import { markRegistrationSaved } from '@/lib/registration-reminder';

import Link from 'next/link';
import { MarketingConsentFields } from '@/components/marketing-consent-fields';
import { UsMobileField } from '@/components/us-mobile-field';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowDown, BadgeCheck, Gift, LockKeyhole } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import {
  audienceOptions,
  BusinessFields,
  ContractorFields,
  HiringFirmFields,
  TextField,
  WorkerFields,
  type AudienceType,
  type Intent,
} from '@/components/early-access-role-fields';
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
  PUBLIC_TRADES,
  US_STATES,
  participantRoleByAudienceType,
} from '@/lib/constants';
import { sanitizeQueryText } from '@/lib/query-text';
import { normalizeUsPhoneToE164 } from '@/lib/verification-domain';

function audienceFromQuery(value: string | null): AudienceType | null {
  const normalized = value?.trim().toLowerCase().replaceAll('_', '-');
  if (normalized === 'worker') return 'WORKER';
  if (normalized === 'contractor' || normalized === 'independent-contractor')
    return 'CONTRACTOR';
  if (normalized === 'business' || normalized === 'service-business')
    return 'BUSINESS';
  if (normalized === 'hiring-firm' || normalized === 'hiring-organization')
    return 'HIRING_FIRM';
  return null;
}

function intentFromQuery(value: string | null): Intent | null {
  const normalized = value?.toUpperCase();
  return normalized === 'WORK' || normalized === 'HIRE' || normalized === 'BOTH'
    ? normalized
    : null;
}

function formText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

function optionalBoolean(value: FormDataEntryValue | null) {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

function errorFieldId(field: string) {
  if (
    field === 'termsAccepted' ||
    field === 'privacyAcknowledged' ||
    field === 'launchEmailAcknowledged' ||
    field === 'serviceMessagesAcknowledged'
  ) {
    return 'early-access-registration-acknowledgement';
  }
  if (field === 'businessName') return 'organizationName';
  return field;
}

const TRADE_CATEGORIES = Array.from(
  new Set(PUBLIC_TRADES.map((trade) => trade.category)),
);

function personalizedIntro(audienceType: AudienceType | null, city: string) {
  const place = city || 'your market';
  if (audienceType === 'WORKER') {
    return `Put your skills on the map for opportunities near ${place}.`;
  }
  if (audienceType === 'CONTRACTOR') {
    return `Claim your place among the first independent contractors in ${place}.`;
  }
  if (audienceType === 'BUSINESS') {
    return `Put your hiring needs and open capacity on the map near ${place}.`;
  }
  if (audienceType === 'HIRING_FIRM') {
    return city
      ? `Put your skilled hiring demand on the map near ${city}.`
      : 'Put your skilled hiring demand in the right local market.';
  }
  return 'Choose the role that best describes what you bring to the marketplace.';
}

type ManagedSignup = {
  audienceType: AudienceType;
  intent: Intent | null;
  hasDetailedProfile: boolean;
  name: string;
  organizationName: string | null;
  email: string;
  mobile: string | null;
  city: string;
  state: string;
  zip: string;
  primaryTradeSlug: string;
  secondaryTradeSlug: string | null;
  otherTrade: string | null;
  smsConsent: boolean;
  emailMarketingConsent: boolean;
  worker: {
    professionalStatus: string | null;
    otherProfessionalStatus: string | null;
    experienceRange: string | null;
    availabilityPreference: string | null;
    desiredRate: string | null;
    serviceArea: string | null;
    additionalTrades: string[];
    travelRadiusMiles: number | null;
    ownsTools: boolean | null;
    reliableTransportation: boolean | null;
  } | null;
  business: {
    businessName: string | null;
    businessType: string | null;
    licenseStatus: string | null;
    companySize: string | null;
    serviceArea: string | null;
    availabilityPreference: string | null;
    tradesNeeded: string[];
    servicesOffered: string[];
    shortageFrequency: string | null;
  } | null;
  hiringFirm: {
    organizationName: string | null;
    organizationType: string | null;
    contactRole: string | null;
    marketsServed: string | null;
    tradesSuppliedOrHired: string[];
    organizationCapabilities: string[];
    shortDurationInterest: boolean | null;
  } | null;
};

export function EarlyAccessForm() {
  return (
    <Suspense
      fallback={
        <div
          className="h-[760px] min-w-0 animate-pulse border border-background/10 bg-card"
          aria-label="Loading detailed pre-registration form"
        />
      }
    >
      <EarlyAccessFormContent />
    </Suspense>
  );
}

function EarlyAccessFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isManaging = searchParams.get('manage') === '1';
  const initialAudience = audienceFromQuery(searchParams.get('role'));
  const initialCity = sanitizeQueryText(searchParams.get('city'), 100);
  const initialState = sanitizeQueryText(
    searchParams.get('state'),
    2,
  ).toUpperCase();
  const requestedTrade = sanitizeQueryText(searchParams.get('trade'), 100);
  const initialPrimaryTrade = PUBLIC_TRADES.some(
    (trade) => trade.slug === requestedTrade,
  )
    ? requestedTrade
    : '';
  const [audienceType, setAudienceType] = useState<AudienceType | null>(
    initialAudience,
  );
  const [intent, setIntent] = useState<Intent | null>(() =>
    initialAudience === 'WORKER' || initialAudience === 'CONTRACTOR'
      ? 'WORK'
      : intentFromQuery(searchParams.get('intent')),
  );
  const [mobile, setMobile] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);
  const [emailMarketingConsent, setEmailMarketingConsent] = useState(false);
  const [registrationAcknowledged, setRegistrationAcknowledged] =
    useState(false);
  const [primaryTradeSlug, setPrimaryTradeSlug] = useState(initialPrimaryTrade);
  const [secondaryTradeSlug, setSecondaryTradeSlug] = useState('');
  const [professionalStatus, setProfessionalStatus] = useState('');
  const [otherProfessionalStatus, setOtherProfessionalStatus] = useState('');
  const [licenseStatus, setLicenseStatus] = useState('');
  const [eligibilityConfirmed, setEligibilityConfirmed] = useState(false);
  const [organizationType, setOrganizationType] = useState('');
  const [additionalTrades, setAdditionalTrades] = useState<string[]>([]);
  const [tradesNeeded, setTradesNeeded] = useState<string[]>([]);
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [organizationCapabilities, setOrganizationCapabilities] = useState<
    string[]
  >(initialAudience === 'HIRING_FIRM' ? ['hiring-demand'] : []);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [existingNotice, setExistingNotice] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [managedSignup, setManagedSignup] = useState<
    ManagedSignup | null | undefined
  >(isManaging ? undefined : null);
  const [manageLoadError, setManageLoadError] = useState('');
  const idempotencyKey = useRef('');
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const referralInputRef = useRef<HTMLInputElement>(null);
  const referralCode = sanitizeQueryText(searchParams.get('ref'), 35);
  const querySource = sanitizeQueryText(searchParams.get('source'), 160);

  useEffect(() => {
    const firstReferralCode = sanitizeQueryText(
      readAttribution().ref || referralCode,
      35,
    );
    if (!firstReferralCode) return;
    if (referralInputRef.current) {
      referralInputRef.current.value = firstReferralCode;
    }
    void fetchWithTimeout('/api/referrals/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: firstReferralCode }),
    }).catch(() => undefined);
  }, [referralCode]);

  useEffect(() => {
    if (!isManaging) return;
    const controller = new AbortController();
    fetchWithTimeout('/api/early-access/current', {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          throw new Error('current-signup-unavailable');
        }
        return (data.signup || null) as ManagedSignup | null;
      })
      .then((next) => {
        setManagedSignup(next);
        if (!next) return;
        setAudienceType(next.audienceType);
        setIntent(
          next.audienceType === 'WORKER' || next.audienceType === 'CONTRACTOR'
            ? 'WORK'
            : next.intent,
        );
        setMobile(next.mobile || '');
        setSmsConsent(Boolean(next.mobile && next.smsConsent));
        setEmailMarketingConsent(Boolean(next.emailMarketingConsent));
        setPrimaryTradeSlug(next.primaryTradeSlug || '');
        setSecondaryTradeSlug(next.secondaryTradeSlug || '');
        setProfessionalStatus(next.worker?.professionalStatus || '');
        setOtherProfessionalStatus(next.worker?.otherProfessionalStatus || '');
        setLicenseStatus(next.business?.licenseStatus || '');
        setOrganizationType(next.hiringFirm?.organizationType || '');
        setAdditionalTrades(next.worker?.additionalTrades || []);
        setTradesNeeded(
          next.audienceType === 'HIRING_FIRM'
            ? next.hiringFirm?.tradesSuppliedOrHired || []
            : next.business?.tradesNeeded || [],
        );
        setServicesOffered(next.business?.servicesOffered || []);
        setOrganizationCapabilities(
          next.audienceType === 'HIRING_FIRM' ? ['hiring-demand'] : [],
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError')
          return;
        setManageLoadError(
          'We could not load your saved registration right now. Your existing registration has not been changed.',
        );
        setManagedSignup(null);
      });
    return () => controller.abort();
  }, [isManaging]);

  function showErrors(
    nextErrors: Record<string, string[]>,
    nextMessage: string,
  ) {
    setErrors(nextErrors);
    setMessage(nextMessage);
    const firstField = Object.keys(nextErrors)[0];
    // Wait for the error summary to mount, then scroll to the field — not the
    // page top. Focus uses preventScroll so focus does not fight scrollIntoView.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const targetId =
          firstField === 'termsAccepted' ||
          firstField === 'privacyAcknowledged' ||
          firstField === 'launchEmailAcknowledged' ||
          firstField === 'serviceMessagesAcknowledged'
            ? 'early-access-terms-block'
            : firstField === 'audienceType'
              ? 'audience-error'
              : firstField
                ? errorFieldId(firstField)
                : '';
        const target = targetId
          ? document.getElementById(targetId) ||
            (firstField
              ? document.querySelector<HTMLElement>(
                  `[name="${CSS.escape(firstField)}"]`,
                )
              : null)
          : null;
        if (target) {
          target.scrollIntoView({ block: 'center', behavior: 'smooth' });
          const focusable = target.matches(
            'button,input,select,textarea,[tabindex]',
          )
            ? target
            : target.querySelector<HTMLElement>(
                'button,input,select,textarea,[tabindex]',
              );
          focusable?.focus({ preventScroll: true });
          return;
        }
        errorSummaryRef.current?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
        errorSummaryRef.current?.focus({ preventScroll: true });
      });
    });
  }

  function chooseAudience(nextAudience: AudienceType) {
    setAudienceType(nextAudience);
    setIntent(
      nextAudience === 'WORKER' || nextAudience === 'CONTRACTOR'
        ? 'WORK'
        : null,
    );
    setProfessionalStatus('');
    setOtherProfessionalStatus('');
    setLicenseStatus('');
    setEligibilityConfirmed(false);
    setOrganizationType('');
    setAdditionalTrades([]);
    setTradesNeeded([]);
    setServicesOffered([]);
    setOrganizationCapabilities(
      nextAudience === 'HIRING_FIRM' ? ['hiring-demand'] : [],
    );
    setMessage('');
    setErrors({});
    setExistingNotice('');
  }

  function toggle(
    value: string,
    values: string[],
    setValues: (next: string[]) => void,
  ) {
    setValues(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    );
  }

  function validateBasicFields(formElement: HTMLFormElement) {
    const nextErrors: Record<string, string[]> = {};
    const form = new FormData(formElement);
    const name = formText(form, 'name').trim();
    const email = formText(form, 'email').trim();
    const city = (
      isManaging ? managedSignup?.city || '' : formText(form, 'city')
    ).trim();
    const state = (
      isManaging ? managedSignup?.state || '' : formText(form, 'state')
    )
      .trim()
      .toUpperCase();
    const zip = (
      isManaging ? managedSignup?.zip || '' : formText(form, 'zip')
    ).trim();

    if (name.length < 2) nextErrors.name = ['Enter your name.'];
    if (!/^\S+@\S+\.\S+$/u.test(email)) {
      nextErrors.email = ['Enter a valid email address.'];
    }
    if (!mobile.trim()) {
      nextErrors.mobile = ['Enter your mobile number.'];
    } else if (!normalizeUsPhoneToE164(mobile)) {
      nextErrors.mobile = [
        'Enter a complete 10-digit U.S. mobile number (example: 415 555 2671).',
      ];
    }
    if (!city || city.length < 2) nextErrors.city = ['Enter your city.'];
    if (!US_STATES.includes(state as never)) {
      nextErrors.state = ['Choose a valid state.'];
    }
    if (!/^\d{5}(?:-\d{4})?$/u.test(zip)) {
      nextErrors.zip = ['Enter a valid ZIP code.'];
    }
    if (!primaryTradeSlug) {
      nextErrors.primaryTradeSlug = ['Choose your primary trade or specialty.'];
    }
    if (secondaryTradeSlug && secondaryTradeSlug === primaryTradeSlug) {
      nextErrors.secondaryTradeSlug = [
        'Choose a different secondary trade or leave it blank.',
      ];
    }
    if (!audienceType) {
      nextErrors.audienceType = ['Choose a registration type.'];
    }
    if (
      (audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM') &&
      formText(form, 'organizationName').trim().length < 2
    ) {
      nextErrors.organizationName = ['Enter your organization name.'];
    }
    if (!registrationAcknowledged) {
      nextErrors.termsAccepted = [
        'Agree to the Website Terms and acknowledge the Privacy Policy to continue.',
      ];
    }
    if (
      primaryTradeSlug === 'other-skilled-trade' &&
      !formText(form, 'otherTrade').trim()
    ) {
      nextErrors.otherTrade = [
        'Tell us which trade or specialty you perform or hire for.',
      ];
    }
    return nextErrors;
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const conditionalErrors = validateBasicFields(formElement);
    if (Object.keys(conditionalErrors).length > 0) {
      showErrors(
        conditionalErrors,
        'Complete the required registration fields and try again.',
      );
      return;
    }
    if (!audienceType) return;

    setSubmitting(true);
    setMessage('');
    setExistingNotice('');
    setErrors({});
    const form = new FormData(formElement);
    const attribution = readAttribution();
    const rawRadius = form.get('travelRadiusMiles');
    const travelRadiusMiles =
      typeof rawRadius === 'string' && rawRadius
        ? Number(rawRadius)
        : undefined;
    const city = (
      isManaging ? managedSignup?.city || '' : formText(form, 'city')
    ).trim();
    const state = (
      isManaging ? managedSignup?.state || '' : formText(form, 'state')
    )
      .trim()
      .toUpperCase();
    const organizationName = formText(form, 'organizationName').trim();

    const payload = {
      audienceType,
      name: form.get('name'),
      organizationName: organizationName || undefined,
      email: form.get('email'),
      mobile: normalizeUsPhoneToE164(mobile) || mobile,
      city,
      state,
      zip: form.get('zip'),
      primaryTradeSlug,
      secondaryTradeSlug: form.get('secondaryTradeSlug') || undefined,
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
          : attribution.source || attribution.utm_source || querySource || '',
      landingPage: attribution.landing_page || window.location.pathname,
      utmSource: attribution.utm_source || '',
      utmMedium: attribution.utm_medium || '',
      utmCampaign: attribution.utm_campaign || '',
      utmContent: attribution.utm_content || '',
      utmTerm: attribution.utm_term || '',
      promoCode: attribution.promo || '',
      referredByCode:
        (isManaging
          ? ''
          : attribution.ref || referralCode || form.get('referredByCode')) ||
        '',
      website: form.get('website'),
      intent: audienceType === 'WORKER' ? 'WORK' : intent || undefined,
      businessName: form.get('businessName') || organizationName || undefined,
      businessType: form.get('businessType') || undefined,
      professionalStatus: form.get('professionalStatus') || undefined,
      otherProfessionalStatus: form.get('otherProfessionalStatus') || undefined,
      experienceRange: form.get('experienceRange') || undefined,
      availabilityPreference: form.get('availabilityPreference') || undefined,
      desiredRate: form.get('desiredRate') || undefined,
      serviceArea: form.get('serviceArea') || undefined,
      travelRadiusMiles,
      ownsTools: optionalBoolean(form.get('ownsTools')),
      reliableTransportation: optionalBoolean(
        form.get('reliableTransportation'),
      ),
      additionalTrades,
      licenseStatus: form.get('licenseStatus') || undefined,
      contractorEligibilityConfirmed:
        audienceType === 'CONTRACTOR' && licenseStatus === 'licensed'
          ? eligibilityConfirmed
          : false,
      companySize: form.get('companySize') || undefined,
      tradesNeeded:
        audienceType === 'BUSINESS' && intent === 'WORK' ? [] : tradesNeeded,
      servicesOffered:
        audienceType === 'BUSINESS' && intent === 'HIRE' ? [] : servicesOffered,
      shortageFrequency: form.get('shortageFrequency') || undefined,
      organizationType: form.get('organizationType') || undefined,
      contactRole: form.get('contactRole') || undefined,
      marketsServed: form.get('marketsServed') || undefined,
      organizationCapabilities,
      shortDurationInterest:
        audienceType === 'HIRING_FIRM'
          ? optionalBoolean(form.get('shortDurationInterest'))
          : undefined,
      manageExisting: isManaging,
    };

    try {
      const response = await fetchWithTimeout('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        showErrors(
          data?.errors || {},
          data?.message || 'We could not save your pre-registration.',
        );
        return;
      }
      markRegistrationSaved();
      if (data.outcome !== 'SAVED') {
        router.push('/portal?access=required');
        return;
      }
      const option = audienceOptions.find(
        (item) => item.value === audienceType,
      );
      const completeParams = new URLSearchParams({
        role: option?.slug || 'worker',
        city,
        state,
        registration: data.registrationStage === 'FULL' ? 'complete' : 'basic',
        submitted: '1',
      });
      router.push(`/early-access/complete?${completeParams.toString()}`);
    } catch {
      showErrors(
        {},
        'We could not reach LaborTrader. Check your connection and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  const selectedAudience = audienceOptions.find(
    (option) => option.value === audienceType,
  );
  const selectedPublicRole = participantRoleByAudienceType(audienceType);
  const launchBenefitCap =
    audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM'
      ? '$1,000'
      : '$500';
  const personalizedCity = managedSignup?.city || initialCity;

  if (isManaging && managedSignup === undefined) {
    return (
      <section
        aria-busy="true"
        aria-label="Loading your saved registration"
        className="lt-surface-light h-80 animate-pulse border border-foreground/14 bg-card lt-form-panel"
      />
    );
  }

  if (isManaging && managedSignup === null) {
    return (
      <section className="lt-surface-light border border-foreground/14 bg-card p-6 text-foreground shadow-xl sm:p-8 lt-form-panel">
        <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
          Registration update
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em]">
          We could not open a saved registration.
        </h2>
        <p
          role={manageLoadError ? 'alert' : undefined}
          className="mt-4 text-sm leading-6 text-muted-foreground"
        >
          {manageLoadError ||
            'Open a current secure email access link, then return here to continue your registration.'}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="button-primary" href="/early-access/complete">
            Return to confirmation
          </Link>
          <Link className="button-dark" href="/contact">
            Contact support
          </Link>
        </div>
      </section>
    );
  }

  if (isManaging && managedSignup?.hasDetailedProfile) {
    return (
      <section className="lt-surface-light border border-foreground/14 bg-card p-6 text-foreground shadow-xl sm:p-8 lt-form-panel">
        <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
          Detailed profile already saved
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em]">
          Manage your registration in the secure portal.
        </h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Review your verification, benefits, referrals, and profile details in
          the portal.
        </p>
        <Link className="button-primary mt-6" href="/portal">
          Return to secure portal
        </Link>
      </section>
    );
  }

  return (
    <form
      onSubmit={submit}
      aria-busy={Boolean(submitting)}
      className="lt-surface-light min-w-0 max-w-full border border-foreground/14 bg-card p-4 text-foreground shadow-[0_28px_80px_rgba(0,0,0,.2)] sm:p-8 lt-form-panel"
      noValidate
    >
      <div className="min-w-0 border-b border-foreground/10 pb-6">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
              {isManaging ? 'Complete your registration' : 'One registration'}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
              {isManaging
                ? 'Finish the profile your market will see.'
                : 'Start with the basics.'}
            </h2>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
            <LockKeyhole className="size-4 text-primary" /> Private registration
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {isManaging
            ? personalizedIntro(audienceType, personalizedCity)
            : 'Add optional details now or return through your secure email link later.'}
        </p>
      </div>

      <section className="mt-7">
        <h3 className="sr-only">Required registration details</h3>
        {isManaging && (
          <p className="mt-3 border-l-2 border-primary pl-4 text-xs font-semibold leading-5 text-muted-foreground">
            Need to change your role, market, or primary trade? Use registration
            corrections in your secure portal.
          </p>
        )}

        <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
          <TextField
            name="name"
            label="Your name"
            autoComplete="name"
            required
            defaultValue={managedSignup?.name ?? ''}
            error={errors.name?.[0]}
          />
          <TextField
            name="email"
            label={isManaging ? 'Email (contact support to change)' : 'Email'}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            readOnly={isManaging}
            defaultValue={managedSignup?.email ?? ''}
            error={errors.email?.[0]}
          />
          <UsMobileField
            id="mobile"
            name="mobile"
            label="Mobile phone"
            required
            value={mobile}
            error={errors.mobile?.[0]}
            onChange={(next) => {
              setMobile(next);
              setSmsConsent(false);
            }}
          />
          <TextField
            ref={referralInputRef}
            name="referredByCode"
            label="Referral code (optional)"
            defaultValue={referralCode}
            autoCapitalize="characters"
            autoComplete="off"
            error={errors.referredByCode?.[0]}
          />
          <TextField
            name="city"
            label="City"
            autoComplete="address-level2"
            defaultValue={managedSignup?.city ?? initialCity}
            readOnly={isManaging}
            required
            error={errors.city?.[0]}
          />
          <div className="grid min-w-0 grid-cols-1 gap-5 min-[420px]:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] sm:gap-3">
            <Field className="min-w-0">
              <FieldLabel htmlFor="state" className="form-label">
                State
              </FieldLabel>
              <NativeSelect
                id="state"
                name="state"
                className="form-select min-w-0 max-w-full"
                defaultValue={
                  US_STATES.includes(
                    (managedSignup?.state || initialState) as never,
                  )
                    ? managedSignup?.state || initialState
                    : ''
                }
                autoComplete="address-level1"
                disabled={isManaging}
                required
                aria-invalid={Boolean(errors.state)}
                aria-describedby={errors.state ? 'state-error' : undefined}
              >
                <NativeSelectOption value="" disabled>
                  Select
                </NativeSelectOption>
                {US_STATES.map((state) => (
                  <NativeSelectOption key={state} value={state}>
                    {state}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
              <FieldError id="state-error">{errors.state?.[0]}</FieldError>
            </Field>
            <TextField
              name="zip"
              label="ZIP"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]{5}(-[0-9]{4})?"
              readOnly={isManaging}
              required
              defaultValue={managedSignup?.zip ?? ''}
              error={errors.zip?.[0]}
            />
          </div>
          <Field className="min-w-0">
            <FieldLabel htmlFor="primaryTradeSlug" className="form-label">
              Primary trade or specialty
            </FieldLabel>
            <NativeSelect
              id="primaryTradeSlug"
              name="primaryTradeSlug"
              className="form-select min-w-0 max-w-full"
              disabled={isManaging}
              required
              value={primaryTradeSlug}
              onChange={(event) => {
                const nextPrimary = event.target.value;
                setPrimaryTradeSlug(nextPrimary);
                if (secondaryTradeSlug === nextPrimary) {
                  setSecondaryTradeSlug('');
                }
              }}
              aria-invalid={Boolean(errors.primaryTradeSlug)}
              aria-describedby={
                errors.primaryTradeSlug ? 'primary-trade-error' : undefined
              }
            >
              <NativeSelectOption value="" disabled>
                Choose a trade
              </NativeSelectOption>
              {TRADE_CATEGORIES.map((category) => (
                <NativeSelectOptGroup key={category} label={category}>
                  {PUBLIC_TRADES.filter(
                    (trade) => trade.category === category,
                  ).map((trade) => (
                    <NativeSelectOption key={trade.slug} value={trade.slug}>
                      {trade.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              ))}
            </NativeSelect>
            <FieldError id="primary-trade-error">
              {errors.primaryTradeSlug?.[0]}
            </FieldError>
          </Field>
          <Field className="min-w-0">
            <FieldLabel htmlFor="secondaryTradeSlug" className="form-label">
              Secondary trade or specialty (optional)
            </FieldLabel>
            <NativeSelect
              id="secondaryTradeSlug"
              name="secondaryTradeSlug"
              className="form-select min-w-0 max-w-full"
              value={secondaryTradeSlug}
              onChange={(event) => setSecondaryTradeSlug(event.target.value)}
              aria-invalid={Boolean(errors.secondaryTradeSlug)}
              aria-describedby={
                errors.secondaryTradeSlug ? 'secondary-trade-error' : undefined
              }
            >
              <NativeSelectOption value="">
                No secondary trade
              </NativeSelectOption>
              {TRADE_CATEGORIES.filter((category) => category !== 'Other').map(
                (category) => (
                  <NativeSelectOptGroup key={category} label={category}>
                    {PUBLIC_TRADES.filter(
                      (trade) =>
                        trade.category === category &&
                        trade.slug !== primaryTradeSlug,
                    ).map((trade) => (
                      <NativeSelectOption key={trade.slug} value={trade.slug}>
                        {trade.label}
                      </NativeSelectOption>
                    ))}
                  </NativeSelectOptGroup>
                ),
              )}
            </NativeSelect>
            <FieldError id="secondary-trade-error">
              {errors.secondaryTradeSlug?.[0]}
            </FieldError>
          </Field>
          {primaryTradeSlug === 'other-skilled-trade' && (
            <div className="sm:col-span-2">
              <TextField
                name="otherTrade"
                label="Describe your trade or specialty"
                placeholder="Your specialty"
                readOnly={isManaging}
                required
                defaultValue={managedSignup?.otherTrade ?? ''}
                error={errors.otherTrade?.[0]}
              />
            </div>
          )}
        </div>

        <fieldset
          id="audienceType"
          tabIndex={-1}
          className="mt-7 scroll-mt-28 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-describedby="audience-error"
        >
          <legend className="text-sm font-semibold">
            How will you use LaborTrader?
          </legend>
          <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
            {audienceOptions.map((option) => {
              const Icon = option.icon;
              const active = audienceType === option.value;
              return (
                <label
                  key={option.value}
                  className={`intent-card min-w-0 ${isManaging ? 'cursor-default' : 'cursor-pointer'} ${active ? 'intent-card-active' : ''}`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="audienceType"
                    value={option.value}
                    checked={active}
                    disabled={isManaging}
                    onChange={() => chooseAudience(option.value)}
                  />
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="mt-4 block text-sm font-semibold uppercase tracking-[0.04em]">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                    {option.description}
                  </span>
                </label>
              );
            })}
          </div>
          <FieldError id="audience-error">
            {errors.audienceType?.[0]}
          </FieldError>
        </fieldset>

        {(audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM') && (
          <div className="mt-5">
            <TextField
              name="organizationName"
              label={
                audienceType === 'BUSINESS'
                  ? 'Service business name'
                  : 'Organization name'
              }
              autoComplete="organization"
              required
              defaultValue={managedSignup?.organizationName ?? ''}
              error={errors.organizationName?.[0] || errors.businessName?.[0]}
            />
          </div>
        )}

        {selectedPublicRole && (
          <p className="mt-5 border-l-2 border-primary pl-4 text-sm font-bold leading-6 text-foreground">
            Pre-register before launch for up to 90 days of eligible platform
            use, capped at {launchBenefitCap}. Free-use eligibility requires
            your detailed profile. Activation starts after verification,
            approval, and market launch. No monthly membership fee.
          </p>
        )}

        <div
          id="early-access-terms-block"
          className="mt-7 flex min-w-0 items-start gap-3 border border-input bg-white/[0.03] p-4 text-xs leading-5 text-muted-foreground"
        >
          <Checkbox
            id="early-access-registration-acknowledgement"
            checked={registrationAcknowledged}
            onCheckedChange={(checked) =>
              setRegistrationAcknowledged(Boolean(checked))
            }
            className="mt-0.5"
            aria-required="true"
            aria-invalid={Boolean(errors.termsAccepted)}
            aria-describedby={
              errors.termsAccepted ? 'early-access-terms-error' : undefined
            }
          />
          <div className="min-w-0">
            <label
              htmlFor="early-access-registration-acknowledgement"
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
              . LaborTrader will email me to confirm my registration, verify my
              email, and provide essential account or onboarding notices.
              Marketing updates are optional below. A phone verification text is
              sent only when I request a code.
            </label>
            <FieldError id="early-access-terms-error">
              {errors.termsAccepted?.[0]}
            </FieldError>
          </div>
        </div>

        <MarketingConsentFields
          prefix="early-access"
          emailConsent={emailMarketingConsent}
          onEmailChange={setEmailMarketingConsent}
          smsConsent={smsConsent}
          onSmsChange={setSmsConsent}
          showSms={Boolean(mobile)}
        />
      </section>

      {(message || existingNotice) && (
        <div
          ref={errorSummaryRef}
          tabIndex={-1}
          role={message ? 'alert' : 'status'}
          className={`mt-6 border-l-2 pl-4 text-sm font-semibold leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            message
              ? 'border-destructive text-destructive'
              : 'border-primary text-foreground'
          }`}
        >
          {message || existingNotice}
          {Object.keys(errors).length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  <button
                    type="button"
                    className="text-left underline underline-offset-3"
                    onClick={() => {
                      const id =
                        field === 'termsAccepted' ||
                        field === 'privacyAcknowledged' ||
                        field === 'launchEmailAcknowledged' ||
                        field === 'serviceMessagesAcknowledged'
                          ? 'early-access-terms-block'
                          : errorFieldId(field);
                      const el = document.getElementById(id);
                      el?.scrollIntoView({
                        block: 'center',
                        behavior: 'smooth',
                      });
                      const focusable = el?.matches(
                        'button,input,select,textarea,[tabindex]',
                      )
                        ? el
                        : el?.querySelector<HTMLElement>(
                            'button,input,select,textarea,[tabindex]',
                          );
                      focusable?.focus({ preventScroll: true });
                    }}
                  >
                    {fieldErrors[0]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <details
        id="full-registration-details"
        className="group mt-8 border border-foreground/14 bg-primary/[.07]"
        open={Boolean(isManaging || initialAudience)}
      >
        <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 p-5 marker:content-none sm:p-7 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Optional account details
            </span>
            <span className="mt-2 block text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
              Prepare for launch.
            </span>
            <span className="mt-2 block max-w-2xl text-xs font-semibold leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              Add details for launch matching and referral access. You can also
              return later.
            </span>
          </span>
          <span className="grid size-10 shrink-0 place-items-center border border-foreground/14 bg-background text-primary">
            <ArrowDown
              className="size-5 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </summary>

        <section className="border-t border-foreground/14 p-5 sm:p-7">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Complete your role details and contact verification to unlock your
            referral link.
          </p>
          <div className="lt-form-benefits mt-5 grid gap-3 sm:grid-cols-3">
            {[
              [
                BadgeCheck,
                'Get ready',
                'Complete your profile and verify your email and phone.',
              ],
              [
                Gift,
                'Invite & earn',
                'Earn 10 extra days per verified referral through your link. Your dollar cap stays the same.',
              ],
              [
                ArrowDown,
                'More to come',
                'Be eligible for additional early-member benefits as they are released.',
              ],
            ].map(([Icon, title, text]) => {
              const BenefitIcon = Icon as typeof BadgeCheck;
              return (
                <div
                  key={String(title)}
                  className="border border-foreground/12 bg-white/[0.03] p-4"
                >
                  <BenefitIcon
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-sm font-semibold">{String(title)}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {String(text)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {audienceType ? (
          <section className="border-t border-foreground/12 bg-white/[0.03] p-5 sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              {selectedAudience?.label} account details
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.035em]">
              Give the marketplace enough to make the right match.
            </h3>
            {audienceType === 'WORKER' && (
              <WorkerFields
                errors={errors}
                professionalStatus={professionalStatus}
                setProfessionalStatus={setProfessionalStatus}
                otherProfessionalStatus={otherProfessionalStatus}
                setOtherProfessionalStatus={setOtherProfessionalStatus}
                additionalTrades={additionalTrades}
                defaults={managedSignup?.worker ?? undefined}
                onToggle={(value) =>
                  toggle(value, additionalTrades, setAdditionalTrades)
                }
              />
            )}
            {audienceType === 'CONTRACTOR' && (
              <ContractorFields
                errors={errors}
                licenseStatus={licenseStatus}
                setLicenseStatus={(value) => {
                  setLicenseStatus(value);
                  if (value !== 'licensed') setEligibilityConfirmed(false);
                }}
                eligibilityConfirmed={eligibilityConfirmed}
                setEligibilityConfirmed={setEligibilityConfirmed}
                additionalTrades={additionalTrades}
                defaults={
                  managedSignup
                    ? {
                        businessName:
                          managedSignup.business?.businessName ||
                          managedSignup.organizationName,
                        serviceArea:
                          managedSignup.business?.serviceArea ||
                          managedSignup.worker?.serviceArea,
                        availabilityPreference:
                          managedSignup.business?.availabilityPreference ||
                          managedSignup.worker?.availabilityPreference,
                      }
                    : undefined
                }
                onToggleAdditional={(value) =>
                  toggle(value, additionalTrades, setAdditionalTrades)
                }
              />
            )}
            {audienceType === 'BUSINESS' && (
              <BusinessFields
                errors={errors}
                intent={intent}
                setIntent={(nextIntent) => {
                  setIntent(nextIntent);
                  if (nextIntent === 'HIRE') setServicesOffered([]);
                  if (nextIntent === 'WORK') setTradesNeeded([]);
                }}
                tradesNeeded={tradesNeeded}
                servicesOffered={servicesOffered}
                licenseStatus={licenseStatus}
                setLicenseStatus={setLicenseStatus}
                defaults={managedSignup?.business ?? undefined}
                onToggleNeeded={(value) =>
                  toggle(value, tradesNeeded, setTradesNeeded)
                }
                onToggleOffered={(value) =>
                  toggle(value, servicesOffered, setServicesOffered)
                }
              />
            )}
            {audienceType === 'HIRING_FIRM' && (
              <HiringFirmFields
                errors={errors}
                organizationType={organizationType}
                setOrganizationType={setOrganizationType}
                tradesNeeded={tradesNeeded}
                defaults={managedSignup?.hiringFirm ?? undefined}
                onToggleTrade={(value) =>
                  toggle(value, tradesNeeded, setTradesNeeded)
                }
              />
            )}
            {primaryTradeSlug !== 'other-skilled-trade' &&
              [
                ...additionalTrades,
                ...tradesNeeded,
                ...servicesOffered,
              ].includes('other-skilled-trade') && (
                <div className="mt-5">
                  <TextField
                    name="otherTrade"
                    label="Describe the other trade or specialty"
                    placeholder="Your specialty"
                    defaultValue={managedSignup?.otherTrade ?? ''}
                    error={errors.otherTrade?.[0]}
                  />
                </div>
              )}

            <div className="mt-6 flex gap-3 border-l-2 border-primary pl-4 text-xs leading-5 text-muted-foreground">
              <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" />
              <p>
                Add credential numbers in your secure portal after email
                verification. Each claim is reviewed before it is marked
                verified.
              </p>
            </div>
          </section>
        ) : (
          <p className="border-t border-foreground/12 bg-white/[0.03] p-5 text-sm font-bold leading-6 text-muted-foreground sm:p-7">
            Choose your role above to open the account details built for you.
          </p>
        )}
      </details>

      <input
        name="website"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <Button
        type="submit"
        disabled={submitting || !audienceType}
        className="mt-7 min-h-12 w-full whitespace-normal rounded-none bg-primary px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.09em] text-primary-foreground hover:bg-primary/90"
      >
        {submitting
          ? isManaging
            ? 'Saving your registration...'
            : 'Submitting your registration...'
          : isManaging
            ? 'Save my registration'
            : 'Submit my LaborTrader registration'}
      </Button>
      <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
        The required fields are enough to pre-register. You can finish optional
        details later.
      </p>
    </form>
  );
}
