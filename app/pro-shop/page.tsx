import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  GraduationCap,
  HardHat,
  MapPin,
  Megaphone,
  MousePointerClick,
  PackageSearch,
  ShieldCheck,
  Store,
  Truck,
  Wrench,
} from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { ProShopStorefrontPreview } from '@/components/pro-shop-storefront-preview';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Pro Shop: Trade Tools, Supplies & Services',
  description:
    'Preview the LaborTrader Pro Shop for trade tools, supplies, rentals, training, and business services. Apply to list your offer by category and state.',
  path: '/pro-shop',
});

const categories = [
  {
    title: 'Supplies & Materials',
    body: 'General and specialty supply houses for parts, materials, and jobsite essentials.',
    icon: Store,
  },
  {
    title: 'Tools & Rentals',
    body: 'Professional tools, equipment, fleet support, maintenance, and rentals.',
    icon: Wrench,
  },
  {
    title: 'Safety & Workwear',
    body: 'Field-ready protection, clothing, boots, storage, and everyday gear.',
    icon: HardHat,
  },
  {
    title: 'Trade Training',
    body: 'Trade education, continuing education, exam preparation, and career development.',
    icon: GraduationCap,
  },
  {
    title: 'Insurance & Payroll',
    body: 'Insurance, benefits, payroll, bonding, safety, and risk-management resources.',
    icon: ShieldCheck,
  },
  {
    title: 'Jobsite Software',
    body: 'Operations tools, connectivity, logistics, security, and field support.',
    icon: Truck,
  },
  {
    title: 'Business Services',
    body: 'Growth, accounting, tax, legal, licensing, and business advisory services.',
    icon: Megaphone,
  },
  {
    title: 'Business Funding',
    body: 'Equipment financing, working capital, and practical funding resources for trade businesses.',
    icon: BriefcaseBusiness,
  },
] as const;

const vendorAdvantages = [
  {
    title: 'Trade and Market Match',
    body: 'Place the right offer by state, trade, and buyer role.',
    icon: MapPin,
  },
  {
    title: 'Direct Vendor Traffic',
    body: 'Send qualified visitors to an approved product, service, or quote page you control.',
    icon: MousePointerClick,
  },
  {
    title: 'Buyer Insights',
    body: 'Compare attributable LaborTrader clicks by offer and market where tracking is available.',
    icon: BarChart3,
  },
  {
    title: 'Products and Services',
    body: 'Sell gear, rentals, training, insurance, software, and more.',
    icon: PackageSearch,
  },
] as const;

