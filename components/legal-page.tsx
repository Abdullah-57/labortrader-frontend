import { SiteFrame } from './site-frame';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { COMPANY_PROFILE } from '@/lib/company-profile';
import type { SitePath } from '@/lib/site-url';
import { BreadcrumbJsonLd } from './breadcrumb-json-ld';
import { LegalHashOpener } from './legal-hash-opener';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function LegalPage({
  title,
  path,
  updated,
  intro,
  sections,
  contactEmail,
}: {
  title: string;
  path: Exclude<SitePath, ''>;
  updated: string;
  intro: string;
  sections: Array<[string, ReactNode]>;
  contactEmail: string;
}) {
  return (
    <SiteFrame reading>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: title, path },
        ]}
      />
      <LegalHashOpener />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Legal / {title}</p>
            <h1 className="page-title mt-5">{title}</h1>
            <p className="mt-5 text-[13px] font-bold text-background/80">
              Effective {updated}
            </p>
          </div>
        </section>
        <section className="py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[minmax(13rem,.32fr)_minmax(0,1fr)] xl:gap-16">
            <aside className="h-fit min-w-0 border-l-2 border-primary bg-card p-5 text-sm leading-7 text-muted-foreground lg:sticky lg:top-28">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                Policy Contact
              </p>
              <p className="mt-3">
                Questions may be sent to{' '}
                <a
                  className="font-semibold text-primary underline underline-offset-4"
                  href={'mailto:' + contactEmail}
                >
                  {contactEmail}
                </a>
                .
              </p>
              <div className="mt-5 border-t border-foreground/12 pt-5">
                <p className="font-semibold text-foreground">
                  {COMPANY_PROFILE.legalName}
                </p>
                <address className="mt-2 not-italic text-xs leading-6">
                  <span className="font-semibold">Mailing address:</span>
                  <br />
                  {COMPANY_PROFILE.mailingAddress.streetAddress}
                  <br />
                  {COMPANY_PROFILE.mailingAddress.addressLocality},{' '}
                  {COMPANY_PROFILE.mailingAddress.addressRegion}{' '}
                  {COMPANY_PROFILE.mailingAddress.postalCode}
                </address>
              </div>
            </aside>
            <article className="min-w-0 w-full max-w-4xl">
              <p className="max-w-[74ch] text-xl leading-9 text-foreground/80">
                {intro}
              </p>
              <div className="mt-10 border-b border-foreground/12">
                {sections.map(([heading, body]) => (
                  <details
                    key={heading}
                    id={sectionId(heading)}
                    className="group min-w-0 border-t border-foreground/12"
                  >
                    <summary className="grid min-h-14 cursor-pointer list-none lt-accordion-title items-center gap-3 px-2 py-5 transition-colors hover:bg-foreground/[0.025] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring sm:py-6">
                      <h2 className="min-w-0 text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
                        {heading}
                      </h2>
                      <ChevronDown
                        className="size-5 shrink-0 transition-transform group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    {typeof body === 'string' ? (
                      <p className="max-w-[78ch] px-2 pb-8 text-base leading-8 text-foreground/76  sm:pr-4">
                        {body}
                      </p>
                    ) : (
                      <div className="max-w-[78ch] px-2 pb-8 text-base leading-8 text-foreground/76  sm:pr-4">
                        {body}
                      </div>
                    )}
                  </details>
                ))}
              </div>
            </article>
          </div>
        </section>
        <section className="lt-surface-dark border-t border-primary/45 bg-lt-panel py-12 text-background lg:py-16">
          <div className="site-shell flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="section-kicker">Join Your Market</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
                Pre-registration Is Open.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-background/82">
                Join your local launch list and explore the early-registration
                benefits.
              </p>
            </div>
            <Link className="button-primary" href="/early-access">
              Choose Your Account <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
