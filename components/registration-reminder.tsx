'use client';

import Link from 'next/link';
import { ArrowUpRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  dueRegistrationReminder,
  readReminderState,
  REGISTRATION_SAVED_EVENT,
  REGISTRATION_SAVED_KEY,
  REMINDER_STATE_KEY,
  type ReminderStage,
  type ReminderState,
} from '@/lib/registration-reminder';
import styles from '@/design-system/registration-reminder.module.css';

export function RegistrationReminder({
  alreadyRegistered = false,
}: {
  alreadyRegistered?: boolean;
}) {
  const [visible, setVisible] = useState<ReminderStage>(0);
  const active = useRef<ReminderStage>(0);
  const state = useRef<ReminderState | null>(null);

  const remember = useCallback(() => {
    try {
      window.sessionStorage.setItem(
        REMINDER_STATE_KEY,
        JSON.stringify(state.current),
      );
    } catch {
      /* The current page still remembers when storage is unavailable. */
    }
  }, []);

  const dismiss = useCallback(
    (stop = false) => {
      if (state.current) {
        state.current.dismissedAt = Date.now();
        state.current.stopped ||= stop;
        remember();
      }
      active.current = 0;
      setVisible(0);
    },
    [remember],
  );

  useEffect(() => {
    if (alreadyRegistered) return;
    let raw = null;
    let saved = false;
    try {
      raw = window.sessionStorage.getItem(REMINDER_STATE_KEY);
      saved = window.sessionStorage.getItem(REGISTRATION_SAVED_KEY) === '1';
    } catch {
      /* Use page-local state when storage is unavailable. */
    }
    state.current = readReminderState(raw, Date.now());
    state.current.stopped ||= saved;
    remember();

    function check() {
      if (!state.current) return;
      const busy = Boolean(
        document.hidden ||
        document.activeElement?.closest('form') ||
        document.querySelector(
          'header [aria-expanded="true"], [role="dialog"][aria-modal="true"]',
        ),
      );
      if (busy && active.current) dismiss();
      const stage = dueRegistrationReminder(
        state.current,
        Date.now(),
        active.current,
        busy,
      );
      if (!stage) return;
      state.current.shown = stage;
      active.current = stage;
      remember();
      setVisible(stage);
    }
    const savedRegistration = () => dismiss(true);
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && active.current) dismiss();
    };
    check();
    const timer = window.setInterval(check, 1000);
    window.addEventListener(REGISTRATION_SAVED_EVENT, savedRegistration);
    window.addEventListener('keydown', escape);
    document.addEventListener('visibilitychange', check);
    document.addEventListener('focusin', check);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener(REGISTRATION_SAVED_EVENT, savedRegistration);
      window.removeEventListener('keydown', escape);
      document.removeEventListener('visibilitychange', check);
      document.removeEventListener('focusin', check);
    };
  }, [alreadyRegistered, dismiss, remember]);

  return (
    <>
      <output className="sr-only" aria-live="polite">
        {visible
          ? 'Pre-register now for 90 days free. A signup reminder is available.'
          : ''}
      </output>
      {visible > 0 && (
        <aside
          className={`${styles.reminder} card`}
          aria-labelledby="registration-reminder-title"
          data-reminder-stage={visible}
        >
          <div className={styles.reminderGlow} aria-hidden="true" />

          <div className={styles.headerBar}>
            <div className={styles.kickerRow}>
              <span className={styles.kickerDot} aria-hidden="true" />
              <p className={styles.eyebrow}>
                {visible === 1 ? 'Get in early' : 'Make your next move'}
              </p>
              <span className={`${styles.launchBadge} badge badge-outline`}>
                Launch Benefit
              </span>
            </div>
            <button
              type="button"
              onClick={() => dismiss()}
              className={styles.close}
              aria-label="Dismiss signup reminder"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>

          <div className={styles.contentBody}>
            <h2 id="registration-reminder-title" className={styles.title}>
              90 days <span>free.</span>
            </h2>
            <p className={styles.copy}>
              {visible === 1
                ? 'More work. More hands. More money. Sign up now for 90 days of free platform use when your market launches.'
                : 'Turn open days into paid work. Find skilled help when you need it. Sign up now and claim your 90-day launch benefit.'}
            </p>
          </div>

          <Link
            href="#pre-register"
            onClick={() => dismiss(true)}
            className={styles.cta}
          >
            <span>Sign up for 90 days free</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>

          <div className={styles.footer}>
            <span>Pre-registration is open nationwide.</span>
            <Link href="/launch-benefits" onClick={() => dismiss(true)}>
              Launch-benefit terms
            </Link>
          </div>
        </aside>
      )}
    </>
  );
}