export default function ProShopPage() {
  return (
    <SiteFrame background="pro-shop">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pro Shop', path: '/pro-shop' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">The LaborTrader Pro Shop</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Everything the Trades Buy. <span>One Focused Marketplace.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              Tools, materials, rentals, training, insurance, software, and
              business services organized by the work, the buyer, and the
              market.
            </p>
            <p className="mt-5 max-w-3xl text-base font-bold leading-7 text-background/76">
              Vendor applications are open. The directory will connect buyers
              directly to approved providers as each market opens.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary" href="#pro-shop-preview">
                See the Pro Shop Preview <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="/advertise">
                Become a Founding Partner
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="categories"
          className="lt-surface-light scroll-mt-28 bg-lt-panel py-14 text-foreground lg:py-20"
        >
          <div className="site-shell min-w-0">
            <p className="section-kicker">Built for the Trades</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Products, Services, and Support. <span>All in One Place.</span>
            </h2>
            <div className="mt-10 lt-tile-grid">
              {categories.map(({ icon: Icon, title, body }) => (
                <article key={title} className="min-w-0 bg-lt-panel p-6 sm:p-7">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.035em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-foreground">
                    {body}
                  </p>
                </article>
              ))}
              <article className="min-w-0 bg-lt-panel p-6 text-[#f3eddf] sm:p-7 col-span-full">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-3xl">
                    <PackageSearch
                      className="size-6 text-primary"
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.035em]">
                      Bring Something Else the Trades Need
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#f3eddf]/76">
                      Vendors can describe another useful product or service in
                      the Founding Partner application.
                    </p>
                  </div>
                  <Link className="button-primary shrink-0" href="/advertise">
                    Apply as a Vendor
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="pro-shop-preview"
          aria-labelledby="pro-shop-preview-title"
          className="scroll-mt-28 bg-lt-panel py-14 lg:py-20"
        >
          <div className="site-shell min-w-0">
            <p className="section-kicker">The Pro Shop Experience</p>
            <h2
              id="pro-shop-preview-title"
              className="section-title mt-5 max-w-5xl"
            >
              The Right Offer. <span>Already in Front of the Right Buyer.</span>
            </h2>
            <p className="mt-6 max-w-4xl text-lg font-bold leading-8 text-background/78">
              Find products and services by trade, role, and market. Reach
              buyers who already need what you sell.
            </p>

            <ProShopStorefrontPreview />

            <div className="mt-12 border-y border-background/14">
              <div className="lt-tile-grid">
                {vendorAdvantages.map(({ icon: Icon, title, body }, index) => (
                  <div
                    key={title}
                    className={`min-w-0 py-7 md:px-6 lg:px-7 ${
                      index > 0 ? 'lg:border-l lg:border-background/14' : ''
                    } ${index % 2 === 1 ? 'md:border-l md:border-background/14' : ''}`}
                  >
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em]">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-background/68">
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-5 border-l-4 border-primary pl-5 sm:flex-row sm:items-center sm:justify-between sm:pl-7">
              <p className="max-w-4xl text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
                Put your offer directly in front of the buyers who need it.
              </p>
              <Link
                className="button-primary shrink-0"
                href="/advertise#provider-application"
              >
                Apply for a Founding Listing
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <p className="section-kicker">
                Built for Buyers. Valuable for Vendors.
              </p>
              <h2 className="section-title mt-5 max-w-4xl">
                Focused Demand. <span>Measurable Traffic.</span>
              </h2>
              <p className="mt-6 max-w-3xl text-lg font-bold leading-8 tracking-[-0.02em]">
                Reach the people who use, specify, and buy for the trades. Keep
                your marketing focused on the buyers who matter.
              </p>

              <div className="mt-10 border border-foreground/15 bg-lt-panel p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                  How It Starts
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                  Direct to the Vendor. Measured Where Available.
                </h3>
                <ul className="mt-6 grid gap-4 text-sm font-bold leading-6 text-foreground sm:grid-cols-3">
                  <li className="border-l-2 border-primary pl-4">
                    Buyers discover offers by category, role, trade, and state.
                  </li>
                  <li className="border-l-2 border-primary pl-4">
                    Each live offer sends the buyer to the vendor&apos;s
                    approved destination.
                  </li>
                  <li className="border-l-2 border-primary pl-4">
                    LaborTrader will record attributable clicks where the
                    vendor&apos;s tracking supports it.
                  </li>
                </ul>
                <p className="mt-6 text-xs font-bold leading-5 text-foreground">
                  Shop directly with approved vendors.{' '}
                  <Link href="/terms" className="underline underline-offset-4">
                    Pro Shop terms
                  </Link>
                </p>
              </div>
            </div>

            <aside className="min-w-0 border border-foreground/15 bg-lt-panel p-6 text-[#f3eddf] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Founding Partner Rate
              </p>
              <div className="mt-5 flex items-end gap-2">
                <p className="text-5xl font-semibold tracking-[-0.055em] text-primary">
                  $299
                </p>
                <p className="pb-1 text-base font-semibold text-[#f3eddf]/70">
                  / year
                </p>
              </div>
              <p className="mt-4 text-base font-semibold leading-7">
                Per approved vendor category, per state.
              </p>
              <div className="mt-7 space-y-0 border-y border-[#f3eddf]/14">
                <div className="flex items-start justify-between gap-4 py-4">
                  <span className="text-sm font-bold text-[#f3eddf]/68">
                    First active year
                  </span>
                  <span className="text-sm font-semibold">$299</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-[#f3eddf]/14 py-4">
                  <span className="text-sm font-bold text-[#f3eddf]/68">
                    Founding renewals, years 2 and 3
                  </span>
                  <span className="text-right text-sm font-semibold">
                    $299 / year
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-[#f3eddf]/14 py-4">
                  <span className="text-sm font-bold text-[#f3eddf]/68">
                    Standard annual rate after that
                  </span>
                  <span className="text-sm font-semibold">$999 / year</span>
                </div>
              </div>
              <p className="mt-6 text-sm leading-6 text-[#f3eddf]/68">
                Founding Partners in good standing can choose two additional
                annual renewals at the $299 rate. Renewal is never automatic.
                Each active category and state slot is exclusive. Website and
                specialized marketing placements are priced separately.
              </p>
              <Link
                className="button-primary mt-7 w-full justify-center"
                href="/advertise"
              >
                View the Founding Partner Offer
                <ArrowRight aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
