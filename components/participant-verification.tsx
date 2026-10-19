'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function EmailVerificationPanel({ token }: { token: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  async function confirm() {
    setSubmitting(true);
    setMessage('');
    setShowRecovery(false);
    try {
      const response = await fetchWithTimeout(
        '/api/verification/email/confirm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(
          data?.message || 'This verification link is invalid or expired.',
        );
        setShowRecovery(true);
        window.requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      router.replace('/early-access/complete?verified=email');
      router.refresh();
    } catch {
      setMessage(
        'We could not reach LaborTrader. Check your connection and try again.',
      );
      window.requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="lt-surface-light mx-auto max-w-2xl border border-foreground/14 bg-card p-6 shadow-xl sm:p-10 lt-form-panel">
      <span className="grid size-11 place-items-center bg-primary text-primary-foreground">
        <Mail className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
        Email ownership verification
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
        Confirm your place in the market.
      </h1>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        Confirm your email to continue your registration, review your launch
        benefit, and finish your account details.
      </p>
      {!token && (
        <output className="mt-5 block text-sm text-muted-foreground">
          This verification link is incomplete. Request a new secure link below.
        </output>
      )}
      {token && (
        <Button
          type="button"
          onClick={confirm}
          disabled={submitting || !token || showRecovery}
          className="mt-7 min-h-12 w-full rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
        >
          {submitting ? 'Confirming…' : 'Confirm my email'}
        </Button>
      )}
      {message && (
        <p
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 border-l-2 border-destructive pl-4 text-sm font-semibold text-destructive outline-none"
        >
          {message}
        </p>
      )}
      {(showRecovery || !token) && <ParticipantEmailAccessForm />}
    </section>
  );
}

export function ParticipantEmailAccessForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const statusRef = useRef<HTMLParagraphElement>(null);

  async function requestAccess(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/verification/email/request',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.get('email') }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(
          data?.message ||
            'Secure email access is temporarily unavailable. Please try again.',
        );
        return;
      }
      setMessage(
        data?.message ||
          'If that email is connected to a LaborTrader pre-registration, a secure link will be sent.',
      );
    } catch {
      setMessage(
        'We could not reach LaborTrader. Check your connection and request a new link.',
      );
    } finally {
      setSubmitting(false);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <form
      onSubmit={requestAccess}
      className="mt-7 border-t border-foreground/10 pt-6"
    >
      <Field>
        <FieldLabel htmlFor="participant-access-email" className="form-label">
          Registration email
        </FieldLabel>
        <Input
          id="participant-access-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className="form-input"
        />
      </Field>
      <Button
        type="submit"
        disabled={submitting}
        className="mt-4 min-h-12 w-full rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
      >
        {submitting ? 'Requesting…' : 'Email me a secure access link'}
      </Button>
      {message && (
        <p
          ref={statusRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-4 text-sm font-semibold leading-6 text-muted-foreground outline-none"
        >
          {message}
        </p>
      )}
    </form>
  );
}

export function PhoneVerificationPanel({
  verified,
  maskedPhone,
  fullRegistrationComplete = false,
}: {
  verified: boolean;
  maskedPhone?: string | null;
  fullRegistrationComplete?: boolean;
}) {
  const [challengeId, setChallengeId] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [complete, setComplete] = useState(verified);
  const [message, setMessage] = useState('');
  const statusRef = useRef<HTMLParagraphElement>(null);

  async function requestCode() {
    setRequesting(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/verification/phone/request',
        {
          method: 'POST',
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(
          data?.message || 'We could not request a verification code.',
        );
      } else if (data.challengeId) {
        setChallengeId(data.challengeId);
        setMessage(
          typeof data.localDevCode === 'string'
            ? `Dev mock OTP (no SMS sent): ${data.localDevCode}`
            : 'Your verification request is ready. Enter the six-digit code when it arrives.',
        );
      } else {
        setMessage(
          'Phone verification is already complete or a new code cannot be requested yet.',
        );
      }
    } catch {
      setMessage(
        'We could not reach LaborTrader. Check your connection and try again.',
      );
    } finally {
      setRequesting(false);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  async function confirmCode(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setConfirming(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/verification/phone/confirm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ challengeId, code: form.get('code') }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(
          data?.message ||
            (data?.reason === 'EXPIRED'
              ? 'This code has expired. Request a new code to continue.'
              : 'That code is invalid. Check the digits and try again, or request a new code.'),
        );
      } else {
        setComplete(true);
        setMessage(
          fullRegistrationComplete
            ? 'Phone verified. Your completed registration is ready for referral eligibility review.'
            : 'Phone verified. Finish your registration for referral access.',
        );
        window.setTimeout(() => window.location.reload(), 700);
      }
    } catch {
      setMessage(
        'We could not reach LaborTrader. Check your connection and try again.',
      );
    } finally {
      setConfirming(false);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  if (complete) {
    return (
      <section className="border border-primary/35 bg-primary/8 p-5 sm:p-6">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
          Email and phone verified
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {fullRegistrationComplete
            ? 'Your completed registration is ready for referral eligibility review.'
            : 'Your phone is verified. Finish your registration for referral access.'}
        </p>
      </section>
    );
  }

  return (
    <section className="border border-foreground/14 bg-card p-5 sm:p-6">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
        Verify your phone to unlock more benefits
      </p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        By requesting a verification code, you ask LaborTrader to send a
        one-time SMS to {maskedPhone || 'your registered mobile number'}. This
        ownership check and a completed registration support account
        verification, referral access. This does not enroll you in recurring
        marketing texts. Message and data rates may apply. Reply STOP to opt out
        or HELP for help. Codes expire after about 10 minutes. See the{' '}
        <Link href="/sms-terms" className="underline">
          SMS Terms
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
      {!challengeId ? (
        <Button
          type="button"
          onClick={requestCode}
          disabled={requesting}
          className="mt-5 min-h-11 rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
        >
          {requesting ? 'Requesting…' : 'Request verification code'}
        </Button>
      ) : (
        <form
          onSubmit={confirmCode}
          className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"
        >
          <Field>
            <FieldLabel
              htmlFor="phone-verification-code"
              className="form-label"
            >
              Six-digit code
            </FieldLabel>
            <Input
              id="phone-verification-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              className="form-input"
            />
            <FieldError />
          </Field>
          <Button
            type="submit"
            disabled={confirming}
            className="min-h-11 self-end rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
          >
            {confirming ? 'Confirming…' : 'Confirm code'}
          </Button>
        </form>
      )}
      {challengeId ? (
        <Button
          type="button"
          variant="outline"
          onClick={requestCode}
          disabled={requesting || confirming}
          className="mt-3 min-h-11 rounded-none bg-transparent text-xs font-semibold uppercase tracking-[0.08em]"
        >
          {requesting ? 'Sending…' : 'Resend code'}
        </Button>
      ) : null}
      {message && (
        <p
          ref={statusRef}
          tabIndex={-1}
          role={
            message.includes('could not') ||
            message.includes('invalid') ||
            message.includes('expired')
              ? 'alert'
              : 'status'
          }
          className="mt-4 text-xs font-semibold leading-5 text-muted-foreground outline-none"
        >
          {message}
        </p>
      )}
    </section>
  );
}
