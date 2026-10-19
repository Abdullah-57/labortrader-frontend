import { Building2, Network, Waypoints } from 'lucide-react';
import { AudienceLandingPage } from '@/components/audience-landing-page';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Hire Skilled Workers and Trade Businesses',
  description:
    'Pre-register your hiring organization to compare skilled workers, independent contractors, and service businesses by qualifications, availability, and price.',
  path: '/for-hiring-firms',
});

export default function ForHiringFirmsPage() {
  return (
    <AudienceLandingPage
      eyebrow="For Hiring Organizations"
      title={
        <>
          Find the Skilled Capacity Your <span>Work Requires.</span>
        </>
      }
      lede="Compare specialties, reviewed credentials, availability, and rates. Hire W-2 help through SkillCraft Staffing or engage contractors and service businesses."
      registrationHref="/early-access?role=hiring-organization#detailed-registration"
      registrationLabel="Pre-register as a Hiring Organization"
      audienceType="HIRING_FIRM"
      capabilities={[
        {
          icon: Network,
          title: 'Compare the Right Details',
          compactBody:
            'Review skills, credentials, ratings, availability, and rates.',
          body: 'Compare experience, credential status, completed-engagement ratings, availability, location, and price.',
        },
        {
          icon: Waypoints,
          title: 'Rehire People You Trust',
          compactBody: 'Bring back the people who showed up and delivered.',
          body: 'Go back to the people who showed up and got the job done. A shared work history makes the next hiring decision easier.',
        },
        {
          icon: Building2,
          title: 'Build Your Hiring Reputation',
          body: 'Your hire rate and confirmed payments give skilled people a clearer view of your organization and its track record.',
        },
      ]}
      registrationDetails={[
        'Organization name, type, contact role, and states or markets served.',
        'Trades, specialties, and the type of skilled capacity you expect to hire.',
        'Timing and interest in short-duration skilled-trade engagements.',
      ]}
      afterJoining={[
        'Describe the trade, work location, schedule, scope, and capacity you need.',
        'Compare suitable workers, independent contractors, and service businesses. Agree on the terms before the work starts.',
        'Confirm completion and payments, keep the engagement record together, and rehire proven people for the next job.',
      ]}
      secondaryAction={{
        href: '/for-clients#client-preregistration',
        label: 'Use the Client Path',
        description:
          'Have a defined project? Use Client & Project Owner registration. Staffing and payroll providers use Partner Inquiries.',
      }}
    />
  );
}
