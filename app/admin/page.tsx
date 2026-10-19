import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFrame } from '@/components/site-frame';
import { AdminDashboard } from '@/components/admin-dashboard';
import { Wordmark } from '@/components/site-header';
import { adminAuthMode } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, noarchive: true },
};

// Evaluate the auth mode per request so enabling managed auth never requires
// a rebuild to make the page appear.
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  // Until a managed identity provider (or the development-only local adapter)
  // is configured there is nothing to sign in to, so do not advertise the
  // reporting surface with a disabled login form.
  if (adminAuthMode() === 'disabled') notFound();

  return (
    <SiteFrame reading>
      <a
        className="fixed left-3 top-3 z-[100] -translate-y-[180%] bg-primary px-4 py-3 text-sm font-black text-primary-foreground transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring"
        href="#main-content"
      >
        Skip to Main Content
      </a>
      <header className="border-b border-foreground/10">
        <div className="site-shell flex h-[72px] items-center justify-between gap-4">
          <Link href="/">
            <Wordmark inverse />
          </Link>
          <Link
            href="/"
            className="shrink-0 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground hover:text-primary"
          >
            Return to site
          </Link>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="site-shell pb-16">
        <AdminDashboard />
      </main>
    </SiteFrame>
  );
}
