import { z } from 'zod';
import {
  AVAILABILITY_OPTIONS,
  BUSINESS_TYPES,
  COMPANY_SIZES,
  EXPERIENCE_RANGES,
  ORGANIZATION_TYPES,
  QUICK_TRADES,
  SHORTAGE_TIMING_OPTIONS,
  TRADE_SLUGS,
  US_STATES,
} from './constants';
import {
  PRO_SHOP_AFFILIATE_SUB_ID_SUPPORT,
  PRO_SHOP_AFFILIATE_PROGRAM_STATUSES,
  PRO_SHOP_CUSTOMER_ROLES,
  PRO_SHOP_FULFILLMENT_COVERAGE,
  PRO_SHOP_MARKETING_BUDGET_BANDS,
  PRO_SHOP_PLACEMENT_INTERESTS,
  PRO_SHOP_PROVIDER_CATEGORIES,
} from './pro-shop';
import { normalizeUsPhoneToE164 } from './verification-domain';

const optionalShortText = z
  .string()
  .trim()
  .max(160)
  .optional()
  .or(z.literal(''));
const requiredShortText = z.string().trim().min(2).max(160);
const optionValues = <Value extends string>(
  options: ReadonlyArray<{ value: Value }>,
) => options.map((option) => option.value) as [Value, ...Value[]];
const availabilityChoice = z.enum(optionValues(AVAILABILITY_OPTIONS));
const experienceChoice = z.enum(optionValues(EXPERIENCE_RANGES));
const businessTypeChoice = z.enum(optionValues(BUSINESS_TYPES));
const companySizeChoice = z.enum(optionValues(COMPANY_SIZES));
const organizationTypeChoice = z.enum(optionValues(ORGANIZATION_TYPES));
const shortageTimingChoice = z.enum(optionValues(SHORTAGE_TIMING_OPTIONS));
const quickTradeChoice = z.enum(optionValues(QUICK_TRADES), {
  error: 'Choose your primary trade or specialty.',
});
const workerProfessionalStatus = z.enum([
  'licensed',
  'journeyman',
  'apprentice',
  'technician',
  'helper',
  'not-required',
  'other',
]);
const tradeSlug = z
  .string()
  .refine((value) => TRADE_SLUGS.includes(value as never), {
    message: 'Choose a valid trade or category.',
  });

const intentSchema = z.enum(['WORK', 'HIRE', 'BOTH']);
const contractorLicenseStatus = z.enum(
  ['licensed', 'credentialed', 'not-required', 'in-progress', 'other'],
  { error: 'Choose a valid license or credential status.' },
);
const tradeList = z.array(tradeSlug).max(15);
const organizationCapability = z.enum([
  'workforce-supply',
  'hiring-demand',
  'payroll-support',
]);

const optionalMobile = z
  .string()
  .trim()
  .max(30)
  .transform((value, context) => {
    if (!value) return '';
    const normalized = normalizeUsPhoneToE164(value);
    if (normalized) return normalized;
    context.addIssue({
      code: 'custom',
      message: 'Enter a valid U.S. mobile number.',
    });
    return z.NEVER;
  })
  .optional()
  .or(z.literal(''));

const requiredMobile = z
  .string()
  .trim()
  .min(1, 'Enter your mobile number.')
  .max(30)
  .transform((value, context) => {
    const normalized = normalizeUsPhoneToE164(value);
    if (normalized) return normalized;
    context.addIssue({
      code: 'custom',
      message: 'Enter a valid U.S. mobile number.',
    });
    return z.NEVER;
  });

function isPublicProgramUrl(value: string) {
  try {
    const parsed = new URL(value);
    if (parsed.username || parsed.password) return false;
    const hostname = parsed.hostname.toLowerCase().replace(/\.$/u, '');
    const localDevelopmentHost =
      hostname === 'localhost' || hostname === '127.0.0.1';
    if (localDevelopmentHost) {
      return (
        parsed.protocol === 'http:' && process.env.NODE_ENV !== 'production'
      );
    }
    if (parsed.protocol !== 'https:') return false;
    if (
      hostname === '0.0.0.0' ||
      hostname === '::1' ||
      hostname === '[::1]' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      /^(?:10|127|169\.254|192\.168)\./u.test(hostname)
    ) {
      return false;
    }
    const match172 = hostname.match(/^172\.(\d{1,3})\./u);
    if (match172 && Number(match172[1]) >= 16 && Number(match172[1]) <= 31) {
      return false;
    }
    return Boolean(hostname && hostname.includes('.'));
  } catch {
    return false;
  }
}

