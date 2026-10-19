'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ReferralRecord = {
  id: string;
  status: string;
  statusReason: string | null;
  capturedAt: string;
  referrerName: string;
  referrerRole: string;
  referrerReady: boolean;
  referredName: string;
  referredRole: string;
  referredReady: boolean;
  rewardStatus: string | null;
  daysAwarded: number;
};

type ReferralPayload = {
  featureEnabled: boolean;
  policyVersion: string;
  summary: {
    total: number;
    pending: number;
    rewarded: number;
    rejected: number;
    awardedDays: number;
    missingCodes: number;
  };
  recent: ReferralRecord[];
};

function label(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function AdminReferralPanel({ canManage }: { canManage: boolean }) {
  const [payload, setPayload] = useState<ReferralPayload | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [backfillBusy, setBackfillBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    const response = await fetchWithTimeout('/api/admin/referrals?limit=50', {
      cache: 'no-store',
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.ok) {
      throw new Error('referral-operations-unavailable');
    }
    setPayload(data.referrals);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch(() => {
        setMessage('Referral operations could not be loaded.');
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function reconcile(referralId: string) {
    setBusyId(referralId);
    setMessage('');
    try {
      const response = await fetchWithTimeout('/api/admin/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RECONCILE', referralId }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(data?.message || 'Referral reconciliation was rejected.');
        return;
      }
      const outcome = data.result.referral_status;
      setMessage(
        outcome === 'REWARDED'
          ? 'Referral verified. The link owner received 10 additional included-use days under the current launch benefit.'
          : outcome === 'REJECTED'
            ? 'Referral rejected by the verification or anti-abuse rules. No included-use days were awarded.'
            : outcome === 'REVERSED'
              ? 'This referral reward has been reversed in the current ledger.'
              : 'Referral checked. It remains pending until every required verification passes.',
      );
      await load();
    } catch {
      setMessage('Referral reconciliation could not be reached.');
    } finally {
      setBusyId(null);
    }
  }

  async function backfillCodes() {
    setBackfillBusy(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout('/api/admin/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'BACKFILL_CODES', limit: 250 }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(data?.message || 'Referral links could not be issued.');
        return;
      }
      setMessage(
        data.result.remaining > 0
          ? `${data.result.issued} referral links issued. ${data.result.remaining} eligible accounts remain for the next batch.`
          : `${data.result.issued} referral links issued. Every eligible account now has a link.`,
      );
      await load();
    } catch {
      setMessage('Referral link issuance could not be reached.');
    } finally {
      setBackfillBusy(false);
    }
  }

  return (
    <section className="mt-3 border border-foreground/12 bg-card p-5 sm:p-7">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
            Referral operations
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            First-touch attribution and verified-account rewards
          </h2>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
            The referral-link owner receives 10 extra included-use days for each
            verified new account. Rewards remain subject to anti-abuse review
            and the original role-based dollar cap.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`border px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] ${
              payload?.featureEnabled
                ? 'border-emerald-700/30 bg-emerald-500/10 text-emerald-300'
                : 'border-amber-700/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            {payload?.featureEnabled
              ? 'Current program enabled'
              : 'Feature gated'}
          </span>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-none bg-transparent text-[10px] font-black uppercase tracking-[0.08em]"
            onClick={() => {
              setMessage('');
              void load().catch(() => {
                setMessage('Referral operations could not be refreshed.');
              });
            }}
          >
            <RefreshCw /> Refresh
          </Button>
          {canManage && payload?.featureEnabled && (
            <Button
              type="button"
              className="h-9 rounded-none text-[10px] font-black uppercase tracking-[0.08em]"
              disabled={backfillBusy || payload.summary.missingCodes === 0}
              onClick={() => void backfillCodes()}
            >
              {backfillBusy ? 'Issuing' : 'Issue missing links'}
            </Button>
          )}
        </div>
      </div>

      {payload && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
            {[
              ['Captured', payload.summary.total],
              ['Pending', payload.summary.pending],
              ['Rewarded', payload.summary.rewarded],
              ['Rejected', payload.summary.rejected],
              ['Referral days awarded', payload.summary.awardedDays],
              ['Links to issue', payload.summary.missingCodes],
            ].map(([name, value]) => (
              <div key={name} className="border border-foreground/10 p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                  {name}
                </p>
                <p className="mt-2 text-2xl font-black">
                  {Number(value).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 overflow-x-auto border border-foreground/10">
            <table className="w-full min-w-[840px] text-left text-xs">
              <thead className="bg-muted/40 text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">Captured</th>
                  <th className="px-3 py-3">Referrer</th>
                  <th className="px-3 py-3">Referred account</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">10-day reward</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {payload.recent.map((referral) => (
                  <tr
                    key={referral.id}
                    className="border-t border-foreground/10 align-top"
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {new Date(referral.capturedAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-bold">{referral.referrerName}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {label(referral.referrerRole)} ·{' '}
                        {referral.referrerReady ? 'ready' : 'verification open'}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-bold">{referral.referredName}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {label(referral.referredRole)} ·{' '}
                        {referral.referredReady ? 'ready' : 'verification open'}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-black">{label(referral.status)}</p>
                      {referral.statusReason && (
                        <p className="mt-1 max-w-52 text-[10px] leading-4 text-muted-foreground">
                          {referral.statusReason}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[10px] leading-4 text-muted-foreground">
                      {referral.rewardStatus
                        ? `${label(referral.rewardStatus)} · ${referral.daysAwarded} days`
                        : 'Awaiting verification'}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {canManage &&
                      payload.featureEnabled &&
                      ['CAPTURED', 'PENDING'].includes(referral.status) ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="rounded-none text-[9px] font-black uppercase"
                          disabled={busyId === referral.id}
                          onClick={() => void reconcile(referral.id)}
                        >
                          {busyId === referral.id ? 'Checking' : 'Reconcile'}
                        </Button>
                      ) : (
                        <span className="text-[9px] font-black uppercase text-muted-foreground">
                          Read only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {!payload.recent.length && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      No referral attributions have been captured.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {message && (
        <output className="mt-3 block text-xs font-semibold">{message}</output>
      )}
    </section>
  );
}
