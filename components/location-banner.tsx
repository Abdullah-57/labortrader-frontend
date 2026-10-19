'use client';

import Link from 'next/link';
import { ArrowUpRight, MapPin, X } from 'lucide-react';
import {
  useCallback,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  buildDifferentLocationHref,
  buildLaunchListHref,
  getLocationDismissalSignature,
  getLocationDismissalStorageKey,
  isLocationDismissalCurrent,
  LOCATION_BANNER_COOKIE,
  LOCATION_BANNER_DISMISSAL_DAYS,
  type ApproximateLocation,
  type LaunchListRole,
} from '@/lib/location';
import { findMarketWaveForState } from '@/lib/market-config';

type LocationBannerProps = {
  location: ApproximateLocation | null;
  compact?: boolean;
  initiallyDismissed?: boolean;
  locationConfidence?: 'APPROXIMATE' | 'CONFIRMED';
  /** Optional when the visitor has already chosen a role elsewhere. */
  role?: LaunchListRole;
};

const dismissalEvent = 'labortrader:location-banner-dismissed';

export function LocationBanner({
  location,
  compact = false,
  initiallyDismissed = false,
  locationConfidence = 'APPROXIMATE',
  role,
}: LocationBannerProps) {
  const headingId = useId();
  const descriptionId = useId();
  const [dismissedSignature, setDismissedSignature] = useState<string | null>(
    null,
  );
  const signature = useMemo(
    () => getLocationDismissalSignature(location),
    [location],
  );
  const storageKey = useMemo(
    () => getLocationDismissalStorageKey(location),
    [location],
  );
  const subscribeToDismissal = useCallback((onStoreChange: () => void) => {
    window.addEventListener('storage', onStoreChange);
    window.addEventListener(dismissalEvent, onStoreChange);

    return () => {
      window.removeEventListener('storage', onStoreChange);
      window.removeEventListener(dismissalEvent, onStoreChange);
    };
  }, []);
  const getDismissalSnapshot = useCallback(() => {
    try {
      return isLocationDismissalCurrent(
        window.localStorage.getItem(storageKey),
      );
    } catch {
      return false;
    }
  }, [storageKey]);
  const getServerDismissalSnapshot = useCallback(
    () => initiallyDismissed,
    [initiallyDismissed],
  );
  const storedDismissal = useSyncExternalStore(
    subscribeToDismissal,
    getDismissalSnapshot,
    getServerDismissalSnapshot,
  );
  const isVisible =
    !initiallyDismissed && !storedDismissal && dismissedSignature !== signature;

  function dismiss() {
    const maxAge = LOCATION_BANNER_DISMISSAL_DAYS * 24 * 60 * 60;

    setDismissedSignature(signature);

    try {
      window.localStorage.setItem(storageKey, String(Date.now()));
      window.dispatchEvent(new Event(dismissalEvent));
    } catch {
      // Dismissal still applies for the current render if storage is blocked.
    }

    try {
      document.cookie = `${LOCATION_BANNER_COOKIE}=${signature}; Max-Age=${maxAge}; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {
      // Some browser policies prevent first-party cookie storage.
    }
  }

  if (!isVisible) return null;

  const marketWave = findMarketWaveForState(location?.region);
  const supportedLocation = marketWave ? location : null;
  const city = supportedLocation?.city;
  const marketTiming = marketWave?.publicMonthLabel;
  const regionLabel =
    marketWave?.displayName === 'Nationwide'
      ? supportedLocation?.region
      : marketWave?.displayName;
  const primaryLabel = city
    ? locationConfidence === 'CONFIRMED'
      ? 'Open My Pre-registration'
      : `Participant Pre-registration in ${regionLabel ?? supportedLocation?.region}`
    : 'Participant Pre-registration';
  const primaryHref =
    locationConfidence === 'CONFIRMED'
      ? '/portal'
      : buildLaunchListHref(supportedLocation, role);

  if (compact) {
    if (!city) return null;
    return (
      <aside
        className="lt-market-notice"
        aria-label="Your market"
        data-location-banner
      >
        <div className="site-shell">
          <MapPin size={17} aria-hidden="true" />
          <p>
            {locationConfidence === 'CONFIRMED' ? 'Your market:' : 'Near'}{' '}
            <strong>
              {city}, {supportedLocation?.region}
            </strong>
            {locationConfidence === 'APPROXIMATE'
              ? '? Choose or change your state when you register.'
              : '. Your saved registration is ready to view.'}
          </p>
          <Link href={primaryHref}>
            {locationConfidence === 'CONFIRMED'
              ? 'Open registration'
              : 'Choose my market'}{' '}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss launch-list message"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="lt-surface-dark border-b border-primary/55 bg-[#20231f] text-background"
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      data-location-banner
    >
      <div className="site-shell relative grid min-w-0 gap-3 py-3 pr-12 sm:gap-4 sm:py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:py-5">
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3.5">
          <span
            className="mt-0.5 hidden size-11 shrink-0 place-items-center border border-primary/55 bg-primary/10 text-primary sm:grid"
            aria-hidden="true"
          >
            <MapPin className="size-5" />
          </span>
          <div className="min-w-0">
            <p
              id={headingId}
              className="text-[9px] font-black uppercase tracking-[0.16em] text-primary sm:text-[10px]"
            >
              {city
                ? `${city}, ${supportedLocation?.region}`
                : 'Pre-registration Is Open'}
            </p>
            <p
              id={descriptionId}
              className="mt-1 max-w-4xl text-xs font-semibold leading-5 text-background/86 sm:mt-2 sm:text-[15px] sm:leading-7"
            >
              <span className="sm:hidden">
                {city && supportedLocation
                  ? `Confirm your market before it launches to reserve up to 90 days of included eligible LaborTrader platform use, subject to verification and your account-type cap.`
                  : 'Choose your state before it launches to reserve up to 90 days of included eligible LaborTrader platform use, subject to verification and your account-type cap.'}
              </span>
              <span className="hidden sm:inline">
                {city && supportedLocation ? (
                  locationConfidence === 'CONFIRMED' ? (
                    <>
                      Your pre-registration is connected to {city},{' '}
                      {supportedLocation.region}.{' '}
                      {marketTiming
                        ? `${regionLabel} has a target launch in ${marketTiming}.`
                        : `Pre-registration is open in ${regionLabel}. We will notify you when launch timing is approved.`}
                    </>
                  ) : (
                    <>
                      It looks like you are near {city},{' '}
                      {supportedLocation.region}.{' '}
                      {marketTiming
                        ? `${regionLabel} has a target launch in ${marketTiming}.`
                        : `Pre-registration is open in ${regionLabel}. We will notify you when launch timing is approved.`}{' '}
                      A legitimate pre-registration submitted before the
                      selected market launches reserves up to 90 days of
                      included eligible LaborTrader platform use, subject to
                      verification and the $500 or $1,000 account-type cap.
                    </>
                  )
                ) : (
                  <>
                    Choose your role and state before that market launches to
                    reserve up to 90 days of included eligible LaborTrader
                    platform use, subject to verification and the $500 or $1,000
                    account-type cap.
                  </>
                )}
              </span>
            </p>
            {supportedLocation && locationConfidence === 'APPROXIMATE' && (
              <p className="mt-1.5 hidden text-xs leading-5 text-background/60 sm:block">
                This location is approximate. Confirm or change your state
                during registration.
              </p>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2 lg:grid lg:w-[25rem] lg:grid-cols-2 lg:gap-3">
          <Link
            className="button-primary min-w-0 whitespace-normal text-center max-lg:min-h-10 max-lg:px-4 max-sm:w-full"
            href={primaryHref}
          >
            <span className="sm:hidden">
              {locationConfidence === 'CONFIRMED'
                ? 'Open Registration'
                : 'Participant Registration'}
            </span>
            <span className="hidden sm:inline">{primaryLabel}</span>
            <ArrowUpRight className="shrink-0" aria-hidden="true" />
          </Link>
          <Link
            className="hidden min-w-0 text-xs font-black uppercase tracking-[0.08em] text-background/80 underline decoration-primary decoration-2 underline-offset-4 hover:text-primary sm:inline-flex lg:hidden"
            href={buildDifferentLocationHref(role)}
          >
            {city ? `Not near ${city}?` : 'Choose a Different Location'}
          </Link>
          <Link
            className="button-on-dark hidden min-w-0 whitespace-normal text-center lg:inline-flex"
            href={buildDifferentLocationHref(role)}
          >
            Choose a Different Location
          </Link>
          {!role && locationConfidence !== 'CONFIRMED' && (
            <Link
              className="min-h-9 text-xs font-black uppercase tracking-[0.08em] text-background/80 underline decoration-primary decoration-2 underline-offset-4 hover:text-primary max-lg:w-full lg:col-span-2 lg:text-center"
              href="/for-clients#client-preregistration"
            >
              Hiring for a project? Use Client Pre-registration
            </Link>
          )}
        </div>

        <button
          type="button"
          className="absolute right-0 top-3 grid size-11 place-items-center text-background/70 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4ea1ff] sm:top-4"
          aria-label="Dismiss launch-list message"
          onClick={dismiss}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
