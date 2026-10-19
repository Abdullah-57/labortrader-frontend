import Link from 'next/link';
import {
  BriefcaseBusiness,
  Building2,
  HardHat,
  Network,
  UserRound,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import {
  AVAILABILITY_OPTIONS,
  BUSINESS_TYPES,
  COMPANY_SIZES,
  EXPERIENCE_RANGES,
  ORGANIZATION_TYPES,
  PUBLIC_PARTICIPANT_ROLES,
  PROFESSIONAL_STATUSES,
  SHORTAGE_TIMING_OPTIONS,
  PUBLIC_TRADES,
} from '@/lib/constants';

export type AudienceType = 'WORKER' | 'CONTRACTOR' | 'BUSINESS' | 'HIRING_FIRM';
export type Intent = 'WORK' | 'HIRE' | 'BOTH';

export const audienceOptions = [
  {
    value: 'WORKER' as const,
    slug: PUBLIC_PARTICIPANT_ROLES[0].value,
    label: PUBLIC_PARTICIPANT_ROLES[0].label,
    shortLabel: PUBLIC_PARTICIPANT_ROLES[0].label,
    description: PUBLIC_PARTICIPANT_ROLES[0].description,
    icon: UserRound,
  },
  {
    value: 'CONTRACTOR' as const,
    slug: PUBLIC_PARTICIPANT_ROLES[1].value,
    label: PUBLIC_PARTICIPANT_ROLES[1].label,
    shortLabel: PUBLIC_PARTICIPANT_ROLES[1].label,
    description: PUBLIC_PARTICIPANT_ROLES[1].description,
    icon: HardHat,
  },
  {
    value: 'BUSINESS' as const,
    slug: PUBLIC_PARTICIPANT_ROLES[2].value,
    label: PUBLIC_PARTICIPANT_ROLES[2].label,
    shortLabel: PUBLIC_PARTICIPANT_ROLES[2].label,
    description: PUBLIC_PARTICIPANT_ROLES[2].description,
    icon: Building2,
  },
  {
    value: 'HIRING_FIRM' as const,
    slug: PUBLIC_PARTICIPANT_ROLES[3].value,
    label: PUBLIC_PARTICIPANT_ROLES[3].label,
    shortLabel: PUBLIC_PARTICIPANT_ROLES[3].label,
    description: PUBLIC_PARTICIPANT_ROLES[3].description,
    icon: Network,
  },
] as const;

const businessIntentOptions = [
  {
    value: 'WORK' as const,
    label: 'Offer crews / services',
    description:
      'Make company-managed crews, services, or open capacity discoverable.',
    icon: HardHat,
  },
  {
    value: 'HIRE' as const,
    label: 'Hire',
    description: 'Find qualified capacity when real labor needs arise.',
    icon: BriefcaseBusiness,
  },
  {
    value: 'BOTH' as const,
    label: 'Both',
    description: 'Hire when busy and offer capacity when schedules open.',
    icon: Network,
  },
] as const;

const licenseStatusOptions = [
  { value: 'licensed', label: 'Current license held' },
  { value: 'credentialed', label: 'Certification or credential held' },
  { value: 'not-required', label: 'No license required for this work' },
  { value: 'in-progress', label: 'License or credential in progress' },
  { value: 'other', label: 'Other or not sure' },
] as const;

type ErrorMap = Record<string, string[]>;

export type WorkerFieldDefaults = {
  professionalStatus?: string | null;
  otherProfessionalStatus?: string | null;
  experienceRange?: string | null;
  availabilityPreference?: string | null;
  desiredRate?: string | null;
  serviceArea?: string | null;
  travelRadiusMiles?: number | null;
  ownsTools?: boolean | null;
  reliableTransportation?: boolean | null;
};

export type ContractorFieldDefaults = {
  businessName?: string | null;
  serviceArea?: string | null;
  availabilityPreference?: string | null;
};

export type BusinessFieldDefaults = {
  businessName?: string | null;
  businessType?: string | null;
  licenseStatus?: string | null;
  companySize?: string | null;
  serviceArea?: string | null;
  shortageFrequency?: string | null;
};

export type HiringFirmFieldDefaults = {
  organizationName?: string | null;
  contactRole?: string | null;
  marketsServed?: string | null;
  shortDurationInterest?: boolean | null;
};

export function TextField({
  name,
  label,
  error,
  ...props
}: React.ComponentProps<typeof Input> & {
  name: string;
  label: string;
  error?: string;
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel htmlFor={name} className="form-label">
        {label}
      </FieldLabel>
      <Input
        id={name}
        name={name}
        className="form-input min-w-0 max-w-full"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      <FieldError id={`${name}-error`}>{error}</FieldError>
    </Field>
  );
}

export function SelectField({
  name,
  label,
  placeholder,
  options,
  error,
  value,
  defaultValue,
  ...props
}: Omit<React.ComponentProps<'select'>, 'size'> & {
  name: string;
  label: string;
  placeholder: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  error?: string;
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel htmlFor={name} className="form-label">
        {label}
      </FieldLabel>
      <NativeSelect
        id={name}
        name={name}
        className="form-select min-w-0 max-w-full"
        value={value}
        defaultValue={value === undefined ? (defaultValue ?? '') : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      >
        <NativeSelectOption value="" disabled={props.required}>
          {placeholder}
        </NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <FieldError id={`${name}-error`}>{error}</FieldError>
    </Field>
  );
}

function IntentSelector({
  intent,
  setIntent,
  error,
}: {
  intent: Intent | null;
  setIntent: (intent: Intent) => void;
  error?: string;
}) {
  return (
    <fieldset
      className="mt-6"
      aria-describedby={error ? 'intent-error' : undefined}
    >
      <legend className="text-sm font-semibold">
        How do you expect to participate?
      </legend>
      <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-3">
        {businessIntentOptions.map((option) => {
          const Icon = option.icon;
          const active = intent === option.value;
          return (
            <label
              key={option.value}
              className={`intent-card min-w-0 cursor-pointer ${active ? 'intent-card-active' : ''}`}
            >
              <input
                className="sr-only"
                type="radio"
                name="intent"
                value={option.value}
                checked={active}
                onChange={() => setIntent(option.value)}
              />
              <Icon className="size-5" aria-hidden="true" />
              <span className="mt-4 block text-sm font-semibold uppercase">
                {option.label}
              </span>
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                {option.description}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id="intent-error">{error}</FieldError>
    </fieldset>
  );
}

export function WorkerFields({
  errors,
  professionalStatus,
  setProfessionalStatus,
  otherProfessionalStatus,
  setOtherProfessionalStatus,
  additionalTrades,
  onToggle,
  defaults,
}: {
  errors: ErrorMap;
  professionalStatus: string;
  setProfessionalStatus: (value: string) => void;
  otherProfessionalStatus: string;
  setOtherProfessionalStatus: (value: string) => void;
  additionalTrades: string[];
  onToggle: (value: string) => void;
  defaults?: WorkerFieldDefaults;
}) {
  return (
    <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
      <SelectField
        name="professionalStatus"
        label="Professional or credential level"
        placeholder="Select your current level"
        options={PROFESSIONAL_STATUSES.filter(
          (status) => status.value !== 'business',
        )}
        value={professionalStatus}
        onChange={(event) => setProfessionalStatus(event.target.value)}
        error={errors.professionalStatus?.[0]}
      />
      {professionalStatus === 'other' && (
        <TextField
          name="otherProfessionalStatus"
          label="License or credential type"
          placeholder="License or credential"
          value={otherProfessionalStatus}
          onChange={(event) => setOtherProfessionalStatus(event.target.value)}
          error={errors.otherProfessionalStatus?.[0]}
        />
      )}
      <SelectField
        name="experienceRange"
        label="Experience range (optional)"
        placeholder="Choose a range"
        options={EXPERIENCE_RANGES}
        defaultValue={defaults?.experienceRange ?? ''}
        error={errors.experienceRange?.[0]}
      />
      <SelectField
        name="availabilityPreference"
        label="Current availability preference"
        placeholder="Select availability"
        options={AVAILABILITY_OPTIONS}
        defaultValue={defaults?.availabilityPreference ?? ''}
        error={errors.availabilityPreference?.[0]}
      />
      <TextField
        name="desiredRate"
        label="Desired hourly or day rate (optional)"
        placeholder="e.g. $32/hour"
        defaultValue={defaults?.desiredRate ?? ''}
        error={errors.desiredRate?.[0]}
      />
      <TextField
        name="serviceArea"
        label="Markets you will travel to (optional if radius is provided)"
        placeholder="e.g. Tulsa metro"
        defaultValue={defaults?.serviceArea ?? ''}
        error={errors.serviceArea?.[0]}
      />
      <TextField
        name="travelRadiusMiles"
        label="Approximate travel radius (optional)"
        type="number"
        inputMode="numeric"
        min="0"
        max="500"
        placeholder="Miles"
        defaultValue={defaults?.travelRadiusMiles ?? ''}
        error={errors.travelRadiusMiles?.[0]}
      />
      <SelectField
        name="ownsTools"
        label="Own tools (optional)"
        placeholder="Choose an answer"
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        defaultValue={booleanDefault(defaults?.ownsTools)}
        error={errors.ownsTools?.[0]}
      />
      <SelectField
        name="reliableTransportation"
        label="Reliable transportation (optional)"
        placeholder="Choose an answer"
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        defaultValue={booleanDefault(defaults?.reliableTransportation)}
        error={errors.reliableTransportation?.[0]}
      />
      <MultiChoice
        errorId="additional-trades-error"
        className="sm:col-span-2"
        label="Additional trades or skills (optional)"
        values={additionalTrades}
        options={PUBLIC_TRADES}
        onToggle={onToggle}
        error={errors.additionalTrades?.[0]}
      />
      <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">
        Profile details are self-reported. Credentials receive a verified label
        only after review.
      </p>
    </div>
  );
}

export function ContractorFields({
  errors,
  licenseStatus,
  setLicenseStatus,
  eligibilityConfirmed,
  setEligibilityConfirmed,
  additionalTrades,
  onToggleAdditional,
  defaults,
}: {
  errors: ErrorMap;
  licenseStatus: string;
  setLicenseStatus: (value: string) => void;
  eligibilityConfirmed: boolean;
  setEligibilityConfirmed: (value: boolean) => void;
  additionalTrades: string[];
  onToggleAdditional: (value: string) => void;
  defaults?: ContractorFieldDefaults;
}) {
  return (
    <>
      <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
        <TextField
          name="businessName"
          label="Business or operating name"
          placeholder="Name or business"
          autoComplete="organization"
          defaultValue={defaults?.businessName ?? ''}
          error={errors.businessName?.[0]}
        />
        <SelectField
          name="licenseStatus"
          label="License or credential status"
          placeholder="Choose your current status"
          options={licenseStatusOptions}
          value={licenseStatus}
          onChange={(event) => setLicenseStatus(event.target.value)}
          error={errors.licenseStatus?.[0]}
        />
        <TextField
          name="serviceArea"
          label="Home market and service area"
          placeholder="e.g. Tulsa metro"
          defaultValue={defaults?.serviceArea ?? ''}
          error={errors.serviceArea?.[0]}
        />
        <SelectField
          name="availabilityPreference"
          label="Availability or available capacity"
          placeholder="Select availability"
          options={AVAILABILITY_OPTIONS}
          defaultValue={defaults?.availabilityPreference ?? ''}
          error={errors.availabilityPreference?.[0]}
        />
        <MultiChoice
          errorId="additional-trades-error"
          className="sm:col-span-2"
          label="Additional trades or services (optional)"
          values={additionalTrades}
          options={PUBLIC_TRADES}
          onToggle={onToggleAdditional}
          error={errors.additionalTrades?.[0]}
        />
      </div>
      {licenseStatus === 'licensed' && (
        <div className="mt-6 flex items-start gap-3 border border-input bg-white/[0.03] p-4 text-xs leading-5 text-muted-foreground">
          <Checkbox
            id="contractor-eligibility-confirmed"
            checked={eligibilityConfirmed}
            onCheckedChange={(checked) =>
              setEligibilityConfirmed(Boolean(checked))
            }
            className="mt-0.5"
            aria-invalid={Boolean(errors.contractorEligibilityConfirmed)}
            aria-describedby={
              errors.contractorEligibilityConfirmed
                ? 'contractor-eligibility-error'
                : undefined
            }
          />
          <div className="min-w-0">
            <label
              htmlFor="contractor-eligibility-confirmed"
              className="cursor-pointer font-bold text-foreground"
            >
              I confirm that I own or am authorized to represent the currently
              licensed contractor identified in this registration.
            </label>
            <FieldError id="contractor-eligibility-error">
              {errors.contractorEligibilityConfirmed?.[0]}
            </FieldError>
          </div>
        </div>
      )}
      {licenseStatus === 'licensed' && (
        <div className="mt-6 border-l-2 border-primary pl-4 text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground">
            Secure license verification comes next.
          </strong>{' '}
          After confirming your email, add the license number and supporting
          details in your secure portal. LaborTrader manually reviews every
          claim before marking it verified.
        </div>
      )}
    </>
  );
}

export function BusinessFields({
  errors,
  intent,
  setIntent,
  tradesNeeded,
  servicesOffered,
  onToggleNeeded,
  onToggleOffered,
  licenseStatus,
  setLicenseStatus,
  defaults,
}: {
  errors: ErrorMap;
  intent: Intent | null;
  setIntent: (intent: Intent) => void;
  tradesNeeded: string[];
  servicesOffered: string[];
  onToggleNeeded: (value: string) => void;
  onToggleOffered: (value: string) => void;
  licenseStatus: string;
  setLicenseStatus: (value: string) => void;
  defaults?: BusinessFieldDefaults;
}) {
  return (
    <>
      <IntentSelector
        intent={intent}
        setIntent={setIntent}
        error={errors.intent?.[0]}
      />
      <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
        <SelectField
          name="businessType"
          label="Service business type"
          placeholder="Select your service business type"
          options={BUSINESS_TYPES}
          defaultValue={defaults?.businessType ?? ''}
          error={errors.businessType?.[0]}
        />
        <SelectField
          name="licenseStatus"
          label="Business license or credential status"
          placeholder="Choose the closest fit"
          options={licenseStatusOptions}
          value={licenseStatus}
          onChange={(event) => setLicenseStatus(event.target.value)}
          error={errors.licenseStatus?.[0]}
        />
        <SelectField
          name="companySize"
          label="Approximate company size"
          placeholder="Select company size"
          options={COMPANY_SIZES}
          defaultValue={defaults?.companySize ?? ''}
          error={errors.companySize?.[0]}
        />
        <TextField
          name="serviceArea"
          label="Home market and service area"
          placeholder="e.g. Northeast Oklahoma"
          defaultValue={defaults?.serviceArea ?? ''}
          error={errors.serviceArea?.[0]}
        />
        {(intent === 'HIRE' || intent === 'BOTH') && (
          <MultiChoice
            errorId="trades-needed-error"
            className="sm:col-span-2"
            label="Trades your service business expects to need"
            values={tradesNeeded}
            options={PUBLIC_TRADES}
            onToggle={onToggleNeeded}
            error={errors.tradesNeeded?.[0]}
          />
        )}
        {(intent === 'WORK' || intent === 'BOTH') && (
          <MultiChoice
            errorId="services-offered-error"
            className="sm:col-span-2"
            label="Trades or services your service business can offer"
            values={servicesOffered}
            options={PUBLIC_TRADES}
            onToggle={onToggleOffered}
            error={errors.servicesOffered?.[0]}
          />
        )}
        <SelectField
          name="shortageFrequency"
          label="Shortage or availability timing (optional)"
          placeholder="Choose the closest fit"
          options={SHORTAGE_TIMING_OPTIONS}
          defaultValue={defaults?.shortageFrequency ?? ''}
          error={errors.shortageFrequency?.[0]}
        />
      </div>
    </>
  );
}

export function HiringFirmFields({
  errors,
  organizationType,
  setOrganizationType,
  tradesNeeded,
  onToggleTrade,
  defaults,
}: {
  errors: ErrorMap;
  organizationType: string;
  setOrganizationType: (value: string) => void;
  tradesNeeded: string[];
  onToggleTrade: (value: string) => void;
  defaults?: HiringFirmFieldDefaults;
}) {
  return (
    <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
      <p className="text-sm leading-6 text-muted-foreground sm:col-span-2">
        This profile is for hiring skilled labor or service businesses. For a
        defined project, use Client &amp; Project Owner registration.
      </p>
      <SelectField
        name="organizationType"
        label="Organization type"
        placeholder="Select organization type"
        options={ORGANIZATION_TYPES}
        value={organizationType}
        onChange={(event) => setOrganizationType(event.target.value)}
        error={errors.organizationType?.[0]}
      />
      <TextField
        name="contactRole"
        label="Your role"
        placeholder="e.g. Operations director"
        defaultValue={defaults?.contactRole ?? ''}
        error={errors.contactRole?.[0]}
      />
      <TextField
        name="marketsServed"
        label="Markets served"
        placeholder="Cities, metros, or states"
        defaultValue={defaults?.marketsServed ?? ''}
        error={errors.marketsServed?.[0]}
      />
      <MultiChoice
        errorId="trades-needed-error"
        className="sm:col-span-2"
        label="Trades your organization expects to hire"
        values={tradesNeeded}
        options={PUBLIC_TRADES}
        onToggle={onToggleTrade}
        error={errors.tradesNeeded?.[0]}
      />
      <fieldset
        className="sm:col-span-2"
        aria-describedby={
          errors.shortDurationInterest ? 'short-duration-error' : undefined
        }
      >
        <legend className="form-label">
          Interest in short-duration skilled-trade assignments
        </legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { value: 'yes', label: 'Yes, this is relevant' },
            { value: 'no', label: 'Not currently' },
          ].map((option) => (
            <label
              key={option.value}
              className="flex min-h-11 cursor-pointer items-center gap-3 border border-foreground/14 bg-white/[0.03] p-3 text-sm font-bold has-[:checked]:border-primary"
            >
              <input
                type="radio"
                name="shortDurationInterest"
                value={option.value}
                defaultChecked={
                  defaults?.shortDurationInterest === (option.value === 'yes')
                }
                className="size-4 accent-primary"
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError id="short-duration-error">
          {errors.shortDurationInterest?.[0]}
        </FieldError>
      </fieldset>
      <div className="border-l-2 border-primary pl-4 text-xs leading-5 text-muted-foreground sm:col-span-2">
        Staffing, payroll, and workforce-supply organizations use a separate
        partner review.{' '}
        <Link
          href="/partners#partner-inquiry"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-foreground underline underline-offset-2"
        >
          Open the partner inquiry in a new tab
        </Link>
        .
      </div>
    </div>
  );
}

function booleanDefault(value: boolean | null | undefined) {
  if (value === true) return 'yes';
  if (value === false) return 'no';
  return '';
}

function MultiChoice({
  errorId,
  label,
  values,
  options,
  onToggle,
  error,
  className = '',
}: {
  errorId: string;
  label: string;
  values: string[];
  options: ReadonlyArray<{
    value?: string;
    slug?: string;
    label: string;
    category?: string;
  }>;
  onToggle: (value: string) => void;
  error?: string;
  className?: string;
}) {
  const categories = Array.from(
    new Set(options.map((option) => option.category).filter(Boolean)),
  ) as string[];
  const renderOption = (option: (typeof options)[number]) => {
    const value = option.value || option.slug || '';
    return (
      <label
        key={value}
        className="flex min-h-11 min-w-0 cursor-pointer items-center gap-3 border border-foreground/10 bg-white/[0.03] p-3 text-xs font-semibold hover:border-primary/45"
      >
        <Checkbox
          checked={values.includes(value)}
          onCheckedChange={() => onToggle(value)}
        />
        <span className="min-w-0">{option.label}</span>
      </label>
    );
  };

  return (
    <fieldset
      className={`min-w-0 ${className}`}
      aria-describedby={error ? errorId : undefined}
    >
      <legend className="form-label">{label}</legend>
      {categories.length ? (
        <div className="mt-3 grid min-w-0 gap-5">
          {categories.map((category) => (
            <div key={category}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {category}
              </p>
              <div className="grid min-w-0 gap-2 sm:grid-cols-2">
                {options
                  .filter((option) => option.category === category)
                  .map(renderOption)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2">
          {options.map(renderOption)}
        </div>
      )}
      <FieldError id={errorId}>{error}</FieldError>
    </fieldset>
  );
}
