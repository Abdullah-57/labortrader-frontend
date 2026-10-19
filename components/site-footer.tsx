import Link from 'next/link';
import { COMPANY_PROFILE } from '@/lib/company-profile';
import { BrandLogo } from './brand-logo';

const footerGroups = [
  {
    title: 'Marketplace',
    links: [
      ['How It Works', '/how-it-works'],
      ['MarketScan', '/market-scan'],
      ['Pro Shop', '/pro-shop'],
      ['Advertise in Pro Shop', '/advertise'],
      ['Pre-register', '/early-access'],
      ['Launch Benefit', '/launch-benefits'],
      ['Referral Rewards', '/referrals'],
      ['FAQ', '/faq'],
    ],
  },
  {
    title: 'Industries',
    links: [
      ['HVAC & Refrigeration', '/trades/hvac'],
      ['Electrical', '/trades/electrical'],
      ['Plumbing & Pipefitting', '/trades/plumbing'],
      ['Oil & Gas', '/industries/oil-gas'],
      ['Other Trades & Specialties', '/trades/other'],
    ],
  },
  {
    title: "Who It's For",
    links: [
      ['Clients & Project Owners', '/for-clients'],
      ['Workers', '/for-workers'],
      ['Independent Contractors', '/for-contractors'],
      ['Service Businesses', '/for-businesses'],
      ['Hiring Organizations', '/for-hiring-firms'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About', '/about'],
      ['Partners', '/partners'],
      ['Investors', '/investors'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Trust & Legal',
    links: [
      ['Trust & Safety', '/trust-safety'],
      ['Accessibility', '/accessibility'],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
      ['SMS Terms', '/sms-terms'],
    ],
  },
] as const;

export function SiteFooter({
  ctaHref = '/early-access',
  ctaLabel = 'Pre-register',
  supportingCopy = 'Pre-registration is open nationwide. Find work, hire skilled help, and put available capacity to work.',
}: {
  ctaHref?: string;
  ctaLabel?: string;
  supportingCopy?: string;
} = {}) {
  return (
    <footer className="lt-footer lt-surface-dark pb-24 text-background sm:pb-0">
      <div className="site-shell grid min-w-0 gap-12 py-14 lg:grid-cols-[minmax(13rem,.65fr)_minmax(0,1.35fr)] lg:py-16">
        <div className="min-w-0">
          <Link
            href="/"
            className="inline-block max-w-full focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4ea1ff]"
            aria-label="LaborTrader home"
          >
            <BrandLogo
              appearance="inverse"
              alt=""
              className="w-[min(100%,16rem)]"
              preload
            />
          </Link>
          <p className="mt-5 max-w-xs text-[15px] font-semibold leading-7">
            The marketplace where skilled labor meets real demand, one market at
            a time.
          </p>
          <p className="text-on-dark-subtle mt-3 max-w-xs text-[13px] leading-6">
            {supportingCopy}
          </p>
          <Link
            href={ctaHref}
            className="mt-6 inline-flex min-h-11 items-center text-[13px] font-semibold uppercase tracking-[0.09em] text-primary underline underline-offset-4 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#4ea1ff]"
          >
            {ctaLabel}
          </Link>
        </div>
        <nav
          className="grid min-w-0 grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-5"
          aria-label="Footer navigation"
        >
          {footerGroups.map((group) => (
            <div key={group.title} className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                {group.title}
              </p>
              <div className="mt-3">
                {group.links.map(([label, href]) => (
                  <Link
                    key={href}
                    className="flex min-h-11 items-center text-sm font-semibold leading-5 text-background/82 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4ea1ff] lg:min-h-9"
                    href={href}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-background/12">
        <div className="text-on-dark-subtle site-shell flex min-w-0 flex-col gap-4 py-6 text-[11px] font-semibold sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <p>© 2026 {COMPANY_PROFILE.legalName} All rights reserved.</p>
          <div className="flex min-w-0 flex-col gap-2 sm:items-end">
            <address className="not-italic">
              <span className="font-semibold text-background/78">
                Mailing address:{' '}
              </span>
              {COMPANY_PROFILE.mailingAddress.streetAddress},{' '}
              {COMPANY_PROFILE.mailingAddress.addressLocality},{' '}
              {COMPANY_PROFILE.mailingAddress.addressRegion}{' '}
              {COMPANY_PROFILE.mailingAddress.postalCode}
            </address>
            <a
              className="min-h-6 font-semibold text-background/78 underline underline-offset-4 transition-colors hover:text-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#4ea1ff]"
              href={COMPANY_PROFILE.facebookUrl}
              rel="noreferrer"
              target="_blank"
            >
              LaborTrader on Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
