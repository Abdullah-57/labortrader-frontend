import type { SignupCountScope } from './signup-counts-domain';
export type ParticipantRoleValue =
  | 'worker'
  | 'independent-contractor'
  | 'service-business'
  | 'hiring-organization';
export type SpecializedPageConfig = {
  eyebrow: string;
  title: string;
  titleAccent: string;
  shortName: string;
  lede: string;
  tradeSlug: string;
  source: string;
  scope: SignupCountScope;
  advantages: readonly { title: string; body: string; compactBody?: string }[];
  paths: readonly { role: ParticipantRoleValue; title: string; body: string }[];
};
export const SPECIALIZED_TRADE_PAGES = {
  hvac: {
    eyebrow: 'HVAC & Refrigeration',
    title: 'Cover the Calls.',
    titleAccent: 'Win the Next Job.',
    shortName: 'HVAC',
    lede: 'Keep service calls moving while your best people handle the big job. Find technicians, team up with other shops, or put your own open capacity to work.',
    tradeSlug: 'hvac-mechanical',
    source: 'hvac-trade-page',
    scope: 'hvac',
    advantages: [
      {
        title: 'Cover the Backlog',
        compactBody:
          'Add a technician for service calls while your crew handles the big job.',
        body: 'Bring in a qualified technician for a day of service calls while your crew handles a changeout, refrigeration repair, or commercial installation.',
      },
      {
        title: 'Keep Crews Working',
        compactBody:
          'Offer available technicians or install crews between your own projects.',
        body: 'Offer available technicians and installation crews during a slow stretch, then return to your own schedule when demand picks up.',
      },
      {
        title: 'Quote the Bigger Job',
        body: 'Check rates for the controls, sheet metal, refrigeration, or commissioning help you need before committing to a larger project.',
      },
    ],
    paths: [
      {
        role: 'worker',
        title: 'Technicians & Helpers',
        body: 'Set your wage, HVAC experience, availability, and travel area. Choose W-2 assignments through SkillCraft and build your completed-work rating.',
      },
      {
        role: 'independent-contractor',
        title: 'Independent HVAC Contractors',
        body: 'Find service and installation projects or team up for larger changeouts. Agree on scope and price while keeping your independence.',
      },
      {
        role: 'service-business',
        title: 'HVAC Service Businesses',
        body: 'Clear a service backlog or offer your available install crew. Match technician levels and equipment experience to the job.',
      },
      {
        role: 'hiring-organization',
        title: 'Hiring Organizations',
        body: 'Compare HVAC specialists by reviewed credentials, commercial or residential experience, availability, and rate. Confirm the scope, keep payments on record, and rehire the people who deliver.',
      },
    ],
  },
  electrical: {
    eyebrow: 'Electrical Trades',
    title: 'Bring the Skill.',
    titleAccent: 'Power the Project.',
    shortName: 'Electrical',
    lede: 'From a service backlog to a commercial buildout, find electrical capacity matched to the work. Keep your schedule moving without carrying every specialty on payroll.',
    tradeSlug: 'electrical',
    source: 'electrical-trade-page',
    scope: 'electrical',
    advantages: [
      {
        title: 'Cover the Next Phase',
        compactBody:
          'Match rough-in, trim-out, or service help to the license and supervision required.',
        body: 'Add suitable help for rough-in, trim-out, testing, or a busy service day. Match the assignment to the license, experience, and supervision it requires.',
      },
      {
        title: 'Keep Crews Productive',
        compactBody: 'Offer available electricians between your own projects.',
        body: 'Offer available company-managed electricians between projects instead of leaving capacity unused.',
      },
      {
        title: 'Price the Specialty Work',
        body: 'Find the controls, industrial, high-voltage, or low-voltage expertise your bid needs and confirm labor rates before submitting it.',
      },
    ],
    paths: [
      {
        role: 'worker',
        title: 'Electrical Workers',
        body: 'Share your experience, credential level, desired hourly wage, and availability. Choose suitable W-2 assignments through SkillCraft and keep completed hours and ratings in your work record.',
      },
      {
        role: 'independent-contractor',
        title: 'Independent Electrical Contractors',
        body: 'Find projects within your licensed scope. Team up for larger buildouts or complementary specialties, with scope and rates agreed upfront.',
      },
      {
        role: 'service-business',
        title: 'Electrical Service Businesses',
        body: 'Add qualified capacity for a construction phase or offer available electricians between jobs. Review licensing, required supervision, and site requirements before the engagement.',
      },
      {
        role: 'hiring-organization',
        title: 'Hiring Organizations',
        body: 'Compare electrical workers and businesses by specialty, reviewed credential status, work history, schedule, and rate. Rehire proven people and build a confirmed-payment history.',
      },
    ],
  },
  plumbing: {
    eyebrow: 'Plumbing & Pipefitting',
    title: 'Keep Jobs Moving.',
    titleAccent: 'Keep Crews Working.',
    shortName: 'Plumbing',
    lede: 'Cover service calls, staff the next construction phase, or add pipefitting expertise. Match skilled capacity to the job without adding permanent overhead before you need it.',
    tradeSlug: 'plumbing',
    source: 'plumbing-trade-page',
    scope: 'plumbing',
    advantages: [
      {
        title: 'Cover Service Calls',
        compactBody:
          'Add help for a full service day while your team handles the project.',
        body: 'Hire suitable help for a full service day while your team handles a rough-in, mechanical room, or time-sensitive repair.',
      },
      {
        title: 'Make Slow Weeks Pay',
        compactBody: 'Offer available plumbers or pipe crews at rates you set.',
        body: 'Offer available plumbers or pipe crews to businesses with a backlog, with availability and rates under your control.',
      },
      {
        title: 'Take On More Complex Work',
        body: 'Plan labor for process piping, testing, or a larger installation by comparing relevant experience and rates before you bid.',
      },
    ],
    paths: [
      {
        role: 'worker',
        title: 'Plumbers & Pipefitters',
        body: 'Share your wage, license level, piping experience, and availability. Find W-2 assignments through SkillCraft and build your work record.',
      },
      {
        role: 'independent-contractor',
        title: 'Independent Plumbing Contractors',
        body: 'Win service and installation work or team up for larger projects. Find complementary pipefitting or mechanical expertise and agree on the scope, schedule, and price.',
      },
      {
        role: 'service-business',
        title: 'Plumbing Service Businesses',
        body: 'Cover a busy service day with qualified help or offer an available crew between projects. Match credentials and experience to the systems and work involved.',
      },
      {
        role: 'hiring-organization',
        title: 'Hiring Organizations',
        body: 'Compare plumbers, pipefitters, contractors, and service companies by credentials, experience, availability, and rates. Keep completion and payments documented for the next hire.',
      },
    ],
  },
  'oil-gas': {
    eyebrow: 'Oil & Gas',
    title: 'Field-Ready Talent.',
    titleAccent: 'Right Where You Need It.',
    shortName: 'Oil & Gas',
    lede: 'Connect field talent, independent specialists, and service companies across wellsite, pipeline, plant, and refinery work. Add capacity when the schedule demands it.',
    tradeSlug: 'oil-gas-field-operations',
    source: 'oil-gas-industry-page',
    scope: 'oil-gas',
    advantages: [
      {
        title: 'Add Field Capacity',
        compactBody:
          'Bring in project, outage, or turnaround help without carrying every peak year-round.',
        body: 'Bring in suitable field support, maintenance, or technical capacity for a project, outage, or turnaround without staffing every peak year-round.',
      },
      {
        title: 'Put Crews to Work',
        compactBody:
          'Make open crew time visible across field, pipeline, and plant support.',
        body: 'Make your company\u2019s open crew time visible across production, midstream, transport, inspection, and plant support.',
      },
      {
        title: 'Match the Work to the Experience',
        body: 'Compare equipment experience, site requirements, safety credentials, travel area, and availability before committing to field work.',
      },
    ],
    paths: [
      {
        role: 'worker',
        title: 'Field Workers',
        body: 'Show your field experience, safety credentials, rotation, travel area, and desired wage. Review suitable W-2 assignments through SkillCraft and complete required onboarding before mobilization.',
      },
      {
        role: 'independent-contractor',
        title: 'Independent Specialists',
        body: 'Offer inspection, instrumentation, commissioning, engineering, or other qualified technical services. Agree on deliverables and rates, and team up when a scope requires another specialty.',
      },
      {
        role: 'service-business',
        title: 'Service Companies',
        body: 'Offer available maintenance crews or hire capacity for a turnaround. Set the site, schedule, specialty, and qualification requirements before agreeing on the engagement.',
      },
      {
        role: 'hiring-organization',
        title: 'Operators & Hiring Organizations',
        body: 'Compare qualified field talent and service companies for wellsite, pipeline, refinery, and plant projects. Keep scope, completion, and payments documented.',
      },
    ],
  },
  other: {
    eyebrow: 'Other Trades & Specialties',
    title: 'You Know the Work.',
    titleAccent: 'Find Your Next Opportunity.',
    shortName: 'Other Trades',
    lede: 'Welding, roofing, carpentry, concrete, industrial maintenance, landscaping, logistics, and more. LaborTrader is being built for people who work, across industries and specialties.',
    tradeSlug: 'other-skilled-trade',
    source: 'other-trades-page',
    scope: 'other',
    advantages: [
      {
        title: 'Find Work That Fits',
        compactBody: 'Share your skills, service area, and availability.',
        body: 'Show the skills you bring, the area you serve, and when you are available so the right people can find you.',
      },
      {
        title: 'Grow Your Reach',
        compactBody: 'Team up with other trades or offer your open crews.',
        body: 'Team up with complementary trades, add suitable help to a larger job, or offer available crews between your own projects.',
      },
      {
        title: 'Add Your Profession',
        body: 'Do not see your specialty in the form? Choose Other and tell us what you do. Your submissions help us expand the list.',
      },
    ],
    paths: [
      {
        role: 'worker',
        title: 'Workers',
        body: 'Set your desired hourly wage, specialty, experience, and availability. Explore suitable short-term W-2 opportunities through SkillCraft and build a completed-engagement rating.',
      },
      {
        role: 'independent-contractor',
        title: 'Independent Contractors',
        body: 'Find projects in your specialty or team up for bigger jobs. Agree on scope and price upfront.',
      },
      {
        role: 'service-business',
        title: 'Service Businesses',
        body: 'Hire suitable capacity for a busy period or offer your available people and services to other businesses. Use one profile for both sides.',
      },
      {
        role: 'hiring-organization',
        title: 'Hiring Organizations',
        body: 'Describe the work and specialty you need. Compare qualifications, availability, and rates, then build a reliable network through completed engagements and repeat hires.',
      },
    ],
  },
} as const satisfies Record<string, SpecializedPageConfig>;

export function tradeRegistrationHref(
  config: Pick<SpecializedPageConfig, 'tradeSlug' | 'source'>,
  role: ParticipantRoleValue,
) {
  const query = new URLSearchParams({
    role,
    trade: config.tradeSlug,
    source: config.source,
  });
  return `/early-access?${query.toString()}#detailed-registration`;
}
