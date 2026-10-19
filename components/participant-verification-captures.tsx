'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Capture = {
  kind: 'EMAIL' | 'PHONE';
  challengeId: string;
  maskedRecipient: string;
  verificationUrl: string | null;
  code: string | null;
  createdAt: string;
  expiresAt: string;
};

async function fetchCaptures(): Promise<{
  captures: Capture[];
  message: string;
}> {
  try {
    const response = await fetch('/api/dev/participant-verification', {
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      return {
        captures: [],
        message: 'Local verification capture is disabled or unavailable.',
      };
    }
    return { captures: data.captures || [], message: '' };
  } catch {
    return {
      captures: [],
      message: 'Local verification capture is unavailable.',
    };
  }
}

export function ParticipantVerificationCaptures() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setMessage('');
    const result = await fetchCaptures();
    setCaptures(result.captures);
    setMessage(result.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchCaptures().then((result) => {
      if (cancelled) return;
      setCaptures(result.captures);
      setMessage(result.message);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="lt-surface-light mx-auto max-w-3xl border border-foreground/14 bg-card p-6 shadow-xl sm:p-10">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
        Local QA only · In-memory capture
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-[-0.055em] sm:text-4xl">
        Participant verification captures
      </h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Local/preview only (messaging is mock — Loops does not send). Open
        captured email links here. Captures disappear when the server process
        restarts and never write plaintext links or codes to the database or
        logs.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="rounded-none bg-primary text-xs font-black uppercase tracking-[0.08em] text-primary-foreground"
        >
          {loading ? 'Refreshing…' : 'Refresh captures'}
        </Button>
        <Link className="button-dark" href="/portal">
          Open participant portal
        </Link>
      </div>
      {message && (
        <p role="alert" className="mt-5 text-sm font-semibold text-destructive">
          {message}
        </p>
      )}
      {!loading && !message && captures.length === 0 && (
        <p className="mt-6 border border-foreground/10 p-5 text-sm text-muted-foreground">
          No verification request has been captured in this server process yet.
        </p>
      )}
      <ol className="mt-6 grid gap-4">
        {captures.map((capture) => (
          <li
            key={`${capture.kind}:${capture.challengeId}`}
            className="min-w-0 border border-foreground/14 bg-white/[0.03] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-black">
                {capture.kind === 'EMAIL' ? 'Email link' : 'Phone OTP'} ·{' '}
                {capture.maskedRecipient}
              </p>
              <time className="text-[11px] text-muted-foreground">
                {new Date(capture.createdAt).toLocaleString()}
              </time>
            </div>
            {capture.verificationUrl && (
              <a href={capture.verificationUrl} className="button-primary mt-4">
                Open verification link
              </a>
            )}
            {capture.code && (
              <p className="mt-4 text-sm text-muted-foreground">
                One-time code:{' '}
                <code className="select-all bg-foreground px-2 py-1 text-base font-black tracking-[0.18em] text-background">
                  {capture.code}
                </code>
              </p>
            )}
            <p className="mt-3 break-all text-[11px] leading-5 text-muted-foreground">
              Challenge {capture.challengeId} · expires{' '}
              {new Date(capture.expiresAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