const publicProgramUrl = z.string().trim().max(500).refine(isPublicProgramUrl, {
  message: 'Enter a public HTTPS URL without private access credentials.',
});

const requiredRegistrationAcknowledgements = {
  termsAccepted: z.literal(true, {
    error: 'Agree to the Website Terms to continue.',
  }),
  privacyAcknowledged: z.literal(true, {
    error: 'Acknowledge the Privacy Policy to continue.',
  }),
  launchEmailAcknowledged: z.literal(true, {
    error: 'Acknowledge the essential registration emails to continue.',
  }),
  serviceMessagesAcknowledged: z.literal(true, {
    error: 'Acknowledge the essential registration emails to continue.',
  }),
};

const optionalReferralCode = z
  .string()
  .trim()
  .toUpperCase()
  .max(35)
  .refine(
    (value) => !value || /^(?:LT-)?[A-Z0-9]{6,32}$/u.test(value),
    'Enter a valid referral code.',
  )
  .optional()
  .or(z.literal(''));

export const AUDIENCE_TYPES = [
  'WORKER',
  'CONTRACTOR',
  'BUSINESS',
  'HIRING_FIRM',
] as const;

export type AudienceType = (typeof AUDIENCE_TYPES)[number];

export function normalizeAudienceType(value: unknown): AudienceType | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().toUpperCase().replaceAll('-', '_');
  if (normalized === 'INDIVIDUAL_WORKER') return 'WORKER';
  if (normalized === 'INDEPENDENT_CONTRACTOR') return 'CONTRACTOR';
  if (normalized === 'TRADE_BUSINESS') return 'BUSINESS';
  return AUDIENCE_TYPES.includes(normalized as AudienceType)
    ? (normalized as AudienceType)
    : null;
}

const commonEarlyAccessShape = {
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email('Enter a valid email address.')),
  mobile: optionalMobile,
  city: z.string().trim().min(2, 'Enter your city.').max(100),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => US_STATES.includes(value as never), {
      message: 'Choose a valid state.',
    }),
  zip: z
    .string()
    .trim()
    .regex(/^\d{5}(?:-\d{4})?$/, 'Enter a valid ZIP code.'),
  primaryTradeSlug: tradeSlug,
  secondaryTradeSlug: tradeSlug.optional().or(z.literal('')),
  otherTrade: z.string().trim().max(160).optional().or(z.literal('')),
  emailMarketingConsent: z.boolean().optional().default(false),
  smsConsent: z.boolean().optional().default(false),
  idempotencyKey: z.uuid(),
  acquisitionSource: optionalShortText,
  landingPage: z.string().trim().max(500).optional().or(z.literal('')),
  utmSource: optionalShortText,
  utmMedium: optionalShortText,
  utmCampaign: optionalShortText,
  utmContent: optionalShortText,
  utmTerm: optionalShortText,
  promoCode: z.string().trim().max(80).optional().or(z.literal('')),
  referredByCode: optionalReferralCode,
  manageExisting: z.boolean().optional().default(false),
  website: z.string().max(0).optional().or(z.literal('')),
};

const publicEarlyAccessShape = {
  ...commonEarlyAccessShape,
  mobile: requiredMobile,
  ...requiredRegistrationAcknowledgements,
};

const workerEarlyAccessSchema = z
  .object({
    ...publicEarlyAccessShape,
    audienceType: z.literal('WORKER'),
    intent: z.literal('WORK').optional().default('WORK'),
    professionalStatus: workerProfessionalStatus,
    otherProfessionalStatus: optionalShortText,
    experienceRange: experienceChoice.optional().or(z.literal('')),
    availabilityPreference: availabilityChoice,
    desiredRate: optionalShortText,
    serviceArea: optionalShortText,
    travelRadiusMiles: z.number().int().min(0).max(500).nullable().optional(),
    ownsTools: z.boolean().nullable().optional(),
    reliableTransportation: z.boolean().nullable().optional(),
    additionalTrades: tradeList.optional().default([]),
  })
  .superRefine((input, context) => {
    if (
      input.professionalStatus === 'other' &&
      (!input.otherProfessionalStatus ||
        input.otherProfessionalStatus.trim().length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherProfessionalStatus'],
        message: 'Enter your license or credential type.',
      });
    }
    if (!input.serviceArea && input.travelRadiusMiles == null) {
      context.addIssue({
        code: 'custom',
        path: ['serviceArea'],
        message: 'Enter a travel area or choose a travel radius.',
      });
    }
  });

