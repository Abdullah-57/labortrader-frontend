'use client';

import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
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
const audienceNav = [
  ['Workers', '/for-workers'],
  ['Independent Contractors', '/for-contractors'],
  ['Service Businesses', '/for-businesses'],
  ['Hiring Organizations', '/for-hiring-firms'],
  ['Clients & Project Owners', '/for-clients'],
] as const;
const industryNav = [
  ['HVAC & Refrigeration', '/trades/hvac'],
  ['Electrical', '/trades/electrical'],
  ['Plumbing & Pipefitting', '/trades/plumbing'],
  ['Oil & Gas', '/industries/oil-gas'],
  ['Other Trades & Specialties', '/trades/other'],
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
function MenuLinks({
  links,
  onChoose,
}: {
  links: readonly (readonly [string, string])[];
  onChoose: () => void;
}) {
  return links.map(([label, href], index) => (
    <Link
      key={href}
      href={href}
      onClick={onChoose}
      style={{ '--menu-item-index': index } as CSSProperties}
    >
      <span>{label}</span>
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  ));
}

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
                ['audiences', 'Who It’s For', audienceNav, audienceButton],
                ['industries', 'Industries', industryNav, industryButton],
              ] as const
            ).map(([key, label, links, button]) => (
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
                  <MenuLinks links={links} onChoose={close} />
                </div>
              </div>
            ))}
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
          <MenuLinks links={[primaryNav[0]]} onChoose={close} />
          <details>
            <summary>
              Who It’s For
              <ChevronDown size={17} aria-hidden="true" />
            </summary>
            <div className={styles.subgroup}>
              <MenuLinks links={audienceNav} onChoose={close} />
            </div>
          </details>
          <details>
            <summary>
              Industries
              <ChevronDown size={17} aria-hidden="true" />
            </summary>
            <div className={styles.subgroup}>
              <MenuLinks links={industryNav} onChoose={close} />
            </div>
          </details>
          <MenuLinks links={primaryNav.slice(1)} onChoose={close} />
          <Link className={styles.mobileCta} href={ctaHref} onClick={close}>
            <span>{ctaLabel}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </nav>
      </header>
    </>
  );
}
