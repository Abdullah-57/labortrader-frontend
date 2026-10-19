import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import {
  ArrowDown,
  BadgeCheck,
  Building2,
  FileCheck2,
  Hammer,
  Home,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { ClientPreregistrationForm } from '@/components/client-preregistration-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Find Local Skilled Trade Professionals',
  description:
    'Pre-register as a homeowner, property team, builder, or project owner to compare skilled trade providers, verified qualifications, and completed work.',
  path: '/for-clients',
});

const clientTypes = [
  {
    icon: Home,
    title: 'Home Owners',
    body: 'Repairs, replacements, improvements, and skilled projects at home.',
  },
  {
    icon: Building2,
    title: 'Property Teams',
    body: 'Ongoing maintenance, turns, upgrades, and multi-site work.',
  },
  {
    icon: Hammer,
    title: 'Builders & Owners',
    body: 'Qualified capacity for a defined scope, schedule, and budget.',
  },
  {
    icon: Wrench,
    title: 'Service Programs',
    body: 'Local skilled providers backed by a documented work record.',
  },
] as const;

const proofPoints = [
  {
    icon: BadgeCheck,
    title: 'Know Who Is Qualified',
    body: 'Review applicable licenses, endorsements, insurance, skills, and service area before you commit.',
  },
  {
    icon: ShieldCheck,
    title: 'See Proven Work',
    body: 'Completed jobs, client ratings, and repeat hires build the record. Providers cannot buy a better one.',
  },
  {
    icon: FileCheck2,
    title: 'Know the Price Before You Commit',
    body: 'Agree on scope, rates, and responsibilities upfront. Keep project documents, completion records, and confirmed payments together.',
  },
] as const;

export default function ForClientsPage() {
  return (
    <SiteFrame background="clients">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Clients & Project Owners', path: '/for-clients' },
        ]}
      />
      <SiteHeader
        ctaHref="#client-preregistration"
        ctaLabel="Pre-register as a Client"
      />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero overflow-hidden">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
            <div className="min-w-0">
              <p className="section-kicker">For Clients and Project Owners</p>
              <h1 className="page-title mt-6 max-w-5xl">
                Hire Skilled Work With <span>Proof Behind It.</span>
              </h1>
              <p className="page-lede max-w-3xl">
                Compare skilled providers by reviewed credentials and
                completed-work ratings. Agree on scope and price before the
                project starts. Pre-register for access at local launch.
              </p>
              <div className="mt-9">
                <Link className="button-primary" href="#client-preregistration">
                  Pre-register for Client Access{' '}
                  <ArrowDown aria-hidden="true" />
                </Link>
              </div>
            </div>

            <aside className="min-w-0 border border-background/18 bg-background/[0.055] p-6 shadow-[0_24px_70px_rgba(0,0,0,.24)] backdrop-blur-sm sm:p-8">
              <p className="section-kicker">Proof Over Promotion</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                The work builds the reputation.
              </h2>
              <p className="text-on-dark-muted mt-5 text-sm leading-7 sm:text-base">
                See the qualifications and completed-work record behind each
                provider before you choose.
              </p>
              <dl className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                  ['Credentials', 'Reviewed'],
                  ['Work record', 'Earned'],
                  ['Monthly fee', '$0'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border border-background/12 bg-lt-panel p-4"
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-background/65">
                      {label}
                    </dt>
                    <dd className="mt-2 text-xl font-semibold text-primary">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">
              Built for Anyone Hiring Skilled Work
            </p>
            <div className="mt-5 grid min-w-0 gap-6 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <h2 className="section-title max-w-3xl">
                A Client Is Anyone With <span>Work to Get Done.</span>
              </h2>
              <p className="text-on-light-muted max-w-2xl text-base leading-8 lg:justify-self-end">
                From one repair to recurring projects, find the right provider
                for the job.
              </p>
            </div>
            <div className="mt-9 lt-tile-grid">
              {clientTypes.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="min-w-0 border border-foreground/12 bg-lt-panel p-6 shadow-[0_18px_45px_rgba(32,34,30,.08)]"
                >
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.035em]">
                    {title}
                  </h3>
                  <p className="text-on-light-muted mt-3 text-sm leading-6">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-background/10 bg-lt-panel py-14 lg:py-20">
          <div className="site-shell min-w-0">
            <p className="section-kicker">A Better Way to Choose</p>
            <h2 className="section-title mt-5 max-w-4xl">
              Less Searching. More <span>Useful Proof.</span>
            </h2>
            <div className="mt-9 lt-tile-grid">
              {proofPoints.map(({ icon: Icon, title, body }) => (
                <article
                  key={title}
                  className="min-w-0 border border-background/14 bg-background/[0.05] p-6 shadow-[0_22px_55px_rgba(0,0,0,.18)] backdrop-blur-sm sm:p-8"
                >
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-7 text-2xl font-semibold tracking-[-0.04em]">
                    {title}
                  </h3>
                  <p className="text-on-dark-muted mt-4 text-sm leading-7">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <div className="min-w-0">
              <p className="section-kicker">From Need to Done</p>
              <h2 className="section-title mt-5">
                One Clear <span>Path.</span>
              </h2>
            </div>
            <ol className="min-w-0 border-t border-foreground/16">
              {[
                [
                  'Post the work',
                  'Share the trade, location, timing, scope, and budget.',
                ],
                [
                  'Compare qualified options',
                  'Review relevant credentials, completed work, ratings, and price.',
                ],
                [
                  'Hire and keep the record',
                  'Keep required documents, the engagement, and closeout tied to the project.',
                ],
              ].map(([title, body]) => (
                <li
                  key={title}
                  className="grid min-w-0 grid-cols-1 gap-4 border-b border-foreground/16 py-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">
                      {title}
                    </h3>
                    <p className="text-on-light-muted mt-2 text-sm leading-7">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="client-preregistration"
          aria-labelledby="client-preregistration-title"
          className="scroll-mt-24 border-t border-background/10 bg-lt-panel py-14 lg:py-20"
        >
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.62fr_1fr] lg:items-start">
            <div className="min-w-0">
              <p className="section-kicker">Client Preregistration</p>
              <h2
                id="client-preregistration-title"
                className="section-title mt-5"
              >
                Bring the Project. Start With <span>More Room to Move.</span>
              </h2>
              <p className="text-on-dark-muted mt-5 max-w-xl text-base leading-8">
                Pre-register for client access when your local market opens.
              </p>
              <div className="mt-7 border border-background/14 bg-background/[0.05] p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold leading-6">
                  After the launch benefit, a $10 job-posting fee applies when a
                  job is posted. Any contract charge applies only after both
                  sides agree.
                </p>
              </div>
            </div>
            <ClientPreregistrationForm />
          </div>
        </section>
      </main>
      <SiteFooter
        ctaHref="#client-preregistration"
        ctaLabel="Pre-register as a Client"
        supportingCopy="Find skilled providers for your next project. Pre-register for client access."
      />
    </SiteFrame>
  );
}
