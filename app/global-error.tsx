'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { inter } from './fonts';
import './globals.css';
import '@/design-system/tokens.css';
import '@/design-system/site.css';
import '@/design-system/interactions.css';
import { SiteFrame } from '@/components/site-frame';

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="lt-surface-dark bg-[#171916] text-[#f3eddf]">
        <title>Something Didn&apos;t Work | LaborTrader</title>
        <SiteFrame reading>
          <main className="grid min-h-screen place-items-center px-6 py-16">
            <div className="w-full max-w-2xl border border-white/15 bg-lt-panel p-8 text-center shadow-2xl sm:p-12">
              <Link
                href="/"
                aria-label="LaborTrader home"
                className="mx-auto mb-9 inline-block max-w-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4ea1ff]"
              >
                <BrandLogo
                  appearance="inverse"
                  alt=""
                  className="mx-auto w-[min(100%,16rem)]"
                />
              </Link>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Something Didn&apos;t Work.
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-none tracking-[-0.055em] sm:text-6xl">
                Your Request Couldn&apos;t Be Completed.
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/60">
                Try again in a moment. If the problem continues, contact{' '}
                <a
                  className="font-semibold text-primary underline underline-offset-4"
                  href="mailto:support@labortraders.com"
                >
                  support@labortraders.com
                </a>
                .
              </p>
              {error.digest && (
                <p className="mt-4 text-xs font-semibold text-white/75">
                  Support reference: {error.digest}
                </p>
              )}
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  className="button-primary"
                  onClick={() => retry()}
                  type="button"
                >
                  Try Again
                </button>
                <Link className="button-on-dark" href="/">
                  Return Home
                </Link>
              </div>
            </div>
          </main>
        </SiteFrame>
      </body>
    </html>
  );
}
