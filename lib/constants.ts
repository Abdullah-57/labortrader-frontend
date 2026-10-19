/**
 * Public participant metadata is the single source of truth for role labels
 * and query values. Launch-benefit caps are the maximum included platform use
 * available to each account type during its eligible period.
 */
export const PUBLIC_PARTICIPANT_ROLES = [
  {
    value: 'worker',
    audienceType: 'WORKER',
    label: 'Worker',
    description: 'Build a verified record through eligible W-2 assignments.',
    launchBenefitCapCents: 50_000,
  },
  {
    value: 'independent-contractor',
    audienceType: 'CONTRACTOR',
    label: 'Independent Contractor',
    description: 'Offer skilled services as a self-employed individual.',
    launchBenefitCapCents: 50_000,
  },
  {
    value: 'service-business',
    audienceType: 'BUSINESS',
    label: 'Service Business',
    description: 'Hire skilled capacity, offer it, or do both.',
    launchBenefitCapCents: 100_000,
  },
  {
    value: 'hiring-organization',
    audienceType: 'HIRING_FIRM',
    label: 'Hiring Organization',
    description: 'Find verified workers, contractors, and service businesses.',
    launchBenefitCapCents: 100_000,
  },
] as const;

export type PublicParticipantRole = (typeof PUBLIC_PARTICIPANT_ROLES)[number];
export type PublicAudienceType = PublicParticipantRole['audienceType'];

export function participantRoleByAudienceType(
  audienceType: string | null | undefined,
) {
  return PUBLIC_PARTICIPANT_ROLES.find(
    (role) => role.audienceType === audienceType,
  );
}

export function participantRoleByValue(value: string | null | undefined) {
  return PUBLIC_PARTICIPANT_ROLES.find((role) => role.value === value);
}

/**
 * The public Trade or specialty taxonomy. Existing stable slugs are retained
 * where they already represented the approved broader category.
 */
export const TRADES = [
  {
    slug: 'hvac-mechanical',
    label: 'HVAC & Refrigeration',
    category: 'HVAC, Electrical & Plumbing',
  },
  {
    slug: 'electrical',
    label: 'Electrical',
    category: 'HVAC, Electrical & Plumbing',
  },
  {
    slug: 'plumbing',
    label: 'Plumbing & Pipefitting',
    category: 'HVAC, Electrical & Plumbing',
  },
  {
    slug: 'welding-fabrication',
    label: 'Welding & Fabrication',
    category: 'Welding & Fabrication',
  },
  {
    slug: 'sheet-metal',
    label: 'Sheet Metal',
    category: 'Sheet Metal',
  },
  {
    slug: 'oil-gas-field-operations',
    label: 'Oil & Gas Field Operations',
    category: 'Oilfield & Industrial',
  },
  {
    slug: 'industrial-maintenance-millwright',
    label: 'Industrial Maintenance & Millwright',
    category: 'Oilfield & Industrial',
  },
  {
    slug: 'roofing',
    label: 'Roofing',
    category: 'Construction Specialties',
  },
  {
    slug: 'carpentry-framing',
    label: 'Carpentry & Framing',
    category: 'Construction Specialties',
  },
  {
    slug: 'drywall-finishing',
    label: 'Drywall & Finishing',
    category: 'Construction Specialties',
  },
  {
    slug: 'insulation',
    label: 'Insulation',
    category: 'Construction Specialties',
  },
  {
    slug: 'masonry-concrete',
    label: 'Masonry & Concrete',
    category: 'Construction Specialties',
  },
  {
    slug: 'tile-stone',
    label: 'Tile & Stone',
    category: 'Construction Specialties',
  },
  {
    slug: 'countertops-surfaces',
    label: 'Countertops & Surfaces',
    category: 'Construction Specialties',
  },
  {
    slug: 'flooring',
    label: 'Flooring',
    category: 'Construction Specialties',
  },
  {
    slug: 'painting-coatings',
    label: 'Painting & Coatings',
    category: 'Construction Specialties',
  },
  {
    slug: 'cdl-hotshot-gooseneck',
    label: 'Hotshot / Gooseneck',
    category: 'CDL Transportation',
  },
  {
    slug: 'cdl-flatbed-step-deck',
    label: 'Flatbed / Step Deck',
    category: 'CDL Transportation',
  },
  {
    slug: 'cdl-tanker',
    label: 'Tanker / Tank Vehicle',
    category: 'CDL Transportation',
  },
  {
    slug: 'cdl-hazmat',
    label: 'Hazardous Materials (Hazmat)',
    category: 'CDL Transportation',
  },
  {
    slug: 'cdl-doubles-triples',
    label: 'Doubles / Triples',
    category: 'CDL Transportation',
  },
  {
    slug: 'cdl-heavy-haul-oversize',
    label: 'Heavy Haul / Oversize',
    category: 'CDL Transportation',
  },
  {
    slug: 'heavy-equipment-site-work',
    label: 'Heavy Equipment & Site Work',
    category: 'Heavy Equipment & Site Work',
  },
  {
    slug: 'home-technology-low-voltage',
    label: 'Low Voltage, Security & Smart Systems',
    category: 'Low Voltage & Energy',
  },
  {
    slug: 'solar-renewable-energy',
    label: 'Solar & Renewable Energy',
    category: 'Low Voltage & Energy',
  },
  {
    slug: 'drafting-design',
    label: 'Estimating, Drafting & Design',
    category: 'Planning & Technical Services',
  },
  {
    slug: 'other-skilled-trade',
    label: 'Other Skilled Trade (explain)',
    category: 'Other',
  },
] as const;

