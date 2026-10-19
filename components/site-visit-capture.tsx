'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { readAttribution } from '@/lib/client-attribution';

const EXCLUDED_PREFIXES = ['/admin', '/dev', '/api'];

export function SiteVisitCapture() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const sentInitialReferrer = useRef(false);

  useEffect(() => {
    if (
      !pathname ||
      lastPath.current === pathname ||
      EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
    ) {
      return;
    }
    lastPath.current = pathname;

    const privacyNavigator = navigator as Navigator & {
      globalPrivacyControl?: boolean;
    };
    if (
      navigator.doNotTrack === '1' ||
      privacyNavigator.globalPrivacyControl === true
    ) {
      void fetch('/api/analytics/visit', {
        method: 'DELETE',
        credentials: 'same-origin',
        keepalive: true,
        referrerPolicy: 'no-referrer',
      }).catch(() => {
        // Privacy cleanup is best effort and never blocks navigation.
      });
      return;
    }

    const attribution = readAttribution();
    let referrerHost: string | null = null;
    if (!sentInitialReferrer.current) {
      sentInitialReferrer.current = true;
      try {
        const referrer = document.referrer ? new URL(document.referrer) : null;
        if (referrer && referrer.origin !== window.location.origin) {
          referrerHost = referrer.hostname.toLowerCase().slice(0, 253);
        }
      } catch {
        referrerHost = null;
      }
    }
    void fetch('/api/analytics/visit', {
      method: 'POST',
      credentials: 'same-origin',
      keepalive: true,
      referrerPolicy: 'no-referrer',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventKey: crypto.randomUUID(),
        path: pathname,
        utmSource: attribution.utm_source || null,
        utmCampaign: attribution.utm_campaign || null,
        referrerHost,
      }),
    }).catch(() => {
      // Analytics is intentionally best effort and never blocks navigation.
    });
  }, [pathname]);

  return null;
}
