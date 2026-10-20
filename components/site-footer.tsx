import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { COMPANY_PROFILE } from '@/lib/company-profile';
import { BrandLogo } from './brand-logo';
import styles from '@/design-system/footer.module.css';

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
    <footer className={styles.footer}>
      <div className={styles.footerOverlay} aria-hidden="true" />

      <div className={styles.shell}>
        <div className={styles.mainGrid}>
          <div className={styles.brandCol}>
            <Link
              href="/"
              className={styles.logoLink}
              aria-label="LaborTrader home"
            >
              <BrandLogo
                appearance="inverse"
                alt=""
                className={styles.brandLogo}
                preload
              />
            </Link>
            <p className={styles.slogan}>
              The marketplace where skilled labor meets real demand, one market at a time.
            </p>
            <p className={styles.supportingCopy}>
              {supportingCopy}
            </p>

            <div className={`${styles.statusBadge} badge badge-outline`}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>Pre-Registration Open Nationwide</span>
            </div>

            <Link href={ctaHref} className={styles.ctaButton}>
              <span>{ctaLabel}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <nav className={styles.navGrid} aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.title} className={styles.groupCol}>
                <p className={styles.groupTitle}>
                  <span className={styles.kickerDot} aria-hidden="true" />
                  {group.title}
                </p>
                <div className={styles.groupLinks}>
                  {group.links.map(([label, href]) => (
                    <Link
                      key={href}
                      className={styles.navLink}
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
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomShell}>
          <p className={styles.copyright}>
            © 2026 {COMPANY_PROFILE.legalName} All rights reserved.
          </p>
          <div className={styles.bottomRight}>
            <address className={styles.address}>
              <span className={styles.addressLabel}>Mailing address: </span>
              {COMPANY_PROFILE.mailingAddress.streetAddress},{' '}
              {COMPANY_PROFILE.mailingAddress.addressLocality},{' '}
              {COMPANY_PROFILE.mailingAddress.addressRegion}{' '}
              {COMPANY_PROFILE.mailingAddress.postalCode}
            </address>
            <a
              className={styles.socialLink}
              href={COMPANY_PROFILE.facebookUrl}
              rel="noreferrer"
              target="_blank"
            >
              <span>LaborTrader on Facebook</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
