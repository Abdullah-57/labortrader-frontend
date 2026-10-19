import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Gift, Link2 } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Referral Rewards & Launch Benefits',
  description:
    'Complete your LaborTrader registration to unlock a personal referral link and add 10 days for every verified new account that joins through it.',
  path: '/referrals',
});

const steps = [
  {
    number: '01',
    title: 'Get Your Link',
    body: 'Finish your registration and required contact verification to unlock your personal referral link.',
    icon: Link2,
  },
  {
    number: '02',
    title: 'Invite Your Network',
    body: 'Your referral uses the valid link or code and completes account verification.',
    icon: BadgeCheck,
  },
  {
    number: '03',
    title: 'You Earn 10 Extra Days',
    body: 'Each verified new account that joins through your link adds 10 days to your included-use period.',
    icon: Gift,
  },
] as const;

export default function ReferralsPage() {
  return (
    <SiteFrame background="landing">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Referral Rewards', path: '/referrals' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Referral Benefits</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Bring the Right People. <span>Get 10 More Days.</span>
            </h1>
            <p className="page-lede">
              Finish your registration and required verification to get your own
              link. When someone uses it and completes account verification,
              your included-use period grows by 10 days.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary" href="/early-access">
                Complete Participant Registration
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                className="button-on-dark"
                href="/for-clients#client-preregistration"
              >
                Complete Client Registration
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="/launch-benefits">
                See Pre-registration Benefits
              </Link>
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.52fr)] lg:items-end">
              <div>
                <p className="section-kicker">How It Works</p>
                <h2 className="section-title mt-5 max-w-4xl">
                  One verified referral. <span>Ten more days.</span>
                </h2>
              </div>
            </div>

            <div className="mt-10 lt-tile-grid">
              {steps.map(({ icon: Icon, ...step }) => (
                <article
                  key={step.number}
                  className="min-w-0 bg-lt-panel p-6 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <Icon
                      className="size-5 text-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-foreground">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>

            <p className="mt-7 max-w-3xl text-sm leading-7 text-foreground">
              You earn the extra days as the referral-link owner. Your original
              $500 or $1,000 account-type cap stays the same. Available to
              eligible participants and clients.{' '}
              <Link
                href="/terms#referral-included-use-benefit"
                className="font-bold underline underline-offset-4"
              >
                Referral terms
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
