import { SiteFrame } from '@/components/site-frame';
import type { Metadata } from 'next';
import { EmailVerificationPanel } from '@/components/participant-verification';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Verify Your Email',
  description: 'Confirm your LaborTrader pre-registration email.',
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token =
    typeof params.token === 'string' ? params.token.slice(0, 300) : '';

  return (
    <SiteFrame background="landing">
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="site-shell">
            <EmailVerificationPanel token={token} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
