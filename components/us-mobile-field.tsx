'use client';

import { useId, useMemo, useState } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { normalizeUsPhoneToE164 } from '@/lib/verification-domain';

function digitsOnly(value: string) {
  return value.replace(/\D/gu, '');
}

/** Format national 10-digit US mobile as (XXX) XXX-XXXX while typing. */
export function formatUsNationalMobile(digits: string) {
  const d = digitsOnly(digits).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function nationalFromAny(value: string) {
  const digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits.slice(0, 10);
}

type UsMobileFieldProps = {
  id?: string;
  name?: string;
  label?: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  error?: string;
  help?: string;
  /** Called with the national display value on every edit, e.g. "(415) 555". */
  onChange?: (nationalDisplay: string) => void;
  className?: string;
};

const DEFAULT_HELP =
  'U.S. mobile only — enter as (555) 123-4567. Used for account verification. Marketing texts remain optional.';

/**
 * U.S. mobile control: national (XXX) XXX-XXXX display; submits E.164 (+1…).
 */
export function UsMobileField({
  id,
  name = 'mobile',
  label = 'Mobile phone',
  required = true,
  defaultValue = '',
  value,
  error,
  help = DEFAULT_HELP,
  onChange,
  className,
}: UsMobileFieldProps) {
  const autoId = useId();
  const fieldId = id || autoId;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;
  const controlled = value !== undefined;
  const [localNational, setLocalNational] = useState(() =>
    formatUsNationalMobile(nationalFromAny(defaultValue)),
  );
  const national = controlled
    ? formatUsNationalMobile(nationalFromAny(value))
    : localNational;
  const e164 = useMemo(() => {
    const digits = digitsOnly(national);
    return digits.length === 10 ? `+1${digits}` : '';
  }, [national]);

  function updateNational(nextRaw: string) {
    const formatted = formatUsNationalMobile(nationalFromAny(nextRaw));
    if (!controlled) setLocalNational(formatted);
    // Always pass the national display string. Passing "" until 10 digits
    // were complete cleared controlled parents (early-access) on every keystroke.
    onChange?.(formatted);
  }

  return (
    <Field className={className || 'min-w-0'}>
      <FieldLabel htmlFor={fieldId} className="form-label">
        {label}
      </FieldLabel>
      <Input
        id={fieldId}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        className="form-input min-w-0 max-w-full"
        placeholder="(555) 123-4567"
        required={required}
        value={national}
        onChange={(event) => updateNational(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${helpId} ${errorId}` : helpId}
        maxLength={14}
      />
      <input type="hidden" name={name} value={e164} readOnly />
      <p id={helpId} className="mt-1.5 text-[11px] leading-5 text-muted-foreground">
        {help}
      </p>
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  );
}

export function usMobileFieldIsValid(nationalOrE164: string) {
  return Boolean(normalizeUsPhoneToE164(nationalOrE164));
}
