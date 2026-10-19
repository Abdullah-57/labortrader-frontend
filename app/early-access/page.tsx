import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import { Suspense } from 'react';
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { EarlyAccessForm } from '@/components/early-access-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Skilled Trade Marketplace Pre-registration',
  description:
    'Pre-register nationwide as a skilled worker, contractor, service business, or hiring organization. Oklahoma launches February 2027; more states will follow.',
  path: '/early-access',
});

export default function EarlyAccessPage() {
  return (
    <SiteFrame background="landing">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pre-register', path: '/early-access' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="py-10 sm:py-16 lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[minmax(0,.82fr)_minmax(0,1.18fr)] lg:items-start xl:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0 lg:sticky lg:top-28">
              <p className="section-kicker">Launch Pre-registration</p>
              <h1 className="page-title mt-4">
                Your next move <span>starts here.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-background/75">
                Join as a worker, independent contractor, service business, or
                hiring organization. We will notify you when your market opens.
              </p>
              <p className="mt-4 text-sm leading-6 text-background/75">
                Hiring for your own project?{' '}
                <Link
                  href="/for-clients#client-preregistration"
                  className="font-bold underline underline-offset-4"
                >
                  Use client registration.
                </Link>
              </p>
              <div className="lt-glass-panel mt-7 hidden p-6 lg:block">
                <p className="text-xl font-semibold">
                  No monthly membership fee.
                </p>
                <p className="mt-3 text-sm leading-7 text-background/75">
                  Reserve up to 90 days of eligible platform use after
                  verification, approval, and market launch.
                </p>
                <Link
                  className="mt-4 inline-block text-xs font-bold underline underline-offset-4"
                  href="/launch-benefits"
                >
                  Benefits and fees
                </Link>
              </div>
            </div>
            <div className="min-w-0">
              <div id="detailed-registration" className="min-w-0 scroll-mt-24">
                <Suspense
                  fallback={
                    <div
                      className="h-[760px] min-w-0 animate-pulse border border-background/10 bg-card"
                      aria-label="Loading detailed pre-registration form"
                    />
                  }
                >
                  <EarlyAccessForm />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