const contractorEarlyAccessInputSchema = z
  .object({
    ...publicEarlyAccessShape,
    audienceType: z.literal('CONTRACTOR'),
    intent: intentSchema,
    businessName: z
      .string()
      .trim()
      .min(2, 'Enter your operating name.')
      .max(160),
    businessType: optionalShortText,
    licenseStatus: contractorLicenseStatus,
    availabilityPreference: availabilityChoice,
    serviceArea: requiredShortText,
    servicesOffered: tradeList.optional().default([]),
    additionalTrades: tradeList.optional().default([]),
    contractorEligibilityConfirmed: z.boolean().optional().default(false),
  })
  .superRefine((input, context) => {
    if (
      input.licenseStatus.trim().toLowerCase() === 'licensed' &&
      !input.contractorEligibilityConfirmed
    ) {
      context.addIssue({
        code: 'custom',
        path: ['contractorEligibilityConfirmed'],
        message:
          'Confirm that you are authorized to make this licensed status claim.',
      });
    }
  });

const businessEarlyAccessSchema = z
  .object({
    ...publicEarlyAccessShape,
    audienceType: z.literal('BUSINESS'),
    intent: intentSchema,
    businessName: z
      .string()
      .trim()
      .min(2, 'Enter your business name.')
      .max(160),
    businessType: businessTypeChoice,
    licenseStatus: contractorLicenseStatus,
    companySize: companySizeChoice,
    serviceArea: requiredShortText,
    tradesNeeded: tradeList.optional().default([]),
    servicesOffered: tradeList.optional().default([]),
    shortageFrequency: shortageTimingChoice.optional().or(z.literal('')),
  })
  .superRefine((input, context) => {
    if (
      (input.intent === 'HIRE' || input.intent === 'BOTH') &&
      !input.tradesNeeded.length
    ) {
      context.addIssue({
        code: 'custom',
        path: ['tradesNeeded'],
        message: 'Choose at least one trade you may need.',
      });
    }
    if (
      (input.intent === 'WORK' || input.intent === 'BOTH') &&
      !input.servicesOffered.length
    ) {
      context.addIssue({
        code: 'custom',
        path: ['servicesOffered'],
        message: 'Choose at least one trade or service you may offer.',
      });
    }
    if (input.intent === 'HIRE' && input.servicesOffered.length) {
      context.addIssue({
        code: 'custom',
        path: ['servicesOffered'],
        message: 'Offered services are not used for a hire-only registration.',
      });
    }
    if (input.intent === 'WORK' && input.tradesNeeded.length) {
      context.addIssue({
        code: 'custom',
        path: ['tradesNeeded'],
        message: 'Needed trades are not used for an offer-only registration.',
      });
    }
  });

const hiringFirmEarlyAccessSchema = z.object({
  ...publicEarlyAccessShape,
  audienceType: z.literal('HIRING_FIRM'),
  intent: intentSchema.optional().default('HIRE'),
  businessName: z
    .string()
    .trim()
    .min(2, 'Enter your organization name.')
    .max(160),
  organizationType: organizationTypeChoice,
  contactRole: requiredShortText,
  marketsServed: z.string().trim().min(2).max(600),
  tradesNeeded: tradeList.min(
    1,
    'Choose at least one trade supplied or hired.',
  ),
  organizationCapabilities: z.array(organizationCapability).min(1).max(3),
  shortDurationInterest: z.boolean(),
});

export const earlyAccessSchema = z
  .discriminatedUnion('audienceType', [
    workerEarlyAccessSchema,
    contractorEarlyAccessInputSchema,
    businessEarlyAccessSchema,
    hiringFirmEarlyAccessSchema,
  ])
  .superRefine((input, context) => {
    const selectedTrades = [
      input.primaryTradeSlug,
      ...('additionalTrades' in input ? input.additionalTrades : []),
      ...('tradesNeeded' in input ? input.tradesNeeded : []),
      ...('servicesOffered' in input ? input.servicesOffered : []),
    ];
    if (
      selectedTrades.includes('other-skilled-trade') &&
      (!input.otherTrade || input.otherTrade.length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherTrade'],
        message: 'Tell us which trade or specialty you perform or hire for.',
      });
    }
    if (input.secondaryTradeSlug === input.primaryTradeSlug) {
      context.addIssue({
        code: 'custom',
        path: ['secondaryTradeSlug'],
        message: 'Choose a different secondary trade or leave it blank.',
      });
    }
    if (input.secondaryTradeSlug === 'other-skilled-trade') {
      context.addIssue({
        code: 'custom',
        path: ['secondaryTradeSlug'],
        message: 'Choose a listed secondary trade or leave it blank.',
      });
    }
    if (input.smsConsent && !input.mobile) {
      context.addIssue({
        code: 'custom',
        path: ['mobile'],
        message: 'Enter a mobile number before opting in to text messages.',
      });
    }
  });

