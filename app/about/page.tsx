import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Building2, HardHat, UsersRound } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { COMPANY_PROFILE, founderStructuredData } from '@/lib/company-profile';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'About LaborTrader and Founder Ben Randall',
  description:
    'Meet LaborTrader founder and CEO Ben Randall and learn why 20 years in HVAC led him to build a marketplace that keeps skilled labor moving.',
  path: '/about',
});

const publicSiteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://labortraders.com',
);

const founderJsonLd = founderStructuredData(publicSiteUrl.origin);

const founderExperience = [
  ['20 years', 'Working in HVAC'],
  ['6 years', 'HVAC contractor and business owner'],
  ['Two-time founder', 'Building from firsthand operating experience'],
] as const;

const marketplaceOutcomes = [
  {
    icon: HardHat,
    title: 'Keep People Working',
    compactBody:
      'Build a work record and find opportunities beyond your personal contacts.',
    body: 'Workers and independent contractors can build a documented record and find opportunities beyond personal contacts and social posts.',
  },
  {
    icon: Building2,
    title: 'Take on More',
    compactBody:
      'Fill open crew time and find the help to handle bigger projects.',
    body: 'Service businesses can put open capacity to work, find help for larger projects, and pursue jobs they would otherwise have to pass up.',
  },
  {
    icon: UsersRound,
    title: 'Choose With Confidence',
    compactBody:
      'Clients can compare qualified options using clearly sourced records.',
    body: 'Property managers, general contractors, warranty providers, and other clients can compare qualified options using clearly sourced records.',
  },
] as const;

export default function AboutPage() {
  return (
    <SiteFrame background="landing">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'About LaborTrader', path: '/about' },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(founderJsonLd).replaceAll('<', '\\u003c'),
        }}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">About LaborTrader</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Built to Keep Skilled Labor <span>Moving.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              LaborTrader connects skilled people and open business capacity
              with the demand that keeps them working.
            </p>
          </div>
        </section>

        <section
          id="founder"
          className="lt-surface-light scroll-mt-28 bg-lt-panel py-14 text-foreground lg:py-20"
        >
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.74fr_1fr] lg:items-center lg:gap-16">
            <div className="min-w-0 border border-foreground/14 bg-lt-panel p-3 sm:p-4">
              <Image
                src={COMPANY_PROFILE.founder.imagePath}
                alt="Ben Randall, Founder and CEO of LaborTrader Inc."
                className="h-auto w-full"
                width={1000}
                height={986}
                sizes="(min-width: 1024px) 38vw, 92vw"
              />
              <div className="border-t border-foreground/12 px-2 pb-2 pt-4">
                <p className="text-xl font-semibold tracking-[-0.035em]">
                  {COMPANY_PROFILE.founder.name}
                </p>
                <p className="mt-1 text-sm font-bold text-foreground">
                  {COMPANY_PROFILE.founder.jobTitle},{' '}
                  {COMPANY_PROFILE.legalName}
                </p>
              </div>
            </div>

            <div className="min-w-0">
              <p className="section-kicker">Built From Experience</p>
              <h2 className="section-title mt-5">
                The Labor Was There. <span>The Connection Was Not.</span>
              </h2>
              <div className="text-on-light-muted mt-6 space-y-5 text-lg leading-8">
                <p>
                  Ben Randall brings 20 years of HVAC experience, including six
                  years as an HVAC contractor and business owner. A two-time
                  founder, his background spans building engineer and oilfield
                  engineering technician roles, plus real-estate investing.
                </p>
                <p>
                  He saw the same costly disconnect: qualified people sitting
                  idle while nearby businesses struggled to find help. Smaller
                  companies relied on social posts, personal contacts, and
                  costly staffing while larger firms captured more opportunity.
                </p>
                <p className="text-xl font-semibold tracking-[-0.025em] text-foreground">
                  LaborTrader was created to give the people and businesses that
                  build America a better way to find each other and compete.
                </p>
              </div>

              <dl className="mt-8 lt-tile-grid lt-status-grid">
                {founderExperience.map(([value, label]) => (
                  <div key={value} className="bg-lt-panel p-5">
                    <dd className="text-xl font-semibold tracking-[-0.035em]">
                      {value}
                    </dd>
                    <dt className="mt-2 text-xs font-bold leading-5 text-foreground">
                      {label}
                    </dt>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="border-y border-background/10 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Why LaborTrader Exists</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Opportunity Should Not Depend on <span>Who You Know.</span>
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-background/76">
              Smaller businesses should be able to staff larger jobs. Crews with
              open schedules should be able to help companies facing a backlog.
              LaborTrader brings those opportunities together.
            </p>

            <div className="mt-10 lt-tile-grid">
              {marketplaceOutcomes.map(
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

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.58fr_1fr] lg:items-start">
            <div className="min-w-0">
              <p className="section-kicker">Credibility Has a Source</p>
              <h2 className="section-title mt-5">
                Claims Are Labeled. <span>Work Becomes the Record.</span>
              </h2>
            </div>
            <div className="text-on-light-muted min-w-0 text-lg leading-8">
              <p>
                Self-reported details, reviewed credentials, and completed-work
                records are clearly labeled. Ratings and work history are
                earned, never bought.
              </p>
              <Link
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.09em] text-foreground underline decoration-primary decoration-2 underline-offset-4"
                href="/trust-safety"
              >
                See the LaborTrader trust model
                <ArrowUpRight
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-lt-panel py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <p className="section-kicker">The Skilled Labor Marketplace</p>
              <h2 className="section-title mt-5 max-w-4xl">
                Help Put Your Market in <span>Motion.</span>
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-background/74">
                Pre-register your role, specialty, and market. Help build the
                local connections that keep skilled labor moving.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link className="button-primary" href="/early-access">
                Choose Your Account <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="/how-it-works">
                See How It Works <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