/**
 * Accepted for backward-compatible imports and updates, but intentionally not
 * offered to new registrants now that the taxonomy is organized more broadly.
 */
export const LEGACY_TRADES = [
  { slug: 'refrigeration', label: 'Refrigeration' },
  { slug: 'controls-bas', label: 'Controls / BAS' },
  { slug: 'estimating', label: 'Estimating' },
  { slug: 'takeoffs', label: 'Takeoffs' },
  { slug: 'load-calculations', label: 'Load Calculations' },
  { slug: 'commissioning-startup', label: 'Commissioning / Startup' },
  { slug: 'apprentices-helpers', label: 'Apprentices / Helpers' },
  { slug: 'specialized-rentals', label: 'Specialized Rentals' },
  { slug: 'construction-labor', label: 'Construction Labor' },
  { slug: 'maintenance-facilities', label: 'Maintenance & Facilities' },
  {
    slug: 'commercial-driving-transportation',
    label: 'CDL & Specialized Driving',
  },
] as const;

export const TRADE_SLUGS = [
  ...TRADES.map((trade) => trade.slug),
  ...LEGACY_TRADES.map((trade) => trade.slug),
];

/**
 * Public registration choices. CDL credential support remains available for
 * existing records and credential review, but transportation is not promoted
 * as a standalone marketplace category in this website release.
 */
export const PUBLIC_TRADES = TRADES.filter(
  (trade) => trade.category !== 'CDL Transportation',
);

export const QUICK_TRADES = PUBLIC_TRADES.map((trade) => ({
  value: trade.slug,
  label: trade.label,
  category: trade.category,
}));

export const LABOR_TYPES = [
  { slug: 'hourly', label: 'Hourly Help' },
  { slug: 'day', label: 'Full-Day Coverage' },
  { slug: 'weekly', label: 'Weekly Capacity' },
  { slug: 'monthly-project', label: 'Monthly or Project-Duration Capacity' },
  { slug: 'crews', label: 'Qualified Crews' },
  { slug: 'subcontract', label: 'Subcontract Work' },
  { slug: 'specialized-services', label: 'Defined-Scope Technical Services' },
] as const;

export const PROFESSIONAL_STATUSES = [
  { value: 'licensed', label: 'Contractor' },
  { value: 'journeyman', label: 'Journeyman' },
  { value: 'apprentice', label: 'Apprentice' },
  { value: 'helper', label: 'Helper' },
  { value: 'technician', label: 'Specialist' },
  { value: 'not-required', label: 'Trade license not required' },
  { value: 'business', label: 'Service business / contractor' },
  {
    value: 'other',
    label: 'Other license type not listed (specify)',
  },
] as const;

