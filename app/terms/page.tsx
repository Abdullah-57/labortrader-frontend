import { LegalPage } from '@/components/legal-page';
import { PUBLIC_COPY } from '@/lib/public-copy';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Website and Pre-registration Terms',
  description:
    'Read the terms governing LaborTrader website use, pre-registration, launch benefits, referrals, Pro Shop applications, and public inquiries.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Website and Pre-registration Terms"
      path="/terms"
      updated="October 1, 2026"
      contactEmail="legal@labortraders.com"
      intro="These Terms govern your use of the LaborTrader website, participant and client preregistration, verification, launch benefits, referrals, Founding 100, Pro Shop partner applications, and public inquiry pathways. Additional marketplace, advertising, and order terms may apply when a market, placement, or approved account activates."
      sections={[
        [
          'Pre-registration and Eligibility',
          'LaborTrader accepts participant preregistration from Workers, Independent Contractors, Service Businesses, and Hiring Organizations, including authorized human representatives of organizations. Clients and project owners use a separate demand-side preregistration, while partner and investor inquiries use their own pathways. Preregistration does not itself create an active marketplace account, post a project, hire a provider, or guarantee account approval, activation, work, hiring, earnings, partnership approval, or access to investment materials. You must be at least 18 years old and legally able to agree to these Terms. If you submit information for an organization, you represent that you are authorized to do so.',
        ],
        [
          'Launch Benefit and Marketplace Charges',
          'Every legitimate preregistration submitted before the selected market launches reserves up to 90 days of waived LaborTrader platform charges. The benefit activates after the required verification and account approval, when both the registered market and approved account are live. It ends when the eligible period expires or the applicable dollar cap is reached, whichever happens first. The cap is $500 for Workers (individuals), Independent Contractors, and Clients or Project Owners, and $1,000 for Service Businesses and Hiring Organizations. The benefit may be applied only to eligible LaborTrader platform charges. It has no cash value, is not transferable, and cannot be applied to provider compensation, wages, staffing charges, materials, taxes, permits, insurance, payment-processing costs, Pro Shop fees or purchases, screenings, payroll services, or other third-party or pass-through charges. Preregistration does not itself create an active account, post or confirm a job, charge a payment method, or guarantee account approval, provider availability, project completion, work, hiring, earnings, or a market launch. Duplicate, fraudulent, test, deleted, abusive, or otherwise ineligible records may be rejected.',
        ],
        [
          'Founding Pro Shop Partner Terms',
          'An authorized business representative may apply for consideration as a Founding Pro Shop Partner. The commercial unit is one approved vendor, in one approved category, in one state. Each active category-and-state slot is exclusive for its paid term. An application is nonbinding and does not guarantee approval, placement, timing, traffic, attribution, sales, revenue, affiliate compensation, or a state launch. No payment is collected during application, and applying does not reserve a placement, create exclusivity, authorize automatic renewal, or obligate either party to proceed. If approved inventory remains available, LaborTrader may offer a separate written order at $299 for the first 12-month term. A Founding Partner in good standing may affirmatively renew the same approved slot for two additional consecutive 12-month terms at $299 per term. The planned standard price after that Founding period is $999 per category, per state, per year. Renewal is never automatic. The signed order controls price, scope, activation, cancellation, refund terms, creative, service, and eligibility.',
        ],
        [
          'Sponsored Content, Affiliate Links, and Reporting',
          'The initial Pro Shop is a directory and affiliate marketplace. Approved vendors remain the seller and merchant of record and are responsible for product claims, pricing, availability, checkout, payment collection, fulfillment, shipping, returns, warranties, product taxes, and product-order customer service. LaborTrader may display offers, send users to an approved vendor destination, record first-party clickout events, and present provider statistics. LaborTrader-measured clicks may differ from provider- or network-reported conversions, returns, commissions, and payouts. No traffic, clicks, conversions, sales, revenue, placement rank, payout, or renewal is guaranteed. Website sponsorships and specialized marketing placements are separately priced. Founding Pro Shop Partner is a commercial designation, not a LaborTrader certification, credential verification, product endorsement, or guarantee.',
        ],
        [
          'Launch-Benefit Eligibility and Timing',
          'The launch benefit is available across all five preregistration paths: Workers, Independent Contractors, Service Businesses, Hiring Organizations, and Clients or Project Owners. Every legitimate preregistration submitted before the selected market launches reserves the benefit for its account type. Activation requires the applicable contact verification, account approval, selected market or state, and information required for the applicable profile. Completing every optional profile or credential field is not required. The eligible period begins only after both the registered market and approved account are live. No card is collected and no paid membership begins automatically during preregistration.',
        ],
        [
          'No Monthly Membership Fee',
          'LaborTrader does not charge a monthly account or membership fee, and there are no additional fees simply for remaining a member. After the launch benefit ends or reaches its dollar cap, a $10 LaborTrader charge applies when a job is posted. Any applicable LaborTrader contract charge applies only after both sides agree to the contract. The applicable charges and available benefit are disclosed before confirmation. Provider pricing, wages, materials, taxes, permits, insurance, payment processing, screenings, payroll services, and other optional, third-party, or pass-through costs remain separate.',
        ],
        [
          'Provider Reputation and Paid Programs',
          'LaborTrader does not sell provider reputation or provider-result order. Marketplace ratings, completion history, rehire history, and similar performance records are intended to arise from completed LaborTrader engagements under the applicable marketplace terms. Credential and insurance review, contact verification, launch-benefit eligibility, Pro Shop advertising, affiliate relationships, sponsorships, and Founding recognition are separate labels and do not manufacture a provider work record.',
        ],
        [
          'Founding 100 Recognition',
          `${PUBLIC_COPY.foundingDefinition} A position is awarded only after the participant completes the full registration for its role and verifies both email and phone ownership. Duplicate, test, fraudulent, abusive, or otherwise disqualified accounts do not qualify or consume a position. LaborTrader may remove recognition if an account is later found to be ineligible or is disqualified under program rules. Founding 100 is recognition only. It is not equity, company ownership, professional credential verification, guaranteed work, a launch benefit, or a permanent search position.`,
        ],
        [
          'Referral Included-Use Benefit',
          'A referral qualifies when a new user registers through a valid personal referral link or code and completes the required account verification. An email-only or otherwise unverified signup does not qualify. For each qualified new account, the owner of the referral link receives 10 additional days in the eligible LaborTrader included-use period. The referred account does not receive a separate referral reward solely for using the link. Additional days remain subject to the original role-based dollar cap and do not increase it. Self-referrals, duplicate or test accounts, bots, fake accounts, circular schemes, and other abusive activity do not qualify. Referral benefits have no cash value, are not transferable, and do not change Founding 100 order.',
        ],
        [
          'Communications',
          'By joining a participant or client preregistration list, you agree to receive essential registration, ownership-verification, market-opening, security, and onboarding messages under the disclosure presented at signup. You may unsubscribe from marketing email while still receiving necessary transactional or legal notices. A requested phone-verification code is transactional and separate from recurring SMS consent. Providing or verifying a mobile number does not authorize recurring marketing texts. Promotional, client-news, matched-opportunity, and launch text messages require separate affirmative consent and are governed by the SMS Terms.',
        ],
        [
          'Accurate Information and Acceptable Use',
          'You must provide information that is accurate to the best of your knowledge. You may not impersonate another person, submit another person’s information without permission, make a false license or credential claim, manipulate referrals or market rank, interfere with the website, bypass security or rate limits, automate abusive submissions, scrape protected content, or use LaborTrader unlawfully. Skills, service areas, availability, and similar details remain self-reported. Every claimed professional license, certification, and endorsement remains pending until separately approved through manual review and may later expire or be revoked.',
        ],
        [
          'Marketplace Descriptions and Illustrations',
          'Descriptions of profiles, listings, matching, credentials, availability, work history, opportunities, assignments, staffing or payroll support, and other marketplace functions explain the LaborTrader marketplace experience as markets and services open. Examples are illustrative. They do not create a live listing, offer, employment relationship, transaction, commitment, funding claim, partner relationship, or evidence of completed marketplace activity.',
        ],
        [
          'Separate Programs and Designations',
          `${PUBLIC_COPY.contractorBenefit} ${PUBLIC_COPY.benefitQualifier} ${PUBLIC_COPY.feeClarification}`,
        ],
        ['Marketplace and Employment Role', PUBLIC_COPY.marketplaceRole],
        [
          'Support',
          'LaborTrader provides support by email at support@labortraders.com. The target initial response time is within two business days for ordinary support requests and within four business hours for active disputes. Text alerts and verification messages are not support channels. Response targets are goals, not guaranteed resolution times.',
        ],
        [
          'Intellectual Property',
          'LaborTrader names, trademarks, branding, website content, product concepts, software, and design are owned by LaborTrader or used with permission and are protected by applicable intellectual-property laws. You may use the website for its intended purpose. You may not copy, scrape, republish, modify, distribute, reverse engineer, or commercially exploit protected materials without written permission.',
        ],
        [
          'Disclaimers and Limitation',
          'To the maximum extent permitted by law, the website and its content are provided “as is” and “as available,” without express or implied warranties. LaborTrader does not warrant uninterrupted access, error-free operation, or the accuracy or availability of user-submitted information. To the maximum extent permitted by law, LaborTrader is not liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising from or related to use of the website.',
        ],
        [
          'Law, Disputes, Changes, and Contact',
          'To the extent permitted by law, Oklahoma law governs these Terms without regard to conflict-of-law principles. Before filing a claim, contact legal@labortraders.com so the parties can attempt to resolve the matter informally. Unless applicable law requires otherwise, proceedings must be brought in a court with jurisdiction serving Oklahoma County, Oklahoma. LaborTrader may update these Terms by posting a revised version and effective date. Continued use after an update constitutes acceptance of the revised Terms.',
        ],
      ]}
    />
  );
}
