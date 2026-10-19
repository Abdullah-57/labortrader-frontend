'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { fetchWithTimeout } from '@/lib/browser-request';

export function IntakeEmailConfirmation({ token }: { token: string }) {
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [phoneComplete, setPhoneComplete] = useState(false);
  const [needsPhone, setNeedsPhone] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState('');
  const [message, setMessage] = useState('');
  const feedback = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    if (window.location.search)
      window.history.replaceState(null, '', window.location.pathname);
  }, []);

  function focusFeedback() {
    window.requestAnimationFrame(() => feedback.current?.focus());
  }

  async function confirmEmail() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/verification/intake/confirm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setMessage(
          result?.message ||
            'We could not complete this request. Please try again.',
        );
        return;
      }
      setConfirmed(true);
      if (result.needsPhoneVerification && result.email) {
        setNeedsPhone(true);
        setClientEmail(String(result.email));
        setMaskedPhone(
          typeof result.maskedPhone === 'string' ? result.maskedPhone : null,
        );
        setMessage(
          'Email confirmed. Verify your mobile number to finish contact ownership.',
        );
      } else {
        setMessage('Email confirmed. You can return to LaborTrader.');
      }
    } catch {
      setMessage('We could not reach LaborTrader. Please try again.');
    } finally {
      setBusy(false);
      focusFeedback();
    }
  }

  async function requestPhoneCodeForEmail(
    email: string,
    options?: { allowExitOnMiss?: boolean },
  ) {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/verification/intake/phone/request',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setMessage(
          result?.message || 'We could not request a verification code.',
        );
        if (options?.allowExitOnMiss) {
          setConfirmed(false);
          setNeedsPhone(false);
        }
        return;
      }
      if (result.alreadyVerified) {
        setPhoneComplete(true);
        setNeedsPhone(false);
        setMessage('Phone already verified. You can return to LaborTrader.');
        return;
      }
      if (result.challengeId) {
        setChallengeId(String(result.challengeId));
        if (typeof result.maskedPhone === 'string') {
          setMaskedPhone(result.maskedPhone);
        }
        setMessage(
          typeof result.localDevCode === 'string'
            ? `Dev mock OTP (no SMS sent): ${result.localDevCode}`
            : 'Your verification request is ready. Enter the six-digit code when it arrives.',
        );
        return;
      }
      setMessage(
        result?.message ||
          'Phone verification is already complete or a new code cannot be requested yet.',
      );
      if (options?.allowExitOnMiss) {
        setConfirmed(false);
        setNeedsPhone(false);
      }
    } catch {
      setMessage('We could not reach LaborTrader. Please try again.');
      if (options?.allowExitOnMiss) {
        setConfirmed(false);
        setNeedsPhone(false);
      }
    } finally {
      setBusy(false);
      focusFeedback();
    }
  }

  async function requestPhoneCode() {
    if (!clientEmail) return;
    await requestPhoneCodeForEmail(clientEmail);
  }

  async function confirmPhoneCode(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/verification/intake/phone/confirm',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId,
            code: form.get('code'),
          }),
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setMessage(
          result?.message ||
            (result?.reason === 'EXPIRED'
              ? 'This code has expired. Request a new code to continue.'
              : 'That code is invalid. Check the digits and try again, or request a new code.'),
        );
        return;
      }
      setPhoneComplete(true);
      setNeedsPhone(false);
      setMessage('Phone verified. You can return to LaborTrader.');
    } catch {
      setMessage('We could not reach LaborTrader. Please try again.');
    } finally {
      setBusy(false);
      focusFeedback();
    }
  }

  async function requestEmailLink(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/verification/intake/request',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.get('email'),
            kind: data.get('kind'),
          }),
        },
      );
      const result = await response.json().catch(() => null);
      if (response.ok && result?.ok) {
        setMessage(
          result?.message ||
            'If that email matches a saved submission, a new confirmation link will be sent.',
        );
      } else {
        setMessage(
          result?.message ||
            'We could not complete this request. Please try again.',
        );
      }
    } catch {
      setMessage('We could not reach LaborTrader. Please try again.');
    } finally {
      setBusy(false);
      focusFeedback();
    }
  }

  const finished = confirmed && (!needsPhone || phoneComplete);

  return (
    <section className="lt-form-panel mx-auto min-w-0 max-w-2xl border border-foreground/14 p-6 shadow-xl sm:p-10">
      <p className="section-kicker">LaborTrader email confirmation</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
        {phoneComplete
          ? 'Email and phone confirmed.'
          : confirmed
            ? needsPhone
              ? 'Verify your phone.'
              : 'Your email is confirmed.'
            : 'Confirm your email.'}
      </h1>
      <p className="mt-5 text-base leading-7 text-muted-foreground">
        {phoneComplete
          ? 'Your client signup contact ownership is complete. We will email you about the next steps.'
          : confirmed && needsPhone
            ? 'Your email is confirmed. Enter the one-time code sent to your registered mobile number to finish contact verification.'
            : confirmed
              ? 'Your submission is saved and your email is confirmed. We will email you about the next steps.'
              : 'Confirm the email on your client signup, partnership inquiry, or investor inquiry.'}
      </p>

      {token && !confirmed && (
        <Button
          className="mt-7 min-h-12 w-full"
          disabled={busy}
          onClick={() => void confirmEmail()}
        >
          {busy ? 'Confirming…' : 'Confirm my email'}
          {!busy && <ArrowRight aria-hidden="true" />}
        </Button>
      )}

      {confirmed && needsPhone && !phoneComplete && (
        <section className="mt-7 border border-foreground/14 bg-card p-5 sm:p-6">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            Verify your client mobile number
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            By requesting a verification code, you ask LaborTrader to send a
            one-time SMS to {maskedPhone || 'your registered mobile number'}.
            This ownership check does not enroll you in recurring marketing
            texts. Message and data rates may apply. See the{' '}
            <Link href="/sms-terms" className="underline">
              SMS Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Codes expire after about 10 minutes. You can resend without
            refreshing this page.
          </p>
          {!challengeId ? (
            <Button
              type="button"
              className="mt-5 min-h-11 w-full"
              disabled={busy || !clientEmail}
              onClick={() => void requestPhoneCode()}
            >
              {busy ? 'Requesting…' : 'Request verification code'}
            </Button>
          ) : (
            <>
              <form
                onSubmit={(event) => void confirmPhoneCode(event)}
                className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"
              >
                <Field>
                  <FieldLabel
                    htmlFor="client-phone-verification-code"
                    className="form-label"
                  >
                    Six-digit code
                  </FieldLabel>
                  <Input
                    id="client-phone-verification-code"
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
                  disabled={busy}
                  className="min-h-11 self-end"
                >
                  {busy ? 'Confirming…' : 'Confirm code'}
                </Button>
              </form>
              <Button
                type="button"
                variant="outline"
                className="mt-3 min-h-11 w-full bg-transparent"
                disabled={busy || !clientEmail}
                onClick={() => void requestPhoneCode()}
              >
                {busy ? 'Sending…' : 'Resend code'}
              </Button>
            </>
          )}
        </section>
      )}

      {phoneComplete && (
        <p className="mt-7 flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
          Email and phone verified
        </p>
      )}

      {finished ? (
        <Button className="mt-7 min-h-12 w-full" render={<Link href="/" />}>
          Return to LaborTrader <ArrowRight aria-hidden="true" />
        </Button>
      ) : !confirmed ? (
        <>
          <form className="mt-8 space-y-5" onSubmit={requestEmailLink}>
            <h2 className="text-xl font-semibold">Need a new link?</h2>
            <div>
              <label className="mb-2 block text-sm" htmlFor="intake-kind">
                Your submission
              </label>
              <NativeSelect
                className="form-select w-full"
                id="intake-kind"
                name="kind"
                defaultValue="CLIENT"
              >
                <option value="CLIENT">Client signup</option>
                <option value="PARTNERSHIP">Partnership inquiry</option>
                <option value="INVESTOR">Investor inquiry</option>
              </NativeSelect>
            </div>
            <div>
              <label className="mb-2 block text-sm" htmlFor="intake-email">
                Email
              </label>
              <Input
                className="form-input"
                type="email"
                autoComplete="email"
                maxLength={254}
                id="intake-email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="min-h-12 w-full" disabled={busy}>
              {busy ? 'Requesting…' : 'Send a new link'}
              {!busy && <ArrowRight aria-hidden="true" />}
            </Button>
            <p className="text-sm leading-6 text-muted-foreground">
              Worker, contractor, business, or hiring team?{' '}
              <Link className="text-primary underline" href="/portal">
                Access your registration.
              </Link>{' '}
              For a vendor application,{' '}
              <Link className="text-primary underline" href="/contact">
                contact us.
              </Link>
            </p>
          </form>
          <form
            className="mt-8 space-y-5 border-t border-foreground/10 pt-8"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const email = String(data.get('email') || '').trim();
              if (!email) return;
              setClientEmail(email);
              setNeedsPhone(true);
              setConfirmed(true);
              void requestPhoneCodeForEmail(email, { allowExitOnMiss: true });
            }}
          >
            <h2 className="text-xl font-semibold">Already confirmed email?</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Client signups can finish phone verification with the email used
              at signup. Partner and investor inquiries stay email-only.
            </p>
            <div>
              <label
                className="mb-2 block text-sm"
                htmlFor="client-phone-email"
              >
                Client signup email
              </label>
              <Input
                className="form-input"
                type="email"
                autoComplete="email"
                maxLength={254}
                id="client-phone-email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            <Button type="submit" className="min-h-12 w-full" disabled={busy}>
              {busy ? 'Requesting…' : 'Send phone verification code'}
              {!busy && <ArrowRight aria-hidden="true" />}
            </Button>
          </form>
        </>
      ) : null}

      <output
        ref={feedback}
        tabIndex={-1}
        aria-live="polite"
        className="mt-5 block text-sm leading-6 outline-none"
      >
        {message}
      </output>
    </section>
  );
}
