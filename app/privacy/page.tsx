import { LegalPage } from '@/components/legal-page';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description:
    'Learn how LaborTrader collects, uses, shares, protects, and retains information from website visitors, applicants, and pre-registrants.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      updated="October 2, 2026"
      contactEmail="privacy@labortraders.com"
      intro="This Privacy Policy explains how LaborTrader collects, uses, shares, protects, and retains information through this website, preregistration, verification, referrals, program benefits, Pro Shop partner applications, affiliate interactions, and partner or investor inquiry pathways. Additional marketplace- or advertising-specific notices may apply when a market, placement, or approved account activates."
      sections={[
        [
          'What We Collect and Why',
          'We collect information you provide, including your role, human contact and organization name, email address, mobile number, city, state and ZIP, specialty, service area, availability or demand indicators, credential claims and supporting review information, communication choices, referral data, inquiry content, and optional profile details. Pro Shop applications may also include provider category, requested states and placements, website and affiliate-program information, offer descriptions, and an optional marketing-budget range. We record Terms and consent history, verification and program status, security events, and audit actions. We may also collect campaign, signup-source, browser, device, request, and limited technical data. We use this information to operate and secure preregistration, review applications, confirm ownership, assign markets, administer benefits and referrals, plan openings and commercial inventory, prevent fraud, and respond to requests.',
        ],
        [
          'Approximate Location Personalization',
          'LaborTrader may use an approximate city, state, or region derived from your internet connection to personalize launch messaging and prefill a possible market. This estimate may be unavailable or inaccurate and does not establish residency, select your final market, or determine Founding 100 order. Registration keeps location visible and editable. LaborTrader does not add your raw IP address to the registration record solely through this personalization feature.',
        ],
        [
          'First-Party Website Measurement',
          'LaborTrader may record the page visited, time, referring website, campaign source, and an approximate city and state so we can understand website use and market demand. A random first-party browser token is converted into a one-way pseudonymous identifier before storage. We do not store the raw token or raw IP address in the site-visit record. Site measurement is disabled when a browser sends a supported Global Privacy Control or Do Not Track signal.',
        ],
        [
          'Email and SMS',
          'Participant preregistration and Pro Shop applications require the contact information disclosed on the applicable form. Choosing Other requires an explanation. Email and phone ownership verification are separate from marketing consent. Requested verification codes and essential application or account notices are transactional. Partner and investor inquiry forms collect email, not phone numbers, and request permission to reply by email. Optional marketing email and text preferences are separate, unchecked choices. Marketing emails include an unsubscribe link; declining updates does not affect registration, inquiry handling, or benefits. Providing or verifying a number does not authorize recurring marketing texts. Promotional, matched-opportunity, provider-program, or launch texts require separate affirmative consent, and SMS consent is not required to register, apply, or earn an otherwise eligible benefit. Reply STOP to opt out and HELP for help. Message and data rates may apply.',
        ],
        [
          'Pro Shop and Affiliate Measurement',
          'When Pro Shop offers are active, LaborTrader may route outbound links through a first-party measurement service and record an opaque click identifier, offer and placement identifiers, time, source surface, general market context, and limited fraud-prevention signals. LaborTrader distinguishes its measured clickouts from conversions, sales, returns, commissions, or payouts reported by an advertiser or affiliate network. We may use and share aggregate or pseudonymous reporting with the relevant provider or network to operate the program, investigate discrepancies, prevent abuse, and calculate performance. Following an outbound link takes you to a third party whose own privacy terms apply.',
        ],
        [
          'Public Counts, Recognition, and Referrals',
          'When enabled, public Market Pulse counts use aggregated basic pre-registrations (including before email confirmation) and exclude known test, duplicate, spam, deleted, rejected, fraudulent, future-dated, or unapproved imported records. Public counts do not display contact information. Public signup strips show exact aggregate signup, state, and specialty counts, including small totals. Industry counts use the participant’s primary trade; the nationwide total also includes eligible client pre-registrations. Inquiries are excluded. Completing a detailed profile gates free-use eligibility, not public signup counting. Legacy role-level breakdowns, where used, retain their privacy threshold. Founding 100 recognition may later show an eligible participant account’s local market, role, and badge status. Referral links contain an opaque code. Referral status and reward progress are visible only through authorized participant or administrator access.',
        ],
        [
          'How Information Is Shared',
          'LaborTrader uses service providers for hosting, data storage, analytics, communications, security, and form processing. We may also disclose information when required by law, to protect rights or safety, to professional advisers, or as part of a merger, financing, acquisition, or other business transaction. Service providers are authorized to use information only to perform services for LaborTrader. LaborTrader does not sell personal information. Mobile information and SMS opt-in data are not shared with third parties or affiliates for their own marketing.',
        ],
        [
          'Form Protection',
          'We use Google reCAPTCHA to help protect forms from spam and abuse. Google may process browser, device, and interaction information to assess a request. Google’s Privacy Policy and Terms of Service apply to reCAPTCHA.',
        ],
        [
          'Retention and Security',
          'LaborTrader retains information for as long as reasonably necessary to fulfill the purposes described in this policy and to maintain legal, consent, security, dispute, or active-business records. Information is then deleted or deidentified as appropriate. We use reasonable administrative, technical, and organizational safeguards, but no method of storage or transmission is completely secure.',
        ],
        [
          'Your Rights and Changes',
          'Depending on applicable law, you may have the right to access, correct, delete, or obtain a copy of your information; opt out of certain uses; or appeal a denied request. Submit a request to privacy@labortraders.com. LaborTrader may verify your identity before completing a request and will not discriminate against you for exercising applicable rights. We may update this policy and will revise the effective date when changes are made.',
        ],
      ]}
    />
  );
}
