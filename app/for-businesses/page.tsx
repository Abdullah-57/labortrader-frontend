import { BriefcaseBusiness, SearchCheck, UsersRound } from 'lucide-react';
import { AudienceLandingPage } from '@/components/audience-landing-page';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Skilled Labor for Service Businesses',
  description:
    'Pre-register your trade service business to find qualified workers and crews, offer open capacity, or do both when your market opens.',
  path: '/for-businesses',
});

export default function ForBusinessesPage() {
  return (
    <AudienceLandingPage
      eyebrow="For Service Businesses"
      title={
        <>
          Fill Gaps. Put Open Crews to <span>Work.</span>
        </>
      }
      lede="Cover the busy days. Earn from the quiet ones. Hire short-term W-2 help, offer available technicians or crews, and take on more work with one business profile."
      registrationHref="/early-access?role=service-business#detailed-registration"
      registrationLabel="Pre-register as a Service Business"
      audienceType="BUSINESS"
      capabilities={[
        {
          icon: SearchCheck,
          title: 'Cover a Busy Day',
          compactBody:
            'Hire W-2 help, contractors, or another business for the scope you need.',
          body: 'Bring in skilled W-2 help through SkillCraft Staffing starting at one full day, or engage an independent contractor or service business for a defined scope.',
        },
        {
          icon: UsersRound,
          title: 'Fill Open Crew Time',
          compactBody:
            'Offer available crews at your rates, in your service area.',
          body: 'Offer your technicians and crews between projects. Set your service area, availability, and rates.',
        },
        {
          icon: BriefcaseBusiness,
          title: 'Bid Beyond Your Payroll',
          body: 'Check labor rates and available capacity before bidding. Add the specialties a larger job needs without building permanent payroll ahead of demand.',
        },
      ]}
      registrationDetails={[
        'Business name, type, size, and primary specialty.',
        'Whether you want to hire, offer capacity, or do both.',
        'Home market, service area, and timing.',
      ]}
      afterJoining={[
        'Offer your open capacity, post a hiring need, or do both from the same service-business profile.',
        'Choose the right engagement path and confirm the scope, rate, schedule, and provider responsibilities.',
        'Build completed-work ratings when providing services, and a hire rate and confirmed-payment history when hiring.',
      ]}
    />
  );
}
