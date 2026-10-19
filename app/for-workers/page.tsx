import { Award, CalendarClock, MapPin } from 'lucide-react';
import { AudienceLandingPage } from '@/components/audience-landing-page';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Skilled Trade Jobs for Workers',
  description:
    'Pre-register for skilled trade work that fits your experience, availability, desired rate, location, and travel area when your market opens.',
  path: '/for-workers',
});

export default function ForWorkersPage() {
  return (
    <AudienceLandingPage
      eyebrow="For Workers"
      title={
        <>
          Put Your Skill Where the <span>Work Is.</span>
        </>
      }
      lede="Name your desired hourly wage. Choose short-term W-2 work that fits your skills, schedule, and travel area, with staffing through SkillCraft Staffing."
      registrationHref="/early-access?role=worker#detailed-registration"
      registrationLabel="Pre-register as a Worker"
      audienceType="WORKER"
      capabilities={[
        {
          icon: CalendarClock,
          title: 'Set Your Hourly Wage',
          compactBody:
            'Set your wage, schedule, and travel area. Agree on pay before accepting.',
          body: 'Set your desired wage, travel area, and availability. Agree on pay before accepting.',
        },
        {
          icon: MapPin,
          title: 'Make Each Day Count.',
          compactBody:
            'Take one-day W-2 assignments with staffing through SkillCraft.',
          body: 'Take short-term W-2 assignments starting at one full day. SkillCraft Staffing handles the employment path so you can focus on the work.',
        },
        {
          icon: Award,
          title: 'Build Proof of Your Work',
          body: 'Each completed engagement adds to your rating and work history. Documented hours may support licensing goals when accepted by the licensing authority.',
        },
      ]}
      registrationDetails={[
        'Primary trade or specialty, credential level, and experience range.',
        'Availability, desired rate, and travel radius or markets.',
        'Optional tools, transportation, and additional skills.',
      ]}
      afterJoining={[
        'Compare assignments by specialty, schedule, location, and agreed pay.',
        'Complete SkillCraft onboarding for the W-2 assignment and keep hours tied to the engagement.',
        'Build your completed-engagement rating and get found again by good hirers.',
      ]}
    />
  );
}
