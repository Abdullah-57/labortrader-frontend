'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, RefreshCw, ShieldCheck } from 'lucide-react';
import { SelectField } from '@/components/early-access-role-fields';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import {
  CREDENTIAL_DECISION_TARGETS,
  CREDENTIAL_STATUSES,
  canAdminDecideCredential,
  credentialKindLabel,
  credentialStatusLabel,
  type CredentialDecisionTarget,
  type CredentialKind,
  type CredentialStatus,
} from '@/lib/credential-domain';
import { tradeLabel } from '@/lib/constants';

type CredentialSummary = {
  id: string;
  kind: CredentialKind;
  parentClaimId: string | null;
  tradeOrSpecialtySlug: string | null;
  status: CredentialStatus;
  currentRevisionNumber: number;
  submittedAt: string | null;
  decidedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
  participant: {
    label: string;
    audienceType: string;
    city: string;
    state: string;
    marketName: string | null;
    emailMasked: string;
  };
  revision: {
    jurisdiction: string | null;
    issuingAuthority: string;
    credentialClass: string | null;
    credentialName: string;
    identifierMasked: string;
    issuedOn: string | null;
    expiresOn: string | null;
    evidenceReference: string | null;
    evidenceSourceType: string;
    policyVersion: string;
    submittedAt: string | null;
  } | null;
};

type CredentialDetail = CredentialSummary & {
  revisions: Array<{
    revisionNumber: number;
    jurisdiction: string | null;
    issuingAuthority: string;
    credentialClass: string | null;
    credentialName: string;
    identifierMasked: string;
    issuedOn: string | null;
    expiresOn: string | null;
    evidenceReference: string | null;
    evidenceSourceType: string;
    policyVersion: string;
    submittedAt: string | null;
    createdAt: string;
  }>;
  reviewHistory: Array<{
    fromStatus: CredentialStatus | null;
    toStatus: CredentialStatus;
    decisionSource: string;
    reviewer: string | null;
    reason: string;
    internalNotes: string | null;
    policyVersion: string;
    correlationId: string | null;
    occurredAt: string;
  }>;
};

const queueFilterOptions = CREDENTIAL_STATUSES.map((value) => ({
  value,
  label: credentialStatusLabel(value),
}));

