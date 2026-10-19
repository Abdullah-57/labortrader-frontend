import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  MapPinned,
  Network,
  Wrench,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { FounderCredibility } from '@/components/founder-credibility';
import { InvestorInquiryForm } from '@/components/investor-inquiry-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  EARLY_MARKET_EVIDENCE,
  EARLY_MARKET_TOTALS,
  LABOR_MARKET_SOURCES,
  NATIONAL_CORE_TRADE_MARKET,
} from '@/lib/labor-market-evidence';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Invest in the Skilled Labor Marketplace',
  description:
    'Explore LaborTrader’s skilled labor marketplace opportunity, Oklahoma launch strategy, and private company brief for qualified investors.',
  path: '/investors',
});

const marketplaceWedge = [
  {
    icon: Wrench,
    title: 'A Costly Local Gap',
    compactBody:
      'Jobs wait while nearby crews sit idle. Connect skill, capacity, and demand at the right time.',
    body: 'Jobs wait while nearby crews sit idle. LaborTrader connects skill, capacity, and demand at the right time.',
  },
  {
    icon: BadgeCheck,
    title: 'Proof Through Work',
    compactBody:
      'Completed engagements build ratings, work history, repeat hires, and clear credential status.',
    body: 'LaborTrader is designed so completed marketplace work builds the record: ratings, documented history, repeat hires, and clearly marked credential status.',
  },
  {
    icon: MapPinned,
    title: 'One Market at a Time',
    compactBody:
      'Start in Oklahoma. Build useful local supply and demand before opening each additional market.',
    body: 'The rollout starts in Oklahoma, where the problem is understood firsthand. Each market is built around local supply and demand before expansion.',
  },
] as const;

