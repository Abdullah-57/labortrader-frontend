import { BadgeCheck, CalendarClock, SearchCheck } from 'lucide-react';
import { AudienceLandingPage } from '@/components/audience-landing-page';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Independent Contractor Work in Skilled Trades',
  description:
    'Pre-register to find independent contractor work in your trade, make your qualifications and availability discoverable, or do both when your market opens.',
  path: '/for-contractors',
});

export default function ForContractorsPage() {
  return (
    <AudienceLandingPage
      eyebrow="For Independent Contractors"
      title={
        <>
          Turn Open Capacity Into <span>Work.</span>
        </>
      }
      lede="Turn a one-person operation into a bigger opportunity. Find projects, team up with complementary specialists, and price the extra labor before you bid."
      registrationHref="/early-access?role=independent-contractor#detailed-registration"
      registrationLabel="Pre-register as an Independent Contractor"
      audienceType="CONTRACTOR"
      capabilities={[
        {
          icon: SearchCheck,
          title: 'Take On Larger Jobs',
          compactBody: 'Team up with specialists or bring in qualified help.',
          body: 'Team up with other professionals or bring in qualified help for larger projects.',
        },
        {
          icon: CalendarClock,
          title: 'Plan Your Labor',
          compactBody:
            'Find bids in MarketScan. Compare rates and availability before you quote.',
          body: 'Use MarketScan to find opportunities, then compare member rates and availability to plan your labor budget before submitting a bid.',
        },
        {
          icon: BadgeCheck,
          title: 'Keep Your Independence',
          body: 'Set your service area, rates, and availability. Work through your own contractor agreement and show reviewed credentials alongside your completed work.',
        },
      ]}
      registrationDetails={[
        'Your name, optional operating name, and primary trade or specialty.',
        'Credential status, registered state, and service area.',
        'Availability, experience, and the work you are prepared to perform.',
      ]}
      afterJoining={[
        'Find a project that fits your specialty, or make your availability visible to businesses that need it.',
        'Agree on scope, rates, and timing. Line up any additional workers or businesses the project needs.',
        'Complete the engagement and build a rated work history that helps you win the next project.',
      ]}
    />
  );
}
