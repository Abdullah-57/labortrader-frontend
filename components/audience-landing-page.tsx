import { SiteFrame } from './site-frame';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import {
  participantRoleByAudienceType,
  type PublicAudienceType,
} from '@/lib/constants';
import type { SitePath } from '@/lib/site-url';

const audienceBackgrounds = {
  WORKER: 'workers',
  CONTRACTOR: 'contractors',
  BUSINESS: 'businesses',
  HIRING_FIRM: 'hiring',
} as const;

const audiencePathByType: Record<PublicAudienceType, Exclude<SitePath, ''>> = {
  WORKER: '/for-workers',
  CONTRACTOR: '/for-contractors',
  BUSINESS: '/for-businesses',
  HIRING_FIRM: '/for-hiring-firms',
};

type Capability = {
  icon: LucideIcon;
  title: string;
  body: string;
  compactBody?: string;
};

type AudienceLandingPageProps = {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  registrationHref: string;
  registrationLabel: string;
  audienceType: PublicAudienceType;
  capabilities: Capability[];
  registrationDetails: string[];
  afterJoining: string[];
  highlight?: ReactNode;
  secondaryAction?: {
    href: string;
    label: string;
    description: string;
  };
};

export function AudienceLandingPage({
  eyebrow,
  title,
  lede,
  registrationHref,
  registrationLabel,
  audienceType,
  capabilities,
  registrationDetails,
  afterJoining,
  highlight,
  secondaryAction,
}: AudienceLandingPageProps) {
  const participantRole = participantRoleByAudienceType(audienceType);
  if (!participantRole) throw new Error('Unsupported participant role.');
  const launchBenefitCap =
    audienceType === 'BUSINESS' || audienceType === 'HIRING_FIRM'
      ? '$1,000'
      : '$500';
  return (
    <SiteFrame background={audienceBackgrounds[audienceType]}>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          {
            name: participantRole.label,
            path: audiencePathByType[audienceType],
          },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell grid gap-10 lg:grid-cols-[1.35fr_.65fr] lg:items-center">
            <div>
              <p className="section-kicker">{eyebrow}</p>
              <h1 className="page-title mt-5">{title}</h1>
              <p className="page-lede">{lede}</p>
              <Link className="button-primary mt-8" href={registrationHref}>
                {registrationLabel}
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <p className="mt-4 text-xs text-background/65">
                Pre-registration now. Marketplace access at local launch.
              </p>
            </div>
            <aside className="lt-glass-panel p-7 sm:p-8">
              <p className="section-kicker">Your Early Start</p>
              <p className="mt-5 text-4xl font-semibold">
                Up to 90 days
                <span className="mt-2 block text-lg text-background/80">
                  of included platform use
                </span>
              </p>
              <p className="mt-5 text-sm leading-7 text-background/75">
                Starts after verification and approval when your market opens.
                Up to {launchBenefitCap} in platform use; time or cap, whichever
                comes first.
              </p>
              <p className="mt-5 border-t border-background/15 pt-5 text-sm font-bold">
                No monthly membership fee.
              </p>
              <Link
                href="/launch-benefits"
                className="mt-4 inline-block text-xs font-bold underline underline-offset-4"
              >
                Benefits and fees
              </Link>
            </aside>
          </div>
        </section>
        <section className="lt-surface-light bg-lt-panel py-16 text-foreground lg:py-20">
          <div className="site-shell">
            <p className="section-kicker">More Opportunity. More Control.</p>
            <h2 className="section-title mt-4 max-w-3xl">
              Make your next move <span>worth it.</span>
            </h2>
            <div className="mt-9 lt-tile-grid">
              {capabilities.map(
                ({ icon: Icon, title: itemTitle, body, compactBody }) => (
                  <article key={itemTitle} className="lt-raised-panel p-7">
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                    <h3 className="mt-7 text-2xl font-semibold tracking-tight">
                      {itemTitle}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-foreground">
                      {compactBody ? (
                        <>
                          <span className="lt-tile-copy-full">{body}</span>
                          <span className="lt-tile-copy-compact">
                            {compactBody}
                          </span>
                        </>
                      ) : (
                        body
                      )}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>
        <section className="py-16 lg:py-20">
          <div className="site-shell grid gap-10 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="section-kicker">From Opportunity to Completion</p>
              <h2 className="section-title mt-4">
                Agree on the work. <span>Build on the result.</span>
              </h2>
              <p className="mt-5 text-sm leading-7 text-background/70">
                Clear terms and completed-work records make the next hire
                easier.
              </p>
            </div>
            <div className="space-y-3">
              {afterJoining.map((item) => (
                <div key={item} className="lt-glass-panel flex gap-4 p-6">
                  <p className="text-sm font-semibold leading-7">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {(highlight || secondaryAction) && (
          <section className="border-y border-background/15 py-10">
            <div className="site-shell">
              {highlight}
              {secondaryAction && (
                <>
                  <p className="max-w-3xl text-sm leading-7 text-background/75">
                    {secondaryAction.description}
                  </p>
                  <Link
                    className="button-on-dark mt-5"
                    href={secondaryAction.href}
                  >
                    {secondaryAction.label}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </>
              )}
            </div>
          </section>
        )}
        <section className="lt-surface-light bg-lt-panel py-14 text-foreground">
          <div className="site-shell grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="section-kicker">Be Ready When Your Market Opens</p>
              <h2 className="section-title mt-4">
                Get your <span>early start.</span>
              </h2>
              <Link className="button-primary mt-7" href={registrationHref}>
                {registrationLabel}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
            <details className="path-accordion">
              <summary>What you need to register</summary>
              <ul className="space-y-3 px-6 pb-6">
                {registrationDetails.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6">
                    <CheckCircle2
                      className="mt-1 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
