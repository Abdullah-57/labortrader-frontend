'use client';

import Link from 'next/link';
import { SiteFrame } from '@/components/site-frame';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <SiteFrame>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="grid min-h-[68svh] place-items-center py-20">
          <div className="site-shell min-w-0 max-w-3xl text-center">
            <p className="section-kicker">Something Didn&apos;t Work.</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
              Your Request Couldn&apos;t Be Completed.
            </h1>
            <p className="text-on-dark-subtle mx-auto mt-5 max-w-2xl text-base leading-8">
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
              <p className="mt-4 text-xs font-semibold text-background/72">
                Support reference: {error.digest}
              </p>
            )}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                className="button-primary"
                onClick={() => retry()}
                type="button"
              >
                <RotateCcw aria-hidden="true" /> Try Again
              </button>
              <Link className="button-on-dark" href="/">
                <ArrowLeft aria-hidden="true" /> Return Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
