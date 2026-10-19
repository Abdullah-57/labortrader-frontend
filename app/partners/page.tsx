import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  GraduationCap,
  Network,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { FounderCredibility } from '@/components/founder-credibility';
import { PartnerInquiryForm } from '@/components/partner-inquiry-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  EARLY_MARKET_TOTALS,
  LABOR_MARKET_SOURCES,
  NATIONAL_CORE_TRADE_MARKET,
} from '@/lib/labor-market-evidence';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Skilled Trades Partnership Opportunities',
  description:
    'Explore workforce, training, supplier, credentialing, and business-service partnerships that support LaborTrader’s skilled-trade marketplace.',
  path: '/partners',
});

const partnerGroups = [
  {
    icon: BadgeCheck,
    title: 'Workforce Support',
    compactBody:
      'Staffing, payroll, and screening partners for well-run assignments.',
    body: 'Staffing, payrolling, screening, and employment organizations that can support qualified people and well-run assignments as markets open.',
  },
  {
    icon: GraduationCap,
    title: 'Training & Networks',
    compactBody:
      'Schools and associations connecting skilled people to local demand.',
    body: 'Trade schools, associations, and member organizations that prepare people for skilled work and connect them to local demand.',
  },
  {
    icon: Store,
    title: 'Trade Suppliers',
    compactBody:
      'Products and services for trade professionals, by category and state.',
    body: 'Supply houses and distributors that can help trade professionals find useful products and services by category and state.',
  },
  {
    icon: ShieldCheck,
    title: 'Business Services',
    compactBody:
      'Credentials, insurance, finance, compliance, and technology for the trades.',
    body: 'Credentialing, insurance, finance, compliance, and technology organizations that solve a practical need for skilled-trade businesses.',
  },
] as const;

const fitCriteria = [
  'You solve a real problem for skilled people or trade businesses.',
  'You can support the markets and responsibilities you propose.',
  'The relationship has a clear scope and a useful way to measure results.',
] as const;

export default function PartnersPage() {
  return (
    <SiteFrame background="partners">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Partners', path: '/partners' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Partner With LaborTrader</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Help Build a Stronger <span>Skilled-Labor Market.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              LaborTrader works with organizations that bring trusted reach,
              useful services, or operating capability to the trades.
            </p>
            <p className="mt-5 max-w-3xl text-base font-bold leading-7 text-background/76">
              SkillCraft Staffing provides the W-2 staffing path. We also
              welcome other staffing and payroll providers. Tell us where you
              operate and how you would like to work together.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary" href="#partner-inquiry">
                Start a Partner Conversation
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="/advertise">
                Advertise in the Pro Shop
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Who We Work With</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Put Your Expertise <span>to Work.</span>
            </h2>
            <div className="mt-9 lt-tile-grid">
              {partnerGroups.map(({ icon: Icon, title, body, compactBody }) => (
                <article key={title} className="min-w-0 bg-lt-panel p-6 sm:p-7">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-7 text-2xl font-semibold tracking-[-0.04em]">
                    {title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-foreground">
                    <span className="lt-tile-copy-full">{body}</span>
                    <span className="lt-tile-copy-compact">{compactBody}</span>
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-background/10 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.62fr_1fr] lg:items-start">
            <div className="min-w-0">
              <Network className="size-7 text-primary" aria-hidden="true" />
              <p className="section-kicker mt-7">Why This Market Matters</p>
              <h2 className="section-title mt-5">
                Reach the Trades Where <span>Demand Is Growing.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-background/74">
                A growing skilled-work market needs more than job matching:
                training, payroll, insurance, tools, technology, and business
                support.
              </p>
            </div>
            <div className="min-w-0">
              <dl className="lt-tile-grid lt-metric-grid">
                {[
                  [
                    NATIONAL_CORE_TRADE_MARKET.specialtyContractorEmploymentRange,
                    'work for specialty trade contractors',
                    'Across the three core occupations nationally',
                  ],
                  [
                    EARLY_MARKET_TOTALS.annualOpenings2024To2034.toLocaleString(
                      'en-US',
                    ),
                    'average openings each year',
                    'Across Oklahoma, Texas, and Florida',
                  ],
                  [
                    `${(
                      EARLY_MARKET_TOTALS.projectedGrowth2024To2034 * 100
                    ).toFixed(1)}%`,
                    'projected core-trade growth',
                    'Combined state projection, 2024 to 2034',
                  ],
                  [
                    '1.77M',
                    'core-trade jobs nationwide',
                    'HVAC, electrical, and plumbing, 2025',
                  ],
                ].map(([value, label, detail]) => (
                  <div key={label} className="min-w-0 bg-lt-panel p-5 sm:p-6">
                    <dd className="text-3xl font-semibold tracking-[-0.055em] text-primary sm:text-4xl">
                      {value}
                    </dd>
                    <dt className="mt-3 text-base font-semibold leading-6 text-background">
                      {label}
                    </dt>
                    <p className="mt-2 text-xs font-bold leading-5 text-background/58">
                      {detail}
                    </p>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs font-bold leading-5 text-background/52">
                Sources:{' '}
                <a
                  className="underline decoration-background/30 underline-offset-4 hover:text-background"
                  href={LABOR_MARKET_SOURCES.national}
                  rel="noreferrer"
                  target="_blank"
                >
                  U.S. Bureau of Labor Statistics
                </a>{' '}
                and{' '}
                <a
                  className="underline decoration-background/30 underline-offset-4 hover:text-background"
                  href={LABOR_MARKET_SOURCES.state}
                  rel="noreferrer"
                  target="_blank"
                >
                  Projections Central
                </a>
                . Annual openings include growth and replacement needs.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-background/10 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.68fr_1.32fr] lg:items-start">
            <div className="min-w-0">
              <Network className="size-7 text-primary" aria-hidden="true" />
              <p className="section-kicker mt-7">A Strong Fit</p>
              <h2 className="section-title mt-5">
                Clear Scope. <span>Real Value.</span>
              </h2>
            </div>
            <div className="min-w-0 border-t border-background/14">
              {fitCriteria.map((item) => (
                <div
                  key={item}
                  className="grid min-w-0 grid-cols-1 gap-3 border-b border-background/14 py-5"
                >
                  <p className="text-base font-bold leading-7 text-background/80">
                    {item}
                  </p>
                </div>
              ))}
              <p className="mt-6 text-sm font-bold leading-6 text-background/68">
                Commercial terms are reviewed privately and documented in a
                separate written agreement.
              </p>
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.58fr_1fr] lg:items-center">
            <div className="min-w-0">
              <p className="section-kicker">Who Is Building LaborTrader</p>
              <h2 className="section-title mt-5">
                Firsthand Experience. <span>Practical Partnerships.</span>
              </h2>
              <p className="text-on-light-muted mt-5 max-w-xl text-base leading-7">
                Help solve the everyday problems skilled workers, trade
                businesses, and clients face.
              </p>
            </div>
            <FounderCredibility />
          </div>
        </section>

        <section
          id="partner-inquiry"
          aria-labelledby="partner-inquiry-title"
          className="scroll-mt-28 border-t border-background/10 bg-lt-panel py-14 lg:py-20"
        >
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.5fr_1fr] lg:items-start">
            <div className="min-w-0">
              <p className="section-kicker">Partnership Inquiry</p>
              <h2 id="partner-inquiry-title" className="section-title mt-5">
                Tell Us What You <span>Bring.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-background/76">
                Tell us who you serve, where you operate, and how we could work
                together. We follow up by email.
              </p>
            </div>
            <div className="min-w-0">
              <PartnerInquiryForm />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