// Compatibility parser for the legacy contractor form payload used before the
// multi-audience launch-list update. New public requests use earlyAccessSchema.
export const contractorEarlyAccessSchema = z
  .object({
    ...publicEarlyAccessShape,
    intent: intentSchema,
    businessName: z.string().trim().min(2).max(160),
    contractorEligibilityConfirmed: z.literal(true, {
      error:
        'Confirm that you represent a currently licensed trade contractor.',
    }),
  })
  .transform((input) => ({
    ...input,
    audienceType: 'CONTRACTOR' as const,
    licenseStatus: 'licensed' as const,
    availabilityPreference: 'future' as const,
    serviceArea: `${input.city}, ${input.state}`,
    servicesOffered: [input.primaryTradeSlug],
    additionalTrades: [],
  }));

export const quickLaunchInterestSchema = z
  .object({
    audienceType: z.enum(AUDIENCE_TYPES, {
      error: 'Choose how you will use LaborTrader.',
    }),
    name: z.string().trim().min(2, 'Enter your name.').max(120),
    organizationName: z.string().trim().max(160).optional().or(z.literal('')),
    email: z
      .string()
      .trim()
      .max(254)
      .pipe(z.email('Enter a valid email address.')),
    mobile: requiredMobile,
    city: z.string().trim().min(2, 'Enter your city.').max(100),
    state: z
      .string()
      .trim()
      .toUpperCase()
      .refine((value) => US_STATES.includes(value as never), {
        message: 'Choose a valid state.',
      }),
    zip: z
      .string()
      .trim()
      .regex(/^\d{5}(?:-\d{4})?$/, 'Enter a valid ZIP code.'),
    primaryTradeSlug: quickTradeChoice,
    secondaryTradeSlug: quickTradeChoice.optional().or(z.literal('')),
    otherTrade: z.string().trim().max(160).optional().or(z.literal('')),
    ...requiredRegistrationAcknowledgements,
    emailMarketingConsent: z.boolean().optional().default(false),
    smsConsent: z.boolean().optional().default(false),
    idempotencyKey: z.uuid(),
    acquisitionSource: optionalShortText,
    landingPage: z.string().trim().max(500).optional().or(z.literal('')),
    utmSource: optionalShortText,
    utmMedium: optionalShortText,
    utmCampaign: optionalShortText,
    utmContent: optionalShortText,
    utmTerm: optionalShortText,
    promoCode: z.string().trim().max(80).optional().or(z.literal('')),
    referredByCode: optionalReferralCode,
    website: z.string().max(0).optional().or(z.literal('')),
  })
  .superRefine((input, context) => {
    if (
      (input.audienceType === 'BUSINESS' ||
        input.audienceType === 'HIRING_FIRM') &&
      (!input.organizationName || input.organizationName.length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['organizationName'],
        message: 'Enter your organization name.',
      });
    }
    if (
      input.primaryTradeSlug === 'other-skilled-trade' &&
      (!input.otherTrade || input.otherTrade.length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherTrade'],
        message: 'Tell us which trade or skilled service you provide or need.',
      });
    }
    if (input.secondaryTradeSlug === input.primaryTradeSlug) {
      context.addIssue({
        code: 'custom',
        path: ['secondaryTradeSlug'],
        message: 'Choose a different secondary trade or leave it blank.',
      });
    }
    if (input.secondaryTradeSlug === 'other-skilled-trade') {
      context.addIssue({
        code: 'custom',
        path: ['secondaryTradeSlug'],
        message: 'Choose a listed secondary trade or leave it blank.',
      });
    }
  });

/**
 * One public registration contract for the Early Access page. The market and
 * contact fields are required, while role-specific account details may be
 * saved as a draft. The server separately evaluates the same payload with
 * `earlyAccessSchema` before marking the account complete or unlocking
 * completion-gated programs.
 */