function readableDate(value: string | null) {
  if (!value) return 'Not recorded';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function AdminCredentialReviewPanel({
  canDecide,
}: {
  canDecide: boolean;
}) {
  const [claims, setClaims] = useState<CredentialSummary[]>([]);
  const [selected, setSelected] = useState<CredentialDetail | null>(null);
  const [filter, setFilter] = useState('');
  const [decision, setDecision] = useState<CredentialDecisionTarget | ''>('');
  const [loading, setLoading] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [message, setMessage] = useState('');
  const statusRef = useRef<HTMLOutputElement>(null);
  const decisionKeyRef = useRef('');

  const loadQueue = useCallback(
    async (preserveMessage = false) => {
      setLoading(true);
      if (!preserveMessage) setMessage('');
      try {
        const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
        const response = await fetchWithTimeout(
          `/api/admin/credentials${query}`,
          {
            cache: 'no-store',
          },
        );
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.ok) {
          setMessage(data?.message || 'Credential queue unavailable.');
          return;
        }
        setClaims((data.claims || []) as CredentialSummary[]);
      } catch {
        setMessage('Credential queue unavailable. Try again.');
      } finally {
        setLoading(false);
      }
    },
    [filter],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadQueue(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadQueue]);

  async function openClaim(claimId: string) {
    setLoading(true);
    setMessage('');
    setDecision('');
    decisionKeyRef.current = crypto.randomUUID();
    try {
      const response = await fetchWithTimeout(
        `/api/admin/credentials/${encodeURIComponent(claimId)}`,
        { cache: 'no-store' },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(data?.message || 'Credential detail unavailable.');
        return;
      }
      setSelected(data.claim as CredentialDetail);
    } catch {
      setMessage('Credential detail unavailable. Try again.');
    } finally {
      setLoading(false);
    }
  }

  const allowedDecisions = useMemo(
    () =>
      selected
        ? CREDENTIAL_DECISION_TARGETS.filter((target) =>
            canAdminDecideCredential(selected.status, target),
          ).map((value) => ({
            value,
            label: credentialStatusLabel(value),
          }))
        : [],
    [selected],
  );

  async function submitDecision(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !decision || !canDecide) return;
    const form = new FormData(event.currentTarget);
    setDeciding(true);
    setMessage('');
    try {
      const response = await fetchWithTimeout(
        `/api/admin/credentials/${encodeURIComponent(selected.id)}/decision`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idempotencyKey:
              decisionKeyRef.current ||
              (decisionKeyRef.current = crypto.randomUUID()),
            expectedRevisionNumber: selected.currentRevisionNumber,
            toStatus: decision,
            reason: form.get('reason'),
            internalNotes: form.get('internalNotes') || undefined,
          }),
        },
      );
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setMessage(data?.message || 'The decision could not be recorded.');
        return;
      }
      setMessage(`Decision recorded: ${credentialStatusLabel(decision)}.`);
      setSelected(null);
      setDecision('');
      await loadQueue(true);
    } catch {
      setMessage('The decision could not be recorded. Try again.');
    } finally {
      setDeciding(false);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <section className="mt-8 border border-foreground/12 bg-card p-5 sm:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
            Human verification
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Credential review queue
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-muted-foreground">
            Identifiers are masked. Decisions apply only to the current
            immutable revision and always create an audit event. A verified
            claim can still expire or be revoked.
          </p>
        </div>
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
          <SelectField
            name="credentialQueueFilter"
            label="Queue filter"
            placeholder="Open review queue"
            options={queueFilterOptions}
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value);
              setSelected(null);
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => void loadQueue()}
            disabled={loading}
            className="h-12 rounded-none text-xs font-black uppercase tracking-[0.08em]"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
        </div>
      </div>

      <output
        ref={statusRef}
        tabIndex={-1}
        className="mt-4 block text-sm font-semibold outline-none"
      >
        {message}
      </output>

      <div className="mt-5 w-full max-w-full overflow-x-auto overscroll-x-contain border border-foreground/10">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-foreground text-background">
            <tr>
              {[
                'Claim',
                'Participant',
                'Market',
                'Status',
                'Submitted',
                '',
              ].map((label) => (
                <th
                  key={label || 'actions'}
                  className="px-3 py-3 font-black uppercase tracking-[0.08em]"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id} className="border-t border-foreground/10">
                <td className="px-3 py-3">
                  <span className="font-bold">
                    {claim.revision?.credentialName ||
                      credentialKindLabel(claim.kind)}
                  </span>
                  <span className="mt-1 block text-muted-foreground">
                    {tradeLabel(claim.tradeOrSpecialtySlug || '')}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="font-semibold">
                    {claim.participant.label}
                  </span>
                  <span className="mt-1 block text-muted-foreground">
                    {claim.participant.emailMasked}
                  </span>
                </td>
                <td className="px-3 py-3">
                  {claim.participant.marketName ||
                    `${claim.participant.city}, ${claim.participant.state}`}
                </td>
                <td className="px-3 py-3 font-bold">
                  {credentialStatusLabel(claim.status)}
                </td>
                <td className="px-3 py-3">{readableDate(claim.submittedAt)}</td>
                <td className="px-3 py-3 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void openClaim(claim.id)}
                    className="rounded-none"
                  >
                    Review
                  </Button>
                </td>
              </tr>
            ))}
            {!claims.length && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No claims match this queue filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <article className="mt-5 border border-primary/35 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-primary">
                Revision {selected.currentRevisionNumber} ·{' '}
                {credentialKindLabel(selected.kind)}
              </p>
              <h3 className="mt-2 text-xl font-black">
                {selected.revision?.credentialName || 'Incomplete draft'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.participant.label} ·{' '}
                {selected.participant.emailMasked}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </div>

          {selected.revision && (
            <dl className="mt-5 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Status', credentialStatusLabel(selected.status)],
                ['Authority', selected.revision.issuingAuthority],
                [
                  'Jurisdiction',
                  selected.revision.jurisdiction || 'Not supplied',
                ],
                ['Class', selected.revision.credentialClass || 'Not supplied'],
                ['Identifier', selected.revision.identifierMasked],
                ['Issue date', selected.revision.issuedOn || 'Not supplied'],
                ['Expiration', selected.revision.expiresOn || 'Not supplied'],
                ['Evidence type', selected.revision.evidenceSourceType],
              ].map(([label, value]) => (
                <div key={label} className="border border-foreground/10 p-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-bold">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {selected.revision?.evidenceReference && (
            <a
              href={selected.revision.evidenceReference}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em] text-primary underline underline-offset-4"
            >
              Open authoritative source <ExternalLink />
            </a>
          )}

          {selected.reviewHistory.length > 0 && (
            <div className="mt-5 border-t border-foreground/10 pt-4">
              <h4 className="text-xs font-black uppercase tracking-[0.1em]">
                Decision history
              </h4>
              <ol className="mt-3 space-y-3">
                {selected.reviewHistory.map((event, index) => (
                  <li
                    key={`${event.occurredAt}-${index}`}
                    className="border-l-2 border-primary pl-3 text-xs leading-5"
                  >
                    <span className="font-bold">
                      {credentialStatusLabel(event.toStatus)}
                    </span>{' '}
                    · {readableDate(event.occurredAt)}
                    <span className="block text-muted-foreground">
                      {event.reason}
                    </span>
                    {event.internalNotes && (
                      <span className="block text-muted-foreground">
                        Internal: {event.internalNotes}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {canDecide && allowedDecisions.length > 0 && (
            <form
              onSubmit={submitDecision}
              className="mt-5 border-t border-foreground/10 pt-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                  name="credentialDecision"
                  label="Decision"
                  placeholder="Choose a decision"
                  options={allowedDecisions}
                  value={decision}
                  onChange={(event) => {
                    setDecision(event.target.value as CredentialDecisionTarget);
                    decisionKeyRef.current = crypto.randomUUID();
                  }}
                  required
                />
                <Field>
                  <FieldLabel
                    htmlFor="credential-decision-reason"
                    className="form-label"
                  >
                    Required member-facing reason
                  </FieldLabel>
                  <Textarea
                    id="credential-decision-reason"
                    name="reason"
                    minLength={5}
                    maxLength={1_000}
                    required
                    className="min-h-24 rounded-none bg-background"
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel
                    htmlFor="credential-internal-notes"
                    className="form-label"
                  >
                    Internal notes (optional)
                  </FieldLabel>
                  <Textarea
                    id="credential-internal-notes"
                    name="internalNotes"
                    maxLength={4_000}
                    className="min-h-20 rounded-none bg-background"
                  />
                </Field>
              </div>
              <Button
                type="submit"
                disabled={deciding || !decision}
                className="mt-4 h-11 rounded-none px-5 text-xs font-black uppercase tracking-[0.08em]"
              >
                <ShieldCheck /> {deciding ? 'Recording…' : 'Record decision'}
              </Button>
            </form>
          )}

          {!canDecide && (
            <p className="mt-5 border-t border-foreground/10 pt-4 text-xs text-muted-foreground">
              Read & Export access can inspect masked records and history but
              cannot change credential status.
            </p>
          )}
        </article>
      )}
    </section>
  );
}
