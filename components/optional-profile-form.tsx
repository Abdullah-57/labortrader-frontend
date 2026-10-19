'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, Copy, Share2 } from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import {
  audienceOptions,
  SelectField,
  TextField,
  type AudienceType,
  type Intent,
} from '@/components/early-access-role-fields';
import {
  ParticipantEmailAccessForm,
  PhoneVerificationPanel,
} from '@/components/participant-verification';
import { ParticipantCredentialClaims } from '@/components/participant-credential-claims';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldError } from '@/components/ui/field';
import {
  participantRoleByAudienceType,
  PUBLIC_TRADES,
  SHORTAGE_TIMING_OPTIONS,
  US_STATES,
} from '@/lib/constants';
import type { FoundingEvaluationView } from '@/lib/award-reconciliation-domain';

type SignupDetail = {
  additionalTrades?: string[];
  tradesNeeded?: string[];
  servicesOffered?: string[];
  organizationCapabilities?: string[];
  desiredRate?: string | null;
  travelRadiusMiles?: number | null;
  ownsTools?: boolean | null;
  reliableTransportation?: boolean | null;
  shortageFrequency?: string | null;
};

type CurrentSignup = {
  audienceType: AudienceType;
  intent: Intent | null;
  name: string;
  organizationName: string | null;
  city: string;
  state: string;
  zip: string;
  marketName: string | null;
  primaryTradeSlug: string;
  secondaryTradeSlug: string | null;
  otherTrade: string | null;
  displayFoundingOrdinal: boolean;
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  fullyVerifiedAt: string | null;
  maskedPhone: string | null;
  referralCode: string | null;
  founding: { ordinal: number; status: string } | null;
  foundingEvaluation: FoundingEvaluationView;
  entitlements: Array<{
    status: string;
    baseDays: number;
    referralBonusDays: number;
    usageCapCents: number;
    usageConsumedCents: number;
    startsAt: string | null;
    endsAt: string | null;
  }>;
  referralProgress: {
    registrations: number;
    qualified: number;
    awardedDays: number;
    capIncreaseCents: 0;
  } | null;
  hasDetailedProfile: boolean;
  verificationCaptureMode: boolean;
  worker: SignupDetail | null;
  business: SignupDetail | null;
  hiringFirm: SignupDetail | null;
};

function audienceLabel(audienceType: AudienceType) {
  return (
    audienceOptions.find((option) => option.value === audienceType)?.label ||
    'Participant'
  );
}

function referralCopy(audienceType: AudienceType) {
  if (audienceType === 'WORKER') {
    return {
      heading: 'Know another skilled worker who should hear about the launch?',
      text: 'Skilled workers are joining LaborTrader by trade and market now.',
    };
  }
  if (audienceType === 'CONTRACTOR') {
    return {
      heading: 'Know an independent contractor who should get in early?',
      text: 'Independent trade contractors are claiming their place in local launch markets.',
    };
  }
  if (audienceType === 'BUSINESS') {
    return {
      heading: 'Know a service business that hires or offers skilled capacity?',
      text: 'Service businesses are putting hiring demand and open capacity on the map.',
    };
  }
  return {
    heading: 'Know a hiring organization that should join the launch list?',
    text: 'LaborTrader gives hiring organizations a direct path to qualified skilled-trade capacity.',
  };
}

export function OptionalProfileForm() {
  return (
    <Suspense
      fallback={
        <section
          aria-busy="true"
          aria-label="Loading your LaborTrader pre-registration"
          className="h-80 animate-pulse border border-foreground/10 bg-card"
        >
          <h1 className="sr-only">Loading Your LaborTrader Pre-registration</h1>
        </section>
      }
    >
      <OptionalProfileFormContent />
    </Suspense>
  );
}