export const progressiveEarlyAccessSchema = quickLaunchInterestSchema.and(
  z.object({
    intent: intentSchema.optional(),
    businessName: optionalShortText,
    businessType: businessTypeChoice.optional().or(z.literal('')),
    professionalStatus: workerProfessionalStatus.optional().or(z.literal('')),
    otherProfessionalStatus: optionalShortText,
    experienceRange: experienceChoice.optional().or(z.literal('')),
    availabilityPreference: availabilityChoice.optional().or(z.literal('')),
    desiredRate: optionalShortText,
    serviceArea: z.string().trim().max(600).optional().or(z.literal('')),
    travelRadiusMiles: z.number().int().min(0).max(500).nullable().optional(),
    ownsTools: z.boolean().nullable().optional(),
    reliableTransportation: z.boolean().nullable().optional(),
    additionalTrades: tradeList.optional().default([]),
    licenseStatus: contractorLicenseStatus.optional().or(z.literal('')),
    contractorEligibilityConfirmed: z.boolean().optional().default(false),
    companySize: companySizeChoice.optional().or(z.literal('')),
    tradesNeeded: tradeList.optional().default([]),
    servicesOffered: tradeList.optional().default([]),
    shortageFrequency: shortageTimingChoice.optional().or(z.literal('')),
    organizationType: organizationTypeChoice.optional().or(z.literal('')),
    contactRole: optionalShortText,
    marketsServed: z.string().trim().max(600).optional().or(z.literal('')),
    organizationCapabilities: z
      .array(organizationCapability)
      .max(3)
      .optional()
      .default([]),
    shortDurationInterest: z.boolean().nullable().optional(),
    manageExisting: z.boolean().optional().default(false),
  }),
);

export function completedEarlyAccessInput(
  input: ProgressiveEarlyAccessInput | EarlyAccessInput,
) {
  const completed = earlyAccessSchema.safeParse(input);
  return completed.success ? completed.data : null;
}

export const importEarlyAccessSchema = z
  .object({
    ...commonEarlyAccessShape,
    audienceType: z.enum(AUDIENCE_TYPES),
    intent: intentSchema,
    professionalStatus: optionalShortText,
    otherProfessionalStatus: optionalShortText,
    experienceRange: optionalShortText,
    availabilityPreference: optionalShortText,
    desiredRate: optionalShortText,
    serviceArea: z.string().trim().max(600).optional().or(z.literal('')),
    travelRadiusMiles: z.number().int().min(0).max(500).nullable().optional(),
    ownsTools: z.boolean().nullable().optional(),
    reliableTransportation: z.boolean().nullable().optional(),
    additionalTrades: tradeList.optional().default([]),
    businessName: optionalShortText,
    businessType: optionalShortText,
    licenseStatus: optionalShortText,
    companySize: optionalShortText,
    tradesNeeded: tradeList.optional().default([]),
    servicesOffered: tradeList.optional().default([]),
    shortageFrequency: optionalShortText,
    laborTypes: z
      .array(z.string().trim().max(80))
      .max(8)
      .optional()
      .default([]),
    organizationType: optionalShortText,
    contactRole: optionalShortText,
    marketsServed: z.string().trim().max(600).optional().or(z.literal('')),
    organizationCapabilities: z
      .array(organizationCapability)
      .max(3)
      .optional()
      .default([]),
    shortDurationInterest: z.boolean().nullable().optional(),
    contractorEligibilityConfirmed: z.boolean().optional().default(false),
  })
  .superRefine((input, context) => {
    if (
      input.audienceType === 'WORKER' &&
      input.professionalStatus === 'other' &&
      (!input.otherProfessionalStatus ||
        input.otherProfessionalStatus.trim().length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherProfessionalStatus'],
        message: 'Enter your license or credential type.',
      });
    }
  });

