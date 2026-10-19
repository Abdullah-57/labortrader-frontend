import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeCheck,
  ClipboardCheck,
  EyeOff,
  ListChecks,
} from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Skilled Labor Marketplace Trust & Safety',
  description:
    'Learn how LaborTrader labels self-reported details, reviews credentials, protects contact information, and records completed marketplace work.',
  path: '/trust-safety',
});

const safeguards = [
  {
    icon: ClipboardCheck,
    label: 'Participant-provided',
    title: 'Reported Details',
    compactBody:
      'Skills, history, rates, and availability are provided by members and labeled as such.',
    body: 'Skills, experience, work history, availability, rates, tools, and service areas begin as participant-provided information and remain clearly labeled.',
  },
  {
    icon: BadgeCheck,
    label: 'Reviewed by LaborTrader',
    title: 'Credential Review',
    compactBody:
      'Credentials and onboarding documents are manually reviewed before they receive a verified status.',
    body: 'Licenses, certifications, insurance, endorsements, and onboarding documents are reviewed by a person before LaborTrader applies a verified status.',
  },
  {
    icon: ListChecks,
    label: 'Recorded through the marketplace',
    title: 'Work Record',
    compactBody:
      'Completed LaborTrader engagements build ratings, hours, and repeat-hire history.',
    body: 'Completed engagements, ratings, hours, repeat hires, and other marketplace activity build the record after work is completed through LaborTrader.',
  },
  {
    icon: EyeOff,
    label: 'Protected account information',
    title: 'Contact Checks',
    compactBody:
      'Email and phone checks confirm contact ownership. They do not verify skills, credentials, or work history.',
    body: 'Email and phone checks confirm control of contact information. They do not verify a skill, credential, license, or work-history claim.',
  },
] as const;

export default function TrustSafetyPage() {
  return (
    <SiteFrame background="landing" reading>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Trust & Safety', path: '/trust-safety' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Trust and Safety</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Clear Records. <span>No Guesswork.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              LaborTrader separates participant-provided details, manually
              reviewed credentials, and performance recorded through completed
              marketplace work.
            </p>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Trust Framework</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Know What Is Verified and <span>What Is Not.</span>
            </h2>
            <div className="mt-9 lt-tile-grid">
              {safeguards.map(
                ({ icon: Icon, label, title, body, compactBody }) => (
                  <article
                    key={title}
                    className="min-w-0 bg-lt-panel p-6 sm:p-7"
                  >
                    <Icon className="size-6 text-primary" aria-hidden="true" />
                    <p className="lt-tile-copy-full mt-7 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                      {label}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                      {title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-foreground">
                      <span className="lt-tile-copy-full">{body}</span>
                      <span className="lt-tile-copy-compact">
                        {compactBody}
                      </span>
                    </p>
                  </article>
                ),
              )}
            </div>
            <div className="mt-8 border-l-2 border-primary bg-lt-panel p-6">
              <h3 className="text-lg font-semibold tracking-[-0.025em]">
                Additional screening is a separate service.
              </h3>
              <p className="mt-3 max-w-5xl text-sm font-semibold leading-6 text-foreground">
                Background checks and drug tests are separate from credential
                review. Where offered, they require consent, show pricing
                upfront, and are marked complete only after screening.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-lt-panel py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div className="min-w-0">
              <p className="section-kicker">Shared Responsibility</p>
              <h2 className="section-title mt-5">
                Better Information. Better <span>Decisions.</span>
              </h2>
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold leading-8">
                Choose with documented credentials and completed-work records
                behind the decision.
              </p>
              <p className="mt-5 text-base leading-7 text-background/72">
                Participants and applicable employers remain responsible for
                licensing, safety, supervision, insurance, taxes, wages,
                employment, and contracts. LaborTrader verification adds useful
                information without replacing professional judgment or legal
                responsibility.
              </p>
              <p className="mt-5 text-base leading-7 text-background/72">
                Contact details stay private until an appropriate marketplace
                connection. Credential and onboarding records are shared only
                for review or an eligible engagement.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-lt-panel py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="min-w-0">
              <p className="section-kicker">Bring Your Real Credentials</p>
              <h2 className="section-title mt-5 max-w-4xl">
                Put Your Record to <span>Work.</span>
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-background/72">
                Add your role, specialty, market, and credential details now so
                your account is ready for review before your market opens.
              </p>
            </div>
            <Link className="button-primary" href="/early-access">
              Pre-register for Launch <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
