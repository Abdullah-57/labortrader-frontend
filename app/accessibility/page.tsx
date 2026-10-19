import { BreadcrumbJsonLd } from '@/components/breadcrumb-json-ld';
import { SiteFrame } from '@/components/site-frame';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Accessibility',
  description:
    'Learn about LaborTrader’s accessibility work and request support or an accessible alternative.',
  path: '/accessibility',
});

export default function AccessibilityPage() {
  return (
    <SiteFrame background="landing" reading>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Accessibility', path: '/accessibility' },
        ]}
      />
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="page-hero">
          <div className="site-shell min-w-0">
            <p className="section-kicker">Accessibility at LaborTrader</p>
            <h1 className="page-title mt-6 max-w-6xl">
              Access Is <span>Built In.</span>
            </h1>
            <p className="page-lede max-w-4xl">
              LaborTrader targets WCAG 2.2 Level AA. If something gets in your
              way, tell us and we will help.
            </p>
          </div>
        </section>

        <section className="lt-surface-light bg-lt-panel py-14 text-foreground lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div className="min-w-0">
              <p className="section-kicker">What We Review</p>
              <h2 className="section-title mt-5">
                Designed for Real-World <span>Use.</span>
              </h2>
            </div>
            <p className="text-xl font-semibold leading-8 tracking-[-0.025em]">
              We review keyboard and screen-reader use, form labels and errors,
              contrast, text resizing, touch targets, mobile layouts, and
              reduced-motion preferences across the public experience.
            </p>
          </div>
        </section>

        <section className="bg-lt-panel py-14 lg:py-20">
          <div className="site-shell grid min-w-0 gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div className="min-w-0">
              <p className="section-kicker">Need Help?</p>
              <h2 className="section-title mt-5">
                Tell Us What You <span>Need.</span>
              </h2>
            </div>
            <div className="min-w-0">
              <a
                className="inline-block max-w-full text-lg font-semibold text-primary underline underline-offset-4 [overflow-wrap:anywhere] sm:text-2xl"
                href="mailto:accessibility@labortraders.com"
              >
                accessibility@
                <wbr />
                labortraders.com
              </a>
              <p className="text-on-dark-subtle mt-5 max-w-3xl text-base leading-7">
                Tell us which page or task caused a problem and what support
                would help. We will work with you on an accessible alternative.
              </p>
              <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
                Last Reviewed: October 2026
              </p>
            </div>
          </div>
        </section>
        <section className="border-t border-primary/45 bg-lt-panel py-12 lg:py-16">
          <div className="site-shell flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="section-kicker">Your Market Is Waiting</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
                Pre-registration Is Open.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-background/78">
                Join your local launch list. No monthly membership fee.
              </p>
            </div>
            <Link className="button-primary" href="/early-access">
              Choose Your Account <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