export const optionalDetailsSchema = z
  .object({
    audienceType: z.enum(AUDIENCE_TYPES).optional(),
    professionalStatus: optionalShortText,
    otherProfessionalStatus: optionalShortText,
    experienceRange: optionalShortText,
    availabilityPreference: optionalShortText,
    desiredRate: optionalShortText,
    serviceArea: z.string().trim().max(600).optional().or(z.literal('')),
    additionalTrades: z.array(tradeSlug).max(12).optional(),
    travelRadiusMiles: z.number().int().min(0).max(500).nullable().optional(),
    ownsTools: z.boolean().nullable().optional(),
    reliableTransportation: z.boolean().nullable().optional(),
    businessName: optionalShortText,
    businessType: optionalShortText,
    licenseStatus: optionalShortText,
    companySize: optionalShortText,
    tradesNeeded: z.array(tradeSlug).max(15).optional(),
    servicesOffered: z.array(tradeSlug).max(15).optional(),
    shortageFrequency: optionalShortText,
    laborTypes: z.array(z.string().trim().max(80)).max(8).optional(),
    organizationType: optionalShortText,
    contactRole: optionalShortText,
    marketsServed: z.string().trim().max(600).optional().or(z.literal('')),
    organizationCapabilities: z.array(organizationCapability).max(3).optional(),
    shortDurationInterest: z.boolean().nullable().optional(),
  })
  .superRefine((input, context) => {
    const hasStatus = input.professionalStatus !== undefined;
    const hasOtherStatus = input.otherProfessionalStatus !== undefined;
    if (hasStatus !== hasOtherStatus) {
      context.addIssue({
        code: 'custom',
        path: [hasStatus ? 'otherProfessionalStatus' : 'professionalStatus'],
        message: 'Update the professional level and its explanation together.',
      });
      return;
    }
    if (
      input.professionalStatus === 'other' &&
      (!input.otherProfessionalStatus ||
        input.otherProfessionalStatus.trim().length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherProfessionalStatus'],
        message: 'Enter your license or credential type.',
      });
    }
  });

export const participantProfileCorrectionSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your name.').max(120),
    organizationName: z.string().trim().max(160).optional().or(z.literal('')),
    city: z.string().trim().min(2, 'Enter your city.').max(100),
    state: z
      .string()
      .trim()
      .toUpperCase()
      .refine((value) => US_STATES.includes(value as never), {
        message: 'Choose a valid state.',
      }),
    zip: z
      .string()
      .trim()
      .regex(/^\d{5}(?:-\d{4})?$/, 'Enter a valid ZIP code.'),
    primaryTradeSlug: tradeSlug,
    secondaryTradeSlug: tradeSlug.optional().or(z.literal('')),
    otherTrade: z.string().trim().max(160).optional().or(z.literal('')),
    idempotencyKey: z.uuid(),
  })
  .superRefine((input, context) => {
    if (
      input.primaryTradeSlug === 'other-skilled-trade' &&
      (!input.otherTrade || input.otherTrade.length < 2)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherTrade'],
        message: 'Tell us which trade or specialty you perform or hire for.',
      });
    }
    if (input.secondaryTradeSlug === input.primaryTradeSlug) {
      context.addIssue({
        code: 'custom',
        path: ['secondaryTradeSlug'],
        message: 'Choose a different secondary trade or leave it blank.',
      });
    }
    if (input.secondaryTradeSlug === 'other-skilled-trade') {
      context.addIssue({
        code: 'custom',
        path: ['secondaryTradeSlug'],
        message: 'Choose a listed secondary trade or leave it blank.',
      });
    }
  });

const inquiryAttribution = {
  acquisitionSource: optionalShortText,
  landingPage: z.string().trim().max(500).optional().or(z.literal('')),
  utmSource: optionalShortText,
  utmMedium: optionalShortText,
  utmCampaign: optionalShortText,
  utmContent: optionalShortText,
  utmTerm: optionalShortText,
};

/**
 * Client preregistration is intentionally separate from the labor-side
 * registration contract. A client is expressing future demand for completed
 * work, not claiming a trade, credential, or worker profile.
 */
export const clientPreregistrationSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name.').max(120),
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email('Enter a valid email address.')),
  phone: requiredMobile,
  city: z.string().trim().min(2, 'Enter your city.').max(100),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .refine((value) => US_STATES.includes(value as never), {
      message: 'Choose a valid state.',
    }),
  termsAccepted: z.literal(true, {
    error: 'Agree to the Website Terms to continue.',
  }),
  privacyAcknowledged: z.literal(true, {
    error: 'Acknowledge the Privacy Policy to continue.',
  }),
  serviceMessagesAcknowledged: z.literal(true, {
    error: 'Acknowledge the essential preregistration emails to continue.',
  }),
  emailMarketingConsent: z.boolean().optional().default(false),
  smsMarketingConsent: z.boolean().optional().default(false),
  idempotencyKey: z.uuid(),
  referredByCode: optionalReferralCode,
  website: z.string().max(0).optional().or(z.literal('')),
  ...inquiryAttribution,
});