export default function InvestorsPage() {
  return (
    <SiteFrame background="investors">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Investors', path: '/investors' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Investor Information</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Back the Marketplace Built for <span>Skilled Work.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              LaborTrader is organizing skilled people, open business capacity,
              and real hiring demand in one focused marketplace.
            </p>
            <p className="mt-5 max-w-3xl text-base font-bold leading-7 text-background/76">
              Pre-registration is open nationwide. Oklahoma is the first planned
              launch market in February 2027.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary" href="#investor-inquiry">
                Request the Private Brief
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="#founder-market-fit">
                Why LaborTrader Exists <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.58fr_1fr] lg:items-start">
            <div className="min-w-0">
              <p className="section-kicker">The Problem</p>
              <h2 className="section-title mt-5">
                The Labor Exists. <span>The Connection Breaks Down.</span>
              </h2>
            </div>
            <div className="text-on-light-muted min-w-0 space-y-5 text-lg leading-8">
              <p>
                Skilled work is local and time-sensitive. Phone calls, social
                posts, and personal networks rarely show the full picture.
              </p>
              <p className="text-xl font-semibold tracking-[-0.025em] text-foreground">
                LaborTrader is built to make available skill and real demand
                easier to find, compare, and turn into documented work.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-background/10 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">
              Initial Outreach: Oklahoma, Texas &amp; Florida
            </p>
            <div className="mt-8 lt-tile-grid">
              {EARLY_MARKET_EVIDENCE.map((market) => (
                <article
                  key={market.state}
                  className="min-w-0 bg-lt-panel p-5 sm:p-6"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {market.status}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    {market.state}
                  </h3>
                  <p className="mt-4 text-sm font-bold leading-6 text-background/74">
                    {market.jobs2024.toLocaleString('en-US')} core-trade jobs,{' '}
                    {market.annualOpenings2024To2034.toLocaleString('en-US')}{' '}
                    average annual openings, and{' '}
                    {(market.projectedGrowth2024To2034 * 100).toFixed(1)}%
                    projected growth through 2034.
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-10 grid min-w-0 gap-8 lg:grid-cols-[.62fr_1fr] lg:items-end">
              <div className="min-w-0">
                <p className="section-kicker">The Market Opening</p>
                <h2 className="section-title mt-5">
                  Large Enough to Matter. <span>Focused Enough to Win.</span>
                </h2>
              </div>
              <p className="max-w-3xl text-base leading-7 text-background/76">
                HVAC, electrical, and plumbing account for more than{' '}
                <strong className="text-background">
                  1.77 million U.S. jobs
                </strong>{' '}
                and an average of{' '}
                <strong className="text-background">
                  {NATIONAL_CORE_TRADE_MARKET.annualOpenings2025To2035.toLocaleString(
                    'en-US',
                  )}{' '}
                  openings each year
                </strong>
                . LaborTrader begins with the trades and states where a focused
                local marketplace can prove value before the rollout expands.
              </p>
            </div>

            <dl className="mt-10 lt-tile-grid lt-metric-grid">
              {[
                [
                  '1.77M',
                  'Core trade jobs nationwide',
                  'HVAC, electrical, and plumbing, 2025',
                ],
                [
                  NATIONAL_CORE_TRADE_MARKET.annualOpenings2025To2035.toLocaleString(
                    'en-US',
                  ),
                  'Average openings each year',
                  'National projection, 2025 to 2035',
                ],
                [
                  EARLY_MARKET_TOTALS.annualOpenings2024To2034.toLocaleString(
                    'en-US',
                  ),
                  'Openings each year in OK, TX, and FL',
                  'Combined state projection, 2024 to 2034',
                ],
                [
                  `${(
                    EARLY_MARKET_TOTALS.shareOfNationalJobGrowth2024To2034 * 100
                  ).toFixed(1)}%`,
                  'Share of projected U.S. job growth',
                  'From states holding 17.1% of current jobs',
                ],
              ].map(([value, label, detail]) => (
                <div key={label} className="min-w-0 bg-lt-panel p-5 sm:p-6">
                  <dd className="text-3xl font-semibold tracking-[-0.055em] text-primary sm:text-4xl">
                    {value}
                  </dd>
                  <dt className="mt-4 text-base font-semibold leading-6 text-background">
                    {label}
                  </dt>
                  <p className="mt-2 text-xs font-bold leading-5 text-background/58">
                    {detail}
                  </p>
                </div>
              ))}
            </dl>

            <p className="mt-7 max-w-5xl text-xs font-bold leading-5 text-background/52">
              Sources:{' '}
              <a
                className="underline decoration-background/30 underline-offset-4 hover:text-background"
                href={LABOR_MARKET_SOURCES.national}
                rel="noreferrer"
                target="_blank"
              >
                U.S. Bureau of Labor Statistics 2025 to 2035 projections
              </a>{' '}
              and{' '}
              <a
                className="underline decoration-background/30 underline-offset-4 hover:text-background"
                href={LABOR_MARKET_SOURCES.state}
                rel="noreferrer"
                target="_blank"
              >
                state labor projections published through Projections Central
              </a>
              . Annual openings include growth and replacement needs. State
              projections use the 2024 to 2034 cycle.
            </p>
          </div>
        </section>

        <section className="border-b border-background/10 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">The Focused Wedge</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Start With the Work the General Platforms <span>Miss.</span>
            </h2>
            <div className="mt-10 lt-tile-grid">
              {marketplaceWedge.map(
                ({ icon: Icon, title, body, compactBody }) => (
                  <article
                    key={title}
                    className="min-w-0 bg-lt-panel p-6 sm:p-7"
                  >
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-7 text-2xl font-semibold tracking-[-0.04em]">
                      {title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-background/74">
                      <span className="lt-tile-copy-full">{body}</span>
                      <span className="lt-tile-copy-compact">
                        {compactBody}
                      </span>
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>

        <section
          id="founder-market-fit"
          className="lt-surface-light scroll-mt-28 bg-lt-panel py-14 text-foreground lg:py-20"
        >
          <div className="site-shell min-w-0">
            <div className="grid min-w-0 gap-10 lg:grid-cols-[.58fr_1fr] lg:items-start">
              <div className="min-w-0">
                <Network className="size-7 text-primary" aria-hidden="true" />
                <p className="section-kicker mt-7">Founder-Market Fit</p>
                <h2 className="section-title mt-5">
                  Built From the <span>Actual Bottleneck.</span>
                </h2>
              </div>
              <FounderCredibility />
            </div>
            <dl className="mt-12 lt-tile-grid lt-status-grid">
              {[
                ['Current stage', 'Pre-registration open'],
                ['First planned market', 'Oklahoma'],
                ['Public launch target', 'February 2027'],
              ].map(([label, value]) => (
                <div key={label} className="bg-lt-panel p-5 sm:p-6">
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                    {label}
                  </dt>
                  <dd className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="investor-inquiry"
          aria-labelledby="investor-inquiry-title"
          className="scroll-mt-28 border-t border-background/10 bg-lt-panel py-14 lg:py-20"
        >
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.5fr_1fr] lg:items-start">
            <div className="min-w-0">
              <p className="section-kicker">Private Investor Brief</p>
              <h2 id="investor-inquiry-title" className="section-title mt-5">
                Review the Company <span>Privately.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-background/76">
                Qualified investors can request company, product, market, and
                fundraising materials for private review.
              </p>
            </div>
            <div className="min-w-0">
              <InvestorInquiryForm />
              <div className="mt-6 border-l-2 border-primary pl-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.12em]">
                  Securities Disclaimer
                </h3>
                <p className="mt-3 text-sm font-bold leading-6 text-background/72">
                  This page is for informational and discussion purposes only.
                  It is not an offer to sell or a solicitation to buy any
                  security. Any offering will be made only through definitive
                  offering documents and in accordance with applicable law.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
