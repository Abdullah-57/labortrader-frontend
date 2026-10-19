import { SiteFrame } from '@/components/site-frame';
import type { Metadata } from 'next';
import { ProShopEmailVerification } from '@/components/pro-shop-email-verification';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Verify Your Pro Shop Partner Email',
  description: 'Confirm the email on your LaborTrader Pro Shop application.',
  robots: { index: false, follow: false },
};

export default async function ProShopVerifyEmailPage({
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
            <ProShopEmailVerification token={token} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteFrame>
  );
}