const inquiryContact = {
  privacyAcknowledged: z.literal(true, {
    error: 'Acknowledge the Privacy Policy to continue.',
  }),
  contactRequested: z.literal(true, {
    error: 'Confirm that you want us to contact you about this inquiry.',
  }),
  emailMarketingConsent: z.boolean().optional().default(false),
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().max(254),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  organization: z.string().trim().min(2).max(160),
  role: z.string().trim().max(120).optional().or(z.literal('')),
  idempotencyKey: z.uuid(),
  website: z.string().max(0).optional().or(z.literal('')),
};

export const partnerInquirySchema = z.object({
  ...inquiryContact,
  ...inquiryAttribution,
  role: z.string().trim().min(2).max(120),
  partnerType: z.enum([
    'staffing-payroll',
    'local-market-leader',
    'supply-distributor',
    'equipment-rental',
    'trade-school',
    'industry-association',
    'contractor-business',
    'technology-integration',
    'insurance-financial',
    'business-service',
    'marketing-distribution',
    'other',
  ]),
  organizationWebsite: z.url().max(500).optional().or(z.literal('')),
  geographicFootprint: z.string().trim().min(2).max(600),
  audience: z.string().trim().min(10).max(1200),
  audienceSize: z.string().trim().max(120).optional().or(z.literal('')),
  partnershipInterests: z
    .array(
      z.enum([
        'founding-market-launch',
        'staffing-payroll-support',
        'customer-member-benefit',
        'cobranded-early-access',
        'tracked-referral',
        'supply-branch-program',
        'student-graduate-apprentice',
        'equipment-rental',
        'technology-integration',
        'insurance-credentialing-business-services',
        'local-event-comarketing',
        'strategic-relationship',
        'other',
      ]),
    )
    .min(1)
    .max(12),
  proposedRelationship: z.string().trim().min(20).max(3000),
  activationCapacity: z.string().trim().max(1800).optional().or(z.literal('')),
  successDefinition: z.string().trim().max(1800).optional().or(z.literal('')),
});

export const investorInquirySchema = z.object({
  ...inquiryContact,
  ...inquiryAttribution,
  role: z.string().trim().min(2).max(120),
  investorType: z.enum([
    'angel',
    'family-office',
    'venture-capital',
    'strategic-corporate',
    'private-investment-group',
    'industry-operator',
    'other',
  ]),
  areasOfInterest: z
    .array(
      z.enum([
        'marketplace-model',
        'skilled-trades-market',
        'business-revenue-model',
        'go-to-market',
        'product-technology',
        'founding-market-data',
        'use-of-funds',
        'strategic-partnership',
        'funding-discussion',
        'other',
      ]),
    )
    .min(1)
    .max(10),
  preferredNextStep: z.enum([
    'request-materials',
    'introductory-conversation',
    'strategic-investment',
    'investment-and-partnership',
  ]),
  message: z.string().trim().max(3000).optional().or(z.literal('')),
});

const proShopCategory = z.enum(optionValues(PRO_SHOP_PROVIDER_CATEGORIES), {
  error: 'Choose a provider category.',
});
const proShopPlacementInterest = z.enum(
  optionValues(PRO_SHOP_PLACEMENT_INTERESTS),
);
const proShopAffiliateProgramStatus = z.enum(
  optionValues(PRO_SHOP_AFFILIATE_PROGRAM_STATUSES),
);
const proShopCustomerRole = z.enum(optionValues(PRO_SHOP_CUSTOMER_ROLES));
const proShopFulfillmentCoverage = z.enum(
  optionValues(PRO_SHOP_FULFILLMENT_COVERAGE),
);
const proShopAffiliateSubIdSupport = z.enum(
  optionValues(PRO_SHOP_AFFILIATE_SUB_ID_SUPPORT),
);
const proShopMarketingBudgetBand = z.enum(
  optionValues(PRO_SHOP_MARKETING_BUDGET_BANDS),
);

