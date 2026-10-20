import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { industries, support } from './landing-content-data';
import { AdvantageRoadmap } from './advantage-roadmap';
import { AccountPathTree } from './account-path-tree';
import styles from '@/design-system/landing.module.css';

/** The approved landing layout, shared by the real homepage and design lab. */
export function LandingContent({
  registration,
  counter,
  marketNotice,
  preview = false,
}: {
  registration: ReactNode;
  counter: ReactNode;
  marketNotice?: ReactNode;
  preview?: boolean;
}) {
  const anchors = preview
    ? {
        top: 'lab-top',
        why: 'lab-why',
        paths: 'lab-paths',
        register: 'lab-register',
        benefits: 'lab-benefits',
        industries: 'lab-industries',
      }
    : {
        top: 'top',
        why: 'why-labortrader',
        paths: 'account-paths',
        register: 'pre-register',
        benefits: 'programs',
        industries: 'industries',
      };
  return (
    <main id="main-content" tabIndex={-1}>
      {marketNotice}
      <section className={`${styles.hero} hero`} id={anchors.top}>
        <div className={styles.heroBackground} aria-hidden="true" />
        <div className={`${styles.heroOverlay} hero-overlay`} aria-hidden="true" />
        <div className={styles.heroLines} aria-hidden="true" />
        <div className={`${styles.shell} ${styles.heroGrid} hero-content`}>
          <div className={styles.heroCopy}>
            <div className={`${styles.openLabel} badge badge-outline`}>
              <span className={styles.statusDot} />
              Pre-registration is open nationwide
            </div>
            <p className={styles.launchRoadmap}>
              <strong>Oklahoma launches February 2027.</strong> Texas, Florida
              &amp; more states planned soon after.
            </p>
            <h1>
              More work.
              <br />
              More hands.
              <br />
              <span>More money.</span>
            </h1>
            <p className={styles.heroLede}>
              Find projects to bid on, bring in qualified help, or turn open
              days into paid work. Your rates, your availability, your service
              area. Get notified when there’s a match.
            </p>
            <div className={styles.heroActions}>
              <a className={styles.outlineButton} href={`#${anchors.paths}`}>
                Find Your Path <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <a
                className={`${styles.textButton} ${styles.meetLink}`}
                href={`#${anchors.why}`}
              >
                Meet LaborTrader <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.heroBenefits}>
              <Link href="/launch-benefits" className={`${styles.heroBenefitCard} card`}>
                <div className={styles.heroBenefitValue}>
                  <span className={styles.heroBenefitLabel}>
                    Launch benefit
                  </span>
                  <strong>
                    90<span> days free</span>
                  </strong>
                </div>
                <span>Eligible platform use</span>
              </Link>
              <Link href="/referrals" className={`${styles.heroBenefitCard} card`}>
                <div className={styles.heroBenefitValue}>
                  <span className={styles.heroBenefitLabel}>
                    Referral reward
                  </span>
                  <strong>
                    +10<span> days</span>
                  </strong>
                </div>
                <span>Per verified referral</span>
              </Link>
              <Link href="/launch-benefits" className={`${styles.heroBenefitCard} card`}>
                <div className={styles.heroBenefitValue}>
                  <span className={styles.heroBenefitLabel}>Your account</span>
                  <strong>
                    $0<span> / month</span>
                  </strong>
                </div>
                <span>No membership fee</span>
              </Link>
            </div>
            <Link className={styles.benefitDetails} href="/launch-benefits">
              Benefit details <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div id={anchors.register} className={styles.registrationSlot}>
            {registration}
          </div>
        </div>
      </section>

      {counter}

      <section
        className={`${styles.contentSection} ${styles.why}`}
        id={anchors.why}
      >
        <div className={styles.whyOverlay} aria-hidden="true" />
        <div className={`${styles.shell} ${styles.whyGrid}`}>
          <div className={styles.whyCopy}>
            <div className={styles.kicker}>A BETTER WAY TO CONNECT</div>
            <h2>
              Real work.
              <br />
              Real records.
              <br />
              <em>Less chasing.</em>
            </h2>
            <p className={styles.sectionLede}>
              Put your skills in front of people ready to hire. Fill open crew
              time, bring in qualified help, and take on projects you couldn’t
              cover alone. Every completed engagement builds your record.
            </p>
            <a href={`#${anchors.register}`} className={styles.darkButton}>
              Make Your Next Move <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className={styles.whyRoadmap}>
            <AdvantageRoadmap />
          </div>
        </div>
      </section>

      <section
        className={`${styles.contentSection} ${styles.pathSection}`}
        id={anchors.paths}
      >
        <div className={styles.shell}>
          <div className={styles.pathSectionHeading}>
            <div className={styles.kicker}>CHOOSE YOUR ACCOUNT</div>
            <h2>
              Five paths. <em>One marketplace.</em>
            </h2>
          </div>
          <AccountPathTree />
        </div>
      </section>

      <section className={styles.benefitSection} id={anchors.benefits}>
        <div className={styles.benefitOverlay} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.benefitHeadingArea}>
            <div>
              <div className={styles.benefitKicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                START WITH MORE
              </div>
              <h2>
                Early registrants can <em>earn more time.</em>
              </h2>
            </div>
            <Link className={styles.benefitHeaderButton} href="/launch-benefits">
              <span>Benefits & Fees</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.benefitGrid}>
            <Link href="/launch-benefits" className={styles.launchBenefit}>
              <div className={styles.benefitCardGlow} aria-hidden="true" />
              <div>
                <div className={styles.benefitTopRow}>
                  <span className={styles.benefitBadge}>YOUR LAUNCH BENEFIT</span>
                  <span className={styles.metricPill}>UP TO 90 DAYS FREE</span>
                </div>

                <div className={styles.benefitHeaderArea}>
                  <div className={styles.benefitIconBox}>
                    <Clock size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h3>A head start, built in.</h3>
                </div>

                <p>
                  Reserve up to 90 days of eligible platform use. Completing your
                  detailed profile qualifies you for free-use eligibility. Activation
                  starts after verification, approval, and market launch.
                </p>
              </div>

              <div className={styles.benefitCtaRow}>
                <span className={styles.benefitCtaButton}>
                  <span>See Launch Benefits</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </div>
            </Link>

            <Link href="/referrals" className={styles.referralBenefit}>
              <div className={styles.benefitCardGlow} aria-hidden="true" />
              <div>
                <div className={styles.benefitTopRow}>
                  <span className={styles.benefitBadge}>YOUR REFERRAL BENEFIT</span>
                  <span className={styles.metricPill}>+10 DAYS PER REFERRAL</span>
                </div>

                <div className={styles.benefitHeaderArea}>
                  <div className={styles.benefitIconBox}>
                    <UsersRound size={24} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h3>Bring your people.</h3>
                </div>

                <p>
                  Earn 10 extra days when someone registers through your link and
                  completes verification. There is no limit to the bonus time you can
                  bank before market launch.
                </p>
              </div>

              <div className={styles.benefitCtaRow}>
                <span className={styles.benefitCtaButton}>
                  <span>See Referral Benefits</span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.industrySection} id={anchors.industries}>
        <div className={styles.industryOverlay} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.industryHeadingArea}>
            <div className={styles.industryHeadingLeft}>
              <div className={styles.industryKicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                BUILT AROUND YOUR INDUSTRY
              </div>
              <h2>
                Your trade. <em>Your opportunities.</em>
              </h2>
              <p className={styles.industryLede}>
                Specialized workflows, verified licensing, and direct matching tailored to the unique demands of skilled trades.
              </p>
            </div>
            <div className={styles.industryHeadingRight}>
              <div className={`${styles.industryCountPill} badge badge-outline`}>
                <span className={styles.countPillDot} aria-hidden="true" />
                5 Core Trade Sectors
              </div>
            </div>
          </div>

          <div className={`${styles.industryList} list`} role="list">
            {industries.map(({ icon: Icon, ...industry }, index) => {
              const num = String(index + 1).padStart(2, '0');
              return (
                <Link
                  key={industry.href}
                  href={industry.href}
                  className={`${styles.industryRow} list-row`}
                  role="listitem"
                >
                  <div className={styles.industryRowGlow} aria-hidden="true" />

                  <div className={styles.industryRowLead}>
                    <span className={styles.industryIndex}>{num}</span>
                    <div className={styles.industryIconBox}>
                      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                  </div>

                  <div className={styles.industryRowMain}>
                    <div className={styles.industryTitleLine}>
                      <h3>{industry.title}</h3>
                      {industry.tag && (
                        <span className={`${styles.industryTag} badge badge-outline`}>
                          {industry.tag}
                        </span>
                      )}
                    </div>
                    {industry.highlight && (
                      <span className={styles.industryHighlight}>
                        {industry.highlight}
                      </span>
                    )}
                  </div>

                  <div className={`${styles.industryRowDesc} list-col-grow`}>
                    <p>{industry.body}</p>
                  </div>

                  <div className={styles.industryRowAction}>
                    <span className={styles.industryCtaButton}>
                      <span>Explore Trade</span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className={styles.industryFootnote}>
            <div className={styles.footnoteLeft}>
              <span className={styles.footnoteBadge}>PRE-REGISTRATION OPEN</span>
              <p>
                Don&apos;t see your specific specialty? Pre-registration supports all licensed trades, general contracting, and specialized craft disciplines.
              </p>
            </div>
            <Link href="/trades/other" className={styles.footnoteCta}>
              <span>Explore All Specialties</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.supportSection} id="support">
        <div className={styles.supportOverlay} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.supportHeadingArea}>
            <div className={styles.supportHeadingLeft}>
              <div className={styles.supportKicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                SUPPORT THE MARKETPLACE
              </div>
              <h2>
                Get in early. <em>Build with us.</em>
              </h2>
              <p className={styles.supportLede}>
                Partner with LaborTrader through pro supplies, strategic alliances, investor backing, or specialized trade commercial services.
              </p>
            </div>
            <div className={styles.supportHeadingRight}>
              <div className={`${styles.supportCountPill} badge badge-outline`}>
                <span className={styles.countPillDot} aria-hidden="true" />
                4 Ecosystem Channels
              </div>
            </div>
          </div>

          <div className={styles.supportGrid}>
            {support.map(({ icon: Icon, ...item }) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.supportCard} card`}
              >
                {/* Background image inside card with blur and darkening */}
                <div
                  className={styles.supportCardBg}
                  style={{ backgroundImage: `url(${item.bg})` }}
                  aria-hidden="true"
                />
                {/* Gradient scrim for text contrast */}
                <div className={styles.supportCardScrim} aria-hidden="true" />
                {/* Ambient corner glow on hover */}
                <div className={styles.supportCardGlow} aria-hidden="true" />

                <div className={styles.supportCardContent}>
                  <div className={styles.supportCardTop}>
                    <div className={styles.supportIconBox}>
                      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    {item.tag && (
                      <span className={`${styles.supportTag} badge badge-outline`}>
                        {item.tag}
                      </span>
                    )}
                  </div>

                  <div className={styles.supportCardBody}>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>

                  <div className={styles.supportCardFooter}>
                    <span className={styles.supportCtaButton}>
                      <span>{item.cta}</span>
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta} id="rollout">
        <div className={styles.finalCtaOverlay} aria-hidden="true" />
        <div className={styles.shell}>
          <div className={styles.finalCtaGrid}>
            <div className={styles.finalCtaMain}>
              <div className={styles.finalCtaKicker}>
                <span className={styles.kickerDot} aria-hidden="true" />
                YOUR NEXT OPPORTUNITY STARTS HERE
              </div>
              <h2>
                Let’s get <em>moving.</em>
              </h2>
              <p className={styles.finalCtaDescription}>
                <strong>Pre-register from any U.S. state.</strong> Oklahoma’s
                launch is scheduled for February 2027. More states will open as
                local demand and available talent grow. Secure your early standing and bank exclusive launch benefits today.
              </p>

              <div className={styles.finalCtaActions}>
                <a className={styles.finalCtaPrimary} href={`#${anchors.register}`}>
                  <span>Pre-register Now</span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <Link className={styles.finalCtaSecondary} href="/launch-benefits">
                  <span>See Launch Benefits</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className={styles.finalCtaPillars}>
              <div className={styles.pillarCard}>
                <div className={styles.pillarIconBox}>
                  <MapPin size={20} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className={styles.pillarContent}>
                  <div className={styles.pillarHeader}>
                    <span className={styles.pillarLabel}>FIRST MARKET LAUNCH</span>
                    <span className={`${styles.pillarBadge} badge badge-outline`}>
                      <span className={styles.pillarBeacon} aria-hidden="true" />
                      Target Q1
                    </span>
                  </div>
                  <strong>February 2027</strong>
                  <p>Oklahoma metro pipeline & regional networks</p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIconBox}>
                  <ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className={styles.pillarContent}>
                  <div className={styles.pillarHeader}>
                    <span className={styles.pillarLabel}>COAST-TO-COAST ACCESS</span>
                    <span className={`${styles.pillarBadge} badge badge-outline`}>Open Now</span>
                  </div>
                  <strong>All 50 U.S. States</strong>
                  <p>Lock in verified standing ahead of rollout</p>
                </div>
              </div>

              <div className={styles.pillarCard}>
                <div className={styles.pillarIconBox}>
                  <Sparkles size={20} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div className={styles.pillarContent}>
                  <div className={styles.pillarHeader}>
                    <span className={styles.pillarLabel}>EARLY REGISTRANT REWARD</span>
                    <span className={`${styles.pillarBadge} badge badge-outline`}>Zero Fees</span>
                  </div>
                  <strong>Up to 90 Days Free</strong>
                  <p>Bank bonus days and zero monthly platform charges</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
