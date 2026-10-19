import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowLeftRight,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  Handshake,
  SearchCheck,
  UserRound,
  UserRoundCheck,
  Waypoints,
} from 'lucide-react';
import { DetailsJumpLink } from '@/components/details-jump-link';
import { HowItWorksProfilePreview } from '@/components/how-it-works-profile-preview';
import profileStyles from '@/components/how-it-works-profile-preview.module.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'How LaborTrader Works',
  description:
    'See how LaborTrader will connect skilled-trade profiles, verified credentials, availability, defined work, visible terms, and documented engagement history.',
  path: '/how-it-works',
});

const launchSteps = [
  {
    icon: Waypoints,
    number: '01',
    title: 'Choose Your Role',
    body: 'Work, contract, run a business, or hire. Choose the profile that fits.',
    targetId: 'flow-profile',
    action: 'See How Profiles Work',
  },
  {
    icon: ArrowLeftRight,
    number: '02',
    title: 'Tell Us What You Do',
    body: 'Add your specialty, location, and availability so your profile is ready for local launch.',
    targetId: 'flow-profile',
    action: 'Explore the Profile',
  },
  {
    icon: BadgeCheck,
    number: '03',
    title: 'Verify and Get Ready',
    body: 'Confirm your contact information and submit any claimed license, certification, or endorsement for manual review.',
    targetId: 'flow-verify',
    action: 'See What Gets Reviewed',
  },
] as const;

const marketplaceFlow = [
  {
    id: 'flow-profile',
    icon: UserRoundCheck,
    number: '01',
    title: 'Build a Useful Profile',
    summary: 'Put the facts that determine fit in one place.',
    body: 'Share your specialty, service area, experience, availability, and rate or budget.',
  },
  {
    id: 'flow-verify',
    icon: BadgeCheck,
    number: '02',
    title: 'Verify What Matters',
    summary: 'Know what was reviewed and what was self-reported.',
    body: 'Contact checks and self-reported details stay separate from professional credentials. Licenses, certifications, and endorsements are marked verified only after review.',
  },
  {
    id: 'flow-post',
    icon: ClipboardList,
    number: '03',
    title: 'Post Work or Availability',
    summary: 'Publish a real opportunity, not a vague status update.',
    body: 'Post a project, available crew, or service with clear scope, location, timing, requirements, and pricing.',
  },
  {
    id: 'flow-compare',
    icon: SearchCheck,
    number: '04',
    title: 'Compare Before You Commit',
    summary: 'See the fit and the terms before anyone says yes.',
    body: 'Compare credentials, work history, availability, service area, and price. Contact details stay private until a marketplace connection is accepted.',
  },
  {
    id: 'flow-engage',
    icon: Handshake,
    number: '05',
    title: 'Engage the Right Way',
    summary: 'Use the structure that fits the participant and the work.',
    body: 'Short-term W-2 assignments are provided through SkillCraft Staffing, starting at one full day. Independent Contractors and Service Businesses use the applicable business engagement path.',
  },
  {
    id: 'flow-back-office',
    icon: ClipboardCheck,
    number: '06',
    title: 'Back Office, Already Organized',
    summary:
      'Move from an accepted match to ready-to-work without an admin scramble.',
    body: 'Keep onboarding, tax forms, agreements, credentials, and insurance in one place. See what is complete and what is still needed before the job starts.',
  },
  {
    id: 'flow-complete',
    icon: FileCheck2,
    number: '07',
    title: 'Complete, Rate, and Rehire',
    summary: 'Finish with a record that improves the next decision.',
    body: 'Keep terms, documents, ratings, and completion records together. Use Hire Again to return to proven people, with fees shown before acceptance.',
  },
] as const;

const participantAdvantages = [
  {
    icon: UserRound,
    role: 'Worker',
    headline: 'Build your work history.',
    body: 'Set your trade, schedule, travel area, and preferred wage. Find short-term W-2 assignments and build your ratings and documented work history.',
    href: '/early-access?role=worker#detailed-registration',
    cta: 'Pre-register as a Worker',
    profileRole: 'worker',
  },
  {
    icon: BriefcaseBusiness,
    role: 'Independent Contractor',
    headline: 'Put your credentials to work.',
    body: 'Show your credentials, rates, availability, and work history. Find projects, submit quotes, and build a record that helps win the next job.',
    href: '/early-access?role=independent-contractor#detailed-registration',
    cta: 'Pre-register as an Independent Contractor',
    profileRole: 'independent-contractor',
  },
  {
    icon: Building2,
    role: 'Service Business',
    headline: 'Keep your crews moving.',
    body: 'Hire when you are busy. Offer open crews when schedules loosen. Use one business profile to keep both sides moving.',
    href: '/early-access?role=service-business#detailed-registration',
    cta: 'Pre-register a Service Business',
    profileRole: 'service-business',
  },
  {
    icon: SearchCheck,
    role: 'Hiring Organization',
    headline: 'Build a proven team.',
    body: 'Set your hiring requirements and compare qualified workers, contractors, and service businesses. For a defined project, use the Client & Project Owner path.',
    href: '/early-access?role=hiring-organization#detailed-registration',
    cta: 'Pre-register a Hiring Organization',
    profileRole: 'hiring-organization',
  },
] as const;

