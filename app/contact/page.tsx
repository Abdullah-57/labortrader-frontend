import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import { ArrowUpRight, Building2, Mail, MapPin } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { COMPANY_EMAILS, COMPANY_PROFILE } from '@/lib/company-profile';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Contact LaborTrader Support',
  description:
    'Contact LaborTrader for pre-registration help, market questions, partnership or investor inquiries, privacy, legal, and accessibility support.',
  path: '/contact',
});

const primaryContacts = [
  {
    title: 'Account Help',
    email: COMPANY_EMAILS.support,
    body: 'Help with registration, your role, or market details. Target initial response: two business days.',
    href: `mailto:${COMPANY_EMAILS.support}`,
    cta: 'Get Help',
  },
  {
    title: 'Partners',
    email: COMPANY_EMAILS.partners,
    body: 'Discuss staffing, payroll, training, distribution, technology, or market reach.',
    href: '/partners#partner-inquiry',
    cta: 'Partner Inquiry',
  },
  {
    title: 'Investors',
    email: COMPANY_EMAILS.investors,
    body: 'Request approved materials and a direct conversation with LaborTrader.',
    href: '/investors#investor-inquiry',
    cta: 'Investor Brief',
  },
] as const;

const complianceContacts = [
  ['Privacy', COMPANY_EMAILS.privacy],
  ['Legal', COMPANY_EMAILS.legal],
  ['Accessibility', COMPANY_EMAILS.accessibility],
] as const;

export default function ContactPage() {
  return (
    <SiteFrame background="landing">
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Contact LaborTrader</p>
            <h1 className="page-title mt-6 max-w-5xl">
              Talk to the Right <span>Team.</span>
            </h1>
            <p className="page-lede max-w-3xl">
              Registration, partnerships, investment, privacy, legal, and
              accessibility. LaborTrader support is provided by email.
            </p>
            <Link className="button-primary mt-9" href="/early-access">
              Choose Your Account <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell min-w-0 lt-tile-grid">
            {primaryContacts.map(({ title, email, body, href, cta }) => (
              <article
                key={email}
                className="flex min-h-64 flex-col bg-lt-panel p-7"
              >
                <Mail className="size-5 text-primary" aria-hidden="true" />
                <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
                  {title}
                </h2>
                <a
                  className="lt-contact-email mt-3 text-xs font-semibold text-primary underline underline-offset-4"
                  href={`mailto:${email}`}
                >
                  {email.split('@')[0]}@<wbr />
                  {email.split('@')[1]}
                </a>
                <p className="text-on-light-muted mt-4 text-base leading-7">
                  {body}
                </p>
                {href.startsWith('mailto:') ? (
                  <a
                    className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.09em]"
                    href={href}
                  >
                    {cta}{' '}
                    <ArrowUpRight
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  </a>
                ) : (
                  <Link
                    className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.09em]"
                    href={href}
                  >
                    {cta}{' '}
                    <ArrowUpRight
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="bg-lt-panel py-12">
          <div className="site-shell min-w-0">
            <div className="lt-tile-grid border-b border-background/14 pb-10">
              <div className="min-w-0">
                <Building2 className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Company
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {COMPANY_PROFILE.legalName}
                </p>
                <Link
                  className="mt-3 inline-flex min-h-8 items-center text-xs font-semibold underline underline-offset-4 hover:text-primary"
                  href="/about"
                >
                  About LaborTrader
                </Link>
              </div>
              <div className="min-w-0">
                <MapPin className="size-5 text-primary" aria-hidden="true" />
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Mailing Address
                </p>
                <address className="mt-2 not-italic text-sm font-bold leading-6 text-background/76">
                  {COMPANY_PROFILE.mailingAddress.streetAddress}
                  <br />
                  {COMPANY_PROFILE.mailingAddress.addressLocality},{' '}
                  {COMPANY_PROFILE.mailingAddress.addressRegion}{' '}
                  {COMPANY_PROFILE.mailingAddress.postalCode}
                </address>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Social
                </p>
                <p className="mt-2 text-lg font-semibold">
                  LaborTrader on Facebook
                </p>
                <a
                  className="mt-3 inline-flex min-h-8 items-center gap-2 break-all text-xs font-semibold underline underline-offset-4 hover:text-primary"
                  href={COMPANY_PROFILE.facebookUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  facebook.com/labortraders
                  <ArrowUpRight
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            <p className="section-kicker mt-10">
              Privacy, Legal, and Accessibility
            </p>
            <div className="mt-6 lt-tile-grid">
              {complianceContacts.map(([label, email]) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="border border-background/14 p-5 transition-colors hover:border-primary"
                >
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="lt-contact-email text-on-dark-subtle mt-2 block text-xs">
                    {email.split('@')[0]}@<wbr />
                    {email.split('@')[1]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