export const EXPERIENCE_RANGES = [
  { value: 'under-2', label: 'Under 2 years' },
  { value: '2-5', label: '2 to 5 years' },
  { value: '6-10', label: '6 to 10 years' },
  { value: '11-20', label: '11 to 20 years' },
  { value: '20-plus', label: '20+ years' },
] as const;

export const AVAILABILITY_OPTIONS = [
  { value: 'immediate', label: 'Available now' },
  { value: 'between-jobs', label: 'Between jobs or projects' },
  { value: 'slow-weeks', label: 'Slow weeks / select weekdays' },
  { value: 'evenings', label: 'Evenings / after-hours' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'project', label: 'Project-based' },
  { value: 'seasonal', label: 'Seasonal / as capacity allows' },
  { value: 'future', label: 'Interested when my market opens' },
] as const;

export const COMPANY_SIZES = [
  { value: '1', label: 'Just me' },
  { value: '2-10', label: '2 to 10 people' },
  { value: '11-25', label: '11 to 25 people' },
  { value: '26-50', label: '26 to 50 people' },
  { value: '51-100', label: '51 to 100 people' },
  { value: '100-plus', label: '100+ people' },
] as const;

export const BUSINESS_TYPES = [
  { value: 'licensed-trade-contractor', label: 'Licensed trade contractor' },
  { value: 'specialty-subcontractor', label: 'Specialty subcontractor' },
  { value: 'general-contractor', label: 'General contractor' },
  { value: 'trade-service-company', label: 'Skilled-service company' },
  {
    value: 'supplier-resource-provider',
    label: 'Supplier or resource provider',
  },
  { value: 'other', label: 'Other service business' },
] as const;

export const ORGANIZATION_TYPES = [
  { value: 'hiring-firm', label: 'Employer, workforce buyer, or operator' },
  { value: 'other', label: 'Other hiring organization' },
] as const;

export const SHORTAGE_TIMING_OPTIONS = [
  { value: 'now', label: 'Current need or availability' },
  { value: 'within-30-days', label: 'Within 30 days' },
  { value: 'seasonal', label: 'Seasonal or project-based' },
  { value: 'future', label: 'Interested when my market opens' },
] as const;

const LEGACY_SHORTAGE_FREQUENCIES = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'A few times a month' },
  { value: 'quarterly', label: 'A few times a quarter' },
  { value: 'rarely', label: 'Rarely, but it matters when it happens' },
] as const;

export const US_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
  'DC',
] as const;

export const FOUNDING_STATES = ['OK', 'TX', 'FL', 'LA'] as const;

export function tradeLabel(slug: string) {
  return (
    TRADES.find((trade) => trade.slug === slug)?.label ??
    LEGACY_TRADES.find((trade) => trade.slug === slug)?.label ??
    slug
  );
}

export function laborTypeLabel(slug: string) {
  return LABOR_TYPES.find((type) => type.slug === slug)?.label ?? slug;
}

export function professionalStatusLabel(value: string) {
  return (
    PROFESSIONAL_STATUSES.find((status) => status.value === value)?.label ??
    value
  );
}

export function experienceLabel(value: string) {
  return (
    EXPERIENCE_RANGES.find((range) => range.value === value)?.label ?? value
  );
}

export function availabilityLabel(value: string) {
  return (
    AVAILABILITY_OPTIONS.find((option) => option.value === value)?.label ??
    value
  );
}

export function companySizeLabel(value: string) {
  return COMPANY_SIZES.find((size) => size.value === value)?.label ?? value;
}

export function shortageFrequencyLabel(value: string) {
  return (
    SHORTAGE_TIMING_OPTIONS.find((option) => option.value === value)?.label ??
    LEGACY_SHORTAGE_FREQUENCIES.find((option) => option.value === value)
      ?.label ??
    value
  );
}
