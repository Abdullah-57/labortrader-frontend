import { SiteFrame } from './site-frame';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  ChevronDown,
  UsersRound,
} from 'lucide-react';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { BreadcrumbJsonLd } from './breadcrumb-json-ld';
import { IndustrySignupCounts } from './industry-signup-counts';
import {
  tradeRegistrationHref,
  type SpecializedPageConfig,
} from '@/lib/specialized-pages';
import type { SitePath } from '@/lib/site-url';

export function SpecializedTradePage({
  config,
  tradeName,
  path,
}: {
  config: SpecializedPageConfig;
  tradeName: string;
  path: Exclude<SitePath, ''>;
}) {
  return (
    <SiteFrame background={config.scope === 'all' ? 'landing' : config.scope}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: tradeName, path },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell grid gap-10 lg:grid-cols-[1.25fr_.75fr] lg:items-center">
            <div>
              <p className="section-kicker">{tradeName}</p>
              <h1 className="page-title mt-5">
                {config.title} <span>{config.titleAccent}</span>
              </h1>
              <p className="page-lede">{config.lede}</p>
              <Link className="button-primary mt-8" href="#ways-to-join">
                Choose Your Path
                <ArrowRight aria-hidden="true" />
              </Link>
              <p className="mt-4 text-xs text-background/65">
                Pre-register now for access when your local market opens.
              </p>
            </div>
            <aside className="lt-glass-panel p-7 sm:p-8">
              <p className="section-kicker">More Ways to Get It Done</p>
              <h2 className="mt-5 text-3xl font-semibold leading-tight">
                Skilled help.
                <br />
                Starting at one full day.
              </h2>
              <p className="mt-5 text-sm leading-7 text-background/75">
                Choose W-2 staffing through SkillCraft Staffing, independent
                contractors, or service businesses.
              </p>
              <Link
                href="/faq"
                className="mt-6 inline-block text-xs font-bold underline underline-offset-4"
              >
                How engagements work
              </Link>
            </aside>
          </div>
        </section>
        <IndustrySignupCounts
          scope={config.scope}
          label={`${tradeName} signups`}
          href="#ways-to-join"
        />
        <section className="trade-light-section py-16 lg:py-20">
          <div className="site-shell">
            <p className="section-kicker">Built for {config.shortName}</p>
            <h2 className="section-title mt-4 max-w-3xl">
              Grow around the work. <span>Control the overhead.</span>
            </h2>
            <div className="mt-9 lt-tile-grid">
              {config.advantages.map((item, index) => {
                const Icon = [UsersRound, ClipboardCheck, BadgeCheck][index];
                return (
                  <article key={item.title} className="lt-raised-panel p-7">
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-7 text-2xl font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-foreground/75">
                      {item.compactBody ? (
                        <>
                          <span className="lt-tile-copy-full">{item.body}</span>
                          <span className="lt-tile-copy-compact">
                            {item.compactBody}
                          </span>
                        </>
                      ) : (
                        item.body
                      )}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id="ways-to-join"
          className="scroll-mt-28 border-y border-foreground/10 bg-lt-panel py-16 lg:py-20"
        >
          <div className="site-shell grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="section-kicker">Choose Your Path</p>
              <h2 className="section-title mt-4">
                How will you <span>use LaborTrader?</span>
              </h2>
              <p className="mt-5 text-sm leading-7 text-foreground/75">
                Choose your role. Agree on scope, rates, and timing before the
                job starts.
              </p>
              <p className="mt-5 text-sm leading-7 text-foreground/75">
                Build your record through reviewed credentials, completed
                engagements, and confirmed payments.
              </p>
            </div>
            <div className="lt-path-grid">
              {config.paths.map((item) => (
                <details key={item.role} className="path-accordion">
                  <summary aria-label={item.title}>
                    <strong>
                      {
                        {
                          worker: 'Workers',
                          'independent-contractor': 'Contractors',
                          'service-business': 'Businesses',
                          'hiring-organization': 'Hiring Teams',
                        }[item.role]
                      }
                    </strong>
                    <span>
                      Explore path <ChevronDown aria-hidden="true" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-sm leading-7 text-foreground/75">
                      {item.body}
                    </p>
                    <Link
                      className="button-dark mt-5"
                      href={tradeRegistrationHref(config, item.role)}
                    >
                      Pre-register
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </details>
              ))}
              <Link
                className="lt-path-client"
                href={`/for-clients?source=${config.source}#client-preregistration`}
              >
                <span>Clients & Project Owners</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
        <section className="lt-surface-dark bg-lt-panel py-14 text-background">
          <div className="site-shell grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="section-kicker">MarketScan</p>
              <h2 className="section-title mt-4 max-w-3xl">
                Find the opportunity. <span>Plan the labor.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-background/75">
                Find projects, compare member rates, and line up the people your
                bid needs.
              </p>
            </div>
            <Link className="button-on-dark" href="/market-scan">
              Explore MarketScan
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
