'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  Building2,
  ChevronDown,
  Droplets,
  Flame,
  Hammer,
  HardHat,
  Home,
  Layers,
  type LucideIcon,
  Snowflake,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BrandLogo } from './brand-logo';
import styles from '@/design-system/navigation.module.css';

const primaryNav = [
  ['How It Works', '/how-it-works'],
  ['MarketScan', '/market-scan'],
  ['Pro Shop', '/pro-shop'],
  ['Partners', '/partners'],
  ['Investors', '/investors'],
  ['Contact', '/contact'],
] as const;

export type DropdownNavItem = {
  label: string;
  href: string;
  desc: string;
  icon: LucideIcon;
};

const audienceNav: readonly DropdownNavItem[] = [
  {
    label: 'Workers',
    href: '/for-workers',
    desc: 'W-2 opportunities & flexible schedules',
    icon: HardHat,
  },
  {
    label: 'Independent Contractors',
    href: '/for-contractors',
    desc: 'Fill your schedule & bid projects',
    icon: Hammer,
  },
  {
    label: 'Service Businesses',
    href: '/for-businesses',
    desc: 'Keep crews booked & grow contracts',
    icon: Building2,
  },
  {
    label: 'Hiring Organizations',
    href: '/for-hiring-firms',
    desc: 'Hire verified pros & build crews',
    icon: Users,
  },
  {
    label: 'Clients & Project Owners',
    href: '/for-clients',
    desc: 'Qualified trade help for your project',
    icon: Home,
  },
] as const;

const industryNav: readonly DropdownNavItem[] = [
  {
    label: 'HVAC & Refrigeration',
    href: '/trades/hvac',
    desc: 'Heating, cooling, mechanical & BAS',
    icon: Snowflake,
  },
  {
    label: 'Electrical',
    href: '/trades/electrical',
    desc: 'Commercial, industrial & residential wire',
    icon: Zap,
  },
  {
    label: 'Plumbing & Pipefitting',
    href: '/trades/plumbing',
    desc: 'Commercial piping, sanitary & hydronics',
    icon: Droplets,
  },
  {
    label: 'Oil & Gas',
    href: '/industries/oil-gas',
    desc: 'Field operations, pipelines & rigging',
    icon: Flame,
  },
  {
    label: 'Other Trades & Specialties',
    href: '/trades/other',
    desc: 'Carpentry, welding, roofing & finish',
    icon: Layers,
  },
] as const;

export function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return (
    <BrandLogo
      appearance={inverse ? 'inverse' : 'default'}
      className="w-[clamp(9.25rem,44vw,12.5rem)]"
      preload
    />
  );
}

type Menu = 'mobile' | 'audiences' | 'industries' | null;

