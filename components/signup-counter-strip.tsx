'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Users, Wrench } from 'lucide-react';
import {
  DEFAULT_PUBLIC_COUNTER_DISPLAY_MINIMUM,
  publicCountsAreVisible,
  type SignupCounts,
} from '@/lib/signup-counts-domain';
import styles from '@/design-system/signup-counter.module.css';

const STAT_CONFIG = [
  {
    key: 'signups' as const,
    title: 'Signups',
    desc: 'Early trade accounts',
    pill: 'VERIFIED',
    icon: Users,
  },
  {
    key: 'states' as const,
    title: 'States',
    desc: 'Coast-to-coast coverage',
    pill: 'NATIONWIDE',
    icon: MapPin,
  },
  {
    key: 'specialties' as const,
    title: 'Specialties',
    desc: 'Skilled trade categories',
    pill: 'DISCIPLINES',
    icon: Wrench,
  },
] as const;

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
      { threshold: 0.25 },
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
      className={`signup-counter-strip ${styles.counterSection}`}
      aria-label={`${label} Pre-registration activity`}
    >
      <div className={styles.ambientOverlay} aria-hidden="true" />

      <div className="site-shell">
        <div className={styles.counterContent}>
          {/* Header Area */}
          <div className={styles.header}>
            <div className={styles.kickerBadge}>
              <span className={styles.kickerDotWrapper} aria-hidden="true">
                <span className={styles.kickerDotPing} />
                <span className={styles.kickerDotCore} />
              </span>
              <p className={styles.kickerText}>The marketplace starts with you</p>
            </div>

            <h2 className={styles.title}>
              {label.toLowerCase().includes('on the map') ? (
                <>
                  Put your trade{' '}
                  <em className={styles.titleAccent}>on the map.</em>
                </>
              ) : (
                label
              )}
            </h2>

            <p className={styles.caption}>Pre-registration is open nationwide.</p>
          </div>

          {/* Stats Display */}
          {available && counts ? (
            <dl
              className={`${styles.statsContainer} stats stats-vertical md:stats-horizontal !overflow-visible`}
            >
              {STAT_CONFIG.map(({ key, title, desc, pill, icon: Icon }) => (
                <div key={key} className={`${styles.statCard} stat group`}>
                  <div className={styles.statCardSheen} aria-hidden="true" />

                  <div className={styles.statTopRow}>
                    <div className={`${styles.statIconBox} stat-figure`}>
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <span className={`${styles.statPill} badge badge-xs badge-ghost`}>
                      {pill}
                    </span>
                  </div>

                  <div className={styles.statContentCol}>
                    <dd className={`${styles.statValue} stat-value`}>
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
                    <dt className={`${styles.statLabel} stat-title`}>{title}</dt>
                    <span className={`${styles.statDesc} stat-desc`}>{desc}</span>
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <div className={styles.fallbackCard}>
              <p className={styles.fallbackCopy}>
                Public signup totals appear once at least{' '}
                {displayMinimum.toLocaleString('en-US')} basic pre-registration
                {displayMinimum === 1 ? ' is' : 's are'} counted — including before
                email confirmation. Join now to be part of the count. Completing
                your detailed profile is what qualifies you for free-use
                eligibility.
              </p>
            </div>
          )}

          {/* Action Dock */}
          <div className={styles.actionsArea}>
            <Link
              href={href}
              className={`${styles.ctaButton} btn btn-primary`}
            >
              <span>{available ? 'Join the Count' : 'Reserve your spot'}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>

            <p className={styles.actionNote}>
              <span>No membership fees</span>
              <span className={styles.actionNoteDot} aria-hidden="true" />
              <span>90 days free platform use upon launch</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
