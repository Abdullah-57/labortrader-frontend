import { LegalPage } from '@/components/legal-page';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'SMS Terms',
  description:
    'Terms for the optional LaborTrader launch-list and marketplace text-messaging program.',
  path: '/sms-terms',
});

export default function SmsTermsPage() {
  return (
    <LegalPage
      title="SMS Terms"
      path="/sms-terms"
      updated="October 1, 2026"
      contactEmail="support@labortraders.com"
      intro="These SMS Terms apply when you separately opt in to recurring LaborTrader launch, onboarding, promotional, or matched-opportunity text messages. A phone-ownership code you request is a separate transactional message, and sending remains subject to carrier and program availability."
      sections={[
        [
          'Enrollment and Optional Consent',
          'Recurring SMS consent is optional and is not a condition of preregistering, submitting a Pro Shop application or other inquiry, purchasing anything, or receiving an otherwise eligible benefit. Providing or verifying a mobile number does not enroll you in recurring texts. You must affirmatively opt in before LaborTrader sends matched-opportunity, provider-program, promotional, or launch text messages. A one-time code requested to verify ownership is transactional and does not create recurring consent.',
        ],
        [
          'Message Types and Frequency',
          'The LaborTrader messaging program may include role-specific launch updates, market-opening notices, onboarding information, separately requested Pro Shop provider-program updates, and matched-opportunity notifications. Opportunity messages, when enabled, are limited to eligible work that matches the participant’s reported skills, verified licenses or endorsements where applicable, and service area. Message frequency varies with matching activity and account settings. Quiet hours, frequency controls, carrier restrictions, availability, and technical conditions apply. LaborTrader does not guarantee delivery of every message, application update, or opportunity.',
        ],
        [
          'Costs, Help, and Opt-out',
          'Message and data rates may apply. Reply STOP to cancel recurring messages. Reply HELP for help. After an opt-out request, you may receive a final confirmation message. Carriers are not liable for delayed or undelivered messages.',
        ],
        [
          'Number Ownership, Privacy, and Contact',
          'You represent that you are the account holder for the mobile number provided or have the account holder’s permission to enroll it. If the number changes or is reassigned, you must opt out or notify LaborTrader. Mobile information and SMS opt-in data are not shared with third parties or affiliates for their own marketing. For support, contact support@labortraders.com. See the Privacy Policy for additional information about data handling.',
        ],
      ]}
    />
  );
}
