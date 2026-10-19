'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  DEFAULT_PUBLIC_COUNTER_DISPLAY_MINIMUM,
  publicCountsAreVisible,
  type SignupCounts,
} from '@/lib/signup-counts-domain';

export function SignupCounterStrip({
  counts,
  label = 'Pre-registration totals',
  href = '/early-access',
  displayMinimum = DEFAULT_PUBLIC_COUNTER_DISPLAY_MINIMUM,
}: {
  counts: SignupCounts | null;
  label?: string;
  href?: string;
  displayMinimum?: number;
}) {
  const strip = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(1);
  const available = publicCountsAreVisible(counts, displayMinimum);
  useEffect(() => {
    const element = strip.current;
    if (
      !element ||
      !available ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const animate = (now: number) => {
          const elapsed = Math.min((now - start) / 1100, 1);
          setProgress(1 - Math.pow(1 - elapsed, 3));
          if (elapsed < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [available, counts]);

  return (
    <aside
      ref={strip}
      className="signup-counter-strip lt-counter"
      aria-label={`${label} Pre-registration activity`}
    >
      <div className="site-shell lt-counter-grid">
        <div>
          <p className="lt-counter-eyebrow">The marketplace starts with you</p>
          <h2 className="lt-counter-title">{label}</h2>
          <p className="lt-counter-caption">
            Pre-registration is open nationwide.
          </p>
        </div>
        {available && counts ? (
          <dl className="lt-counter-stats">
            {(
              [
                ['signups', 'Signups'],
                ['states', 'States'],
                ['specialties', 'Specialties'],
              ] as const
            ).map(([key, title]) => (
              <div key={key}>
                <dt>{title}</dt>
                <dd>
                  <span className="sr-only">
                    {counts[key].toLocaleString('en-US')}
                  </span>
                  <span aria-hidden="true">
                    {Math.max(
                      counts[key] > 0 ? 1 : 0,
                      Math.round(counts[key] * progress),
                    ).toLocaleString('en-US')}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="lt-counter-stats lt-counter-invite">
            <p className="lt-counter-invite-copy">
              Public signup totals appear once at least{' '}
              {displayMinimum.toLocaleString('en-US')} basic pre-registration
              {displayMinimum === 1 ? ' is' : 's are'} counted — including before
              email confirmation. Join now to be part of the count. Completing
              your detailed profile is what qualifies you for free-use
              eligibility.
            </p>
          </div>
        )}
        <Link href={href} className="button-primary lt-counter-cta">
          {available ? 'Join the Count' : 'Reserve your spot'}{' '}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
