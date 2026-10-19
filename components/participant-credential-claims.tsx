'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, FileCheck2, Plus, RefreshCw } from 'lucide-react';
import { SelectField, TextField } from '@/components/early-access-role-fields';
import { Button } from '@/components/ui/button';
import {
  CREDENTIAL_EVIDENCE_SOURCE_TYPES,
  CREDENTIAL_KINDS,
  canSubmitCredentialRevision,
  credentialKindLabel,
  credentialStatusLabel,
  type CredentialKind,
  type CredentialStatus,
} from '@/lib/credential-domain';
import { PUBLIC_TRADES, tradeLabel, TRADES } from '@/lib/constants';

type CredentialClaim = {
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
  currentRevision: {
    jurisdiction: string | null;
    issuingAuthority: string;
    credentialClass: string | null;
    credentialName: string;
    identifierMasked: string;
    issuedOn: string | null;
    expiresOn: string | null;
    evidenceReference: string | null;
    evidenceSourceType: string;
    submittedAt: string | null;
  } | null;
  revisions: Array<{
    revisionNumber: number;
    submittedAt: string | null;
    createdAt: string;
  }>;
  reviewHistory: Array<{
    fromStatus: CredentialStatus | null;
    toStatus: CredentialStatus;
    reason: string;
    occurredAt: string;
  }>;
};

type ClaimFormState = {
  claimId?: string;
  kind: CredentialKind;
  parentClaimId: string;
  tradeOrSpecialtySlug: string;
  jurisdiction: string;
  issuingAuthority: string;
  credentialClass: string;
  credentialName: string;
  identifierMasked: string;
  issuedOn: string;
  expiresOn: string;
  evidenceReference: string;
  evidenceSourceType: string;
};

const kindOptions = CREDENTIAL_KINDS.map((value) => ({
  value,
  label: credentialKindLabel(value),
}));

const publicKindOptions = kindOptions.filter(
  (option) => option.value !== 'CDL_CLASS',
);

const evidenceOptions = CREDENTIAL_EVIDENCE_SOURCE_TYPES.map((value) => ({
  value,
  label: value
    .toLowerCase()
    .replaceAll('_', ' ')
    .replace(/^./u, (letter) => letter.toUpperCase()),
}));

function blankForm(primaryTradeSlug: string): ClaimFormState {
  return {
    kind: 'LICENSE',
    parentClaimId: '',
    tradeOrSpecialtySlug: primaryTradeSlug,
    jurisdiction: '',
    issuingAuthority: '',
    credentialClass: '',
    credentialName: '',
    identifierMasked: '',
    issuedOn: '',
    expiresOn: '',
    evidenceReference: '',
    evidenceSourceType: 'OFFICIAL_REGISTRY',
  };
}

function readableDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export function ParticipantCredentialClaims({
  primaryTradeSlug,
}: {
  primaryTradeSlug: string;
}) {
  const [claims, setClaims] = useState<CredentialClaim[] | null>(null);
  const [form, setForm] = useState<ClaimFormState | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const statusRef = useRef<HTMLOutputElement>(null);
  const submissionKeyRef = useRef('');

  const load = useCallback(async (preserveMessage = false) => {
    setLoading(true);
    if (!preserveMessage) setMessage('');
    try {
      const response = await fetchWithTimeout('/api/early-access/credentials', {
        cache: 'no-store',
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        setClaims([]);
        setMessage(data?.message || 'Credential status is unavailable.');
        return;
      }
      setClaims((data.claims || []) as CredentialClaim[]);
    } catch {
      setClaims([]);
      setMessage('Credential status is unavailable. Try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const parentOptions = useMemo(
    () =>
      (claims || [])
        .filter((claim) => claim.kind !== 'ENDORSEMENT')
        .map((claim) => ({
          value: claim.id,
          label: claim.currentRevision?.credentialName
            ? `${credentialKindLabel(claim.kind)} · ${claim.currentRevision.credentialName}`
            : `${credentialKindLabel(claim.kind)} · details required`,
        })),
    [claims],
  );

  function openClaim(claim?: CredentialClaim) {
    submissionKeyRef.current = crypto.randomUUID();
    setFormKey((current) => current + 1);
    setErrors({});
    setMessage('');
    if (!claim) {
      setForm(blankForm(primaryTradeSlug));
      return;
    }
    const revision = claim.currentRevision;
    setForm({
      claimId: claim.id,
      kind: claim.kind,
      parentClaimId: claim.parentClaimId || '',
      tradeOrSpecialtySlug: claim.tradeOrSpecialtySlug || primaryTradeSlug,
      jurisdiction: revision?.jurisdiction || '',
      issuingAuthority: revision?.issuingAuthority || '',
      credentialClass: revision?.credentialClass || '',
      credentialName: revision?.credentialName || '',
      identifierMasked: revision?.identifierMasked || '',
      issuedOn: revision?.issuedOn || '',
      expiresOn: revision?.expiresOn || '',
      evidenceReference: revision?.evidenceReference || '',
      evidenceSourceType: revision?.evidenceSourceType || 'OFFICIAL_REGISTRY',
    });
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    const data = new FormData(event.currentTarget);
    setSubmitting(true);
    setErrors({});
    setMessage('');
    try {
      const response = await fetchWithTimeout('/api/early-access/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey:
            submissionKeyRef.current ||
            (submissionKeyRef.current = crypto.randomUUID()),
          claimId: form.claimId,
          kind: form.kind,
          parentClaimId:
            form.kind === 'ENDORSEMENT'
              ? data.get('parentClaimId') || undefined
              : undefined,
          tradeOrSpecialtySlug: form.tradeOrSpecialtySlug,
          jurisdiction: data.get('jurisdiction') || undefined,
          issuingAuthority: data.get('issuingAuthority'),
          credentialClass: data.get('credentialClass') || undefined,
          credentialName: data.get('credentialName'),
          identifier: data.get('identifier') || undefined,
          issuedOn: data.get('issuedOn') || undefined,
          expiresOn: data.get('expiresOn') || undefined,
          evidenceReference: data.get('evidenceReference'),
          evidenceSourceType: form.evidenceSourceType,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setErrors(result?.errors || {});
        setMessage(result?.message || 'The credential could not be submitted.');
        return;
      }
      setForm(null);
      setMessage(
        'Credential submitted. Its status remains pending until manual review.',
      );
      await load(true);
    } catch {
      setMessage(
        'We could not reach LaborTrader. Your saved credential status has not changed.',
      );
    } finally {
      setSubmitting(false);
      window.requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  return (
    <section className="mt-8 border border-foreground/12 bg-card p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-primary">
            Professional credentials
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
            Manual credential review
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Submit each license, certification, or endorsement as a separate
            claim. LaborTrader reviews every claim before marking it verified.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void load()}
            disabled={loading}
            className="h-10 rounded-none text-xs font-black uppercase tracking-[0.08em]"
          >
            <RefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </Button>
          <Button
            type="button"
            onClick={() => openClaim()}
            className="h-10 rounded-none text-xs font-black uppercase tracking-[0.08em]"
          >
            <Plus /> Add claim
          </Button>
        </div>
      </div>

      <output
        ref={statusRef}
        tabIndex={-1}
        className="mt-4 block text-sm font-semibold text-foreground outline-none"
      >
        {message}
      </output>

      {!loading && claims?.length === 0 && !form && (
        <div className="mt-5 border border-dashed border-foreground/18 p-5 text-sm text-muted-foreground">
          No credential claims have been submitted yet.
        </div>
      )}

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {claims?.map((claim) => (
          <article key={claim.id} className="border border-foreground/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">
                  {credentialKindLabel(claim.kind)}
                </p>
                <h3 className="mt-2 text-lg font-black">
                  {claim.currentRevision?.credentialName ||
                    `${tradeLabel(claim.tradeOrSpecialtySlug || primaryTradeSlug)} claim`}
                </h3>
              </div>
              {claim.status === 'VERIFIED' ? (
                <BadgeCheck className="text-primary" aria-label="Verified" />
              ) : (
                <FileCheck2
                  className="text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </div>
            <p className="mt-3 text-sm font-bold">
              {credentialStatusLabel(claim.status)}
            </p>
            {claim.currentRevision && (
              <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Authority</dt>
                  <dd className="mt-1 font-semibold">
                    {claim.currentRevision.issuingAuthority}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Identifier</dt>
                  <dd className="mt-1 font-semibold">
                    {claim.currentRevision.identifierMasked}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Submitted</dt>
                  <dd className="mt-1 font-semibold">
                    {readableDate(claim.submittedAt) || 'Not submitted'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Expires</dt>
                  <dd className="mt-1 font-semibold">
                    {claim.currentRevision.expiresOn || 'Not supplied'}
                  </dd>
                </div>
              </dl>
            )}
            {claim.reviewHistory.at(-1) && (
              <p className="mt-3 border-l-2 border-primary pl-3 text-xs leading-5 text-muted-foreground">
                {claim.reviewHistory.at(-1)?.reason}
              </p>
            )}
            {canSubmitCredentialRevision(claim.status) && (
              <Button
                type="button"
                variant="outline"
                onClick={() => openClaim(claim)}
                className="mt-4 h-9 rounded-none text-xs font-black uppercase tracking-[0.08em]"
              >
                {claim.status === 'DRAFT'
                  ? 'Complete claim'
                  : 'Submit updated revision'}
              </Button>
            )}
          </article>
        ))}
      </div>

      {form && (
        <form
          key={formKey}
          onSubmit={submit}
          className="mt-6 border-t border-foreground/12 pt-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">
                {form.claimId ? 'Credential revision' : 'New credential claim'}
              </h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Changes go through a new review. Your previous record is
                preserved.
              </p>
            </div>
            <Button type="button" variant="ghost" onClick={() => setForm(null)}>
              Cancel
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <SelectField
              name="kind"
              label="Claim type"
              placeholder="Choose a claim type"
              options={form.claimId ? kindOptions : publicKindOptions}
              value={form.kind}
              disabled={Boolean(form.claimId)}
              onChange={(event) =>
                setForm({
                  ...form,
                  kind: event.target.value as CredentialKind,
                  parentClaimId:
                    event.target.value === 'ENDORSEMENT'
                      ? form.parentClaimId
                      : '',
                })
              }
              required
              error={errors.kind?.[0]}
            />
            <SelectField
              name="tradeOrSpecialtySlug"
              label="Trade or specialty"
              placeholder="Choose a trade or specialty"
              options={(form.claimId ? TRADES : PUBLIC_TRADES).map((trade) => ({
                value: trade.slug,
                label: trade.label,
              }))}
              value={form.tradeOrSpecialtySlug}
              disabled={Boolean(form.claimId)}
              onChange={(event) =>
                setForm({
                  ...form,
                  tradeOrSpecialtySlug: event.target.value,
                })
              }
              required
              error={errors.tradeOrSpecialtySlug?.[0]}
            />
            {form.kind === 'ENDORSEMENT' && (
              <SelectField
                name="parentClaimId"
                label="Parent credential"
                placeholder="Choose the parent credential"
                options={parentOptions}
                value={form.parentClaimId}
                disabled={Boolean(form.claimId)}
                onChange={(event) =>
                  setForm({ ...form, parentClaimId: event.target.value })
                }
                required
                error={errors.parentClaimId?.[0]}
              />
            )}
            <TextField
              name="credentialName"
              label="Credential name"
              defaultValue={form.credentialName}
              placeholder="Credential name"
              required
              error={errors.credentialName?.[0]}
            />
            <TextField
              name="issuingAuthority"
              label="Issuing authority"
              defaultValue={form.issuingAuthority}
              placeholder="Issuing organization"
              required
              error={errors.issuingAuthority?.[0]}
            />
            <TextField
              name="jurisdiction"
              label="Jurisdiction"
              defaultValue={form.jurisdiction}
              placeholder="Example: Texas"
              error={errors.jurisdiction?.[0]}
            />
            <TextField
              name="credentialClass"
              label="Class or endorsement code"
              defaultValue={form.credentialClass}
              placeholder="Class or endorsement"
              error={errors.credentialClass?.[0]}
            />
            <TextField
              name="identifier"
              label="License or credential number (optional)"
              placeholder={
                form.identifierMasked &&
                form.identifierMasked !== 'Not supplied'
                  ? 'Leave blank to keep'
                  : 'Credential number'
              }
              autoComplete="off"
              error={errors.identifier?.[0]}
            />
            <TextField
              name="issuedOn"
              label="Issue date"
              type="date"
              defaultValue={form.issuedOn}
              error={errors.issuedOn?.[0]}
            />
            <TextField
              name="expiresOn"
              label="Expiration date"
              type="date"
              defaultValue={form.expiresOn}
              error={errors.expiresOn?.[0]}
            />
            <SelectField
              name="evidenceSourceType"
              label="Evidence source"
              placeholder="Choose an evidence source"
              options={evidenceOptions}
              value={form.evidenceSourceType}
              onChange={(event) =>
                setForm({ ...form, evidenceSourceType: event.target.value })
              }
              required
              error={errors.evidenceSourceType?.[0]}
            />
            <TextField
              name="evidenceReference"
              label="Authoritative public-source URL"
              type="url"
              defaultValue={form.evidenceReference}
              placeholder="https://…"
              required
              error={errors.evidenceReference?.[0]}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-none px-5 text-xs font-black uppercase tracking-[0.08em]"
            >
              {submitting ? 'Submitting…' : 'Submit for manual review'}
            </Button>
            <p className="text-xs leading-5 text-muted-foreground">
              Do not email identity documents. No uploaded files are accepted
              here.
            </p>
          </div>
        </form>
      )}

      <p className="mt-6 border-t border-foreground/10 pt-4 text-[11px] leading-5 text-muted-foreground">
        Credentials are marked verified only after manual review. Verification
        can expire or be revoked when evidence or status changes.
      </p>
    </section>
  );
}
