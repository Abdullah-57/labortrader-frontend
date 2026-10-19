import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FaqList, FaqJsonLd } from '@/components/faq-list';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Skilled Labor Marketplace FAQ',
  description:
    'Get answers about LaborTrader registration, skilled trade hiring, verification, launch markets, fees, and referral benefits.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <SiteFrame background="landing" reading>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
      />
      <FaqJsonLd />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">FAQ</p>
            <h1 className="page-title mt-6 max-w-5xl">
              The Essentials, <span>Answered.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              Clear answers about registration, verification, rewards, and
              market openings.
            </p>
          </div>
        </section>
        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.32fr_1fr]">
            <div className="min-w-0">
              <p className="section-kicker">Quick Answers</p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.045em]">
                Pick a Question. Get the Answer.
              </h2>
            </div>
            <FaqList />
          </div>
        </section>
        <section className="bg-lt-panel py-14 lg:py-16">
          <div className="site-shell flex min-w-0 flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="section-kicker">Ready?</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
                Join Before Your Market Opens.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-background/72">
                Pre-register now for launch updates, eligible platform benefits,
                and a personal referral link after verification.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" href="/early-access">
                Participant Pre-registration <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link
                className="button-on-dark"
                href="/for-clients#client-preregistration"
              >
                Client Pre-registration <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
