import { SiteFrame } from '@/components/site-frame';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { OptionalProfileForm } from '@/components/optional-profile-form';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Pre-registration Portal',
  description:
    'Securely access your LaborTrader verification, referral, and profile status.',
  robots: { index: false, follow: false },
};

export default function ParticipantPortalPage() {
  return (
    <SiteFrame background="landing">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="site-shell">
            <Suspense
              fallback={
                <section
                  aria-busy="true"
                  aria-label="Loading your LaborTrader pre-registration"
                  className="h-80 animate-pulse border border-foreground/10 bg-card"
                >
                  <h1 className="sr-only">
                    Loading Your LaborTrader Pre-registration
                  </h1>
                </section>
              }
            >
              <OptionalProfileForm />
            </Suspense>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
