'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Database,
  Download,
  Handshake,
  LayoutDashboard,
  LogOut,
  MapPin,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Upload,
  UserCheck,
  Users,
  WifiOff,
  type LucideIcon,
} from 'lucide-react';
import { AdminAwardReconciliationPanel } from '@/components/admin-award-reconciliation-panel';
import { AdminCredentialReviewPanel } from '@/components/admin-credential-review-panel';
import { AdminReferralPanel } from '@/components/admin-referral-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  availabilityLabel,
  companySizeLabel,
  experienceLabel,
  laborTypeLabel,
  professionalStatusLabel,
  shortageFrequencyLabel,
  tradeLabel,
  TRADES,
} from '@/lib/constants';

type Distribution = Array<{ label: string | null; value: number }>;
type Metrics = {
  summary: {
    total: number;
    today: number;
    sevenDays: number;
    thirtyDays: number;
    imported: number;
    referred: number;
    smsOptIn: number;
    quickLeads: number;
    quickToday: number;
    quickSevenDays: number;
    quickThirtyDays: number;
    quickSmsOptIn: number;
    foundingMembers: number;
    markets?: number;
  };
  mvpOperations: {
    summary: {
      canonicalMembers: number;
      emailVerified: number;
      phoneVerified: number;
      fullyContactVerified: number;
      excluded: number;
      workers: number;
      workersBasic: number;
      workersEmailVerified: number;
      workersPhoneVerified: number;
    };
    verificationStatuses: Distribution;
    referralStatuses: Distribution;
    foundingStatuses: Distribution;
    launchBenefitStatuses: Distribution;
    credentialStatuses: Distribution;
    notificationStatuses: Distribution;
    notificationAttention: Array<{
      id: string;
      templateKey: string;
      channel: string;
      status: string;
      recipientReference: string;
      attemptCount: number;
      maxAttempts: number;
      lastErrorCode: string | null;
      lastErrorSummary: string | null;
      nextAttemptAt: string | Date;
      createdAt: string | Date;
      failedAt: string | Date | null;
      deadLetteredAt: string | Date | null;
    }>;
    emailDeliveryEnabled: boolean;
  };
  foundingStates: Distribution;
  audiences: Distribution;
  intents: Distribution;
  audienceIntents: Array<{
    audienceType: string;
    intent: string | null;
    value: number;
  }>;
  trades: Distribution;
  geography: Array<{ city: string; state: string; value: number }>;
  professionalMix: Distribution;
  workerMix: Distribution;
  availability: Distribution;
  companyMix: Distribution;
  shortages: Distribution;
  laborTypes: Distribution;
  sources: Distribution;
  growth: Array<{ day: string; value: number }>;
  inquiries: Distribution;
  inquiryStatuses: Distribution;
  recentInquiries: Array<{
    id: string;
    type: string;
    name: string;
    email: string;
    phone: string | null;
    organization: string | null;
    role: string | null;
    message: string | null;
    status: string;
    source: string | null;
    landingPage: string | null;
    utmCampaign: string | null;
    partnerType: string | null;
    partnerGeographicFootprint: string | null;
    partnerAudience: string | null;
    partnerAudienceSize: string | null;
    partnerPartnershipInterests: string[] | null;
    partnerProposedRelationship: string | null;
    partnerActivationCapacity: string | null;
    partnerSuccessDefinition: string | null;
    investorType: string | null;
    investorAreasOfInterest: string[] | null;
    investorPreferredNextStep: string | null;
    createdAt: string;
  }>;
  proShop: {
    summary: {
      total: number;
      emailVerified: number;
      pendingEmail: number;
      needsReview: number;
      regulatedReview: number;
      spam: number;
    };
    statuses: Distribution;
    categories: Distribution;
    recent: Array<{
      id: string;
      organizationName: string;
      publicBrandName: string | null;
      contactName: string;
      email: string;
      phone: string;
      primaryCategory: string;
      requestedStates: string[];
      placementInterests: string[];
      fulfillmentCoverage: string;
      affiliateProgramStatus: string;
      requiresManualRegulatoryReview: boolean;
      status: string;
      source: string | null;
      createdAt: string;
    }>;
  };
  recent: Array<{
    id: string;
    name: string;
    email: string;
    audienceType: string;
    intent: string | null;
    city: string;
    state: string;
    trade: string;
    source: string | null;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    profileComplete: boolean;
    createdAt: string;
  }>;
  clients?: {
    summary: {
      total: number;
      today: number;
      sevenDays: number;
      thirtyDays: number;
    };
    consents: {
      serviceMessagesAcknowledged: number;
      emailMarketingOptIn: number;
      smsMarketingOptIn: number;
    };
    launchBenefits: {
      recorded: number;
      reserved: number;
      statuses: Distribution;
    };
    topLocations: Array<{ city: string; state: string; value: number }>;
    recent: Array<{
      id: string;
      name: string;
      email: string;
      phone: string;
      city: string;
      state: string;
      status: string;
      source: string | null;
      utmCampaign: string | null;
      emailMarketingConsent: boolean;
      smsMarketingConsent: boolean;
      launchBenefitStatus: string | null;
      launchBenefitBaseDays: number | null;
      launchBenefitReferralBonusDays: number | null;
      launchBenefitUsageCapCents: number | null;
      launchBenefitUsageConsumedCents: number | null;
      launchBenefitStartsAt: string | null;
      launchBenefitEndsAt: string | null;
      historicalLaunchCreditCents: number;
      historicalLaunchCreditOfferVersion: string;
      createdAt: string;
    }>;
  };
  siteTraffic?: {
    trackingConfigured: boolean;
    lastEventAt: Date | string | null;
    summary?: {
      totalVisits?: number;
      uniqueVisitors?: number;
      today?: number;
      sevenDays?: number;
      thirtyDays?: number;
    };
    topLocations?: Distribution;
    topPages?: Distribution;
    sources?: Distribution;
    growth?: Array<{ day: string; value: number }>;
  };
  reportingTimeZone: string;
  generatedAt: string;
};

