/**
 * Stable public values for Pro Shop partner preregistration. Keep these values
 * independent from display copy so saved submissions remain readable when the
 * marketing language changes.
 */
export const PRO_SHOP_PROVIDER_CATEGORIES = [
  { value: 'GENERAL_SUPPLY', label: 'General supply houses' },
  { value: 'SPECIALTY_SUPPLY', label: 'Specialty supply houses' },
  { value: 'TOOLS_EQUIPMENT', label: 'Tools & equipment' },
  { value: 'SAFETY_PPE', label: 'Safety & PPE' },
  { value: 'WORKWEAR_GEAR', label: 'Workwear & gear' },
  {
    value: 'TRAINING_CERTIFICATION',
    label: 'Training & certification',
  },
  { value: 'RENTALS_FLEET', label: 'Rentals & fleet' },
  { value: 'INSURANCE_RISK', label: 'Insurance & risk services' },
  { value: 'MARKETING_GROWTH', label: 'Marketing & growth services' },
  { value: 'JOBSITE_SERVICES', label: 'Jobsite services' },
  { value: 'SOFTWARE_TECHNOLOGY', label: 'Software & technology' },
  {
    value: 'FINANCING_INVESTMENT',
    label: 'Business financing & capital',
  },
  { value: 'BENEFITS_PAYROLL', label: 'Benefits & payroll' },
  { value: 'ACCOUNTING_TAX_LEGAL', label: 'Accounting, tax & legal' },
  { value: 'OTHER', label: 'Other: please explain' },
] as const;

/** These categories cannot activate without documented human legal review. */
export const PRO_SHOP_REGULATED_REVIEW_CATEGORIES = [
  'TRAINING_CERTIFICATION',
  'INSURANCE_RISK',
  'FINANCING_INVESTMENT',
  'BENEFITS_PAYROLL',
  'ACCOUNTING_TAX_LEGAL',
] as const;

export const PRO_SHOP_PLACEMENT_INTERESTS = [
  { value: 'PRO_SHOP_LISTING', label: 'Pro Shop listing' },
  { value: 'WEBSITE_SPONSORSHIP', label: 'Website sponsorship' },
  { value: 'MARKET_LAUNCH_CAMPAIGN', label: 'Market launch campaign' },
  { value: 'EDUCATION_CONTENT', label: 'Educational content' },
] as const;

export const PRO_SHOP_AFFILIATE_PROGRAM_STATUSES = [
  { value: 'ACTIVE', label: 'We have an active affiliate program' },
  {
    value: 'AVAILABLE_TO_CREATE',
    label: 'We can create an affiliate program',
  },
  { value: 'NONE', label: 'We do not currently offer one' },
] as const;

export const PRO_SHOP_CUSTOMER_ROLES = [
  { value: 'WORKER', label: 'Workers' },
  { value: 'CONTRACTOR', label: 'Independent contractors' },
  { value: 'BUSINESS', label: 'Service businesses' },
  { value: 'HIRING_FIRM', label: 'Hiring organizations' },
] as const;

export const PRO_SHOP_FULFILLMENT_COVERAGE = [
  { value: 'LOCAL', label: 'Local' },
  { value: 'REGIONAL', label: 'Regional' },
  { value: 'MULTI_STATE', label: 'Multi-state' },
  { value: 'NATIONWIDE', label: 'Nationwide' },
  { value: 'DIGITAL', label: 'Digital / online' },
] as const;

export const PRO_SHOP_AFFILIATE_SUB_ID_SUPPORT = [
  { value: 'YES', label: 'Yes' },
  { value: 'NO', label: 'No' },
  { value: 'UNKNOWN', label: 'Not sure' },
] as const;

export const PRO_SHOP_MARKETING_BUDGET_BANDS = [
  { value: 'UNDER_5000', label: 'Under $5,000' },
  { value: 'FROM_5000_TO_24999', label: '$5,000–$24,999' },
  { value: 'FROM_25000_TO_99999', label: '$25,000–$99,999' },
  { value: 'AT_LEAST_100000', label: '$100,000+' },
  { value: 'NOT_SURE', label: 'Not sure yet' },
] as const;

export const PRO_SHOP_FOUNDING_FIRST_YEAR_CENTS_PER_STATE = 29_900;
export const PRO_SHOP_FOUNDING_RENEWAL_YEARS = 2;
export const PRO_SHOP_PLANNED_STANDARD_ANNUAL_CENTS_PER_STATE = 99_900;
export const PRO_SHOP_PRICING_CURRENCY = 'USD';
export const PRO_SHOP_PRICING_SNAPSHOT_VERSION =
  'PRO_SHOP_FOUNDING_PARTNER_2026-09-29';
export const PRO_SHOP_CONSENT_COPY_VERSION =
  'PRO_SHOP_PARTNER_CONSENT_2026-10-02_V2';
export const PRO_SHOP_TERMS_VERSION = '2026-09-29-v2';
export const PRO_SHOP_PRIVACY_VERSION = '2026-10-02-v4';

export type ProShopProviderCategory =
  (typeof PRO_SHOP_PROVIDER_CATEGORIES)[number]['value'];
export type ProShopPlacementInterest =
  (typeof PRO_SHOP_PLACEMENT_INTERESTS)[number]['value'];
export type ProShopAffiliateProgramStatus =
  (typeof PRO_SHOP_AFFILIATE_PROGRAM_STATUSES)[number]['value'];
export type ProShopCustomerRole =
  (typeof PRO_SHOP_CUSTOMER_ROLES)[number]['value'];
export type ProShopFulfillmentCoverage =
  (typeof PRO_SHOP_FULFILLMENT_COVERAGE)[number]['value'];
export type ProShopAffiliateSubIdSupport =
  (typeof PRO_SHOP_AFFILIATE_SUB_ID_SUPPORT)[number]['value'];
export type ProShopMarketingBudgetBand =
  (typeof PRO_SHOP_MARKETING_BUDGET_BANDS)[number]['value'];

export function proShopCategoryRequiresManualRegulatoryReview(
  category: ProShopProviderCategory,
) {
  return PRO_SHOP_REGULATED_REVIEW_CATEGORIES.includes(
    category as (typeof PRO_SHOP_REGULATED_REVIEW_CATEGORIES)[number],
  );
}
