import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import { ArrowRight, SearchCheck, Calculator, UsersRound } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { createPageMetadata } from '@/lib/site-metadata';
export const metadata = createPageMetadata({
  title: 'MarketScan: Bid Opportunities & Labor Planning',
  description:
    'Explore how MarketScan will help you find project bid opportunities, estimate skilled labor costs, and plan crews. Pre-register for LaborTrader.',
  path: '/market-scan',
});
const steps = [
  {
    icon: SearchCheck,
    title: 'Find Relevant Work',
    compactBody:
      'Find opportunities by trade, location, scope, and deadline in one place.',
    body: 'Compare opportunities from multiple sources by specialty, location, scope, and deadline. Spend less time searching and more time bidding.',
  },
  {
    icon: Calculator,
    title: 'Build a Better Bid',
    compactBody:
      'Plan labor with member rates. Confirm scope and pricing before you commit.',
    body: 'Estimate labor using member rates and availability. Confirm scope and pricing with the people you plan to engage.',
  },
  {
    icon: UsersRound,
    title: 'Line Up the Capacity',
    compactBody:
      'Find workers, specialists, or service businesses. Agree on scope, rates, and timing to match the people to the project.',
    body: 'Use the marketplace to find workers, independent specialists, or service businesses. Agree on scope, rates, and timing so the people match the project.',
  },
];
export default function MarketScanPage() {
  return (
    <SiteFrame background="market-scan">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'MarketScan', path: '/market-scan' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="section-kicker">MarketScan</p>
              <h1 className="page-title mt-5">
                Find Work.
                <br />
                <span>Build Better Bids.</span>
              </h1>
              <p className="page-lede">
                Spend less time looking for work and more time bidding it. Find
                relevant opportunities, plan your labor costs, and connect with
                the people who can help you deliver.
              </p>
              <Link
                className="button-primary mt-8"
                href="/early-access?source=market-scan-page#detailed-registration"
              >
                Pre-register for Access
                <ArrowRight aria-hidden="true" />
              </Link>
              <p className="mt-4 text-xs text-background/65">
                Coming with the LaborTrader marketplace.
              </p>
            </div>
            <aside className="lt-glass-panel p-7 sm:p-8">
              <p className="section-kicker">From Lead to Labor Plan</p>
              <ol className="mt-6 space-y-6">
                {[
                  'An opportunity that fits your trade.',
                  'A labor budget grounded in member rates.',
                  'The right people to cover the work.',
                ].map((text) => (
                  <li
                    key={text}
                    className="flex gap-4 border-b border-background/15 pb-6 last:border-0 last:pb-0"
                  >
                    <span className="text-lg font-bold leading-7">{text}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>
        <section className="lt-surface-light bg-lt-panel py-16 text-foreground lg:py-20">
          <div className="site-shell">
            <p className="section-kicker">Less Searching. More Opportunity.</p>
            <h2 className="section-title mt-4 max-w-3xl">
              See the job. <span>Know what it takes.</span>
            </h2>
            <div className="mt-9 lt-tile-grid">
              {steps.map(({ icon: Icon, title, body, compactBody }) => (
                <article key={title} className="lt-raised-panel p-7">
                  <Icon className="size-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-7 text-2xl font-semibold">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-foreground/75">
                    <span className="lt-tile-copy-full">{body}</span>
                    <span className="lt-tile-copy-compact">{compactBody}</span>
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-7 max-w-3xl text-sm leading-7 text-foreground/70">
              Check each opportunity’s source, scope, location, deadline, and
              last review date before you bid.
            </p>
          </div>
        </section>
        <section className="py-14">
          <div className="site-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="section-title max-w-3xl">
              Your next project needs <span>a plan.</span>
            </h2>
            <Link className="button-on-dark" href="/how-it-works">
              How LaborTrader Works
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
