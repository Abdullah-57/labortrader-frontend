'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  reconciliationConfirmation,
  type AwardReconciliationKind,
} from '@/lib/award-reconciliation-domain';

type Scope = {
  id: string;
  code: string;
  name: string;
  candidateCount: number;
  stateCode?: string;
};

type Run = {
  id: string;
  kind: AwardReconciliationKind;
  mode: 'DRY_RUN' | 'APPLY';
  status: string;
  scopeName: string;
  scopeCode: string;
  featureEnabled: boolean | null;
  candidateCount: number;
  eligibleCount: number;
  proposedCount: number;
  existingCount: number;
  excludedCount: number;
  appliedCount: number;
  waitingCount: number;
  createdAt: string;
};

type Item = {
  id: string;
  memberId: string;
  candidateOrder: number;
  orderingTimestamp: string | null;
  audienceType: string;
  evaluationCode: string;
  excludedReason: string | null;
  proposedAction: string;
  proposedOrdinal: number | null;
  applyOutcome: string | null;
  safeDetails: Record<string, unknown>;
};

type Detail = {
  run: Run;
  items: Item[];
  page: { limit: number; offset: number; returned: number; hasMore: boolean };
};

type Payload = {
  scopes: {
    foundingMarkets: Scope[];
    foundingFeatureEnabled: boolean;
  };
  runs: Run[];
  selected: Detail | null;
};

async function responseJson(response: Response) {
  return response.json().catch(() => null);
}

function humanize(value: string | null) {
  return value
    ? value
        .toLowerCase()
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    : 'Not available';
}

function awardKindLabel(kind: AwardReconciliationKind) {
  return kind === 'FOUNDING_100' ? 'Founding 100' : 'Award';
}