function OptionalProfileFormContent() {
  const searchParams = useSearchParams();
  const accessMode = searchParams.get('access');
  const [signup, setSignup] = useState<CurrentSignup | null | undefined>(
    undefined,
  );
  const [additionalTrades, setAdditionalTrades] = useState<string[]>([]);
  const [tradesNeeded, setTradesNeeded] = useState<string[]>([]);
  const [servicesOffered, setServicesOffered] = useState<string[]>([]);
  const [organizationCapabilities, setOrganizationCapabilities] = useState<
    string[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [savingFoundingDisplay, setSavingFoundingDisplay] = useState(false);
  const [foundingDisplayMessage, setFoundingDisplayMessage] = useState('');
  const [profileTrade, setProfileTrade] = useState('');
  const [profileSecondaryTrade, setProfileSecondaryTrade] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileErrors, setProfileErrors] = useState<Record<string, string[]>>(
    {},
  );
  const successRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchWithTimeout('/api/early-access/current', { cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          throw new Error('current-signup-unavailable');
        }
        return data;
      })
      .then((data) => {
        const next = (data.signup || null) as CurrentSignup | null;
        setSignup(next);
        if (!next) return;
        setProfileTrade(next.primaryTradeSlug);
        setProfileSecondaryTrade(next.secondaryTradeSlug || '');
        setAdditionalTrades(next.worker?.additionalTrades || []);
        setTradesNeeded(next.business?.tradesNeeded || []);
        setServicesOffered(next.business?.servicesOffered || []);
        setOrganizationCapabilities(
          next.audienceType === 'HIRING_FIRM' ? ['hiring-demand'] : [],
        );
      })
      .catch(() => {
        setLoadError(
          'We could not load your registration details right now. Your saved registration has not been changed.',
        );
        setSignup(null);
      });
  }, [loadAttempt]);

  useEffect(() => {
    if (saved) successRef.current?.focus();
  }, [saved]);

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

  function referralUrl() {
    return signup?.referralCode
      ? `${window.location.origin}/r/${encodeURIComponent(signup.referralCode)}`
      : '';
  }

  async function share() {
    if (!signup?.referralCode) return;
    const copy = referralCopy(signup.audienceType);
    const url = referralUrl();
    setShareMessage('');
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'LaborTrader launch list',
          text: copy.text,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareMessage(
        'Sharing is not available in this browser. Copy the referral link instead.',
      );
    }
  }

  async function copyLink() {
    if (!signup?.referralCode) return;
    setShareMessage('');
    try {
      await navigator.clipboard.writeText(referralUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setShareMessage(
        'Your browser blocked clipboard access. Use the Share button or copy the URL from the address bar.',
      );
    }
  }

  async function setFoundingDisplayPreference(displayFoundingOrdinal: boolean) {
    if (!signup || savingFoundingDisplay) return;
    const previous = signup.displayFoundingOrdinal;
    setSignup({ ...signup, displayFoundingOrdinal });
    setSavingFoundingDisplay(true);
    setFoundingDisplayMessage('');
    try {
      const response = await fetchWithTimeout('/api/early-access/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayFoundingOrdinal,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setSignup((current) =>
          current ? { ...current, displayFoundingOrdinal: previous } : current,
        );
        setFoundingDisplayMessage(
          data?.message || 'We could not save that display preference.',
        );
      } else {
        setFoundingDisplayMessage('Founding display preference saved.');
      }
    } catch {
      setSignup((current) =>
        current ? { ...current, displayFoundingOrdinal: previous } : current,
      );
      setFoundingDisplayMessage(
        'We could not save that display preference. Try again.',
      );
    } finally {
      setSavingFoundingDisplay(false);
    }
  }

  async function saveCoreProfile(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signup) return;
    const form = new FormData(event.currentTarget);
    setSavingProfile(true);
    setProfileMessage('');
    setProfileErrors({});
    try {
      const response = await fetchWithTimeout('/api/early-access/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          organizationName: form.get('organizationName') || '',
          city: form.get('city'),
          state: form.get('state'),
          zip: form.get('zip'),
          primaryTradeSlug: profileTrade,
          secondaryTradeSlug: profileSecondaryTrade,
          otherTrade: form.get('otherTrade') || '',
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setProfileErrors(data?.errors || {});
        setProfileMessage(
          data?.message || 'We could not save those registration details.',
        );
        return;
      }
      setSignup((current) =>
        current && data.profile ? { ...current, ...data.profile } : current,
      );
      setProfileMessage('Registration details saved.');
    } catch {
      setProfileMessage(
        'We could not reach LaborTrader. Your saved details have not changed.',
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function save(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!signup) return;
    setMessage('');
    const form = new FormData(event.currentTarget);
    if (
      signup.audienceType === 'BUSINESS' &&
      (signup.intent === 'HIRE' || signup.intent === 'BOTH') &&
      tradesNeeded.length === 0
    ) {
      setMessage('Keep at least one needed trade on this registration.');
      return;
    }
    if (
      signup.audienceType === 'BUSINESS' &&
      (signup.intent === 'WORK' || signup.intent === 'BOTH') &&
      servicesOffered.length === 0
    ) {
      setMessage(
        'Keep at least one offered trade or service on this registration.',
      );
      return;
    }
    if (
      signup.audienceType === 'HIRING_FIRM' &&
      organizationCapabilities.length === 0
    ) {
      setMessage(
        'Keep at least one organization capability on this registration.',
      );
      return;
    }
    setSaving(true);
    const rawRadius = form.get('travelRadiusMiles');
    const radius =
      typeof rawRadius === 'string' && rawRadius
        ? Number(rawRadius)
        : undefined;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    const payload: Record<string, unknown> = {
      audienceType: signup.audienceType,
    };
    if (signup.audienceType === 'WORKER') {
      payload.desiredRate = form.get('desiredRate') || '';
      payload.travelRadiusMiles = radius;
      payload.ownsTools = optionalBoolean(form.get('ownsTools'));
      payload.reliableTransportation = optionalBoolean(
        form.get('reliableTransportation'),
      );
      payload.additionalTrades = additionalTrades;
    } else if (signup.audienceType === 'CONTRACTOR') {
      payload.additionalTrades = additionalTrades;
    } else if (signup.audienceType === 'BUSINESS') {
      payload.tradesNeeded = tradesNeeded;
      payload.servicesOffered = servicesOffered;
      payload.shortageFrequency = form.get('shortageFrequency') || '';
    } else {
      payload.organizationCapabilities = organizationCapabilities;
    }

    try {
      const response = await fetchWithTimeout('/api/early-access/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.ok) setSaved(true);
      else {
        setMessage(
          data?.message ||
            'Those details did not save. Your pre-registration is still saved.',
        );
      }
    } catch (error) {
      setMessage(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'The request timed out. Your pre-registration is still saved. Try again.'
          : 'We could not reach LaborTrader. Your pre-registration is still saved.',
      );
    } finally {
      window.clearTimeout(timeout);
      setSaving(false);
    }
  }

  if (signup === undefined) {
    return (
      <section
        aria-busy="true"
        aria-label="Loading your LaborTrader pre-registration"
        className="h-80 animate-pulse border border-foreground/10 bg-card"
      >
        <h1 className="sr-only">Loading Your LaborTrader Pre-registration</h1>
      </section>
    );
  }

  if (signup === null) {
    const justSubmitted = searchParams.get('submitted') === '1';
    const registrationStage = searchParams.get('registration');
    const returningAfterSubmit = accessMode === 'required';
    const showSubmitSuccess =
      !loadError &&
      (justSubmitted ||
        registrationStage === 'basic' ||
        registrationStage === 'complete');
    const gateTitle = loadError
      ? 'Registration details are temporarily unavailable.'
      : showSubmitSuccess
        ? 'Your pre-registration is saved.'
        : returningAfterSubmit
          ? 'Your registration is already saved.'
          : 'Access your pre-registration.';
    const gateBody =
      loadError ||
      (showSubmitSuccess
        ? 'We sent a confirmation email to the address you used. Open that message and confirm your email to continue. Check spam or promotions if you do not see it within a minute.'
        : returningAfterSubmit
          ? 'If you already confirmed this email, you do not need another confirmation message. Enter the same email below to request a secure access link and open your portal.'
          : 'Open the secure link from your email, or request a new access link below. If you already confirmed your registration, use the access-link form—not a new confirmation email.');
    return (
      <section className="lt-surface-light mx-auto max-w-2xl border border-foreground/14 bg-card p-6 shadow-xl sm:p-10 lt-form-panel">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          LaborTrader Pre-registration
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
          {gateTitle}
        </h1>
        <p
          role={loadError ? 'alert' : showSubmitSuccess ? 'status' : undefined}
          className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground"
        >
          {gateBody}
        </p>
        {loadError ? (
          <button
            type="button"
            className="button-primary mt-7"
            onClick={() => {
              setLoadError('');
              setSignup(undefined);
              setLoadAttempt((attempt) => attempt + 1);
            }}
          >
            Try again
          </button>
        ) : showSubmitSuccess ? (
          <details className="mt-7 border border-foreground/12 bg-white/[0.03] p-4">
            <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Didn&apos;t get the email? Request another link
            </summary>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Use the same email you registered with. This only resends a secure
              link — it does not create a second registration.
            </p>
            <div className="mt-4">
              <ParticipantEmailAccessForm />
            </div>
          </details>
        ) : (
          <ParticipantEmailAccessForm />
        )}
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Need to register first?{' '}
          <Link className="font-semibold underline" href="/early-access">
            Open pre-registration.
          </Link>
        </p>
      </section>
    );
  }

  const copy = referralCopy(signup.audienceType);
  const publicRole = participantRoleByAudienceType(signup.audienceType);
  const launchBenefitCap =
    signup.audienceType === 'BUSINESS' || signup.audienceType === 'HIRING_FIRM'
      ? '$1,000'
      : '$500';
  const launchBenefit = signup.entitlements[0];

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <aside className="lt-glass-panel min-w-0 p-6 text-foreground sm:p-8 lg:p-10">
        <BrandLogo appearance="inverse" className="w-[min(100%,15rem)]" />
        <span className="mt-8 grid size-11 place-items-center bg-primary text-primary-foreground">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
          Email verified · {audienceLabel(signup.audienceType)}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-5xl">
          Your email is verified. Welcome to the future of skilled labor.
        </h1>
        <p className="text-on-dark-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">
          Your verified registration is recorded for{' '}
          {signup.marketName || `${signup.city}, ${signup.state}`}. We&apos;ll
          email essential account and onboarding notices. Marketing updates
          follow the choices you made when registering.
        </p>
        <p className="mt-4 max-w-2xl border-l-2 border-primary pl-4 text-sm font-semibold leading-6 text-background">
          Local trades should shape local labor markets.{' '}
          {"We're fighting back, one trade at a time."}
        </p>
        <ul className="text-on-dark-subtle mt-6 grid gap-2 text-xs leading-5 sm:text-sm">
          <li>
            • Your legitimate pre-registration reserves the launch benefit when
            submitted before your selected market launches.
          </li>
          <li>
            • Your benefit starts after verification and approval when your
            market and account go live: up to 90 days or {launchBenefitCap} in
            platform use. No monthly membership fee.
          </li>
          <li>
            • Finish your registration and verify your phone to unlock your
            referral link.
          </li>
        </ul>
      </aside>

      {signup.verificationCaptureMode && (
        <aside className="border border-primary/35 bg-primary/8 p-4 text-sm font-semibold">
          Local verification capture is enabled for QA.{' '}
          <Link
            href="/dev/participant-verification"
            className="font-semibold underline underline-offset-4"
          >
            Open captured links and codes.
          </Link>
        </aside>
      )}

      <details className="lt-surface-light min-w-0 border border-foreground/14 bg-card text-foreground lt-form-panel">
        <summary className="min-h-12 cursor-pointer list-none px-5 py-5 text-xs font-semibold uppercase tracking-[0.1em] text-primary sm:px-8">
          Review or correct registration details
        </summary>
        <form
          onSubmit={saveCoreProfile}
          className="grid min-w-0 gap-5 border-t border-foreground/14 p-5 sm:grid-cols-2 sm:p-8"
        >
          <TextField
            name="name"
            label="Your name"
            autoComplete="name"
            defaultValue={signup.name}
            required
            error={profileErrors.name?.[0]}
          />
          {(signup.audienceType === 'BUSINESS' ||
            signup.audienceType === 'HIRING_FIRM') && (
            <TextField
              name="organizationName"
              label="Organization name"
              autoComplete="organization"
              defaultValue={signup.organizationName ?? ''}
              required
              error={profileErrors.organizationName?.[0]}
            />
          )}
          <TextField
            name="city"
            label="City"
            autoComplete="address-level2"
            defaultValue={signup.city}
            required
            error={profileErrors.city?.[0]}
          />
          <SelectField
            name="state"
            label="State"
            placeholder="Select state"
            options={US_STATES.map((state) => ({ value: state, label: state }))}
            defaultValue={signup.state}
            required
            error={profileErrors.state?.[0]}
          />
          <TextField
            name="zip"
            label="ZIP"
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="[0-9]{5}(-[0-9]{4})?"
            defaultValue={signup.zip}
            required
            error={profileErrors.zip?.[0]}
          />
          <SelectField
            name="primaryTradeSlug"
            label="Primary trade or specialty"
            placeholder="Select your primary trade or specialty"
            options={PUBLIC_TRADES.map((trade) => ({
              value: trade.slug,
              label: trade.label,
            }))}
            value={profileTrade}
            onChange={(event) => {
              const nextTrade = event.target.value;
              setProfileTrade(nextTrade);
              if (profileSecondaryTrade === nextTrade) {
                setProfileSecondaryTrade('');
              }
            }}
            required
            error={profileErrors.primaryTradeSlug?.[0]}
          />
          <SelectField
            name="secondaryTradeSlug"
            label="Secondary trade or specialty (optional)"
            placeholder="No secondary trade"
            options={PUBLIC_TRADES.filter(
              (trade) =>
                trade.slug !== 'other-skilled-trade' &&
                trade.slug !== profileTrade,
            ).map((trade) => ({
              value: trade.slug,
              label: trade.label,
            }))}
            value={profileSecondaryTrade}
            onChange={(event) => setProfileSecondaryTrade(event.target.value)}
            error={profileErrors.secondaryTradeSlug?.[0]}
          />
          {profileTrade === 'other-skilled-trade' && (
            <div className="sm:col-span-2">
              <TextField
                name="otherTrade"
                label="Describe your trade or specialty"
                defaultValue={signup.otherTrade ?? ''}
                required
                error={profileErrors.otherTrade?.[0]}
              />
            </div>
          )}
          {profileMessage && (
            <output
              aria-live="polite"
              className="text-sm font-semibold text-muted-foreground sm:col-span-2"
            >
              {profileMessage}
            </output>
          )}
          <Button
            type="submit"
            disabled={savingProfile}
            className="min-h-11 rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground sm:col-span-2 sm:justify-self-start"
          >
            {savingProfile ? 'Saving…' : 'Save registration corrections'}
          </Button>
          <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">
            Contact support to change a verified email or phone number. The new
            contact needs verification.
          </p>
        </form>
      </details>

      <PhoneVerificationPanel
        verified={Boolean(signup.phoneVerifiedAt)}
        maskedPhone={signup.maskedPhone}
        fullRegistrationComplete={signup.hasDetailedProfile}
      />

      <ParticipantCredentialClaims primaryTradeSlug={signup.primaryTradeSlug} />

      {launchBenefit && (
        <section className="lt-surface-light border border-foreground/14 bg-card p-5 sm:p-8 lt-form-panel">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Pre-registration launch benefit ·{' '}
            {launchBenefit.status.toLowerCase()}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Benefit recorded for account launch
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            We will confirm activation details before your market and account go
            live. No card or monthly membership fee.
          </p>
        </section>
      )}

      {signup.foundingEvaluation.state === 'AWARDED' &&
        signup.founding?.status === 'AWARDED' && (
          <section className="lt-surface-light border border-primary/35 bg-card p-5 sm:p-8 lt-form-panel">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Founding 100 awarded
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              {signup.marketName || `${signup.city}, ${signup.state}`} Founding
              100
              {' · '}
              {audienceLabel(signup.audienceType)}
              {signup.displayFoundingOrdinal
                ? ` · #${signup.founding.ordinal}`
                : ''}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your private local-market ordinal is #{signup.founding.ordinal}.
              It appears on future public recognition only when you enable the
              preference below.
            </p>
            <label
              htmlFor="founding-display-ordinal"
              className="mt-5 flex min-w-0 cursor-pointer items-start gap-3 border border-foreground/10 bg-white/[0.03] p-4 text-xs leading-5 text-muted-foreground"
            >
              <Checkbox
                id="founding-display-ordinal"
                checked={signup.displayFoundingOrdinal}
                disabled={savingFoundingDisplay}
                onCheckedChange={(checked) =>
                  void setFoundingDisplayPreference(Boolean(checked))
                }
                className="mt-0.5"
              />
              <span>
                Allow LaborTrader to display my exact Founding 100 ordinal with
                my future marketplace recognition. This preference can be
                changed.
              </span>
            </label>
            {foundingDisplayMessage && (
              <output
                aria-live="polite"
                className="mt-3 text-xs font-semibold text-muted-foreground"
              >
                {foundingDisplayMessage}
              </output>
            )}
          </section>
        )}

      {signup.referralCode && (
        <section className="lt-surface-light min-w-0 border border-foreground/14 bg-card p-5 sm:p-8 lt-form-panel">
          <h2 className="text-xl font-semibold tracking-[-0.035em]">
            {copy.heading}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {copy.text} Each new account that joins through your link and
            completes verification adds 10 days to your benefit. Your dollar cap
            stays the same.
          </p>
          {signup.referralProgress && (
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                ['Registrations', signup.referralProgress.registrations],
                ['Verified referrals', signup.referralProgress.qualified],
                ['Benefit', '10 days each'],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="border border-foreground/10 bg-white/[0.03] p-3"
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-xl font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              onClick={share}
              className="min-h-11 whitespace-normal rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
            >
              <Share2 /> Share LaborTrader
            </Button>
            <Button
              type="button"
              onClick={copyLink}
              variant="outline"
              className="min-h-11 whitespace-normal rounded-none border-foreground/25 bg-transparent text-xs font-semibold uppercase tracking-[0.08em]"
            >
              <Copy /> Copy referral link
            </Button>
          </div>
          {copied && (
            <output className="mt-3 block text-xs font-bold text-primary">
              Referral link copied.
            </output>
          )}
          {shareMessage && (
            <p role="alert" className="mt-3 text-xs font-bold text-destructive">
              {shareMessage}
            </p>
          )}
        </section>
      )}

      {signup.hasDetailedProfile ? (
        <details className="lt-surface-light min-w-0 border border-foreground/14 bg-card text-foreground lt-form-panel">
          <summary className="min-h-12 cursor-pointer list-none px-5 py-5 text-xs font-semibold uppercase tracking-[0.1em] text-primary sm:px-8">
            Strengthen your launch profile · Optional
          </summary>
          <form
            onSubmit={save}
            className="min-w-0 border-t border-foreground/14 p-5 sm:p-8"
          >
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Add details to help match you with local opportunities at launch.
            </p>
            <OptionalFields
              signup={signup}
              additionalTrades={additionalTrades}
              tradesNeeded={tradesNeeded}
              servicesOffered={servicesOffered}
              organizationCapabilities={organizationCapabilities}
              toggle={toggle}
              setAdditionalTrades={setAdditionalTrades}
              setTradesNeeded={setTradesNeeded}
              setServicesOffered={setServicesOffered}
              setOrganizationCapabilities={setOrganizationCapabilities}
            />
            {message && (
              <p
                role="alert"
                className="mt-6 border-l-2 border-destructive pl-3 text-sm text-destructive"
              >
                {message}
              </p>
            )}
            {saved ? (
              <section
                ref={successRef}
                aria-live="polite"
                tabIndex={-1}
                className="mt-8 flex flex-col gap-4 border border-primary/35 bg-primary/8 p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Check className="size-5 text-primary" /> Optional details
                  saved.
                </p>
                <Link
                  className="text-xs font-semibold uppercase underline"
                  href="/"
                >
                  Back home
                </Link>
              </section>
            ) : (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  disabled={saving}
                  className="min-h-12 flex-1 whitespace-normal rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
                >
                  {saving ? 'Saving…' : 'Save optional details'}
                </Button>
                <Button
                  render={<Link href="/" />}
                  variant="outline"
                  className="min-h-12 whitespace-normal rounded-none border-foreground/25 bg-transparent px-6 text-xs font-semibold uppercase tracking-[0.08em]"
                >
                  Skip for now
                </Button>
              </div>
            )}
          </form>
        </details>
      ) : (
        <section className="lt-surface-light min-w-0 border border-foreground/14 bg-card p-5 text-foreground sm:p-8 lt-form-panel">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Finish Your Registration
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Unlock your referral link and prepare for launch.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Your basic registration is saved. Complete your role details and
            contact verification to unlock your referral link.
          </p>
          <Link
            className="button-primary mt-6"
            href={`/early-access?manage=1&role=${publicRole?.value || 'worker'}`}
          >
            Complete detailed registration
          </Link>
        </section>
      )}

      {signup.audienceType === 'HIRING_FIRM' && (
        <p className="text-center text-sm leading-6 text-muted-foreground">
          Represent a staffing or payrolling organization?{' '}
          <Link
            className="font-semibold underline underline-offset-4"
            href="/partners#partner-inquiry"
          >
            Begin a separate partner conversation.
          </Link>
        </p>
      )}
    </div>
  );
}

function optionalBoolean(value: FormDataEntryValue | null) {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

type OptionalFieldsProps = {
  signup: CurrentSignup;
  additionalTrades: string[];
  tradesNeeded: string[];
  servicesOffered: string[];
  organizationCapabilities: string[];
  toggle: (
    value: string,
    values: string[],
    setValues: (next: string[]) => void,
  ) => void;
  setAdditionalTrades: (next: string[]) => void;
  setTradesNeeded: (next: string[]) => void;
  setServicesOffered: (next: string[]) => void;
  setOrganizationCapabilities: (next: string[]) => void;
};

function OptionalFields(props: OptionalFieldsProps) {
  const { signup, toggle } = props;
  if (signup.audienceType === 'WORKER') {
    return (
      <div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2">
        <TextField
          name="desiredRate"
          label="Desired hourly or day rate"
          placeholder="e.g. $32/hour"
          defaultValue={signup.worker?.desiredRate ?? ''}
        />
        <TextField
          name="travelRadiusMiles"
          label="Approximate travel radius"
          type="number"
          min="0"
          max="500"
          inputMode="numeric"
          placeholder="Miles"
          defaultValue={signup.worker?.travelRadiusMiles ?? ''}
        />
        <SelectField
          name="ownsTools"
          label="Own tools"
          placeholder="Choose an answer"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          defaultValue={optionalBooleanDefault(signup.worker?.ownsTools)}
        />
        <SelectField
          name="reliableTransportation"
          label="Reliable transportation"
          placeholder="Choose an answer"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          defaultValue={optionalBooleanDefault(
            signup.worker?.reliableTransportation,
          )}
        />
        <ChoiceGrid
          className="sm:col-span-2"
          label="Additional trades or skills"
          options={PUBLIC_TRADES}
          values={props.additionalTrades}
          onToggle={(value) =>
            toggle(value, props.additionalTrades, props.setAdditionalTrades)
          }
        />
      </div>
    );
  }
  if (signup.audienceType === 'CONTRACTOR') {
    return (
      <ChoiceGrid
        className="mt-6"
        label="Additional trades or services"
        options={PUBLIC_TRADES}
        values={props.additionalTrades}
        onToggle={(value) =>
          toggle(value, props.additionalTrades, props.setAdditionalTrades)
        }
      />
    );
  }
  if (signup.audienceType === 'BUSINESS') {
    return (
      <div className="mt-6 grid min-w-0 gap-6">
        {(signup.intent === 'HIRE' || signup.intent === 'BOTH') && (
          <ChoiceGrid
            label="Trades your business may need"
            options={PUBLIC_TRADES}
            values={props.tradesNeeded}
            onToggle={(value) =>
              toggle(value, props.tradesNeeded, props.setTradesNeeded)
            }
          />
        )}
        {(signup.intent === 'WORK' || signup.intent === 'BOTH') && (
          <ChoiceGrid
            label="Trades or services your business may offer"
            options={PUBLIC_TRADES}
            values={props.servicesOffered}
            onToggle={(value) =>
              toggle(value, props.servicesOffered, props.setServicesOffered)
            }
          />
        )}
        <SelectField
          name="shortageFrequency"
          label="General shortage or availability timing"
          placeholder="Choose the closest fit"
          options={SHORTAGE_TIMING_OPTIONS}
          defaultValue={signup.business?.shortageFrequency ?? ''}
        />
      </div>
    );
  }
  return (
    <p className="mt-6 border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">
      Your Hiring Organization profile is hire-only. Staffing, payroll, and
      workforce-supply relationships use the separate partner review.
    </p>
  );
}

function optionalBooleanDefault(value: boolean | null | undefined) {
  if (value === true) return 'yes';
  if (value === false) return 'no';
  return '';
}

function ChoiceGrid({
  label,
  options,
  values,
  onToggle,
  className = '',
}: {
  label: string;
  options: ReadonlyArray<{ value?: string; slug?: string; label: string }>;
  values: string[];
  onToggle: (value: string) => void;
  className?: string;
}) {
  return (
    <fieldset className={`min-w-0 ${className}`}>
      <legend className="form-label">{label}</legend>
      <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const value = option.value || option.slug || '';
          return (
            <label
              key={value}
              className="flex min-h-11 min-w-0 cursor-pointer items-center gap-3 border border-foreground/10 bg-white/[0.03] p-3 text-xs font-semibold"
            >
              <Checkbox
                checked={values.includes(value)}
                onCheckedChange={() => onToggle(value)}
              />
              <span className="min-w-0">{option.label}</span>
            </label>
          );
        })}
      </div>
      <FieldError />
    </fieldset>
  );
}
