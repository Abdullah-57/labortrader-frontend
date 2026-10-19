import type { Metadata } from 'next';
import { SiteFrame } from '@/components/site-frame';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { IntakeEmailConfirmation } from '@/components/intake-email-confirmation';
export const metadata: Metadata = {
  title: 'Confirm Your Email',
  description: 'Confirm your LaborTrader submission.',
  robots: { index: false, follow: false, noarchive: true },
};
export default async function ConfirmEmailPage({
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
            <IntakeEmailConfirmation token={token} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
