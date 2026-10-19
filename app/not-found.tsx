import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFrame } from '@/components/site-frame';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The requested LaborTrader page could not be found.',
};

export default function NotFound() {
  return (
    <SiteFrame>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="grid min-h-[68svh] place-items-center py-20">
          <div className="site-shell min-w-0 text-center">
            <p className="section-kicker">This One Got Away.</p>
            <p className="mt-6 text-8xl font-semibold tracking-[-0.08em] text-primary">
              404
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
              We Couldn&apos;t Find That Page.
            </h1>
            <p className="text-on-dark-subtle mt-5 text-base">
              The skilled labor marketplace is still here.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link className="button-primary" href="/">
                <ArrowLeft aria-hidden="true" /> Go Home
              </Link>
              <Link className="button-on-dark" href="/#account-paths">
                Choose Your Account <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