export function AdminDashboard() {
  const [auth, setAuth] = useState<'loading' | 'yes' | 'no'>('loading');
  const [configured, setConfigured] = useState(true);
  const [authMode, setAuthMode] = useState('disabled');
  const [role, setRole] = useState<'SUPER_ADMIN' | 'READ_EXPORT' | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [metricsState, setMetricsState] = useState<
    'idle' | 'loading' | 'ready' | 'unavailable' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    setMetricsState('loading');
    try {
      const response = await fetchWithTimeout('/api/admin/metrics', {
        cache: 'no-store',
      });
      if (response.status === 401) {
        setAuth('no');
        setMetricsState('idle');
        return;
      }
      const data = await response.json().catch(() => null);
      if (response.ok && data?.ok) {
        setMetrics(data.metrics);
        setMetricsState('ready');
        setMessage('');
      } else {
        setMetrics(null);
        setMetricsState(response.status === 503 ? 'unavailable' : 'error');
        setMessage(data?.message || 'Metrics are unavailable.');
      }
    } catch (error) {
      setMetricsState('error');
      setMessage(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'Metrics request timed out. Try again.'
          : 'Metrics could not be loaded. Check the connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWithTimeout('/api/admin/session', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        setConfigured(data.configured);
        setAuthMode(data.authMode || 'disabled');
        setRole(data.role || null);
        setDisplayName(data.displayName || '');
        setAuth(data.authenticated ? 'yes' : 'no');
        if (!data.authenticated) {
          const reason = new URLSearchParams(window.location.search).get(
            'error',
          );
          if (reason === 'mfa_required') {
            setMessage('Multi-factor authentication is required.');
          } else if (reason === 'role_missing') {
            setMessage(
              'This Auth0 user is not assigned SUPER_ADMIN or READ_EXPORT.',
            );
          } else if (reason === 'invalid_state') {
            setMessage(
              'Sign-in state was lost. Click Sign in with Auth0 again (do not reuse an old Auth0 tab).',
            );
          } else if (reason === 'invalid_nonce') {
            setMessage(
              'Sign-in security check failed. Confirm the Auth0 Post-Login action and try again.',
            );
          } else if (reason === 'audience_missing') {
            setMessage(
              'Auth0 API is missing. Create an API with Identifier https://admin.labortraders.com (must match ADMIN_AUTH_AUDIENCE).',
            );
          } else if (reason === 'audience_unauthorized') {
            setMessage(
              'Auth0 app is not authorized for the Admin API. In Auth0 → APIs → LaborTrader Admin → Applications, turn ON your Regular Web Application.',
            );
          } else if (reason === 'access_denied') {
            setMessage(
              'Auth0 denied access. Check the API audience, app authorization, and user permissions.',
            );
          } else if (reason === 'rate_limited') {
            setMessage('Too many sign-in attempts. Try again later.');
          } else if (reason) {
            setMessage('Managed sign-in could not be completed.');
          }
        }
        if (data.authenticated) void loadMetrics();
      })
      .catch(() => setAuth('no'));
  }, [loadMetrics]);

  useEffect(() => {
    if (metricsState !== 'ready') return;
    const searchParams = new URLSearchParams(window.location.search);
    const target =
      (searchParams.get('client') && `client-${searchParams.get('client')}`) ||
      (searchParams.get('inquiry') &&
        `inquiry-${searchParams.get('inquiry')}`) ||
      (searchParams.get('pro_shop_partner') &&
        `pro-shop-partner-${searchParams.get('pro_shop_partner')}`);
    if (!target) return;

    const timer = window.setTimeout(() => {
      const row = document.getElementById(target);
      if (!row) return;
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [metricsState]);

  async function login(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetchWithTimeout('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.get('username'),
          password: form.get('password'),
        }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.ok) {
        setAuth('yes');
        setRole(data.role || null);
        setMessage('');
        await loadMetrics();
      } else setMessage(data?.message || 'Invalid credentials.');
    } catch {
      setMessage('Sign-in could not be completed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (authMode === 'managed') {
      window.location.assign('/api/admin/auth/logout');
      return;
    }
    setLoading(true);
    try {
      const response = await fetchWithTimeout('/api/admin/session', {
        method: 'DELETE',
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage('Sign-out could not be completed. Please try again.');
        return;
      }
      setAuth('no');
      setRole(null);
      setDisplayName('');
      setMetrics(null);
      setMetricsState('idle');
      setMessage('');
    } catch {
      setMessage(
        'Sign-out could not be completed. Check your connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (auth === 'loading')
    return (
      <div className="mx-auto mt-24 h-72 max-w-lg animate-pulse bg-card" />
    );

  if (auth === 'no') {
    return (
      <div className="lt-form-panel mx-auto mt-16 max-w-md border border-foreground/14 bg-card p-6 shadow-xl sm:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
          Internal reporting
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em]">
          LaborTrader Admin
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Private pre-registration metrics and lead reporting.
        </p>
        {authMode === 'managed' ? (
          <>
            {configured ? (
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                Sign in with your invited Auth0 administrator account. MFA is
                required.
              </p>
            ) : (
              <p className="mt-5 border-l-2 border-primary pl-3 text-sm font-semibold">
                Managed administrator sign-in is not fully configured. Set Auth0
                environment values and ADMIN_AUTH_MODE=managed.
              </p>
            )}
            {message && (
              <p
                role="alert"
                className="mt-5 text-sm font-semibold text-destructive"
              >
                {message}
              </p>
            )}
            <Button
              type="button"
              disabled={loading || !configured}
              className="mt-7 h-12 w-full rounded-none bg-primary text-xs font-black uppercase tracking-[0.1em] text-primary-foreground"
              onClick={() => {
                window.location.assign('/api/admin/auth/login');
              }}
            >
              {loading ? 'Redirecting…' : 'Sign in with Auth0'}
            </Button>
          </>
        ) : (
          <>
            {!configured && (
              <p className="mt-5 border-l-2 border-primary pl-3 text-sm font-semibold">
                Local administrator access is disabled. Production requires
                invite-only managed authentication with MFA.
              </p>
            )}
            <form onSubmit={login} className="mt-7 space-y-4">
              <label className="block" htmlFor="admin-username">
                <span className="form-label">Username</span>
                <Input
                  id="admin-username"
                  name="username"
                  autoComplete="username"
                  className="form-input mt-2"
                  required
                />
              </label>
              <label className="block" htmlFor="admin-password">
                <span className="form-label">Password</span>
                <Input
                  id="admin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="form-input mt-2"
                  required
                />
              </label>
              {message && (
                <p
                  role="alert"
                  className="text-sm font-semibold text-destructive"
                >
                  {message}
                </p>
              )}
              <Button
                type="submit"
                disabled={loading || !configured}
                className="h-12 w-full rounded-none bg-primary text-xs font-black uppercase tracking-[0.1em] text-primary-foreground"
              >
                {loading ? 'Signing in…' : 'Open dashboard'}
              </Button>
            </form>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="grid min-w-0 gap-6 xl:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="min-w-0 xl:sticky xl:top-6 xl:h-fit">
          <div className="border border-foreground/12 bg-lt-panel p-5 text-foreground">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
              LaborTrader internal
            </p>
            <p className="mt-2 text-xl font-black tracking-[-0.04em]">
              Admin console
            </p>
            <div className="mt-5 flex items-center gap-2 border-t border-background/12 pt-4 text-xs">
              <span
                className={`size-2 rounded-full ${
                  metricsState === 'ready'
                    ? 'bg-emerald-400'
                    : metricsState === 'loading'
                      ? 'animate-pulse bg-amber-300'
                      : 'bg-red-400'
                }`}
              />
              <span className="font-bold">
                {metricsState === 'ready'
                  ? 'Reporting online'
                  : metricsState === 'loading'
                    ? 'Checking systems'
                    : 'Reporting unavailable'}
              </span>
            </div>
          </div>

          <nav
            aria-label="Admin dashboard sections"
            className="grid grid-cols-2 border-x border-b border-foreground/12 bg-card p-2 sm:grid-cols-4 xl:grid-cols-1"
          >
            {[
              { icon: LayoutDashboard, label: 'Overview', href: '#overview' },
              { icon: BarChart3, label: 'Market pulse', href: '#market-pulse' },
              {
                icon: Activity,
                label: 'Website activity',
                href: '#website-activity',
              },
              { icon: Users, label: 'Registrations', href: '#registrations' },
              { icon: UserCheck, label: 'Client leads', href: '#clients' },
              {
                icon: ShieldCheck,
                label: 'Trust & verification',
                href: '#verification',
              },
              {
                icon: Handshake,
                label: 'Partner inquiries',
                href: '#inquiries',
              },
              { icon: ShoppingBag, label: 'Pro Shop', href: '#pro-shop' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={href}
                href={href}
                className="flex min-w-0 items-center gap-2 px-2 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <Icon className="size-3.5 shrink-0 text-primary" />
                {label}
              </a>
            ))}
          </nav>

          <div
            id="exports"
            className="mt-3 border border-foreground/12 bg-card p-4"
          >
            <p className="report-title flex items-center gap-2">
              <Download className="size-3.5 text-primary" /> Exports
            </p>
            <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
              Separate operating files for each signup path. A live database is
              required.
            </p>
            <div className="mt-3 grid gap-2">
              <AdminExportLink
                href="/api/admin/email-followup/export"
                label="Unconfirmed Emails CSV"
                enabled={Boolean(metrics)}
              />
              <AdminExportLink
                href="/api/admin/export"
                label="Marketplace CSV"
                enabled={Boolean(metrics)}
              />
              <AdminExportLink
                href="/api/admin/clients/export"
                label="Client Leads CSV"
                enabled={Boolean(metrics)}
              />
              <AdminExportLink
                href="/api/admin/inquiries/export?type=partner"
                label="Partner Inquiries CSV"
                enabled={Boolean(metrics)}
              />
              <AdminExportLink
                href="/api/admin/inquiries/export?type=investor"
                label="Investor Inquiries CSV"
                enabled={Boolean(metrics)}
              />
              <AdminExportLink
                href="/api/admin/pro-shop/export"
                label="Pro Shop CSV"
                enabled={Boolean(metrics)}
              />
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-5 border-b border-foreground/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                Private operations dashboard
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                Market command center
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Track demand, signups, verification, and commercial inquiries.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {role && (
                <span className="border border-foreground/12 bg-card px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em]">
                  {adminIdentityLabel(displayName, role)}
                </span>
              )}
              <Button
                onClick={loadMetrics}
                disabled={loading}
                variant="outline"
                className="h-10 rounded-none bg-transparent text-xs font-black uppercase tracking-[0.08em]"
              >
                <RefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
              </Button>
              <Button
                onClick={logout}
                disabled={loading}
                variant="outline"
                className="h-10 rounded-none bg-transparent text-xs font-black uppercase tracking-[0.08em]"
              >
                <LogOut /> Sign out
              </Button>
            </div>
          </div>

          {message && metrics && (
            <p
              role="alert"
              className="mb-5 rounded-lg border border-destructive/50 p-4 text-sm text-destructive"
            >
              {message}
            </p>
          )}
          {metrics ? (
            <MetricsView
              metrics={metrics}
              onImported={loadMetrics}
              canImport={role === 'SUPER_ADMIN'}
              canDecideCredentials={role === 'SUPER_ADMIN'}
              canManageAwards={role === 'SUPER_ADMIN'}
              canManageReferrals={role === 'SUPER_ADMIN'}
            />
          ) : (
            <DashboardUnavailable
              state={metricsState}
              message={message}
              onRetry={loadMetrics}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function MetricsView({
  metrics,
  onImported,
  canImport,
  canDecideCredentials,
  canManageAwards,
  canManageReferrals,
}: {
  metrics: Metrics;
  onImported: () => Promise<void>;
  canImport: boolean;
  canDecideCredentials: boolean;
  canManageAwards: boolean;
  canManageReferrals: boolean;
}) {
  const marketplaceSignups = metrics.summary.total + metrics.summary.quickLeads;
  const clientSignups = metrics.clients?.summary.total ?? 0;
  const totalSignups = marketplaceSignups + clientSignups;
  const joinedToday =
    metrics.summary.today +
    metrics.summary.quickToday +
    (metrics.clients?.summary.today ?? 0);
  const joinedThisWeek =
    metrics.summary.sevenDays +
    metrics.summary.quickSevenDays +
    (metrics.clients?.summary.sevenDays ?? 0);
  const joinedThisMonth =
    metrics.summary.thirtyDays +
    metrics.summary.quickThirtyDays +
    (metrics.clients?.summary.thirtyDays ?? 0);
  const combinedLocations = combineSignupLocations(
    metrics.geography,
    metrics.clients?.topLocations || [],
  );
  const inquiryTotal = metrics.inquiries.reduce(
    (total, row) => total + row.value,
    0,
  );
  const inquiryStatusCounts = new Map(
    (metrics.inquiryStatuses || []).map((row) => [
      String(row.label),
      row.value,
    ]),
  );
  const inquiryFollowUpNew = inquiryStatusCounts.get('NEW') ?? 0;
  const inquirySpam = inquiryStatusCounts.get('SPAM') ?? 0;
  const inquiryFollowUpOpen = (metrics.inquiryStatuses || [])
    .filter((row) =>
      ['NEW', 'REVIEWING', 'CONTACTED', 'QUALIFIED'].includes(
        String(row.label),
      ),
    )
    .reduce((total, row) => total + row.value, 0);
  const trafficStatus = siteTrafficStatus(metrics.siteTraffic);
  const notificationStatusCounts = new Map(
    metrics.mvpOperations.notificationStatuses.map((row) => [
      String(row.label),
      row.value,
    ]),
  );
  const notificationAttentionCount =
    (notificationStatusCounts.get('PENDING') ?? 0) +
    (notificationStatusCounts.get('FAILED') ?? 0) +
    (notificationStatusCounts.get('PROCESSING') ?? 0) +
    (notificationStatusCounts.get('DEAD_LETTER') ?? 0);
  const notificationAccepted =
    (notificationStatusCounts.get('ACCEPTED') ?? 0) +
    (notificationStatusCounts.get('DELIVERED') ?? 0);
  const emailDeliveryEnabled =
    metrics.mvpOperations.emailDeliveryEnabled === true;
  const notificationAttention =
    metrics.mvpOperations.notificationAttention ?? [];
  const notificationHealth = notificationDeliveryHealth({
    emailDeliveryEnabled,
    attentionCount: notificationAttentionCount,
    acceptedCount: notificationAccepted,
    hasOutboxRows: metrics.mvpOperations.notificationStatuses.length > 0,
  });
  const primaryCards = [
    {
      label: 'Total signups',
      value: totalSignups,
      detail: `${marketplaceSignups.toLocaleString()} marketplace · ${clientSignups.toLocaleString()} clients`,
      icon: Users,
      featured: true,
    },
    {
      label: 'Joined this week',
      value: joinedThisWeek,
      detail: `${joinedToday.toLocaleString()} joined today`,
      icon: BarChart3,
      featured: false,
    },
    {
      label: 'Fully contact-verified',
      value: metrics.mvpOperations.summary.fullyContactVerified,
      detail: `${metrics.mvpOperations.summary.emailVerified.toLocaleString()} email · ${metrics.mvpOperations.summary.phoneVerified.toLocaleString()} phone (excludes test/spam)`,
      icon: UserCheck,
      featured: false,
    },
    {
      label:
        typeof metrics.summary.markets === 'number'
          ? 'Markets represented'
          : 'Leading signup market',
      value:
        typeof metrics.summary.markets === 'number'
          ? metrics.summary.markets
          : combinedLocations[0]
            ? `${combinedLocations[0].city}, ${combinedLocations[0].state}`
            : 'Not available',
      detail:
        typeof metrics.summary.markets === 'number'
          ? 'Based on detailed registration locations'
          : combinedLocations[0]
            ? `${combinedLocations[0].value.toLocaleString()} marketplace + client signups`
            : 'No location data reported yet',
      icon: MapPin,
      featured: false,
    },
  ];

  const secondaryCards = [
    ['Last 30 days', joinedThisMonth],
    ['Referral signups', metrics.summary.referred],
    [
      'SMS permissions',
      metrics.summary.smsOptIn + metrics.summary.quickSmsOptIn,
    ],
    ['Founding allocations', metrics.summary.foundingMembers],
    ['Client registrations', clientSignups],
    ['New partner/investor inquiries', inquiryFollowUpNew],
    [
      'Pro Shop needs review',
      metrics.proShop.summary.needsReview ??
        metrics.proShop.summary.emailVerified,
    ],
  ] as const;

  return (
    <>
      <section id="overview" className="scroll-mt-8 pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
              Executive overview
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.045em] sm:text-3xl">
              Market pulse
            </h2>
          </div>
          <p className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" /> Live
            database report · {new Date(metrics.generatedAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {primaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.label}
                className={`min-h-44 border p-5 ${
                  card.featured
                    ? 'border-primary/50 bg-lt-panel text-foreground'
                    : 'border-foreground/12 bg-card'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.13em] opacity-60">
                    {card.label}
                  </p>
                  <Icon className="size-4 text-primary" />
                </div>
                <p
                  className={`mt-6 font-black tracking-[-0.06em] ${
                    typeof card.value === 'number' ? 'text-5xl' : 'text-2xl'
                  }`}
                >
                  {typeof card.value === 'number'
                    ? card.value.toLocaleString()
                    : card.value}
                </p>
                <p className="mt-3 text-[11px] font-semibold leading-4 opacity-65">
                  {card.detail}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          {secondaryCards.map(([label, value]) => (
            <article
              key={label}
              className="border border-foreground/10 bg-card px-4 py-3"
            >
              <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-2 text-2xl font-black tracking-[-0.05em]">
                {value.toLocaleString()}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-3 grid gap-px border border-foreground/10 bg-foreground/10 sm:grid-cols-3">
          <SystemStatus
            label="Registration database"
            status="Connected"
            detail="Live reporting query completed"
            healthy
          />
          <SystemStatus
            label="Website analytics"
            status={trafficStatus.label}
            detail={trafficStatus.detail}
            healthy={trafficStatus.receiving}
          />
          <SystemStatus
            label="Notification delivery"
            status={notificationHealth.status}
            detail={notificationHealth.detail}
            healthy={notificationHealth.healthy}
          />
        </div>
      </section>

      <section
        id="market-pulse"
        className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
      >
        <SectionHeading
          eyebrow="Market intelligence"
          title="Where momentum is building"
          description="Signup movement, participant mix, trades, and market concentration from countable registration records."
        />
        <div className="mt-5 grid gap-3 2xl:grid-cols-[1.2fr_.8fr]">
          <GrowthPanel rows={metrics.growth} />
          <TopMarketsPanel rows={combinedLocations} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
          <MetricPanel
            title="Signup roles"
            rows={metrics.audiences.map((row) => ({
              ...row,
              label: audienceLabel(row.label),
            }))}
          />
          <MetricPanel
            title="Primary trades"
            rows={metrics.trades.slice(0, 8).map((row) => ({
              ...row,
              label: row.label ? tradeLabel(row.label) : row.label,
            }))}
          />
          <MetricPanel
            title="Acquisition sources"
            rows={metrics.sources.slice(0, 8)}
          />
          <MetricPanel title="Work / hire intent" rows={metrics.intents} />
        </div>
      </section>

      <section
        id="website-activity"
        className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
      >
        <SectionHeading
          eyebrow="Website activity"
          title="Attention before conversion"
          description="Visits, pages, sources, and visitor geography belong here only when first-party analytics is actually collecting them."
        />
        <div className="mt-5">
          <WebsiteTrafficPanel traffic={metrics.siteTraffic} />
        </div>
      </section>

      <section
        id="verification"
        className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,.5fr)] md:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
              Trust and verification
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
              Participant integrity at a glance
            </h2>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            Email, phone, and email+phone cards count verified timestamps and
            exclude test, spam, duplicate, fraudulent, and deleted records.
            Contact lifecycle below is by current status — people can move past
            Fully Contact Verified into Launch Invited / Activated, so that
            status row can be lower than the email+phone card.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-5">
          {[
            [
              'Canonical records',
              metrics.mvpOperations.summary.canonicalMembers,
            ],
            ['Email verified', metrics.mvpOperations.summary.emailVerified],
            ['Phone verified', metrics.mvpOperations.summary.phoneVerified],
            [
              'Email + phone verified',
              metrics.mvpOperations.summary.fullyContactVerified,
            ],
            ['Excluded (test/spam/etc.)', metrics.mvpOperations.summary.excluded],
          ].map(([label, value]) => (
            <div key={label} className="border border-foreground/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-3 text-3xl font-black tracking-[-0.05em]">
                {Number(value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            ['Workers', metrics.mvpOperations.summary.workers],
            ['Workers · basic only', metrics.mvpOperations.summary.workersBasic],
            [
              'Workers · email verified',
              metrics.mvpOperations.summary.workersEmailVerified,
            ],
            [
              'Workers · phone verified',
              metrics.mvpOperations.summary.workersPhoneVerified,
            ],
          ].map(([label, value]) => (
            <div key={label} className="border border-foreground/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                {label}
              </p>
              <p className="mt-3 text-2xl font-black tracking-[-0.05em]">
                {Number(value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <MetricPanel
          title="Contact lifecycle (excludes test/spam)"
          rows={metrics.mvpOperations.verificationStatuses.map((row) => ({
            ...row,
            label: humanize(row.label),
          }))}
        />
        <MetricPanel
          title="Credential review"
          rows={metrics.mvpOperations.credentialStatuses.map((row) => ({
            ...row,
            label: humanize(row.label),
          }))}
        />
        <MetricPanel
          title="Notification outbox"
          rows={metrics.mvpOperations.notificationStatuses.map((row) => ({
            ...row,
            label: humanize(row.label),
          }))}
        />
        <MetricPanel
          title="Referral lifecycle"
          rows={metrics.mvpOperations.referralStatuses.map((row) => ({
            ...row,
            label: humanize(row.label),
          }))}
        />
      </section>

      <NotificationDeliveryReviewPanel
        emailDeliveryEnabled={emailDeliveryEnabled}
        statuses={metrics.mvpOperations.notificationStatuses}
        attention={notificationAttention}
      />

      <AdminCredentialReviewPanel canDecide={canDecideCredentials} />

      <AdminReferralPanel canManage={canManageReferrals} />

      <AdminAwardReconciliationPanel canManage={canManageAwards} />

      <section className="mt-3 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        <MetricPanel
          title="Founding allocation lifecycle"
          rows={metrics.mvpOperations.foundingStatuses.map((row) => ({
            ...row,
            label: humanize(row.label),
          }))}
        />
        <MetricPanel
          title="Member launch benefits"
          rows={metrics.mvpOperations.launchBenefitStatuses.map((row) => ({
            ...row,
            label: humanize(row.label),
          }))}
        />
        <MetricPanel
          title="Legacy contractor entitlements by state"
          rows={metrics.foundingStates}
        />
      </section>

      <section
        id="registrations"
        className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
      >
        <SectionHeading
          eyebrow="Registration intelligence"
          title="Who is joining and what they need"
          description="Profile depth and operational demand signals from the detailed registration flow."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <MetricPanel
            title="Professional status"
            rows={metrics.professionalMix.map((row) => ({
              ...row,
              label: row.label ? professionalStatusLabel(row.label) : row.label,
            }))}
            compact
          />
          <MetricPanel
            title="Worker experience"
            rows={metrics.workerMix.map((row) => ({
              ...row,
              label: row.label ? experienceLabel(row.label) : row.label,
            }))}
            compact
          />
          <MetricPanel
            title="Worker availability"
            rows={metrics.availability.map((row) => ({
              ...row,
              label: row.label ? availabilityLabel(row.label) : row.label,
            }))}
            compact
          />
          <MetricPanel
            title="Business size"
            rows={metrics.companyMix.map((row) => ({
              ...row,
              label: row.label ? companySizeLabel(row.label) : row.label,
            }))}
            compact
          />
          <MetricPanel
            title="Labor shortage frequency"
            rows={metrics.shortages.map((row) => ({
              ...row,
              label: row.label ? shortageFrequencyLabel(row.label) : row.label,
            }))}
            compact
          />
          <MetricPanel
            title="Requested labor types"
            rows={metrics.laborTypes.map((row) => ({
              ...row,
              label: row.label ? laborTypeLabel(row.label) : row.label,
            }))}
            compact
          />
          <MetricPanel
            title="Intent by audience"
            rows={metrics.audienceIntents.map((row) => ({
              label: `${audienceLabel(row.audienceType)} · ${row.intent || 'Not completed'}`,
              value: row.value,
            }))}
            compact
          />
        </div>
      </section>

      <section
        id="clients"
        className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
      >
        <SectionHeading
          eyebrow="Client demand"
          title="People looking to hire"
          description="Client preregistrations are tracked as a separate demand-side pipeline, not mixed into worker and provider records."
        />
        <div className="mt-5">
          <ClientPipelinePanel clients={metrics.clients} />
        </div>
      </section>

      <section
        id="inquiries"
        className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
      >
        <SectionHeading
          eyebrow="Commercial pipeline"
          title="Partners and investors"
          description="Separate from marketplace registrations and organized for follow-up."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <MetricPanel
            title="Inquiry mix"
            rows={metrics.inquiries.map((row) => ({
              ...row,
              label: humanize(row.label),
            }))}
            compact
          />
          <MetricPanel
            title="Inquiry status"
            rows={(metrics.inquiryStatuses || []).map((row) => ({
              ...row,
              label: humanize(row.label),
            }))}
            compact
          />
          <PipelineSummary
            title="Follow-up queue (New only)"
            total={inquiryFollowUpNew}
            subtitle={`${inquiryFollowUpOpen.toLocaleString()} open (New/Reviewing/Contacted/Qualified) · ${inquirySpam.toLocaleString()} spam excluded from this queue`}
            detail={`Large number is New inquiries that need first contact (${inquiryFollowUpNew.toLocaleString()}). Non-spam partner/investor records: ${inquiryTotal.toLocaleString()}. The table below lists non-spam inquiries only.`}
            icon={Handshake}
          />
        </div>
        <div className="mt-3">
          <RecentInquiryTable rows={metrics.recentInquiries} />
        </div>
      </section>

      <section
        id="pro-shop"
        className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
      >
        <SectionHeading
          eyebrow="Pro Shop pipeline"
          title="Provider applications"
          description="Review queue is email-verified applications waiting on manual review. Spam is excluded from the table."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <PipelineSummary
            title="Email-verified, awaiting review"
            total={metrics.proShop.summary.needsReview}
            subtitle={`${metrics.proShop.summary.needsReview.toLocaleString()} status EMAIL_VERIFIED_PENDING_REVIEW · ${(metrics.proShop.summary.spam ?? 0).toLocaleString()} spam excluded`}
            detail={`Large number counts applications in EMAIL_VERIFIED_PENDING_REVIEW only. Table below shows recent non-spam applications across statuses (not only that queue). ${metrics.proShop.summary.emailVerified.toLocaleString()} have verified email · ${metrics.proShop.summary.pendingEmail.toLocaleString()} awaiting email · ${metrics.proShop.summary.regulatedReview.toLocaleString()} need regulated-category review · ${metrics.proShop.summary.total.toLocaleString()} total including spam.`}
            icon={ShoppingBag}
          />
          <MetricPanel
            title="Application status (all)"
            rows={metrics.proShop.statuses.map((row) => ({
              ...row,
              label: humanize(row.label),
            }))}
            compact
          />
          <MetricPanel
            title="Provider categories (non-spam)"
            rows={metrics.proShop.categories.map((row) => ({
              ...row,
              label: humanize(row.label),
            }))}
            compact
          />
        </div>
        <div className="mt-3">
          <ProShopPartnerTable
            rows={metrics.proShop.recent}
            summary={metrics.proShop.summary}
          />
        </div>
      </section>

      <section
        className={
          canImport
            ? 'mt-10 grid gap-3 border-t border-foreground/12 pt-8 xl:grid-cols-[1.45fr_.55fr]'
            : 'mt-10 border-t border-foreground/12 pt-8'
        }
      >
        <RecentTable rows={metrics.recent} />
        {canImport && <ImportPanel onImported={onImported} />}
      </section>

      <p className="mt-4 text-right text-[10px] font-semibold text-muted-foreground">
        Generated {new Date(metrics.generatedAt).toLocaleString()} · Reporting
        time zone: {metrics.reportingTimeZone} · Website analytics{' '}
        {trafficStatus.label.toLowerCase()}
      </p>
    </>
  );
}

function AdminExportLink({
  href,
  label,
  enabled,
}: {
  href: string;
  label: string;
  enabled: boolean;
}) {
  if (!enabled) {
    return (
      <span
        aria-disabled="true"
        className="flex cursor-not-allowed items-center justify-between border border-foreground/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.07em] text-muted-foreground opacity-55"
      >
        {label} <Download className="size-3.5" />
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="flex items-center justify-between border border-foreground/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.07em] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      {label} <Download className="size-3.5" />
    </Link>
  );
}

function DashboardUnavailable({
  state,
  message,
  onRetry,
}: {
  state: 'idle' | 'loading' | 'ready' | 'unavailable' | 'error';
  message: string;
  onRetry: () => Promise<void>;
}) {
  const checking = state === 'idle' || state === 'loading';
  const unavailable = state === 'unavailable';
  return (
    <div id="overview" className="scroll-mt-8 pt-6">
      <section className="border border-foreground/12 bg-card">
        <div className="grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <div className="flex h-full min-h-32 items-center justify-center bg-lt-panel p-7 text-primary">
            {checking ? (
              <RefreshCw className="size-8 animate-spin" />
            ) : (
              <WifiOff className="size-8" />
            )}
          </div>
          <div className="p-5 sm:p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
              Infrastructure status
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
              {checking
                ? 'Loading operating data'
                : unavailable
                  ? 'Registration database is not connected'
                  : 'Operating data could not be loaded'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {checking
                ? 'The dashboard is checking the live reporting services now.'
                : unavailable
                  ? 'Connect the registration database to load reporting.'
                  : message || 'Reporting could not be loaded. Try again.'}
            </p>
          </div>
          {!checking && (
            <div className="p-5 md:p-7">
              <Button
                onClick={() => void onRetry()}
                variant="outline"
                className="h-11 rounded-none bg-transparent text-xs font-black uppercase tracking-[0.08em]"
              >
                <RefreshCw /> Try again
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          'Total signups',
          'Joined this week',
          'Contact verified',
          'Top market',
        ].map((label) => (
          <article
            key={label}
            className="min-h-36 border border-foreground/10 bg-card p-5"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-5 text-xl font-black text-muted-foreground/35">
              Not available
            </p>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Awaiting live data
            </p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-3 lg:grid-cols-2">
        <article className="report-panel">
          <div className="flex items-start gap-4">
            <Database className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="report-title">Data workspace ready</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Connected reporting shows signup growth, markets, verification,
                inquiries, and Pro Shop applications.
              </p>
            </div>
          </div>
        </article>
        <article className="report-panel border-dashed">
          <div className="flex items-start gap-4">
            <Activity className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="report-title">Website analytics</p>
                <span className="bg-foreground/8 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-muted-foreground">
                  Status unavailable
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Visit totals and locations will appear when reporting is
                available.
              </p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,.5fr)] md:items-end">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
          {title}
        </h2>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function SystemStatus({
  label,
  status,
  detail,
  healthy,
}: {
  label: string;
  status: string;
  detail: string;
  healthy: boolean;
}) {
  return (
    <div className="bg-card p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2 text-xs font-black">
        <span
          className={`size-2 rounded-full ${healthy ? 'bg-emerald-500' : 'bg-amber-500'}`}
        />
        {status}
      </p>
      <p className="mt-1 text-[10px] leading-4 text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

function notificationDeliveryHealth({
  emailDeliveryEnabled,
  attentionCount,
  acceptedCount,
  hasOutboxRows,
}: {
  emailDeliveryEnabled: boolean;
  attentionCount: number;
  acceptedCount: number;
  hasOutboxRows: boolean;
}): { status: string; detail: string; healthy: boolean } {
  if (!emailDeliveryEnabled) {
    return {
      status: attentionCount
        ? `${attentionCount.toLocaleString()} need review`
        : 'Delivery paused',
      detail: hasOutboxRows
        ? 'FEATURE_EMAIL_DELIVERY is off — pending/failed rows stay queued until dispatch is enabled'
        : 'FEATURE_EMAIL_DELIVERY is off — no outbox rows yet',
      healthy: attentionCount === 0,
    };
  }
  if (attentionCount > 0) {
    return {
      status: `${attentionCount.toLocaleString()} need attention`,
      detail: `${acceptedCount.toLocaleString()} accepted · review pending, failed, processing, and dead-letter rows below`,
      healthy: false,
    };
  }
  if (acceptedCount > 0 || hasOutboxRows) {
    return {
      status: 'Queue clear',
      detail: `${acceptedCount.toLocaleString()} accepted · no pending or failed outbox rows`,
      healthy: true,
    };
  }
  return {
    status: 'Awaiting traffic',
    detail: 'Delivery enabled — no outbox rows yet',
    healthy: true,
  };
}

function NotificationDeliveryReviewPanel({
  emailDeliveryEnabled,
  statuses,
  attention,
}: {
  emailDeliveryEnabled: boolean;
  statuses: Distribution;
  attention: Metrics['mvpOperations']['notificationAttention'];
}) {
  const statusCounts = new Map(
    statuses.map((row) => [String(row.label), row.value]),
  );
  const pending = statusCounts.get('PENDING') ?? 0;
  const failed = statusCounts.get('FAILED') ?? 0;
  const processing = statusCounts.get('PROCESSING') ?? 0;
  const deadLetter = statusCounts.get('DEAD_LETTER') ?? 0;
  const accepted =
    (statusCounts.get('ACCEPTED') ?? 0) +
    (statusCounts.get('DELIVERED') ?? 0);
  const suppressed = statusCounts.get('SUPPRESSED') ?? 0;

  return (
    <section
      id="notification-delivery"
      className="mt-10 scroll-mt-8 border-t border-foreground/12 pt-8"
    >
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,.5fr)] md:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
            Notification delivery
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
            Outbox rows that need review
          </h2>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Recipients are masked. Email intake is drained by cron when
          FEATURE_EMAIL_DELIVERY is on. Phone OTP SMS is sent by Twilio Verify:
          Accepted when Twilio takes the send, Delivered after Verify approval
          callback, Failed on Verify terminal errors. Suppressed phone-confirmed
          rows mean no separate confirmation SMS channel yet. Dead-letter email
          rows stay visible for operator review.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
        {[
          ['Delivery flag', emailDeliveryEnabled ? 'On' : 'Off'],
          ['Pending', pending],
          ['Failed', failed],
          ['Processing', processing],
          ['Dead letter', deadLetter],
          ['Accepted', accepted],
        ].map(([label, value]) => (
          <div key={label} className="border border-foreground/10 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-3 text-2xl font-black tracking-[-0.05em]">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Suppressed: {suppressed.toLocaleString()} · Showing up to{' '}
        {attention.length.toLocaleString()} newest attention rows
      </p>

      <article className="report-panel mt-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Error</TableHead>
              <TableHead>Next attempt</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attention.length ? (
              attention.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-bold">{humanize(row.status)}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {row.id.slice(0, 8)}…
                    </p>
                  </TableCell>
                  <TableCell className="text-xs">{row.templateKey}</TableCell>
                  <TableCell className="text-xs">
                    {humanize(row.channel)}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.recipientReference}
                  </TableCell>
                  <TableCell className="text-xs">
                    {row.attemptCount}/{row.maxAttempts}
                  </TableCell>
                  <TableCell className="max-w-[16rem] text-xs">
                    {row.lastErrorCode || row.lastErrorSummary ? (
                      <>
                        <p className="font-bold">
                          {row.lastErrorCode || 'Error'}
                        </p>
                        {row.lastErrorSummary ? (
                          <p className="mt-1 text-muted-foreground">
                            {row.lastErrorSummary}
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {formatAdminTimestamp(row.nextAttemptAt)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {formatAdminTimestamp(row.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No pending, failed, processing, or dead-letter rows.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </article>
    </section>
  );
}

function formatAdminTimestamp(value: string | Date | null | undefined) {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function TopMarketsPanel({ rows }: { rows: Metrics['geography'] }) {
  const visible = rows.slice(0, 10);
  const max = Math.max(...visible.map((row) => row.value), 1);
  return (
    <article className="report-panel">
      <div className="flex items-center justify-between gap-3">
        <p className="report-title">Top signup locations</p>
        <MapPin className="size-4 text-primary" />
      </div>
      <div className="mt-5 space-y-3">
        {visible.length ? (
          visible.map((row, index) => (
            <div key={`${row.city}-${row.state}`}>
              <div className="mb-1.5 flex items-center justify-between gap-4 text-[11px]">
                <span className="font-bold">
                  <span className="mr-2 text-muted-foreground">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {row.city}, {row.state}
                </span>
                <span className="font-black">{row.value.toLocaleString()}</span>
              </div>
              <div className="h-1.5 bg-foreground/8">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No detailed signup locations reported yet.
          </p>
        )}
      </div>
    </article>
  );
}

function siteTrafficStatus(traffic: Metrics['siteTraffic']) {
  if (!traffic?.trackingConfigured) {
    return {
      label: 'Not configured',
      detail: 'No visit counts are being estimated',
      receiving: false,
    };
  }
  if (!traffic.lastEventAt) {
    return {
      label: 'Configured · waiting for first visit',
      detail: 'Tracking is ready; no visit event has been received yet',
      receiving: false,
    };
  }
  const receivedAt = new Date(traffic.lastEventAt);
  return {
    label: 'Receiving data',
    detail: Number.isNaN(receivedAt.getTime())
      ? 'A visit event has been received'
      : `Last event ${receivedAt.toLocaleString()}`,
    receiving: true,
  };
}

function WebsiteTrafficPanel({ traffic }: { traffic: Metrics['siteTraffic'] }) {
  if (!traffic?.trackingConfigured) {
    return (
      <article className="border border-dashed border-foreground/25 bg-card p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-[auto_minmax(0,1fr)] md:items-start">
          <div className="flex size-12 items-center justify-center bg-lt-panel text-primary">
            <Activity className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black tracking-[-0.035em]">
                Website tracking is not configured
              </h3>
              <span className="bg-amber-500/12 px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-amber-300">
                Not configured
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Connect website analytics to see visits, popular pages, referral
              sources, and approximate locations.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
              {['Visits', 'Unique visitors', 'Top page', 'Top location'].map(
                (label) => (
                  <div key={label} className="border border-foreground/10 p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.08em] text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-black text-muted-foreground/40">
                      Not available
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  const summary = traffic.summary || {};
  const cards = [
    ['Total visits', summary.totalVisits],
    ['Unique visitors', summary.uniqueVisitors],
    ['Visits today', summary.today],
    ['Last 30 days', summary.thirtyDays],
  ] as const;
  const status = siteTrafficStatus(traffic);
  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 border border-foreground/10 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs font-black">
          <span
            className={`size-2 rounded-full ${status.receiving ? 'bg-emerald-500' : 'bg-amber-500'}`}
          />
          {status.label}
        </p>
        <p className="text-[10px] font-semibold text-muted-foreground">
          {status.detail}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {cards.map(([label, value]) => (
          <article key={label} className="metric-card">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-4 text-3xl font-black tracking-[-0.05em]">
              {typeof value === 'number'
                ? value.toLocaleString()
                : 'Not available'}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <GrowthPanel
          title="Pageviews · last 30 days"
          rows={traffic.growth || []}
        />
        <MetricPanel
          title="Visitor locations · unique visitors, 30 days"
          rows={traffic.topLocations || []}
        />
        <MetricPanel
          title="Popular pages · pageviews, 30 days"
          rows={traffic.topPages || []}
        />
        <MetricPanel
          title="Traffic sources · unique visitors, 30 days"
          rows={traffic.sources || []}
        />
      </div>
    </div>
  );
}

function PipelineSummary({
  title,
  total,
  subtitle,
  detail,
  icon: Icon,
}: {
  title: string;
  total: number;
  subtitle: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <article className="report-panel bg-lt-panel text-foreground">
      <div className="flex items-start justify-between gap-3">
        <p className="report-title opacity-65">{title}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-6 text-5xl font-black tracking-[-0.06em]">
        {total.toLocaleString()}
      </p>
      <p className="mt-2 text-xs font-bold text-primary">{subtitle}</p>
      <p className="mt-4 text-[11px] leading-5 opacity-60">{detail}</p>
    </article>
  );
}

function ClientPipelinePanel({ clients }: { clients: Metrics['clients'] }) {
  if (!clients) {
    return (
      <article className="report-panel border-dashed">
        <p className="report-title">Client reporting unavailable</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Client reporting was not returned. Refresh to try again.
        </p>
      </article>
    );
  }

  const consentRows: Distribution = [
    {
      label: 'Service messages acknowledged',
      value: clients.consents.serviceMessagesAcknowledged,
    },
    {
      label: 'Email marketing opt-in',
      value: clients.consents.emailMarketingOptIn,
    },
    {
      label: 'SMS marketing opt-in',
      value: clients.consents.smsMarketingOptIn,
    },
  ];
  const locationRows: Distribution = clients.topLocations.map((row) => ({
    label: `${row.city}, ${row.state}`,
    value: row.value,
  }));
  const reservedBenefits = clients.launchBenefits.reserved;
  const recordedBenefits = clients.launchBenefits.recorded;
  const statusMap = new Map(
    (clients.launchBenefits.statuses || []).map((row) => [
      String(row.label),
      row.value,
    ]),
  );
  const launchBenefitRows: Distribution = [
    {
      label: 'Clients with a benefit record',
      value: recordedBenefits,
    },
    {
      label: 'Reserved',
      value: statusMap.get('RESERVED') ?? reservedBenefits,
    },
    {
      label: 'Active',
      value: statusMap.get('ACTIVE') ?? 0,
    },
    {
      label: 'Exhausted / expired / revoked',
      value:
        (statusMap.get('EXHAUSTED') ?? 0) +
        (statusMap.get('EXPIRED') ?? 0) +
        (statusMap.get('REVOKED') ?? 0),
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {[
          ['Total clients', clients.summary.total],
          ['Joined today', clients.summary.today],
          ['Last 7 days', clients.summary.sevenDays],
          ['Last 30 days', clients.summary.thirtyDays],
          ['Reserved launch benefits', reservedBenefits],
        ].map(([label, value]) => (
          <article key={String(label)} className="metric-card">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-4 text-3xl font-black tracking-[-0.05em]">
              {Number(value).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <MetricPanel title="Client locations" rows={locationRows} />
        <MetricPanel title="Client permissions" rows={consentRows} />
        <MetricPanel title="Client launch benefits" rows={launchBenefitRows} />
      </div>
      <article className="report-panel mt-3 min-w-0 max-w-full overflow-hidden">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <p className="report-title">Recent client registrations</p>
          <p className="text-[10px] font-semibold text-muted-foreground">
            Contact details masked in overview
          </p>
        </div>
        <Table
          containerLabel="Recent client registrations. Scroll horizontally for additional columns."
          className="min-w-[760px]"
        >
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Launch benefit</TableHead>
              <TableHead>Historical offer snapshot</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.recent.length ? (
              clients.recent.map((row) => (
                <TableRow
                  key={row.id}
                  id={`client-${row.id}`}
                  tabIndex={-1}
                  className="scroll-mt-24 outline-none focus:bg-primary/12 focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  <TableCell>
                    <p className="font-bold">{row.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {maskEmail(row.email)} · {maskPhone(row.phone)}
                    </p>
                  </TableCell>
                  <TableCell>
                    {row.city}, {row.state}
                  </TableCell>
                  <TableCell>{humanize(row.status)}</TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold">
                      Email {row.emailMarketingConsent ? 'yes' : 'no'} · SMS{' '}
                      {row.smsMarketingConsent ? 'yes' : 'no'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.launchBenefitStatus ? (
                      <span className="text-[10px] font-bold">
                        {humanize(row.launchBenefitStatus)} ·{' '}
                        {row.launchBenefitBaseDays ?? 0} base days
                        {(row.launchBenefitReferralBonusDays ?? 0) > 0
                          ? ` + ${row.launchBenefitReferralBonusDays} referral days`
                          : ''}
                        <br />
                        {formatCurrency(
                          row.launchBenefitUsageConsumedCents ?? 0,
                        )}{' '}
                        used of{' '}
                        {formatCurrency(row.launchBenefitUsageCapCents ?? 0)}
                      </span>
                    ) : (
                      'Not recorded'
                    )}
                  </TableCell>
                  <TableCell>
                    {row.historicalLaunchCreditCents > 0
                      ? `${formatCurrency(row.historicalLaunchCreditCents)} · ${row.historicalLaunchCreditOfferVersion}`
                      : 'None'}
                  </TableCell>
                  <TableCell>
                    {row.utmCampaign || row.source || 'direct'}
                  </TableCell>
                  <TableCell>
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No client registrations yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </article>
    </div>
  );
}

function MetricPanel({
  title,
  rows,
  compact = false,
}: {
  title: string;
  rows: Distribution;
  compact?: boolean;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <article className="report-panel">
      <p className="report-title">{title}</p>
      <div className={compact ? 'mt-5 space-y-3' : 'mt-6 space-y-4'}>
        {rows.length ? (
          rows.map((row) => (
            <div key={row.label || 'unknown'}>
              <div className="mb-1.5 flex justify-between gap-4 text-[11px] font-bold">
                <span>{row.label || 'Not provided'}</span>
                <span>{row.value}</span>
              </div>
              <div className="h-1.5 bg-foreground/8">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.max(3, (row.value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No data yet.</p>
        )}
      </div>
    </article>
  );
}

function GrowthPanel({
  rows,
  title = 'Detailed signup growth · 30 days',
}: {
  rows: Array<{ day: string; value: number }>;
  title?: string;
}) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <article className="report-panel">
      <p className="report-title">{title}</p>
      <div className="mt-8 flex h-44 items-end gap-1.5 border-b border-foreground/12">
        {rows.length ? (
          rows.map((row) => (
            <div
              key={row.day}
              className="group relative min-w-1 flex-1 bg-primary/80 transition-colors hover:bg-primary"
              style={{ height: `${Math.max(4, (row.value / max) * 100)}%` }}
              title={`${row.day}: ${row.value}`}
            >
              <span className="sr-only">
                {row.day}: {row.value}
              </span>
            </div>
          ))
        ) : (
          <p className="self-center text-sm text-muted-foreground">
            No growth data yet.
          </p>
        )}
      </div>
    </article>
  );
}

function RecentTable({ rows }: { rows: Metrics['recent'] }) {
  return (
    <article className="report-panel min-w-0 max-w-full overflow-hidden">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <p className="report-title">Recent registrations</p>
        <p className="text-[10px] font-semibold text-muted-foreground">
          Basic signups appear immediately · email/phone status per row
        </p>
      </div>
      <Table
        containerLabel="Recent marketplace registrations. Scroll horizontally for verification columns."
        className="min-w-[920px]"
      >
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Market</TableHead>
            <TableHead>Trade</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <p className="font-bold">{row.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {row.email.includes('@') ? maskEmail(row.email) : row.email}
                    {' · '}
                    {humanize(row.status)}
                  </p>
                </TableCell>
                <TableCell>{humanize(row.audienceType)}</TableCell>
                <TableCell>
                  <span className="text-[10px] font-bold">
                    {row.profileComplete ? 'Full' : 'Basic'}
                    {row.intent ? ` · ${humanize(row.intent)}` : ''}
                  </span>
                </TableCell>
                <TableCell>
                  <VerificationBadge verified={row.emailVerified} />
                </TableCell>
                <TableCell>
                  <VerificationBadge verified={row.phoneVerified} />
                </TableCell>
                <TableCell>
                  {row.city}, {row.state}
                </TableCell>
                <TableCell>{tradeLabel(row.trade)}</TableCell>
                <TableCell>{row.source || 'direct'}</TableCell>
                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={9}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No marketplace registrations yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </article>
  );
}

function VerificationBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`text-[10px] font-black uppercase tracking-[0.08em] ${
        verified ? 'text-emerald-700' : 'text-amber-700'
      }`}
    >
      {verified ? 'Verified' : 'Pending'}
    </span>
  );
}

function combineSignupLocations(
  marketplace: Metrics['geography'],
  clients: NonNullable<Metrics['clients']>['topLocations'],
) {
  const totals = new Map<
    string,
    { city: string; state: string; value: number }
  >();
  for (const row of [...marketplace, ...clients]) {
    const city = row.city.trim();
    const state = row.state.trim().toUpperCase();
    if (!city || !state) continue;
    const key = `${city.toLocaleLowerCase('en-US')}|${state}`;
    const current = totals.get(key);
    if (current) current.value += row.value;
    else totals.set(key, { city, state, value: row.value });
  }
  return [...totals.values()].sort((a, b) => b.value - a.value);
}

function audienceLabel(value: string | null) {
  const labels: Record<string, string> = {
    WORKER: 'Workers',
    CONTRACTOR: 'Independent contractors',
    BUSINESS: 'Service businesses',
    HIRING_FIRM: 'Hiring organizations',
    CLIENT: 'Clients',
  };
  return value ? labels[value] || humanize(value) : 'Not provided';
}

function adminIdentityLabel(
  displayName: string,
  role: 'SUPER_ADMIN' | 'READ_EXPORT',
) {
  const roleLabel = role === 'SUPER_ADMIN' ? 'Super Admin' : 'Read & Export';
  const normalizedName = displayName
    .replaceAll(/[_-]+/gu, ' ')
    .trim()
    .toLocaleLowerCase('en-US');
  return !normalizedName ||
    normalizedName === roleLabel.toLocaleLowerCase('en-US')
    ? roleLabel
    : `${displayName} · ${roleLabel}`;
}

function humanize(value: string | null) {
  if (!value) return 'Not provided';
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function maskEmail(value: string) {
  const [local, domain] = value.split('@');
  if (!local || !domain) return '••••';
  return `${local.slice(0, 1)}•••@${domain}`;
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 4 ? `••• ••• ${digits.slice(-4)}` : '••••';
}

function ProShopPartnerTable({
  rows,
  summary,
}: {
  rows: Metrics['proShop']['recent'];
  summary: Metrics['proShop']['summary'];
}) {
  return (
    <article className="report-panel min-w-0 max-w-full overflow-hidden">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="report-title">
            Pro Shop applications in review (spam excluded)
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {summary.needsReview ?? summary.emailVerified} need manual review ·{' '}
            {summary.emailVerified} email verified · {summary.pendingEmail}{' '}
            awaiting email · {summary.spam ?? 0} spam kept out of this table
          </p>
        </div>
      </div>
      <Table
        containerLabel="Recent Pro Shop partner applications. Scroll horizontally for additional columns."
        className="min-w-[1080px]"
      >
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>States</TableHead>
            <TableHead>Placement interest</TableHead>
            <TableHead>Affiliate readiness</TableHead>
            <TableHead>Pipeline</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                id={`pro-shop-partner-${row.id}`}
                tabIndex={-1}
                className="scroll-mt-24 outline-none focus:bg-primary/12 focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <TableCell className="max-w-48 align-top">
                  <p className="font-bold">
                    {row.publicBrandName || row.organizationName}
                  </p>
                  {row.publicBrandName && (
                    <p className="text-[10px] text-muted-foreground">
                      {row.organizationName}
                    </p>
                  )}
                </TableCell>
                <TableCell className="max-w-48 align-top">
                  <p className="font-bold">{row.contactName}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {row.email}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {row.phone}
                  </p>
                </TableCell>
                <TableCell className="max-w-44 align-top text-xs">
                  {humanize(row.primaryCategory)}
                  {row.requiresManualRegulatoryReview && (
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.06em] text-primary">
                      Manual regulatory review
                    </p>
                  )}
                </TableCell>
                <TableCell className="max-w-44 whitespace-normal align-top text-xs">
                  {row.requestedStates.join(' · ')}
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {humanize(row.fulfillmentCoverage)} fulfillment
                  </p>
                </TableCell>
                <TableCell className="max-w-56 whitespace-normal align-top text-xs leading-5">
                  {row.placementInterests.map(humanize).join(' · ')}
                </TableCell>
                <TableCell className="max-w-40 align-top text-xs">
                  {humanize(row.affiliateProgramStatus)}
                </TableCell>
                <TableCell className="max-w-44 align-top">
                  <p className="font-bold">{humanize(row.status)}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {row.source || 'direct'}
                  </p>
                </TableCell>
                <TableCell className="align-top">
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No Pro Shop partner applications yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </article>
  );
}

function RecentInquiryTable({ rows }: { rows: Metrics['recentInquiries'] }) {
  return (
    <article className="report-panel min-w-0 max-w-full overflow-hidden">
      <p className="report-title mb-4">
        Recent partner & investor inquiries (spam excluded)
      </p>
      <Table
        containerLabel="Recent partner and investor inquiries. Scroll horizontally for additional columns."
        className="min-w-[1180px]"
      >
        <TableHeader>
          <TableRow>
            <TableHead>Contact</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Inquiry profile</TableHead>
            <TableHead>Reach / interest</TableHead>
            <TableHead>Proposed next step</TableHead>
            <TableHead>Activation / success</TableHead>
            <TableHead>Pipeline</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => {
              const isPartner = row.type === 'PARTNERSHIP';
              const profile = isPartner ? row.partnerType : row.investorType;
              const reach = isPartner
                ? [
                    row.partnerGeographicFootprint,
                    row.partnerAudience,
                    row.partnerAudienceSize,
                    row.partnerPartnershipInterests?.map(humanize).join(' · '),
                  ]
                    .filter(Boolean)
                    .join(' · ')
                : row.investorAreasOfInterest?.map(humanize).join(' · ');
              const nextStep = isPartner
                ? row.partnerProposedRelationship
                : row.investorPreferredNextStep;
              const activation = isPartner
                ? [row.partnerActivationCapacity, row.partnerSuccessDefinition]
                    .filter(Boolean)
                    .join(' · ')
                : row.message;
              return (
                <TableRow
                  key={row.id}
                  id={`inquiry-${row.id}`}
                  tabIndex={-1}
                  className="scroll-mt-24 outline-none focus:bg-primary/12 focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  <TableCell className="max-w-48 align-top">
                    <p className="font-bold">{row.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {maskEmail(row.email)}
                    </p>
                    {row.phone && (
                      <p className="text-[10px] text-muted-foreground">
                        {maskPhone(row.phone)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="max-w-44 align-top">
                    <p className="font-bold">
                      {row.organization || 'Not provided'}
                    </p>
                    {row.role && (
                      <p className="text-[10px] text-muted-foreground">
                        {row.role}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="max-w-40 align-top">
                    <p className="text-[10px] font-black uppercase tracking-[0.08em] text-primary">
                      {humanize(row.type)}
                    </p>
                    <p className="mt-1 text-xs">{humanize(profile)}</p>
                  </TableCell>
                  <TableCell className="max-w-56 whitespace-normal align-top text-xs leading-5">
                    {reach || 'Not provided'}
                  </TableCell>
                  <TableCell className="max-w-64 whitespace-normal align-top text-xs leading-5">
                    {nextStep
                      ? isPartner
                        ? nextStep
                        : humanize(nextStep)
                      : 'Not provided'}
                  </TableCell>
                  <TableCell className="max-w-64 whitespace-normal align-top text-xs leading-5">
                    {activation || 'Not provided'}
                  </TableCell>
                  <TableCell className="max-w-40 align-top">
                    <p className="font-bold">{humanize(row.status)}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {row.utmCampaign || row.source || 'direct'}
                    </p>
                    {row.landingPage && (
                      <p
                        className="max-w-36 truncate text-[10px] text-muted-foreground"
                        title={row.landingPage}
                      >
                        {row.landingPage}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No partner or investor inquiries yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </article>
  );
}

function ImportPanel({ onImported }: { onImported: () => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setStatus('');
    try {
      const rows = parseCsv(await file.text());
      if (rows.length < 2) {
        setStatus('The CSV has no data rows.');
        return;
      }
      const headers = rows[0].map((header) =>
        header
          .trim()
          .toLowerCase()
          .replaceAll(/[^a-z0-9]/g, ''),
      );
      const column = (row: string[], ...names: string[]) => {
        const index = headers.findIndex((header) => names.includes(header));
        return index >= 0 ? row[index]?.trim() || '' : '';
      };
      const records = rows
        .slice(1)
        .filter((row) => row.some(Boolean))
        .map((row) => {
          const tradeValue = column(
            row,
            'primarytradeslug',
            'primarytrade',
            'trade',
          ).toLowerCase();
          const trade =
            TRADES.find(
              (item) =>
                item.slug === tradeValue ||
                item.label.toLowerCase() === tradeValue,
            )?.slug || tradeValue;
          return {
            audienceType: column(
              row,
              'audiencetype',
              'audience',
              'registrationtype',
            ),
            intent: column(row, 'intent', 'status', 'use'),
            name: column(row, 'name', 'fullname'),
            email: column(row, 'email', 'emailaddress'),
            mobile: column(row, 'mobile', 'phone', 'phonenumber'),
            city: column(row, 'city'),
            state: column(row, 'state'),
            zip: column(row, 'zip', 'zipcode', 'postalcode'),
            primaryTradeSlug: trade,
            referredByCode: column(row, 'referredbycode'),
            promoCode: column(row, 'promocode', 'campaigncode'),
            professionalStatus: column(row, 'professionalstatus'),
            otherProfessionalStatus: column(
              row,
              'otherprofessionalstatus',
              'otherlicensetype',
            ),
            experienceRange: column(row, 'experiencerange'),
            availabilityPreference: column(row, 'availabilitypreference'),
            desiredRate: column(row, 'desiredrate'),
            serviceArea: column(row, 'servicearea'),
            travelRadiusMiles: column(row, 'travelradiusmiles'),
            ownsTools: column(row, 'ownstools'),
            reliableTransportation: column(row, 'reliabletransportation'),
            additionalTrades: column(row, 'additionaltrades'),
            businessName: column(row, 'businessname', 'organizationname'),
            businessType: column(row, 'businesstype'),
            licenseStatus: column(row, 'licensestatus'),
            companySize: column(row, 'companysize'),
            tradesNeeded: column(row, 'tradesneeded', 'tradessuppliedorhired'),
            servicesOffered: column(row, 'servicesoffered'),
            shortageFrequency: column(row, 'shortagefrequency'),
            laborTypes: column(row, 'labortypes'),
            organizationType: column(row, 'organizationtype'),
            contactRole: column(row, 'contactrole'),
            marketsServed: column(row, 'marketsserved'),
            organizationCapabilities: column(row, 'organizationcapabilities'),
            shortDurationInterest: column(row, 'shortdurationinterest'),
          };
        });
      const response = await fetchWithTimeout('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, source, records }),
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.ok) {
        setStatus(
          `${data.imported} imported · ${data.existing} existing · ${data.invalid.length} invalid`,
        );
        await onImported();
      } else setStatus(data?.message || 'Import failed.');
    } catch {
      setStatus('Import failed. Check the CSV and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="report-panel">
      <p className="report-title">Import legitimate signups</p>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Required columns: intent, name, email, city, state, zip,
        primaryTradeSlug. Generic imports are stored without email or SMS
        consent and remain excluded from public counts until a reviewed approval
        workflow is completed.
      </p>
      <Input
        className="form-input mt-5"
        placeholder="Source or partner name"
        value={source}
        onChange={(event) => setSource(event.target.value)}
      />
      <label className="mt-3 flex cursor-pointer items-center gap-3 border border-dashed border-foreground/25 bg-white/[0.03] p-4 text-xs font-bold">
        <Upload className="size-4 text-primary" />
        <span>{file?.name || 'Choose CSV file'}</span>
        <input
          className="sr-only"
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
      </label>
      <Button
        onClick={upload}
        disabled={!file || busy}
        className="mt-3 h-11 w-full rounded-none bg-primary text-xs font-black uppercase tracking-[0.09em] text-primary-foreground"
      >
        {busy ? 'Importing…' : 'Import registrations'}
      </Button>
      {status && (
        <output className="mt-3 block text-xs font-bold">{status}</output>
      )}
    </article>
  );
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else quoted = !quoted;
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += char;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}