export function SiteHeader({
  ctaHref = '/early-access',
  ctaLabel = 'Pre-register',
}: { ctaHref?: string; ctaLabel?: string } = {}) {
  const [menu, setMenu] = useState<Menu>(null);
  const header = useRef<HTMLElement>(null);
  const mobileButton = useRef<HTMLButtonElement>(null);
  const audienceButton = useRef<HTMLButtonElement>(null);
  const industryButton = useRef<HTMLButtonElement>(null);
  const close = () => setMenu(null);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenu(null);
      ({
        mobile: mobileButton,
        audiences: audienceButton,
        industries: industryButton,
      })[menu].current?.focus();
    };
    const onOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setMenu(null);
    };
    const onBreakpoint = () => setMenu(null);
    const breakpoint = window.matchMedia('(min-width: 1201px)');
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    breakpoint.addEventListener('change', onBreakpoint);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
      breakpoint.removeEventListener('change', onBreakpoint);
    };
  }, [menu]);

  return (
    <>
      <a className={styles.skip} href="#main-content">
        Skip to Main Content
      </a>
      <header ref={header} className={styles.header}>
        <div className={styles.shell}>
          <Link
            href="/"
            aria-label="LaborTrader home"
            className={styles.logo}
            onClick={close}
          >
            <BrandLogo appearance="inverse" alt="" preload />
          </Link>

          <nav className={styles.desktop} aria-label="Primary navigation">
            <Link href={primaryNav[0][1]} onClick={close}>
              {primaryNav[0][0]}
            </Link>

            {(
              [
                [
                  'audiences',
                  'Who It’s For',
                  audienceNav,
                  audienceButton,
                  'Choose Your Account',
                  '5 Paths',
                  '/launch-benefits',
                  'Explore zero membership fees & benefits',
                ],
                [
                  'industries',
                  'Industries',
                  industryNav,
                  industryButton,
                  'Market Sectors',
                  'All Trades',
                  '/market-scan',
                  'View market launch timing & map',
                ],
              ] as const
            ).map(
              ([
                key,
                label,
                links,
                button,
                kicker,
                badge,
                footerHref,
                footerText,
              ]) => (
                <div className={styles.group} key={key}>
                  <button
                    ref={button}
                    type="button"
                    aria-expanded={menu === key}
                    aria-controls={`site-${key}`}
                    onClick={() => setMenu(menu === key ? null : key)}
                  >
                    {label}
                    <ChevronDown size={13} aria-hidden="true" />
                  </button>

                  <div
                    id={`site-${key}`}
                    className={styles.dropdown}
                    data-open={menu === key}
                    aria-hidden={menu !== key}
                    inert={menu !== key}
                  >
                    <div className={styles.dropdownGlow} aria-hidden="true" />

                    <div className={styles.dropdownHeader}>
                      <span className={styles.dropdownKicker}>{kicker}</span>
                      <span className={styles.dropdownBadge}>{badge}</span>
                    </div>

                    <div className={styles.dropdownList}>
                      {links.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            className={styles.dropdownItem}
                            style={{ '--menu-item-index': index } as CSSProperties}
                          >
                            <div className={styles.itemIconBox} aria-hidden="true">
                              <Icon size={16} />
                            </div>
                            <div className={styles.itemContent}>
                              <span className={styles.itemTitle}>{item.label}</span>
                              <span className={styles.itemDesc}>{item.desc}</span>
                            </div>
                            <ArrowUpRight
                              size={14}
                              className={styles.itemArrow}
                              aria-hidden="true"
                            />
                          </Link>
                        );
                      })}
                    </div>

                    <div className={styles.dropdownFooter}>
                      <Link href={footerHref} onClick={close}>
                        <span>{footerText}</span>
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              ),
            )}

            {primaryNav.slice(1).map(([label, href]) => (
              <Link key={href} href={href} onClick={close}>
                {label}
              </Link>
            ))}
          </nav>

          <Link className={styles.cta} href={ctaHref} onClick={close}>
            {ctaLabel}
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>

          <button
            ref={mobileButton}
            className={styles.toggle}
            type="button"
            aria-label={
              menu === 'mobile' ? 'Close navigation' : 'Open navigation'
            }
            aria-expanded={menu === 'mobile'}
            aria-controls="site-mobile-navigation"
            onClick={() => setMenu(menu === 'mobile' ? null : 'mobile')}
          >
            <span className={styles.icon} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <nav
          id="site-mobile-navigation"
          className={`${styles.dropdown} ${styles.mobile}`}
          aria-label="Menu navigation"
          data-open={menu === 'mobile'}
          aria-hidden={menu !== 'mobile'}
          inert={menu !== 'mobile'}
        >
          <div className={styles.dropdownGlow} aria-hidden="true" />

          <Link
            href={primaryNav[0][1]}
            onClick={close}
            className={styles.dropdownItem}
          >
            <span className={styles.itemTitle}>{primaryNav[0][0]}</span>
            <ArrowUpRight size={14} className={styles.itemArrow} aria-hidden="true" />
          </Link>

          <details className={styles.mobileDetails}>
            <summary className={styles.mobileSummary}>
              <span>Who It’s For</span>
              <ChevronDown size={15} aria-hidden="true" />
            </summary>
            <div className={styles.subgroup}>
              {audienceNav.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={styles.dropdownItem}
                    style={{ '--menu-item-index': idx } as CSSProperties}
                  >
                    <div className={styles.itemIconBox} aria-hidden="true">
                      <Icon size={15} />
                    </div>
                    <div className={styles.itemContent}>
                      <span className={styles.itemTitle}>{item.label}</span>
                      <span className={styles.itemDesc}>{item.desc}</span>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className={styles.itemArrow}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </details>

          <details className={styles.mobileDetails}>
            <summary className={styles.mobileSummary}>
              <span>Industries</span>
              <ChevronDown size={15} aria-hidden="true" />
            </summary>
            <div className={styles.subgroup}>
              {industryNav.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={styles.dropdownItem}
                    style={{ '--menu-item-index': idx } as CSSProperties}
                  >
                    <div className={styles.itemIconBox} aria-hidden="true">
                      <Icon size={15} />
                    </div>
                    <div className={styles.itemContent}>
                      <span className={styles.itemTitle}>{item.label}</span>
                      <span className={styles.itemDesc}>{item.desc}</span>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className={styles.itemArrow}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </div>
          </details>

          {primaryNav.slice(1).map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={styles.dropdownItem}
            >
              <span className={styles.itemTitle}>{label}</span>
              <ArrowUpRight size={14} className={styles.itemArrow} aria-hidden="true" />
            </Link>
          ))}

          <Link className={styles.mobileCta} href={ctaHref} onClick={close}>
            <span>{ctaLabel}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </nav>
      </header>
    </>
  );
}
