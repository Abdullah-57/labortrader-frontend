import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BadgePercent,
  BarChart3,
  CalendarClock,
  MapPinned,
} from 'lucide-react';
import { ProShopPartnerForm } from '@/components/pro-shop-partner-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Advertise in the Pro Shop',
  description:
    'Apply for a Founding LaborTrader Pro Shop listing by vendor category and state, with direct buyer traffic and trackable affiliate referrals.',
  path: '/advertise',
});

const benefits = [
  {
    title: 'Exclusive Category Slot',
    body: 'One vendor per category and state for the listing term.',
    icon: BadgeCheck,
  },
  {
    title: 'Early Market Placement',
    body: 'Have your offer ready when your state’s Pro Shop opens.',
    icon: MapPinned,
  },
  {
    title: 'First Marketing Opportunity',
    body: 'Get the first chance to bid on matching ad placements.',
    icon: BarChart3,
  },
  {
    title: 'Trackable Partner Traffic',
    body: 'Track referrals through supported vendor programs.',
    icon: BadgePercent,
  },
] as const;

const process = [
  {
    number: '01',
    title: 'Apply',
    body: 'Choose your product or service category, states, audience, and preferred placements.',
  },
  {
    number: '02',
    title: 'Complete Review',
    body: 'LaborTrader reviews fit, coverage, public claims, and affiliate or referral readiness.',
  },
  {
    number: '03',
    title: 'Reserve Your Spot',
    body: 'Once approved, review your written terms and pay to reserve your category and state.',
  },
  {
    number: '04',
    title: 'Activate',
    body: 'The placement term begins at the later of state Pro Shop launch and placement activation.',
  },
] as const;

export default function AdvertisePage() {
  return (
    <SiteFrame background="landing">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Advertise in Pro Shop', path: '/advertise' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Founding Pro Shop Partners</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Put Your Brand in Front of the <span>Skilled Trades.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              Reach workers, contractors, trade businesses, and hiring
              organizations already looking for products and services that
              support skilled work.
            </p>
            <p className="mt-5 max-w-3xl text-base font-bold leading-7 text-background/76">
              Applications are reviewed by vendor, category, and state. Applying
              is free and does not reserve a listing.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary" href="#provider-application">
                Apply as a Founding Vendor
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="/pro-shop">
                Explore the Pro Shop
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">The Founding Offer</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Get In Early. <span>Grow With the Market.</span>
            </h2>

            <div className="mt-10 lt-tile-grid lt-price-tiles">
              <article className="min-w-0 bg-lt-panel p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Apply
                </p>
                <p className="mt-6 text-5xl font-semibold tracking-[-0.055em]">
                  $0
                </p>
                <p className="mt-4 text-base font-semibold leading-7">
                  No application fee. No payment card.
                </p>
              </article>

              <article className="min-w-0 bg-lt-panel p-6 text-[#f3eddf] sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Founding Listing
                </p>
                <p className="mt-6 text-5xl font-semibold tracking-[-0.055em] text-primary">
                  $299
                </p>
                <p className="mt-4 text-base font-semibold leading-7">
                  Per approved vendor category, per state, for the first active
                  12 months.
                </p>
              </article>

              <article className="min-w-0 bg-lt-panel p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  Standard Annual Rate
                </p>
                <p className="mt-6 text-5xl font-semibold tracking-[-0.055em]">
                  $999
                  <span className="ml-1 text-base tracking-normal text-foreground">
                    / year
                  </span>
                </p>
                <p className="mt-4 text-base font-semibold leading-7">
                  Per approved vendor category, per state.
                </p>
                <p className="mt-3 text-base leading-7 text-foreground">
                  After the three-year Founding period. Optional advertising
                  placements are priced separately.
                </p>
              </article>
            </div>

            <p className="mt-6 max-w-5xl text-sm font-bold leading-6 text-foreground">
              Founding Partners in good standing can choose two additional
              annual renewals at $299 per category and state, plus the first
              opportunity to bid on matching marketing placements. Renewal is
              never automatic.
            </p>
            <p className="mt-3 max-w-5xl text-sm leading-6 text-foreground">
              Your signed order confirms the listing, price, activation,
              cancellation, and refund terms.
            </p>
          </div>
        </section>

        <section className="bg-lt-panel py-14 lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Founding Partner Benefits</p>
            <h2 className="section-title mt-5 max-w-5xl">
              More Than Exposure. <span>A Real Market Position.</span>
            </h2>
            <div className="mt-10 lt-tile-grid">
              {benefits.map(({ icon: Icon, title, body }) => (
                <article key={title} className="min-w-0 bg-lt-panel p-6 sm:p-7">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.035em]">
                    {title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-background/74">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Who Should Apply</p>
            <h2 className="section-title mt-5 max-w-4xl">
              Vendors That Help the Trades <span>Perform.</span>
            </h2>
            <p className="mt-6 max-w-4xl text-lg font-semibold leading-8 tracking-[-0.025em]">
              Bring useful products or services, dependable fulfillment, and
              responsive support to the trades.
            </p>
            <p className="mt-4 max-w-5xl text-base leading-7 text-foreground">
              Suppliers, rental companies, training providers, insurers,
              software companies, and other trade-focused businesses are
              welcome. Listings need an approved affiliate or referral
              arrangement.
            </p>
          </div>
        </section>

        <section className="border-y border-background/10 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">From Application to Activation</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Four Clear Steps. <span>No Surprise Commitment.</span>
            </h2>
            <ol className="mt-10 lt-tile-grid">
              {process.map((step) => (
                <li key={step.number} className="min-w-0 bg-lt-panel p-6">
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.035em]">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-background/74">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="provider-application"
          aria-labelledby="provider-application-title"
          className="scroll-mt-28 bg-lt-panel py-14 lg:py-20"
        >
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[minmax(0,.48fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <div className="min-w-0">
              <CalendarClock
                className="size-7 text-primary"
                aria-hidden="true"
              />
              <p className="section-kicker mt-7">Vendor Application</p>
              <h2
                id="provider-application-title"
                className="section-title mt-5"
              >
                Put Your Offer <span>on the Map.</span>
              </h2>
              <p className="mt-6 max-w-xl text-base leading-7 text-background/76">
                Choose your category, states, audience, and placements. Review
                your first-year estimate before submitting.
              </p>
            </div>
            <div className="min-w-0">
              <ProShopPartnerForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
