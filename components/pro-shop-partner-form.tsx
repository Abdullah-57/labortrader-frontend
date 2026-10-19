'use client';

import { fetchWithTimeout } from '@/lib/browser-request';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MarketingConsentFields } from '@/components/marketing-consent-fields';
import { UsMobileField } from '@/components/us-mobile-field';
import { ArrowRight, Check, ShieldCheck, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { readAttribution } from '@/lib/client-attribution';
import { createIdempotencyKey } from '@/lib/client-id';
import { PUBLIC_TRADES, US_STATES } from '@/lib/constants';
import { focusFirstFormError } from '@/lib/form-feedback';
import { normalizeUsPhoneToE164 } from '@/lib/verification-domain';

const proShopFieldIds: Record<string, string> = {
  organizationName: 'pro-shop-organization',
  publicBrandName: 'pro-shop-public-brand',
  contactName: 'pro-shop-contact',
  titleRole: 'pro-shop-title',
  email: 'pro-shop-email',
  phone: 'pro-shop-phone',
  websiteUrl: 'pro-shop-website-url',
  headquartersCity: 'pro-shop-headquarters-city',
  headquartersState: 'pro-shop-headquarters-state',
  headquartersZip: 'pro-shop-headquarters-zip',
  fulfillmentCoverage: 'pro-shop-fulfillment',
  primaryCategory: 'pro-shop-primary-category',
  otherCategory: 'pro-shop-other-category',
  customerRolesServed: 'pro-shop-customer-roles-error',
  servedTradeSlugs: 'pro-shop-served-trades-error',
  requestedStates: 'pro-shop-states-error',
  placementInterests: 'pro-shop-placement-error',
  offerSummary: 'pro-shop-offer-summary',
  affiliateProgramStatus: 'pro-shop-affiliate-status',
  affiliateProgramUrl: 'pro-shop-affiliate-url',
  affiliateProgramDetails: 'pro-shop-affiliate-details',
  marketingBudgetBand: 'pro-shop-budget',
  affiliateSubIdSupport: 'pro-shop-affiliate-sub-id',
  applicationAcknowledged: 'pro-shop-application-acknowledgement',
};
import {
  PRO_SHOP_AFFILIATE_PROGRAM_STATUSES,
  PRO_SHOP_AFFILIATE_SUB_ID_SUPPORT,
  PRO_SHOP_CUSTOMER_ROLES,
  PRO_SHOP_FOUNDING_FIRST_YEAR_CENTS_PER_STATE,
  PRO_SHOP_FOUNDING_RENEWAL_YEARS,
  PRO_SHOP_FULFILLMENT_COVERAGE,
  PRO_SHOP_MARKETING_BUDGET_BANDS,
  PRO_SHOP_PLACEMENT_INTERESTS,
  PRO_SHOP_PLANNED_STANDARD_ANNUAL_CENTS_PER_STATE,
  PRO_SHOP_PROVIDER_CATEGORIES,
} from '@/lib/pro-shop';

type Errors = Record<string, string[]>;

function formText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

function toggleSelection(value: string, values: string[]) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function ApplicationSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section
      data-step={number}
      className="lt-form-section mt-6 min-w-0 border border-input bg-white/[0.03] p-4 sm:p-6"
    >
      <div className="mb-6 flex items-start gap-3 border-b border-input pb-4">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold tracking-[-0.025em]">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function ProShopPartnerForm() {
  const [primaryCategory, setPrimaryCategory] = useState('');
  const [requestedStates, setRequestedStates] = useState<string[]>([]);
  const [placementInterests, setPlacementInterests] = useState<string[]>([]);
  const [customerRolesServed, setCustomerRolesServed] = useState<string[]>([]);
  const [servedTradeSlugs, setServedTradeSlugs] = useState<string[]>([]);
  const [fulfillmentCoverage, setFulfillmentCoverage] = useState('');
  const [affiliateProgramStatus, setAffiliateProgramStatus] = useState('');
  const [affiliateSubIdSupport, setAffiliateSubIdSupport] = useState('');
  const [applicationAcknowledged, setApplicationAcknowledged] = useState(false);
  const [emailMarketingConsent, setEmailMarketingConsent] = useState(false);
  const [smsConsent, setSmsConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const idempotencyKey = useRef('');
  const statusRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLElement>(null);
  const requestedStateEstimate = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(
    (requestedStates.length * PRO_SHOP_FOUNDING_FIRST_YEAR_CENTS_PER_STATE) /
      100,
  );
  const foundingStateRate = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(PRO_SHOP_FOUNDING_FIRST_YEAR_CENTS_PER_STATE / 100);
  const standardCategoryStateRate = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(PRO_SHOP_PLANNED_STANDARD_ANNUAL_CENTS_PER_STATE / 100);

  useEffect(() => {
    if (message) statusRef.current?.focus();
    if (sent) successRef.current?.focus();
  }, [message, sent]);

  function showProShopErrors(nextErrors: Errors, nextMessage: string) {
    setErrors(nextErrors);
    setMessage(nextMessage);
    focusFirstFormError({
      summary: statusRef.current,
      errors: nextErrors,
      fieldIds: proShopFieldIds,
    });
  }

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const localErrors: Errors = {};

    const organizationName = formText(form, 'organizationName').trim();
    const publicBrandName = formText(form, 'publicBrandName').trim();
    const contactName = formText(form, 'contactName').trim();
    const titleRole = formText(form, 'titleRole').trim();
    const email = formText(form, 'email').trim();
    const phone = formText(form, 'phone').trim();
    const websiteUrl = formText(form, 'websiteUrl').trim();
    const headquartersCity = formText(form, 'headquartersCity').trim();
    const headquartersState = formText(form, 'headquartersState').trim();
    const headquartersZip = formText(form, 'headquartersZip').trim();
    const offerSummary = formText(form, 'offerSummary').trim();

    if (organizationName.length < 2)
      localErrors.organizationName = ['Enter the organization name.'];
    if (publicBrandName.length < 2)
      localErrors.publicBrandName = ['Enter the public brand name.'];
    if (contactName.length < 2)
      localErrors.contactName = ['Enter the primary contact name.'];
    if (titleRole && titleRole.length < 2) {
      localErrors.titleRole = ['Enter a valid contact title or role.'];
    }
    if (!/^\S+@\S+\.\S+$/u.test(email)) {
      localErrors.email = ['Enter a valid work email address.'];
    }
    if (!phone) localErrors.phone = ['Enter a mobile number.'];
    else if (!normalizeUsPhoneToE164(phone)) {
      localErrors.phone = [
        'Enter a complete 10-digit U.S. mobile number (example: 415 555 2671).',
      ];
    }
    if (!websiteUrl) localErrors.websiteUrl = ['Enter the company website URL.'];
    if (headquartersCity.length < 2)
      localErrors.headquartersCity = ['Enter headquarters city.'];
    if (!US_STATES.includes(headquartersState as never)) {
      localErrors.headquartersState = ['Choose headquarters state.'];
    }
    if (!/^\d{5}(?:-\d{4})?$/u.test(headquartersZip)) {
      localErrors.headquartersZip = ['Enter a valid headquarters ZIP code.'];
    }
    if (!fulfillmentCoverage) {
      localErrors.fulfillmentCoverage = ['Choose fulfillment coverage.'];
    }
    if (!primaryCategory) {
      localErrors.primaryCategory = ['Choose a primary vendor category.'];
    }
    if (
      (primaryCategory === 'OTHER' || primaryCategory === 'JOBSITE_SERVICES') &&
      !formText(form, 'otherCategory').trim()
    ) {
      localErrors.otherCategory = [
        'Describe the vendor category and proposed scope.',
      ];
    }
    if (requestedStates.length === 0) {
      localErrors.requestedStates = ['Choose at least one state.'];
    }
    if (placementInterests.length === 0) {
      localErrors.placementInterests = ['Choose at least one placement type.'];
    }
    if (customerRolesServed.length === 0) {
      localErrors.customerRolesServed = ['Choose at least one customer role.'];
    }
    if (
      primaryCategory === 'SPECIALTY_SUPPLY' &&
      servedTradeSlugs.length === 0
    ) {
      localErrors.servedTradeSlugs = [
        'Choose at least one trade served by the specialty supply.',
      ];
    }
    if (offerSummary.length < 20) {
      localErrors.offerSummary = [
        'Describe the offer in at least 20 characters.',
      ];
    }
    if (!affiliateProgramStatus) {
      localErrors.affiliateProgramStatus = [
        'Choose an affiliate program status.',
      ];
    }
    if (!affiliateSubIdSupport) {
      localErrors.affiliateSubIdSupport = [
        'Choose whether affiliate sub-IDs are supported.',
      ];
    }
    if (!applicationAcknowledged) {
      localErrors.applicationAcknowledged = [
        'Review and accept the application acknowledgement to continue.',
      ];
    }

    if (Object.keys(localErrors).length > 0) {
      showProShopErrors(
        localErrors,
        'Complete the required application fields highlighted below and try again.',
      );
      return;
    }

    setSending(true);
    setMessage('');
    setErrors({});
    const attribution = readAttribution();
    const payload = {
      organizationName: formText(form, 'organizationName'),
      publicBrandName: formText(form, 'publicBrandName'),
      contactName: formText(form, 'contactName'),
      titleRole: formText(form, 'titleRole'),
      email: formText(form, 'email'),
      phone: formText(form, 'phone'),
      websiteUrl: formText(form, 'websiteUrl'),
      headquartersCity: formText(form, 'headquartersCity'),
      headquartersState: formText(form, 'headquartersState'),
      headquartersZip: formText(form, 'headquartersZip'),
      primaryCategory,
      otherCategory:
        primaryCategory === 'OTHER' || primaryCategory === 'JOBSITE_SERVICES'
          ? formText(form, 'otherCategory')
          : '',
      requestedStates,
      placementInterests,
      customerRolesServed,
      fulfillmentCoverage,
      servedTradeSlugs,
      offerSummary: formText(form, 'offerSummary'),
      affiliateProgramStatus,
      affiliateProgramUrl: formText(form, 'affiliateProgramUrl'),
      affiliateProgramDetails: formText(form, 'affiliateProgramDetails'),
      affiliateSubIdSupport,
      marketingBudgetBand: formText(form, 'marketingBudgetBand'),
      termsAccepted: applicationAcknowledged,
      privacyAcknowledged: applicationAcknowledged,
      accurateInfoConfirmed: applicationAcknowledged,
      emailMarketingConsent,
      smsConsent,
      idempotencyKey:
        idempotencyKey.current ||
        (idempotencyKey.current = createIdempotencyKey()),
      acquisitionSource: attribution.source || attribution.utm_source || '',
      landingPage: attribution.landing_page || '',
      utmSource: attribution.utm_source || '',
      utmMedium: attribution.utm_medium || '',
      utmCampaign: attribution.utm_campaign || '',
      utmContent: attribution.utm_content || '',
      utmTerm: attribution.utm_term || '',
      website: formText(form, 'website'),
    };

    try {
      const response = await fetchWithTimeout('/api/pro-shop/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        message?: string;
        errors?: Errors;
      };

      if (!response.ok || !data.ok) {
        const responseErrors = { ...data.errors };
        const acknowledgementError =
          responseErrors.termsAccepted?.[0] ||
          responseErrors.privacyAcknowledged?.[0] ||
          responseErrors.accurateInfoConfirmed?.[0];
        if (acknowledgementError) {
          responseErrors.applicationAcknowledged = [acknowledgementError];
          delete responseErrors.termsAccepted;
          delete responseErrors.privacyAcknowledged;
          delete responseErrors.accurateInfoConfirmed;
        }
        showProShopErrors(
          responseErrors,
          data.message ||
            'Your application was not submitted. Review the information and try again.',
        );
        return;
      }

      setSent(true);
    } catch {
      setMessage(
        'LaborTrader could not be reached. Check your connection and try again.',
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <section
        ref={successRef}
        aria-live="polite"
        tabIndex={-1}
        className="lt-surface-light block border border-foreground/14 bg-card p-7 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-9 lt-form-panel"
      >
        <Check className="size-7 text-primary" aria-hidden="true" />
        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">
          Application Received
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Your Pro Shop application is in.
        </h3>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">
          Your application is saved and a confirmation email is on the way. Open
          that message to verify your email. Check spam or promotions if you do
          not see it within a minute. If you already verified this address, you
          are set—no second confirmation email is sent. We will review your
          category, states, and offer. Selected vendors receive written terms
          and payment instructions. Nothing is due now.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link className="button-dark" href="/pro-shop">
            Return to the Pro Shop <ArrowRight aria-hidden="true" />
          </Link>
          <Link
            className="inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.09em] underline decoration-primary decoration-2 underline-offset-4"
            href="/"
          >
            Return Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="lt-surface-light min-w-0 max-w-full border border-foreground/14 bg-card p-5 text-foreground sm:p-8 lt-form-panel"
      noValidate
    >
      <div className="mb-8 border-l-2 border-primary pl-4">
        <p className="text-sm font-semibold leading-6">
          Apply now with no card and no application fee.
        </p>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          Selected vendors receive written terms before payment.
        </p>
      </div>

      <ApplicationSection
        number="01"
        title="Company and Listing Basics"
        description="Tell us who you are, where you are based, and the product or service category you want us to review."
      >
        <div className="grid min-w-0 max-w-full gap-5 sm:grid-cols-2">
          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-organization" className="form-label">
              Organization
            </FieldLabel>
            <Input
              id="pro-shop-organization"
              name="organizationName"
              autoComplete="organization"
              className="form-input"
              required
              minLength={2}
              maxLength={160}
              aria-invalid={Boolean(errors.organizationName)}
              aria-describedby={
                errors.organizationName
                  ? 'pro-shop-organization-error'
                  : undefined
              }
            />
            <FieldError id="pro-shop-organization-error">
              {errors.organizationName?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-public-brand" className="form-label">
              Public Brand Name <span>Optional</span>
            </FieldLabel>
            <Input
              id="pro-shop-public-brand"
              name="publicBrandName"
              autoComplete="organization"
              className="form-input"
              maxLength={160}
              placeholder="Brand or DBA"
              aria-invalid={Boolean(errors.publicBrandName)}
              aria-describedby={
                errors.publicBrandName
                  ? 'pro-shop-public-brand-error'
                  : undefined
              }
            />
            <FieldError id="pro-shop-public-brand-error">
              {errors.publicBrandName?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-contact" className="form-label">
              Contact Name
            </FieldLabel>
            <Input
              id="pro-shop-contact"
              name="contactName"
              autoComplete="name"
              className="form-input"
              required
              minLength={2}
              maxLength={120}
              aria-invalid={Boolean(errors.contactName)}
              aria-describedby={
                errors.contactName ? 'pro-shop-contact-error' : undefined
              }
            />
            <FieldError id="pro-shop-contact-error">
              {errors.contactName?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-title" className="form-label">
              Title or Role <span>Optional</span>
            </FieldLabel>
            <Input
              id="pro-shop-title"
              name="titleRole"
              autoComplete="organization-title"
              className="form-input"
              maxLength={120}
              aria-invalid={Boolean(errors.titleRole)}
              aria-describedby={
                errors.titleRole ? 'pro-shop-title-error' : undefined
              }
            />
            <FieldError id="pro-shop-title-error">
              {errors.titleRole?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-email" className="form-label">
              Work Email
            </FieldLabel>
            <Input
              id="pro-shop-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="form-input"
              required
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? 'pro-shop-email-error' : undefined
              }
            />
            <FieldError id="pro-shop-email-error">
              {errors.email?.[0]}
            </FieldError>
          </Field>

          <UsMobileField
            id="pro-shop-phone"
            name="phone"
            label="Mobile phone"
            required
            error={errors.phone?.[0]}
            help="U.S. mobile only — enter as (555) 123-4567. Required for application contact; providing a number does not opt you into recurring texts."
            onChange={() => setSmsConsent(false)}
          />

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-website-url" className="form-label">
              Organization Website
            </FieldLabel>
            <Input
              id="pro-shop-website-url"
              name="websiteUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              placeholder="https://example.com"
              className="form-input"
              required
              maxLength={500}
              pattern="https://.+"
              aria-invalid={Boolean(errors.websiteUrl)}
              aria-describedby={
                errors.websiteUrl ? 'pro-shop-website-url-error' : undefined
              }
            />
            <FieldError id="pro-shop-website-url-error">
              {errors.websiteUrl?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel
              htmlFor="pro-shop-headquarters-city"
              className="form-label"
            >
              Headquarters City
            </FieldLabel>
            <Input
              id="pro-shop-headquarters-city"
              name="headquartersCity"
              autoComplete="address-level2"
              className="form-input"
              required
              minLength={2}
              maxLength={100}
              aria-invalid={Boolean(errors.headquartersCity)}
              aria-describedby={
                errors.headquartersCity
                  ? 'pro-shop-headquarters-city-error'
                  : undefined
              }
            />
            <FieldError id="pro-shop-headquarters-city-error">
              {errors.headquartersCity?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel
              htmlFor="pro-shop-headquarters-state"
              className="form-label"
            >
              Headquarters State
            </FieldLabel>
            <NativeSelect
              id="pro-shop-headquarters-state"
              name="headquartersState"
              className="form-select min-w-0 max-w-full"
              defaultValue=""
              autoComplete="address-level1"
              required
              aria-invalid={Boolean(errors.headquartersState)}
              aria-describedby={
                errors.headquartersState
                  ? 'pro-shop-headquarters-state-error'
                  : undefined
              }
            >
              <NativeSelectOption value="" disabled>
                Select state
              </NativeSelectOption>
              {US_STATES.map((stateCode) => (
                <NativeSelectOption key={stateCode} value={stateCode}>
                  {stateCode}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError id="pro-shop-headquarters-state-error">
              {errors.headquartersState?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel
              htmlFor="pro-shop-headquarters-zip"
              className="form-label"
            >
              Headquarters ZIP
            </FieldLabel>
            <Input
              id="pro-shop-headquarters-zip"
              name="headquartersZip"
              inputMode="numeric"
              autoComplete="postal-code"
              className="form-input"
              required
              pattern="[0-9]{5}(-[0-9]{4})?"
              maxLength={10}
              aria-invalid={Boolean(errors.headquartersZip)}
              aria-describedby={
                errors.headquartersZip
                  ? 'pro-shop-headquarters-zip-error'
                  : undefined
              }
            />
            <FieldError id="pro-shop-headquarters-zip-error">
              {errors.headquartersZip?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-fulfillment" className="form-label">
              Fulfillment Coverage
            </FieldLabel>
            <NativeSelect
              id="pro-shop-fulfillment"
              name="fulfillmentCoverage"
              className="form-select min-w-0 max-w-full"
              value={fulfillmentCoverage}
              onChange={(event) => setFulfillmentCoverage(event.target.value)}
              required
              aria-invalid={Boolean(errors.fulfillmentCoverage)}
              aria-describedby={
                errors.fulfillmentCoverage
                  ? 'pro-shop-fulfillment-error'
                  : undefined
              }
            >
              <NativeSelectOption value="" disabled>
                Select coverage
              </NativeSelectOption>
              {PRO_SHOP_FULFILLMENT_COVERAGE.map((coverage) => (
                <NativeSelectOption key={coverage.value} value={coverage.value}>
                  {coverage.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError id="pro-shop-fulfillment-error">
              {errors.fulfillmentCoverage?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel
              htmlFor="pro-shop-primary-category"
              className="form-label"
            >
              Primary Pro Shop Category
            </FieldLabel>
            <NativeSelect
              id="pro-shop-primary-category"
              name="primaryCategory"
              className="form-select min-w-0 max-w-full"
              value={primaryCategory}
              onChange={(event) => setPrimaryCategory(event.target.value)}
              required
              aria-invalid={Boolean(errors.primaryCategory)}
              aria-describedby={
                errors.primaryCategory
                  ? 'pro-shop-primary-category-error'
                  : 'pro-shop-category-note'
              }
            >
              <NativeSelectOption value="" disabled>
                Choose a category
              </NativeSelectOption>
              {PRO_SHOP_PROVIDER_CATEGORIES.map((category) => (
                <NativeSelectOption key={category.value} value={category.value}>
                  {category.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <p
              id="pro-shop-category-note"
              className="text-xs leading-5 text-muted-foreground"
            >
              The {foundingStateRate} founding rate applies to one approved
              vendor category in each approved state for the first 12 active
              months.
            </p>
            <FieldError id="pro-shop-primary-category-error">
              {errors.primaryCategory?.[0]}
            </FieldError>
          </Field>

          {(primaryCategory === 'OTHER' ||
            primaryCategory === 'JOBSITE_SERVICES') && (
            <Field className="min-w-0 sm:col-span-2">
              <FieldLabel
                htmlFor="pro-shop-other-category"
                className="form-label"
              >
                {primaryCategory === 'OTHER'
                  ? 'Describe Your Category'
                  : 'Describe the Jobsite Service Scope'}
              </FieldLabel>
              <Input
                id="pro-shop-other-category"
                name="otherCategory"
                className="form-input"
                required
                maxLength={160}
                placeholder="What do you provide, and what should the placement cover?"
                aria-invalid={Boolean(errors.otherCategory)}
                aria-describedby={
                  errors.otherCategory
                    ? 'pro-shop-other-category-error'
                    : undefined
                }
              />
              <FieldError id="pro-shop-other-category-error">
                {errors.otherCategory?.[0]}
              </FieldError>
            </Field>
          )}
        </div>
      </ApplicationSection>

      <ApplicationSection
        number="02"
        title="Audience and Market Coverage"
        description="Choose who you serve, the trades you support, and the states where you want a listing."
      >
        <fieldset
          className="min-w-0 border border-input bg-card/70 p-4 sm:p-5"
          aria-invalid={Boolean(errors.customerRolesServed)}
          aria-describedby="pro-shop-customer-roles-error"
        >
          <legend className="px-2 text-[11px] font-semibold uppercase tracking-[0.1em]">
            Customer Roles Served
          </legend>
          <p className="mb-4 text-xs leading-5 text-muted-foreground">
            Choose the customers you serve.
          </p>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {PRO_SHOP_CUSTOMER_ROLES.map((role) => {
              const checked = customerRolesServed.includes(role.value);
              return (
                <div
                  key={role.value}
                  className="flex min-h-12 items-center gap-3 border border-input bg-card p-3 text-sm font-bold leading-5 hover:border-primary"
                >
                  <Checkbox
                    id={`pro-shop-customer-${role.value.toLowerCase()}`}
                    checked={checked}
                    onCheckedChange={() =>
                      setCustomerRolesServed((current) =>
                        toggleSelection(role.value, current),
                      )
                    }
                    aria-label={`Serve ${role.label}`}
                  />
                  <label
                    htmlFor={`pro-shop-customer-${role.value.toLowerCase()}`}
                    className="cursor-pointer"
                  >
                    {role.label}
                  </label>
                </div>
              );
            })}
          </div>
          <FieldError id="pro-shop-customer-roles-error">
            {errors.customerRolesServed?.[0]}
          </FieldError>
        </fieldset>

        <details
          key={primaryCategory === 'SPECIALTY_SUPPLY' ? 'required' : 'optional'}
          open={primaryCategory === 'SPECIALTY_SUPPLY' ? true : undefined}
          className="mt-5 min-w-0 border border-input bg-card/70"
        >
          <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-5">
            <span>
              Trades Served{' '}
              {primaryCategory === 'SPECIALTY_SUPPLY'
                ? '(required for Specialty Supply)'
                : '(optional)'}
            </span>
            <span className="text-primary" aria-hidden="true">
              +
            </span>
          </summary>
          <fieldset
            className="border-t border-input p-4 sm:p-5"
            aria-invalid={Boolean(errors.servedTradeSlugs)}
            aria-describedby="pro-shop-served-trades-error"
          >
            <legend className="sr-only">Trades served</legend>
            <p className="mb-4 text-xs leading-5 text-muted-foreground">
              Choose the trades your offer serves.
            </p>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
              {PUBLIC_TRADES.map((trade) => {
                const checked = servedTradeSlugs.includes(trade.slug);
                return (
                  <div
                    key={trade.slug}
                    className="flex min-h-12 items-center gap-3 border border-input bg-card p-3 text-xs font-bold leading-5 hover:border-primary"
                  >
                    <Checkbox
                      id={`pro-shop-trade-${trade.slug}`}
                      checked={checked}
                      onCheckedChange={() =>
                        setServedTradeSlugs((current) =>
                          toggleSelection(trade.slug, current),
                        )
                      }
                      aria-label={`Serve ${trade.label}`}
                    />
                    <label
                      htmlFor={`pro-shop-trade-${trade.slug}`}
                      className="cursor-pointer"
                    >
                      {trade.label}
                    </label>
                  </div>
                );
              })}
            </div>
            <FieldError id="pro-shop-served-trades-error">
              {errors.servedTradeSlugs?.[0]}
            </FieldError>
          </fieldset>
        </details>

        <fieldset
          className="mt-5 min-w-0 border border-input bg-card/70 p-4 sm:p-5"
          aria-invalid={Boolean(errors.requestedStates)}
          aria-describedby="pro-shop-state-pricing-note pro-shop-states-error"
        >
          <legend className="px-2 text-[11px] font-semibold uppercase tracking-[0.1em]">
            States Requested
          </legend>
          <p className="mb-4 text-xs leading-5 text-muted-foreground">
            Choose your states. Each category-state listing is priced
            separately.
          </p>
          <FieldLabel htmlFor="pro-shop-add-state" className="sr-only">
            Add a requested state
          </FieldLabel>
          <NativeSelect
            id="pro-shop-add-state"
            value=""
            onChange={(event) => {
              const stateCode = event.target.value;
              if (stateCode && !requestedStates.includes(stateCode))
                setRequestedStates((current) => [...current, stateCode]);
            }}
            aria-describedby="pro-shop-states-error"
            aria-invalid={Boolean(errors.requestedStates)}
          >
            <NativeSelectOption value="">Add a state</NativeSelectOption>
            {US_STATES.filter(
              (stateCode) => !requestedStates.includes(stateCode),
            ).map((stateCode) => (
              <NativeSelectOption key={stateCode} value={stateCode}>
                {stateCode}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          <div className="lt-state-tags" aria-label="Selected states">
            {requestedStates.map((stateCode) => (
              <button
                key={stateCode}
                type="button"
                aria-label={`Remove ${stateCode}`}
                onClick={() =>
                  setRequestedStates((current) =>
                    current.filter((state) => state !== stateCode),
                  )
                }
              >
                {stateCode}
                <X className="size-4" aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-xs font-bold text-muted-foreground">
              {requestedStates.length === 0
                ? 'No states selected'
                : `${requestedStates.length} state${requestedStates.length === 1 ? '' : 's'} selected`}
            </p>
            {requestedStates.length > 0 && (
              <button
                type="button"
                className="min-h-11 text-xs font-semibold uppercase tracking-[0.08em] underline decoration-primary decoration-2 underline-offset-4"
                onClick={() => setRequestedStates([])}
              >
                Clear States
              </button>
            )}
          </div>
          <p
            id="pro-shop-state-pricing-note"
            className="mt-3 border-l-2 border-primary pl-3 text-xs font-bold leading-5 text-foreground"
          >
            {requestedStates.length === 0
              ? 'Select states to see a non-binding founding-rate estimate.'
              : `${requestedStates.length} category-state listing${requestedStates.length === 1 ? '' : 's'} x ${foundingStateRate} = ${requestedStateEstimate} for the first 12 active months if approved.`}{' '}
            Eligible Founding Partners may renew at the same annual rate for the
            next {PRO_SHOP_FOUNDING_RENEWAL_YEARS} years. Renewals are not
            automatic. The standard rate after that is{' '}
            {standardCategoryStateRate} per category and state per year. Nothing
            is due when you apply.
          </p>
          <FieldError id="pro-shop-states-error">
            {errors.requestedStates?.[0]}
          </FieldError>
        </fieldset>
      </ApplicationSection>

      <ApplicationSection
        number="03"
        title="Offer and Placement"
        description="Describe your offer, preferred placements, and affiliate program."
      >
        <fieldset
          className="min-w-0 border border-input bg-card/70 p-4 sm:p-5"
          aria-invalid={Boolean(errors.placementInterests)}
          aria-describedby="pro-shop-placement-error"
        >
          <legend className="px-2 text-[11px] font-semibold uppercase tracking-[0.1em]">
            Placement Interests
          </legend>
          <p className="mb-4 text-xs leading-5 text-muted-foreground">
            Choose the placements that interest you.
          </p>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {PRO_SHOP_PLACEMENT_INTERESTS.map((interest) => {
              const checked = placementInterests.includes(interest.value);
              return (
                <div
                  key={interest.value}
                  className="flex min-h-12 cursor-pointer items-center gap-3 border border-input bg-card p-3 text-sm font-bold leading-5 hover:border-primary"
                >
                  <Checkbox
                    id={`pro-shop-placement-${interest.value.toLowerCase()}`}
                    checked={checked}
                    onCheckedChange={() =>
                      setPlacementInterests((current) =>
                        toggleSelection(interest.value, current),
                      )
                    }
                    aria-label={`Request ${interest.label}`}
                  />
                  <label
                    htmlFor={`pro-shop-placement-${interest.value.toLowerCase()}`}
                    className="cursor-pointer"
                  >
                    {interest.label}
                  </label>
                </div>
              );
            })}
          </div>
          <FieldError id="pro-shop-placement-error">
            {errors.placementInterests?.[0]}
          </FieldError>
          <p className="mt-4 border-l-2 border-primary pl-3 text-xs font-bold leading-5 text-muted-foreground">
            The founding rate covers your listing. Optional advertising is
            priced separately, with first bidding opportunity for Founding
            Partners.
          </p>
        </fieldset>

        <div className="mt-5 grid min-w-0 max-w-full gap-5 sm:grid-cols-2">
          <Field className="min-w-0 sm:col-span-2">
            <FieldLabel htmlFor="pro-shop-offer-summary" className="form-label">
              What Do You Want to Offer LaborTrader Markets?
            </FieldLabel>
            <Textarea
              id="pro-shop-offer-summary"
              name="offerSummary"
              className="min-h-32 rounded-none bg-white/[0.03]"
              required
              minLength={20}
              maxLength={3000}
              placeholder="Describe your products or services, ideal customers, geographic reach, and what makes the offer useful to the trades."
              aria-invalid={Boolean(errors.offerSummary)}
              aria-describedby={
                errors.offerSummary ? 'pro-shop-offer-summary-error' : undefined
              }
            />
            <FieldError id="pro-shop-offer-summary-error">
              {errors.offerSummary?.[0]}
            </FieldError>
          </Field>
        </div>
      </ApplicationSection>

      <ApplicationSection
        number="04"
        title="Affiliate and Measurement"
        description="Tell us how you can support tracked referrals and measure partner traffic. An acceptable affiliate or referral structure is required before activation."
      >
        <div className="grid min-w-0 max-w-full gap-5 sm:grid-cols-2">
          <Field className="min-w-0">
            <FieldLabel
              htmlFor="pro-shop-affiliate-status"
              className="form-label"
            >
              Affiliate Program
            </FieldLabel>
            <NativeSelect
              id="pro-shop-affiliate-status"
              name="affiliateProgramStatus"
              className="form-select min-w-0 max-w-full"
              value={affiliateProgramStatus}
              onChange={(event) =>
                setAffiliateProgramStatus(event.target.value)
              }
              required
              aria-invalid={Boolean(errors.affiliateProgramStatus)}
              aria-describedby={
                errors.affiliateProgramStatus
                  ? 'pro-shop-affiliate-status-error'
                  : undefined
              }
            >
              <NativeSelectOption value="" disabled>
                Select one
              </NativeSelectOption>
              {PRO_SHOP_AFFILIATE_PROGRAM_STATUSES.map((status) => (
                <NativeSelectOption key={status.value} value={status.value}>
                  {status.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError id="pro-shop-affiliate-status-error">
              {errors.affiliateProgramStatus?.[0]}
            </FieldError>
            <p className="text-xs leading-5 text-muted-foreground">
              Listings need an approved affiliate or referral arrangement.
              Select your current status.
            </p>
          </Field>

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-affiliate-url" className="form-label">
              Public Affiliate or Partner Information URL <span>Optional</span>
            </FieldLabel>
            <Input
              id="pro-shop-affiliate-url"
              name="affiliateProgramUrl"
              type="url"
              inputMode="url"
              placeholder="https://example.com"
              className="form-input"
              maxLength={500}
              pattern="https://.+"
              aria-invalid={Boolean(errors.affiliateProgramUrl)}
              aria-describedby={
                errors.affiliateProgramUrl
                  ? 'pro-shop-affiliate-url-error'
                  : undefined
              }
            />
            <FieldError id="pro-shop-affiliate-url-error">
              {errors.affiliateProgramUrl?.[0]}
            </FieldError>
            <p className="text-xs leading-5 text-muted-foreground">
              Public information links only. Never submit passwords, API keys,
              or private dashboard links. Tracking links are arranged securely
              after approval.
            </p>
          </Field>

          <Field className="min-w-0 sm:col-span-2">
            <FieldLabel
              htmlFor="pro-shop-affiliate-details"
              className="form-label"
            >
              Affiliate or Measurement Details <span>Optional</span>
            </FieldLabel>
            <Textarea
              id="pro-shop-affiliate-details"
              name="affiliateProgramDetails"
              className="min-h-24 rounded-none bg-white/[0.03]"
              maxLength={1800}
              placeholder="Share commission structure, reporting capabilities, tracking window, platform, or the program you could create."
              aria-invalid={Boolean(errors.affiliateProgramDetails)}
              aria-describedby={
                errors.affiliateProgramDetails
                  ? 'pro-shop-affiliate-details-error'
                  : undefined
              }
            />
            <FieldError id="pro-shop-affiliate-details-error">
              {errors.affiliateProgramDetails?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel htmlFor="pro-shop-budget" className="form-label">
              Estimated Annual Marketing Budget <span>Optional</span>
            </FieldLabel>
            <NativeSelect
              id="pro-shop-budget"
              name="marketingBudgetBand"
              className="form-select min-w-0 max-w-full"
              defaultValue=""
              aria-invalid={Boolean(errors.marketingBudgetBand)}
              aria-describedby={
                errors.marketingBudgetBand ? 'pro-shop-budget-error' : undefined
              }
            >
              <NativeSelectOption value="">
                Prefer not to say
              </NativeSelectOption>
              {PRO_SHOP_MARKETING_BUDGET_BANDS.map((band) => (
                <NativeSelectOption key={band.value} value={band.value}>
                  {band.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError id="pro-shop-budget-error">
              {errors.marketingBudgetBand?.[0]}
            </FieldError>
          </Field>

          <Field className="min-w-0">
            <FieldLabel
              htmlFor="pro-shop-affiliate-sub-id"
              className="form-label"
            >
              Affiliate Sub-ID Support
            </FieldLabel>
            <NativeSelect
              id="pro-shop-affiliate-sub-id"
              name="affiliateSubIdSupport"
              className="form-select min-w-0 max-w-full"
              value={affiliateSubIdSupport}
              onChange={(event) => setAffiliateSubIdSupport(event.target.value)}
              required
              aria-invalid={Boolean(errors.affiliateSubIdSupport)}
              aria-describedby={
                errors.affiliateSubIdSupport
                  ? 'pro-shop-affiliate-sub-id-error'
                  : 'pro-shop-affiliate-sub-id-note'
              }
            >
              <NativeSelectOption value="" disabled>
                Select one
              </NativeSelectOption>
              {PRO_SHOP_AFFILIATE_SUB_ID_SUPPORT.map((option) => (
                <NativeSelectOption key={option.value} value={option.value}>
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <p
              id="pro-shop-affiliate-sub-id-note"
              className="text-xs leading-5 text-muted-foreground"
            >
              Sub-IDs can help compare LaborTrader click sources with provider
              conversion reporting.
            </p>
            <FieldError id="pro-shop-affiliate-sub-id-error">
              {errors.affiliateSubIdSupport?.[0]}
            </FieldError>
          </Field>
        </div>
      </ApplicationSection>

      <ApplicationSection
        number="05"
        title="Review and Apply"
        description="Confirm the application details, choose whether you want optional partner updates, and submit."
      >
        <div className="grid min-w-0 gap-3">
          <div className="flex min-w-0 items-start gap-3 border border-input bg-card p-4 text-xs leading-5 text-muted-foreground">
            <Checkbox
              id="pro-shop-application-acknowledgement"
              checked={applicationAcknowledged}
              onCheckedChange={(checked) =>
                setApplicationAcknowledged(Boolean(checked))
              }
              className="mt-0.5"
              aria-required="true"
              aria-invalid={Boolean(errors.applicationAcknowledged)}
              aria-describedby={
                errors.applicationAcknowledged
                  ? 'pro-shop-application-acknowledgement-error'
                  : undefined
              }
            />
            <div className="min-w-0">
              <label
                htmlFor="pro-shop-application-acknowledgement"
                className="cursor-pointer"
              >
                I certify that I am authorized to submit this application and
                that the information is accurate. I agree to the{' '}
                <Link
                  className="font-bold underline"
                  href="/terms#founding-pro-shop-partner-terms"
                >
                  Founding Pro Shop Partner Terms
                </Link>{' '}
                within the Website Terms and acknowledge the{' '}
                <Link className="font-bold underline" href="/privacy">
                  Privacy Policy
                </Link>
                . I understand this is an application, not a reserved listing,
                binding price, or purchase. LaborTrader will send essential
                application and account emails.
              </label>
              <FieldError id="pro-shop-application-acknowledgement-error">
                {errors.applicationAcknowledged?.[0]}
              </FieldError>
            </div>
          </div>

          <MarketingConsentFields
            prefix="pro-shop"
            audience="vendor"
            emailConsent={emailMarketingConsent}
            onEmailChange={setEmailMarketingConsent}
            smsConsent={smsConsent}
            onSmsChange={setSmsConsent}
          />
        </div>

        <input
          name="website"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {message && (
          <div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            className="mt-6 border-l-2 border-destructive pl-4 text-sm font-semibold leading-6 text-destructive outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {message}
            {Object.keys(errors).length > 0 && (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {Object.entries(errors).map(([field, fieldErrors]) => (
                  <li key={field}>{fieldErrors[0]}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={sending}
          className="mt-7 min-h-13 w-full whitespace-normal rounded-none bg-primary px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-primary-foreground hover:bg-primary/90"
        >
          {sending
            ? 'Submitting your application…'
            : 'Apply as a Founding Pro Shop Vendor'}
          {!sending && <ArrowRight className="size-4" aria-hidden="true" />}
        </Button>

        <p className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
          <ShieldCheck
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          No payment information is requested or collected by this application.
          Approved commercial terms require a separate written agreement.
        </p>
      </ApplicationSection>
    </form>
  );
}