export const proShopPartnerPreregistrationSchema = z
  .object({
    organizationName: z.string().trim().min(2).max(160),
    publicBrandName: z.string().trim().max(160).optional().or(z.literal('')),
    contactName: z.string().trim().min(2).max(120),
    titleRole: z.string().trim().max(120).optional().or(z.literal('')),
    email: z
      .string()
      .trim()
      .max(254)
      .pipe(z.email('Enter a valid email address.')),
    phone: requiredMobile,
    websiteUrl: publicProgramUrl,
    headquartersCity: z.string().trim().min(2).max(100),
    headquartersState: z.enum(US_STATES, {
      error: 'Choose a valid headquarters state.',
    }),
    headquartersZip: z
      .string()
      .trim()
      .regex(/^\d{5}(?:-\d{4})?$/u, 'Enter a valid ZIP code.'),
    primaryCategory: proShopCategory,
    otherCategory: z.string().trim().max(160).optional().or(z.literal('')),
    requestedStates: z
      .array(z.enum(US_STATES))
      .min(1, 'Choose at least one state.')
      .max(51)
      .refine((values) => new Set(values).size === values.length, {
        message: 'Choose each state only once.',
      }),
    placementInterests: z
      .array(proShopPlacementInterest)
      .min(1, 'Choose at least one placement type.')
      .max(PRO_SHOP_PLACEMENT_INTERESTS.length)
      .refine((values) => new Set(values).size === values.length, {
        message: 'Choose each placement type only once.',
      }),
    customerRolesServed: z
      .array(proShopCustomerRole)
      .min(1, 'Choose at least one customer role.')
      .max(PRO_SHOP_CUSTOMER_ROLES.length)
      .refine((values) => new Set(values).size === values.length, {
        message: 'Choose each customer role only once.',
      }),
    fulfillmentCoverage: proShopFulfillmentCoverage,
    servedTradeSlugs: tradeList.optional().default([]),
    offerSummary: z.string().trim().min(20).max(3000),
    affiliateProgramStatus: proShopAffiliateProgramStatus,
    affiliateProgramUrl: publicProgramUrl.optional().or(z.literal('')),
    affiliateProgramDetails: z
      .string()
      .trim()
      .max(1800)
      .optional()
      .or(z.literal('')),
    affiliateSubIdSupport: proShopAffiliateSubIdSupport,
    marketingBudgetBand: proShopMarketingBudgetBand
      .optional()
      .or(z.literal('')),
    termsAccepted: z.literal(true, {
      error: 'Agree to the Website Terms to continue.',
    }),
    privacyAcknowledged: z.literal(true, {
      error: 'Acknowledge the Privacy Policy to continue.',
    }),
    accurateInfoConfirmed: z.literal(true, {
      error: 'Confirm that the submitted information is accurate.',
    }),
    emailMarketingConsent: z.boolean().optional().default(false),
    smsConsent: z.boolean().optional().default(false),
    idempotencyKey: z.uuid(),
    website: z.string().max(0).optional().or(z.literal('')),
    ...inquiryAttribution,
  })
  .superRefine((input, context) => {
    if (
      (input.primaryCategory === 'OTHER' ||
        input.primaryCategory === 'JOBSITE_SERVICES') &&
      !input.otherCategory
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherCategory'],
        message: 'Describe the provider class and proposed scope.',
      });
    }
    if (
      input.primaryCategory !== 'OTHER' &&
      input.primaryCategory !== 'JOBSITE_SERVICES' &&
      input.otherCategory
    ) {
      context.addIssue({
        code: 'custom',
        path: ['otherCategory'],
        message:
          'Only describe a category scope when Other or Jobsite Services is selected.',
      });
    }
    if (
      input.primaryCategory === 'SPECIALTY_SUPPLY' &&
      !input.servedTradeSlugs.length
    ) {
      context.addIssue({
        code: 'custom',
        path: ['servedTradeSlugs'],
        message: 'Choose at least one trade served by the specialty supply.',
      });
    }
  });

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(300),
});

export type EarlyAccessInput = z.infer<typeof earlyAccessSchema>;
export type ProgressiveEarlyAccessInput = z.infer<
  typeof progressiveEarlyAccessSchema
>;
export type QuickLaunchInterestInput = z.infer<
  typeof quickLaunchInterestSchema
>;
export type ImportEarlyAccessInput = z.infer<typeof importEarlyAccessSchema>;
export type OptionalDetailsInput = z.infer<typeof optionalDetailsSchema>;
export type ParticipantProfileCorrectionInput = z.infer<
  typeof participantProfileCorrectionSchema
>;
export type PartnerInquiryInput = z.infer<typeof partnerInquirySchema>;
export type InvestorInquiryInput = z.infer<typeof investorInquirySchema>;
export type ClientPreregistrationInput = z.infer<
  typeof clientPreregistrationSchema
>;
export type ProShopPartnerPreregistrationInput = z.infer<
  typeof proShopPartnerPreregistrationSchema
>;
