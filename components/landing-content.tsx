import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { paths, industries, advantages, support } from './landing-content-data';
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
      <section className={styles.hero} id={anchors.top}>
        <div className={styles.heroLines} aria-hidden="true" />
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <div className={styles.openLabel}>
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
              <Link href="/launch-benefits">
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
              <Link href="/referrals">
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
              <Link href="/launch-benefits">
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
        <div className={`${styles.shell} ${styles.whyGrid}`}>
          <div>
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
          <div className={styles.advantageList}>
            {advantages.map(({ icon: Icon, ...item }) => (
              <article key={item.title}>
                <span className={styles.featureIcon}>
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`${styles.contentSection} ${styles.pathSection}`}
        id={anchors.paths}
      >
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.kicker}>CHOOSE YOUR ACCOUNT</div>
              <h2>
                Five paths. <em>One marketplace.</em>
              </h2>
            </div>
          </div>
          <div className={styles.pathGrid}>
            {paths.map(({ icon: Icon, ...path }) => (
              <Link
                key={path.role}
                href={path.href}
                className={styles.pathCard}
              >
                <div className={styles.pathTop}>
                  <span className={styles.pathRole}>{path.role}</span>
                  <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                </div>
                <h3>
                  {path.compactTitle ? (
                    <>
                      <span className={styles.pathFullText}>{path.title}</span>
                      <span className={styles.pathCompactText}>
                        {path.compactTitle}
                      </span>
                    </>
                  ) : (
                    path.title
                  )}
                </h3>
                <p>{path.body}</p>
                <span className={styles.pathCta}>
                  <span className={styles.pathFullText}>{path.cta}</span>
                  <span className={styles.pathCompactText}>
                    {path.compactCta}
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.benefitSection} id={anchors.benefits}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={`${styles.kicker} ${styles.lightKicker}`}>
                START WITH MORE
              </div>
              <h2>
                Early registrants can <em>earn more time.</em>
              </h2>
            </div>
            <Link className={styles.textButton} href="/launch-benefits">
              Benefits & Fees <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.benefitGrid}>
            <Link href="/launch-benefits" className={styles.launchBenefit}>
              <div>
                <span className={styles.benefitEyebrow}>
                  YOUR LAUNCH BENEFIT
                </span>
                <h3>A head start, built in.</h3>
                <p>
                  Reserve up to 90 days of eligible platform use. Completing
                  your detailed profile qualifies you for free-use eligibility.
                  Activation starts after verification, approval, and market
                  launch.
                </p>
                <span className={styles.inlineCta}>
                  See Launch Benefits{' '}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </span>
              </div>
            </Link>
            <Link href="/referrals" className={styles.referralBenefit}>
              <span className={styles.benefitEyebrow}>
                YOUR REFERRAL BENEFIT
              </span>
              <h3>Bring your people.</h3>
              <p>
                Earn 10 extra days when someone registers through your link and
                completes verification.
              </p>
              <span className={styles.inlineCta}>
                See Referral Benefits{' '}
                <ArrowUpRight size={17} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        className={`${styles.contentSection} ${styles.industrySection}`}
        id={anchors.industries}
      >
        <div className={`${styles.shell} ${styles.industryGrid}`}>
          <div className={styles.industryIntro}>
            <div className={styles.kicker}>BUILT AROUND YOUR INDUSTRY</div>
            <h2>
              Your trade. <em>Your opportunities.</em>
            </h2>
          </div>
          <div className={styles.industryList}>
            {industries.map(({ icon: Icon, ...industry }) => (
              <Link key={industry.href} href={industry.href}>
                <Icon
                  className={styles.industryIcon}
                  size={26}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
                <div>
                  <h3>{industry.title}</h3>
                  <p>{industry.body}</p>
                </div>
                <ArrowUpRight
                  className={styles.industryArrow}
                  size={22}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.contentSection} ${styles.supportSection}`}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <div>
              <div className={styles.kicker}>SUPPORT THE MARKETPLACE</div>
              <h2>
                Get in early. <em>Build with us.</em>
              </h2>
            </div>
          </div>
          <div className={styles.supportGrid}>
            {support.map(({ icon: Icon, ...item }) => (
              <Link key={item.href} href={item.href} data-interaction="text">
                <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
                <h3>
                  {item.title}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </h3>
                <p>{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalCta} id="rollout">
        <div className={styles.shell}>
          <div>
            <span>YOUR NEXT OPPORTUNITY STARTS HERE.</span>
            <h2>Let’s get moving.</h2>
            <p className={styles.launchNote}>
              <strong>Pre-register from any U.S. state.</strong> Oklahoma’s
              launch is scheduled for February 2027. More states will open as
              local demand and available talent grow.
            </p>
          </div>
          <a className={styles.darkButton} href={`#${anchors.register}`}>
            Pre-register Now <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}
