import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Clock3,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { PUBLIC_PARTICIPANT_ROLES } from '@/lib/constants';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Pre-registration Benefits and Fees',
  description:
    'Pre-register before your market opens for up to 90 days of included LaborTrader platform use, with no monthly membership fee.',
  path: '/launch-benefits',
});

const launchBenefits = [
  {
    title: 'Up to 90 days included.',
    body: 'Your benefit begins when your registered market and approved account go live.',
    icon: Clock3,
  },
  {
    title: 'No monthly fee.',
    body: 'Keep your account without a monthly charge. Pay for eligible marketplace actions after your benefit ends.',
    icon: Eye,
  },
  {
    title: '$10 job posts.',
    body: 'After your included benefit ends or reaches its cap, a $10 fee applies when you post a job.',
    icon: BellRing,
  },
  {
    title: 'See fees upfront.',
    body: 'Any applicable contract fee is shown before both sides agree. There are no additional fees simply for being a member.',
    icon: BadgeCheck,
  },
] as const;

function includedValueForRole(audienceType: string) {
  return audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM'
    ? 100_000
    : 50_000;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function LaunchBenefitsPage() {
  return (
    <SiteFrame background="landing">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Launch Benefits', path: '/launch-benefits' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Pre-registration Benefits</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Start With <span>Up to 90 Days Included.</span>
            </h1>
            <p className="page-lede">
              Pre-register before your market opens for up to 90 days of
              eligible platform use, up to your account-type cap. Your benefit
              begins after verification and account approval, when your market
              goes live. There is no monthly membership fee.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary" href="/early-access">
                Participant Pre-registration
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                className="button-on-dark"
                href="/for-clients#client-preregistration"
              >
                Client &amp; Project Owner Pre-registration
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="#pricing">
                See Included Value and Fees
              </Link>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="lt-surface-light scroll-mt-28 bg-lt-panel py-14 text-foreground lg:py-20"
        >
          <div className="site-shell min-w-0">
            <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)] lg:gap-16">
              <div className="min-w-0">
                <p className="section-kicker">Straightforward by Role</p>
                <h2 className="section-title mt-5 max-w-3xl">
                  Included Value. <span>Clear Costs.</span>
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-foreground">
                  Up to $500 for workers, contractors, and clients. Up to $1,000
                  for businesses and hiring organizations.
                </p>
              </div>

              <div className="lt-tile-grid lt-benefit-prices">
                {PUBLIC_PARTICIPANT_ROLES.map((role) => (
                  <article
                    key={role.audienceType}
                    className="flex min-w-0 flex-col bg-lt-panel p-6"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                      {role.label}
                    </p>
                    <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
                      {formatPrice(includedValueForRole(role.audienceType))}
                    </p>
                    <p className="mt-3 text-base leading-7 text-foreground">
                      Included platform use.
                    </p>
                    <Link
                      className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.08em] text-foreground underline decoration-primary decoration-2 underline-offset-4"
                      aria-label={`Pre-register as ${role.label}`}
                      href={`/early-access?role=${role.value}#detailed-registration`}
                    >
                      Choose
                      <ArrowRight
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </article>
                ))}
                <article className="flex min-w-0 flex-col bg-lt-panel p-6 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                    Clients &amp; Project Owners
                  </p>
                  <p className="mt-5 text-4xl font-semibold tracking-[-0.05em]">
                    $500
                  </p>
                  <p className="mt-3 text-base leading-7 text-foreground">
                    Included platform use through client registration.
                  </p>
                  <Link
                    className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.08em] text-foreground underline decoration-primary decoration-2 underline-offset-4"
                    href="/for-clients#client-preregistration"
                  >
                    Choose client account
                    <ArrowRight
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-lt-panel py-14 lg:py-20">
          <div className="site-shell min-w-0">
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.52fr)] lg:items-end">
              <div>
                <p className="section-kicker">What Pre-registration Includes</p>
                <h2 className="section-title mt-5 max-w-4xl">
                  Real Time to Use It. <span>No Monthly Membership Fee.</span>
                </h2>
              </div>
              <p className="text-base leading-7 text-background/68">
                Your included benefit changes what you pay at launch. It never
                changes reputation, ratings, or provider-result order.
              </p>
            </div>

            <div className="mt-10 lt-tile-grid">
              {launchBenefits.map(({ icon: Icon, ...benefit }) => (
                <article
                  key={benefit.title}
                  className="min-w-0 bg-lt-panel p-6 sm:p-7"
                >
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                    {benefit.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-background/68">
                    {benefit.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 border border-primary/45 bg-primary/8 p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <ShieldCheck
                  className="mt-0.5 size-6 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">
                    Included use applies to LaborTrader platform fees.
                  </h3>
                  <p className="mt-2 max-w-5xl text-base leading-7 text-background/70">
                    {
                      'The offer does not cover wages, provider compensation, materials, taxes, permits, insurance, payment processing, or optional third-party services. Charges are shown before a paid action is confirmed.'
                    }
                  </p>
                  <Link
                    className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.08em] text-primary underline underline-offset-4"
                    href="/terms#launch-benefit-and-marketplace-charges"
                  >
                    Read Launch Benefit Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-background/12 py-10">
          <div className="site-shell">
            <p className="max-w-3xl text-sm leading-7 text-background/70">
              The benefit ends after 90 days or when your cap is reached,
              whichever comes first.{' '}
              <Link
                className="font-bold underline underline-offset-4"
                href="/terms#launch-benefit-and-marketplace-charges"
              >
                Launch benefit terms
              </Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
