export const NATIONAL_CORE_TRADE_MARKET = {
  jobs2025: 1_772_500,
  annualOpenings2025To2035: 155_300,
  projectedGrowth2025To2035: 0.089,
  specialtyContractorEmploymentRange: '65% to 68%',
} as const;

export const EARLY_MARKET_EVIDENCE = [
  {
    state: 'Oklahoma',
    jobs2024: 22_340,
    annualOpenings2024To2034: 2_080,
    projectedGrowth2024To2034: 0.072,
    status: 'First planned market',
  },
  {
    state: 'Texas',
    jobs2024: 154_820,
    annualOpenings2024To2034: 15_670,
    projectedGrowth2024To2034: 0.125,
    status: 'Waitlist open',
  },
  {
    state: 'Florida',
    jobs2024: 122_290,
    annualOpenings2024To2034: 13_290,
    projectedGrowth2024To2034: 0.178,
    status: 'Waitlist open',
  },
] as const;

export const EARLY_MARKET_TOTALS = {
  jobs2024: 299_450,
  annualOpenings2024To2034: 31_040,
  projectedGrowth2024To2034: 0.143,
  shareOfNationalJobs2024: 0.171,
  shareOfNationalJobGrowth2024To2034: 0.317,
} as const;

export const LABOR_MARKET_SOURCES = {
  national:
    'https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm',
  state: 'https://projectionscentral.org/',
} as const;