export function AdminAwardReconciliationPanel({
  canManage,
}: {
  canManage: boolean;
}) {
  const [payload, setPayload] = useState<Payload | null>(null);
  const [selected, setSelected] = useState<Detail | null>(null);
  const [kind] = useState<AwardReconciliationKind>('FOUNDING_100');
  const [scopeId, setScopeId] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (runId?: string) => {
    const suffix = runId ? `?runId=${encodeURIComponent(runId)}` : '';
    const response = await fetchWithTimeout(
      `/api/admin/reconciliation${suffix}`,
      {
        cache: 'no-store',
      },
    );
    const data = await responseJson(response);
    if (!response.ok || !data?.ok) {
      throw new Error('reconciliation-read-unavailable');
    }
    setPayload(data);
    if (data.selected) setSelected(data.selected);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void load().catch(() => {
        setMessage('Award reconciliation records could not be loaded.');
      });
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const scopes = useMemo(
    () => payload?.scopes.foundingMarkets || [],
    [payload],
  );
  const activeScopeId = scopes.some((scope) => scope.id === scopeId)
    ? scopeId
    : scopes[0]?.id || '';
  const exactConfirmation = selected
    ? reconciliationConfirmation(selected.run.kind)
    : '';

  async function command(body: Record<string, unknown>) {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout('/api/admin/reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await responseJson(response);
      if (!response.ok || !data?.ok) {
        setMessage(data?.message || 'The reconciliation request was rejected.');
        return;
      }
      setSelected(data.result);
      setConfirmation('');
      setMessage(
        data.result.run.mode === 'DRY_RUN'
          ? 'Dry-run stored. Review every proposed and excluded outcome before applying.'
          : 'Approved reconciliation applied and recorded.',
      );
      await load(data.result.run.id);
    } catch {
      setMessage('The reconciliation service could not be reached.');
    } finally {
      setBusy(false);
    }
  }

  async function openRun(runId: string) {
    setBusy(true);
    setMessage('');
    try {
      await load(runId);
      setConfirmation('');
    } catch {
      setMessage('That reconciliation run could not be loaded.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-3 border border-foreground/12 bg-card p-5 sm:p-7">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.65fr)] lg:items-end">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
            Award reconciliation
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Review first. Apply one exact scope.
          </h2>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
            Dry-runs preserve the candidate order, proposed result, and specific
            exclusion reason. Apply refuses changed data and requires a fresh
            review. No rollout cutoff or feature flag is created here.
          </p>
        </div>
        {!canManage && (
          <p className="border-l-2 border-primary pl-3 text-xs font-semibold leading-5 text-muted-foreground">
            Read &amp; Export can inspect masked operational records but cannot
            run or apply reconciliation.
          </p>
        )}
      </div>

      {canManage && payload && (
        <div className="mt-5 grid gap-3 border border-foreground/10 bg-white/[0.03] p-4 md:grid-cols-2">
          <label className="block text-xs font-black uppercase tracking-[0.08em]">
            Program
            <select className="form-input mt-2 w-full" value={kind} disabled>
              <option value="FOUNDING_100">Founding 100</option>
            </select>
          </label>
          <label className="block text-xs font-black uppercase tracking-[0.08em]">
            Exact allocation scope
            <select
              className="form-input mt-2 w-full"
              value={activeScopeId}
              onChange={(event) => {
                setScopeId(event.target.value);
                setSelected(null);
                setConfirmation('');
              }}
            >
              {scopes.map((scope) => (
                <option key={scope.id} value={scope.id}>
                  {scope.name} · {scope.candidateCount} records
                </option>
              ))}
            </select>
          </label>
          <div className="text-xs leading-5 text-muted-foreground md:col-span-2">
            {payload.scopes.foundingFeatureEnabled ? (
              <p>
                Founding allocation is enabled for this runtime. Apply still
                requires the reviewed dry-run and exact phrase below.
              </p>
            ) : (
              <p>
                Founding allocation is disabled. Dry-run is available for
                readiness review; apply is blocked until operations separately
                enables the approved flag.
              </p>
            )}
          </div>
          <Button
            type="button"
            disabled={busy || !activeScopeId}
            onClick={() =>
              void command({
                action: 'DRY_RUN',
                kind,
                scopeId: activeScopeId,
                idempotencyKey: crypto.randomUUID(),
              })
            }
            className="min-h-11 rounded-none bg-primary text-xs font-black uppercase tracking-[0.08em] text-primary-foreground md:col-span-2 md:justify-self-start"
          >
            {busy ? 'Working…' : 'Create stored dry-run'}
          </Button>
        </div>
      )}

      {message && (
        <output
          aria-live="polite"
          className="mt-4 block border-l-2 border-primary pl-3 text-xs font-semibold leading-5"
        >
          {message}
        </output>
      )}

      {selected && (
        <div className="mt-5 border border-foreground/10">
          <div className="grid gap-3 bg-foreground p-5 text-background sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                {selected.run.mode === 'DRY_RUN'
                  ? 'Stored dry-run'
                  : 'Applied run'}
              </p>
              <h3 className="mt-2 text-xl font-black">
                {selected.run.scopeName} · {awardKindLabel(selected.run.kind)}
              </h3>
              <p className="text-on-dark-muted mt-2 text-xs">
                {new Date(selected.run.createdAt).toLocaleString()} ·{' '}
                {selected.run.id}
              </p>
            </div>
            {selected.run.kind === 'FOUNDING_100' &&
              selected.run.featureEnabled === false && (
                <span className="text-xs font-black uppercase tracking-[0.08em] text-primary">
                  Feature disabled at evaluation
                </span>
              )}
          </div>
          <dl className="grid grid-cols-2 gap-px bg-foreground/10 sm:grid-cols-4 lg:grid-cols-7">
            {[
              ['Candidates', selected.run.candidateCount],
              ['Eligible', selected.run.eligibleCount],
              ['Proposed', selected.run.proposedCount],
              ['Existing', selected.run.existingCount],
              ['Excluded', selected.run.excludedCount],
              ['Applied', selected.run.appliedCount],
              ['Waiting', selected.run.waitingCount],
            ].map(([label, value]) => (
              <div key={label} className="bg-card p-3">
                <dt className="text-[9px] font-black uppercase tracking-[0.08em] text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 text-xl font-black">{value}</dd>
              </div>
            ))}
          </dl>

          {canManage && selected.run.mode === 'DRY_RUN' && (
            <div className="grid gap-3 border-t border-foreground/10 bg-primary/6 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <label className="block text-xs font-black uppercase tracking-[0.08em]">
                Type {exactConfirmation}
                <Input
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  autoComplete="off"
                  className="form-input mt-2"
                />
              </label>
              <Button
                type="button"
                disabled={busy || confirmation.trim() !== exactConfirmation}
                onClick={() =>
                  void command({
                    action: 'APPLY',
                    dryRunId: selected.run.id,
                    confirmation,
                    idempotencyKey: crypto.randomUUID(),
                  })
                }
                className="min-h-11 rounded-none bg-foreground text-xs font-black uppercase tracking-[0.08em] text-background"
              >
                Apply reviewed run
              </Button>
            </div>
          )}

          <div className="w-full max-w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[58rem] text-left text-xs">
              <thead className="border-y border-foreground/10 bg-white/[0.03] text-[9px] font-black uppercase tracking-[0.08em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Member</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Evaluation</th>
                  <th className="px-3 py-2">Proposed</th>
                  <th className="px-3 py-2">Result</th>
                  <th className="px-3 py-2">Safe evidence</th>
                </tr>
              </thead>
              <tbody>
                {selected.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-foreground/8 align-top"
                  >
                    <td className="px-3 py-3 font-black">
                      {item.proposedOrdinal ?? item.candidateOrder}
                    </td>
                    <td className="px-3 py-3 font-mono">
                      …{item.memberId.slice(-8)}
                    </td>
                    <td className="px-3 py-3">{humanize(item.audienceType)}</td>
                    <td className="px-3 py-3 font-bold">
                      {humanize(item.evaluationCode)}
                      {item.excludedReason && (
                        <span className="mt-1 block font-normal text-muted-foreground">
                          {humanize(item.excludedReason)}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {humanize(item.proposedAction)}
                    </td>
                    <td className="px-3 py-3">{humanize(item.applyOutcome)}</td>
                    <td className="max-w-72 px-3 py-3 text-[10px] leading-4 text-muted-foreground">
                      {Object.entries(item.safeDetails)
                        .map(
                          ([key, value]) =>
                            `${humanize(key)}: ${String(value)}`,
                        )
                        .join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected.page.hasMore && (
            <p className="p-3 text-xs text-muted-foreground">
              Showing the first {selected.page.returned} of{' '}
              {selected.run.candidateCount} rows. Use the API pagination fields
              for the remaining operational record.
            </p>
          )}
        </div>
      )}

      {payload?.runs.length ? (
        <div className="mt-5">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            Recent immutable runs
          </p>
          <div className="mt-2 grid gap-2 lg:grid-cols-2">
            {payload.runs.slice(0, 8).map((run) => (
              <button
                key={run.id}
                type="button"
                disabled={busy}
                onClick={() => void openRun(run.id)}
                className="border border-foreground/10 p-3 text-left text-xs hover:border-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="font-black">
                  {run.scopeName} · {humanize(run.kind)} · {run.mode}
                </span>
                <span className="mt-1 block text-muted-foreground">
                  {new Date(run.createdAt).toLocaleString()} · proposed{' '}
                  {run.proposedCount} · applied {run.appliedCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