const differences = [
  {
    label: 'Discovery',
    informal: 'Whoever happens to see the post or answer the call.',
    laborTrader:
      'Relevant local supply and demand organized by trade, location, timing, credentials, and price.',
  },
  {
    label: 'Proof',
    informal: 'Claims scattered across calls, messages, and screenshots.',
    laborTrader:
      'Self-reported details stay labeled. Reviewed credentials are clearly marked.',
  },
  {
    label: 'Terms',
    informal:
      'Scope, price, and responsibility emerge as the conversation goes.',
    laborTrader:
      'Scope, schedule, location, price, and engagement structure are clear before acceptance.',
  },
  {
    label: 'Administration',
    informal:
      'Texts, spreadsheets, and loose paperwork live in different places.',
    laborTrader:
      'Engagement terms, onboarding packet, insurance review, tax records, approvals, ratings, and closeout stay organized together.',
  },
  {
    label: 'The Next Job',
    informal: 'Start the search and the trust check over again.',
    laborTrader:
      'Carry forward completed-work history, reuse a proven relationship, and Hire Again.',
  },
] as const;

export default function HowItWorksPage() {
  return (
    <SiteFrame background="landing">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'How It Works', path: '/how-it-works' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">How LaborTrader Works</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Skilled Labor, With the <span>Facts Up Front.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              Find people by specialty, credentials, availability, and rate.
              Agree on terms, track hours and payments, and rehire proven
              people. Pre-register for local launch.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link className="button-primary" href="/early-access">
                Pre-register for Your Market
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <Link className="button-on-dark" href="#marketplace-flow">
                See the Marketplace Flow
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Before Your Market Opens</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Three Steps. <span>Ready for Launch.</span>
            </h2>
            <div className="mt-9 lt-tile-grid">
              {launchSteps.map(
                ({ icon: Icon, number, title, body, targetId, action }) => (
                  <DetailsJumpLink
                    key={number}
                    className="group min-w-0 bg-lt-panel p-6 transition-[transform,background-color,box-shadow] duration-200 hover:relative hover:-translate-y-1 hover:bg-lt-panel hover:shadow-[0_18px_38px_rgb(32_34_30_/_0.12)] focus-visible:relative focus-visible:z-10 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#1b75d0] motion-reduce:transform-none motion-reduce:transition-none lg:p-7"
                    targetId={targetId}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-primary">
                        {number}
                      </span>
                      <Icon
                        className="size-6 text-foreground transition-[color,transform] duration-200 group-hover:-rotate-3 group-hover:text-primary motion-reduce:transform-none motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold tracking-[-0.045em]">
                      {title}
                    </h3>
                    <p className="mt-4 text-base leading-7 text-foreground">
                      {body}
                    </p>
                    <span className="mt-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-foreground underline decoration-primary decoration-2 underline-offset-4">
                      {action}
                      <ChevronDown
                        className="size-4 text-primary transition-transform duration-200 group-hover:translate-y-1 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </span>
                  </DetailsJumpLink>
                ),
              )}
            </div>
            <div className="mt-7 flex flex-col gap-4 border-l-4 border-primary bg-lt-panel p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-4xl text-sm font-bold leading-6 text-foreground">
                No monthly membership fee. Pre-register to reserve your launch
                benefit.
              </p>
              <Link
                className="group inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-foreground underline decoration-primary decoration-2 underline-offset-4"
                href="/launch-benefits"
              >
                See Pre-registration Benefits
                <ArrowUpRight
                  className="size-4 text-primary transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="marketplace-flow"
          className="lt-surface-dark scroll-mt-28 bg-lt-panel py-14 lg:py-20"
        >
          <div className="site-shell min-w-0">
            <div className="min-w-0">
              <p className="section-kicker">Inside the Marketplace</p>
              <h2 className="section-title mt-5 max-w-6xl [overflow-wrap:normal]">
                Find the Fit. Get to Work.{' '}
                <span className="sm:whitespace-nowrap">Keep the Record.</span>
              </h2>
              <p className="mt-6 max-w-4xl text-base leading-7 text-background/72">
                From the first match to the next hire, keep the details
                together.
              </p>
            </div>

            <div className="mt-10 min-w-0 border-y border-background/15">
              {marketplaceFlow.map(
                ({ id, icon: Icon, number, title, summary, body }, index) => (
                  <details
                    key={number}
                    id={id}
                    className={`group lt-surface-dark scroll-mt-28 border-b border-background/15 bg-lt-panel transition-colors duration-200 last:border-b-0 hover:bg-lt-panel open:bg-lt-panel motion-reduce:transition-none ${profileStyles.flowCard}`}
                    open={index === 0}
                  >
                    <summary className="flex min-h-24 cursor-pointer list-none items-center gap-4 p-5 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#4ea1ff] [&::-webkit-details-marker]:hidden sm:gap-5 sm:p-6">
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-primary">
                        {number}
                      </span>
                      <Icon
                        className="size-5 shrink-0 text-background/58"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                          {title}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-background/66">
                          {summary}
                        </span>
                      </span>
                      <ChevronDown
                        className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="border-t border-background/12 px-5 py-5 sm:ml-[6.9rem] sm:px-6 sm:py-6">
                      <p className="max-w-3xl text-base leading-7 text-background/78">
                        {body}
                      </p>
                    </div>
                  </details>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">What LaborTrader Changes</p>
            <h2 className="section-title mt-5 max-w-5xl">
              Every Role Gets a <span>Real Advantage.</span>
            </h2>
            <p className="mt-5 max-w-4xl text-base font-bold leading-7 text-foreground">
              Explore each profile. Completed engagements build the ratings,
              hours, and repeat-hire history behind it.
            </p>

            <div className={profileStyles.roleGrid}>
              {participantAdvantages.map(
                ({
                  icon: Icon,
                  role,
                  headline,
                  body,
                  href,
                  cta,
                  profileRole,
                }) => (
                  <details
                    key={role}
                    className={`group min-w-0 self-start border border-foreground/14 border-t-4 border-t-transparent bg-lt-panel transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-t-primary hover:shadow-[0_16px_34px_rgb(32_34_30_/_0.1)] open:col-span-full open:border-t-primary open:bg-lt-panel motion-reduce:transform-none motion-reduce:transition-none ${profileStyles.roleCard}`}
                  >
                    <summary className={profileStyles.roleSummary}>
                      <Icon
                        className={profileStyles.roleIcon}
                        aria-hidden="true"
                      />
                      <span className={profileStyles.roleLabel}>{role}</span>
                      <span className={profileStyles.roleHeadline}>
                        {headline}
                      </span>
                      <span className={profileStyles.roleAction}>
                        View profile <ChevronDown aria-hidden="true" />
                      </span>
                    </summary>
                    <div className={profileStyles.roleBody}>
                      <p className="max-w-2xl text-base leading-7 text-foreground">
                        {body}
                      </p>
                      <HowItWorksProfilePreview role={profileRole} />
                      <Link
                        className="group/link mt-7 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-foreground underline decoration-primary decoration-2 underline-offset-4"
                        href={href}
                      >
                        {cta}
                        <ArrowUpRight
                          className="size-4 text-primary transition-transform duration-200 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </details>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Why LaborTrader</p>
            <h2 className="section-title mt-5 max-w-5xl">
              A Social Post Is Not a <span>Work Record.</span>
            </h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-7 text-foreground">
              A referral can start a conversation. LaborTrader adds the facts,
              structure, and accountability needed to turn that conversation
              into completed work.
            </p>

            <div className="mt-10 min-w-0 border-y border-foreground/18">
              <div className="lt-surface-dark hidden min-w-0 grid-cols-[minmax(8rem,.38fr)_minmax(0,.81fr)_minmax(0,1fr)] gap-5 border-b border-foreground/18 bg-lt-panel px-5 py-4 text-background md:grid">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-background/55">
                  What Matters
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-background/55">
                  Random Post or Referral
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  LaborTrader
                </span>
              </div>
              {differences.map(({ label, informal, laborTrader }) => (
                <div
                  key={label}
                  className="grid min-w-0 gap-5 border-b border-foreground/18 bg-lt-panel p-5 last:border-b-0 md:grid-cols-[minmax(8rem,.38fr)_minmax(0,.81fr)_minmax(0,1fr)] md:px-5 md:py-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                    {label}
                  </p>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground md:hidden">
                      Random Post or Referral
                    </p>
                    <p className="text-sm leading-6 text-foreground">
                      {informal}
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-4">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary md:hidden">
                      LaborTrader
                    </p>
                    <p className="text-sm font-bold leading-6 text-foreground">
                      {laborTrader}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lt-surface-dark border-y border-primary/45 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="min-w-0">
              <p className="section-kicker">Pre-registration Is Open</p>
              <h2 className="section-title mt-5 max-w-4xl">
                Be Ready for <span>Your Next Opportunity.</span>
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-background/72">
                Join now, verify your email, and be ready when your market
                opens.
              </p>
            </div>
            <Link className="button-primary min-w-56" href="/early-access">
              Pre-register for Your Market
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
          <div className="site-shell mt-10 border-t border-background/14 pt-6">
            <p className="max-w-6xl text-xs leading-5 text-background/58">
              Review requirements and fees before accepting an engagement.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
