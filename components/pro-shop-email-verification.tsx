'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProShopEmailVerification({ token }: { token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState('');
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  async function confirm() {
    setSubmitting(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        '/api/pro-shop/partners/verify-email',
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
        window.requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      setVerified(true);
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
    <section className="lt-form-panel mx-auto max-w-2xl border border-foreground/14 bg-card p-6 shadow-xl sm:p-10">
      <span className="grid size-11 place-items-center bg-primary text-primary-foreground">
        {verified ? (
          <CheckCircle2 className="size-5" aria-hidden="true" />
        ) : (
          <Mail className="size-5" aria-hidden="true" />
        )}
      </span>
      <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
        Pro Shop partner application
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">
        {verified ? 'Your email is verified.' : 'Confirm your business email.'}
      </h1>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        {verified
          ? 'Your application is ready for provider review. Selected vendors receive a written offer.'
          : 'Confirm your email to send your application for review. Selected vendors receive a written offer before payment.'}
      </p>
      {!verified && (
        <Button
          type="button"
          onClick={confirm}
          disabled={submitting || !token}
          className="mt-7 min-h-12 w-full rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
        >
          {submitting ? 'Confirming…' : 'Confirm my email'}
        </Button>
      )}
      {verified && (
        <Button
          render={<Link href="/pro-shop" />}
          className="mt-7 min-h-12 w-full rounded-none bg-primary text-xs font-semibold uppercase tracking-[0.08em] text-primary-foreground"
        >
          Return to the Pro Shop
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
      {!token && !message && (
        <p className="mt-5 border-l-2 border-destructive pl-4 text-sm font-semibold text-destructive">
          This verification link is incomplete. Open the full link in your
          application email, or{' '}
          <Link className="underline" href="/contact">
            contact us for help
          </Link>
          .
        </p>
      )}
    </section>
  );
}
