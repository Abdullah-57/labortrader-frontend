'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import { QUICK_TRADES, US_STATES } from '@/lib/constants';
import { paths } from '@/components/landing-content-data';
import { LandingContent } from '@/components/landing-content';
import { LandingSurface } from '@/components/landing-surface';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SignupCounterStrip } from '@/components/signup-counter-strip';
import styles from '@/design-system/landing.module.css';

function PreviewRegistration() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  return (
    <div className={styles.registration}>
      <div className={styles.formTop}>
        <span>GET IN EARLY</span>
        <span className={styles.dim}>
          {step === 1 ? 'Your details' : step === 2 ? 'Your path' : 'Complete'}
        </span>
      </div>
      <div className={styles.progress} aria-label={`Preview step ${step} of 3`}>
        {[1, 2, 3].map((n) => (
          <span key={n} data-active={n <= step} />
        ))}
      </div>
      <div aria-live="polite">
        <h2>
          {step === 1
            ? 'Your next chapter starts here.'
            : step === 2
              ? 'Choose your path.'
              : 'That’s the preview.'}
        </h2>
        <p>
          {step === 1
            ? 'Join the skilled labor marketplace being built around you.'
            : step === 2
              ? 'How would you use LaborTrader?'
              : 'Nothing was submitted. You can reset the form and keep exploring the design.'}
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setStep(Math.min(step + 1, 3));
        }}
      >
        <div hidden={step !== 1}>
          <div className={styles.formGrid}>
            <label>
              First name
              <input
                type="text"
                autoComplete="off"
                placeholder="First name"
                required={step === 1}
              />
            </label>
            <label>
              Last name
              <input
                type="text"
                autoComplete="off"
                placeholder="Last name"
                required={step === 1}
              />
            </label>
          </div>
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required={step === 1}
            />
          </label>
          <div className={styles.marketFields}>
            <label>
              Primary state
              <select defaultValue="" required={step === 1}>
                <option value="" disabled>
                  Select state
                </option>
                {US_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Industry
              <select defaultValue="" required={step === 1}>
                <option value="" disabled>
                  Select industry
                </option>
                {QUICK_TRADES.map((trade) => (
                  <option key={trade.value} value={trade.value}>
                    {trade.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {step === 2 && (
          <div className={styles.roleOptions}>
            {paths.map((path) => (
              <label key={path.role}>
                <input
                  type="radio"
                  name="preview-role"
                  value={path.role}
                  checked={role === path.role}
                  required
                  onChange={(event) => setRole(event.target.value)}
                />
                <path.icon size={18} aria-hidden="true" />
                <span>{path.role}</span>
              </label>
            ))}
          </div>
        )}
        {step < 3 ? (
          <button className={styles.formButton} type="submit">
            <span>
              {step === 1 ? 'Continue & Choose My Path' : 'Preview Next Step'}
            </span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        ) : (
          <button
            className={styles.formButton}
            type="button"
            onClick={() => setStep(1)}
          >
            <span>Reset Form Preview</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
        {step === 2 && (
          <button
            className={styles.backButton}
            type="button"
            onClick={() => setStep(1)}
          >
            Back to your details
          </button>
        )}
      </form>
      <div className={styles.formFoot}>
        <span className={styles.statusDot} />
        Design preview · nothing is submitted
      </div>
      <div className={styles.otherPaths}>
        Joining as a{' '}
        <Link href="/for-clients#client-preregistration">client</Link>,{' '}
        <Link href="/advertise#provider-application">vendor</Link>,{' '}
        <Link href="/partners#partner-inquiry">partner</Link>, or{' '}
        <Link href="/investors#investor-inquiry">investor</Link>?
      </div>
    </div>
  );
}

export function LandingDesignLab() {
  const [tone, setTone] = useState('graphite');
  const [photo, setPhoto] = useState(48);
  const [motion, setMotion] = useState(true);
  const [panel, setPanel] = useState(78);
  const [rounded, setRounded] = useState(true);
  return (
    <LandingSurface
      tone={tone}
      photo={photo}
      motion={motion}
      panel={panel}
      rounded={rounded}
    >
      <div className={styles.previewNotice}>
        <span>
          <span className={styles.noticeDot} />
          DESIGN LAB <span className={styles.noticeDivider}>/</span> Industrial
          Glass
        </span>
        <Link href="/">
          Compare current homepage <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
      <SiteHeader ctaHref="#lab-register" />
      <LandingContent
        preview
        registration={<PreviewRegistration />}
        counter={
          <SignupCounterStrip
            counts={null}
            label="Put your trade on the map."
            href="#lab-register"
          />
        }
      />
      <SiteFooter />
      <details className={styles.controls}>
        <summary>
          <SlidersHorizontal size={17} aria-hidden="true" />
          <span>Design controls</span>
          <ChevronDown size={15} aria-hidden="true" />
        </summary>
        <div className={styles.controlsBody}>
          <p>Try the direction. These settings only affect this preview.</p>
          <fieldset>
            <legend>Overall feel</legend>
            <div className={styles.controlButtons}>
              {[
                ['graphite', 'Graphite'],
                ['stone', 'Warm stone'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={tone === value}
                  onClick={() => setTone(value)}
                >
                  {tone === value && <Check size={13} aria-hidden="true" />}
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          <label>
            Background presence <span>{photo}%</span>
            <input
              type="range"
              min="0"
              max="85"
              value={photo}
              onChange={(event) => setPhoto(Number(event.target.value))}
            />
          </label>
          <fieldset>
            <legend>Background motion</legend>
            <div className={styles.controlButtons}>
              <button
                type="button"
                aria-pressed={!motion}
                onClick={() => setMotion(false)}
              >
                Still
              </button>
              <button
                type="button"
                aria-pressed={motion}
                onClick={() => setMotion(true)}
              >
                Scroll motion
              </button>
            </div>
          </fieldset>
          <label>
            Panel opacity <span>{panel}%</span>
            <input
              type="range"
              min="60"
              max="98"
              value={panel}
              onChange={(event) => setPanel(Number(event.target.value))}
            />
          </label>
          <fieldset>
            <legend>Card corners</legend>
            <div className={styles.controlButtons}>
              <button
                type="button"
                aria-pressed={!rounded}
                onClick={() => setRounded(false)}
              >
                Sharp
              </button>
              <button
                type="button"
                aria-pressed={rounded}
                onClick={() => setRounded(true)}
              >
                Soft
              </button>
            </div>
          </fieldset>
          <button
            className={styles.resetControls}
            type="button"
            onClick={() => {
              setTone('graphite');
              setPhoto(48);
              setMotion(true);
              setPanel(78);
              setRounded(true);
            }}
          >
            Reset this direction
          </button>
        </div>
      </details>{' '}
    </LandingSurface>
  );
}
