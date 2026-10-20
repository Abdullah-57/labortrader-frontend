import { LandingContent } from '@/components/landing-content';
import { LandingSurface } from '@/components/landing-surface';
import { LocationBanner } from '@/components/location-banner';
import { IndustrySignupCounts } from '@/components/industry-signup-counts';
import { QuickLaunchForm } from '@/components/quick-launch-form';
import { RegistrationReminder } from '@/components/registration-reminder';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { getConfirmedParticipantMarket } from '@/lib/home-market-context';
import { getLocationDismissalSignature } from '@/lib/location';
import { getLocationBannerContext } from '@/lib/location-server';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({
  title: 'Skilled Labor Marketplace | Find Work & Hire | LaborTrader',
  description:
    'Pre-register nationwide to find skilled trade work, hire qualified help, and discover bid opportunities. Oklahoma launches February 2027.',
  path: '/',
  absoluteTitle: true,
});

export default async function Home() {
  const [locationContext, confirmedMarket] = await Promise.all([
    getLocationBannerContext(),
    getConfirmedParticipantMarket(),
  ]);
  const location = confirmedMarket
    ? {
        city: confirmedMarket.city,
        region: confirmedMarket.state,
        country: 'US' as const,
      }
    : locationContext.location;

  return (
    <LandingSurface background="none">
      <SiteHeader ctaHref="#pre-register" />
      <LandingContent
        registration={<QuickLaunchForm />}
        counter={
          <IndustrySignupCounts
            scope="all"
            label="Put your trade on the map."
            href="#pre-register"
          />
        }
        marketNotice={
          <LocationBanner
            compact
            location={location}
            initiallyDismissed={
              locationContext.dismissedSignature ===
              getLocationDismissalSignature(location)
            }
            locationConfidence={confirmedMarket ? 'CONFIRMED' : 'APPROXIMATE'}
          />
        }
      />
      <SiteFooter />
      <RegistrationReminder alreadyRegistered={Boolean(confirmedMarket)} />
    </LandingSurface>
  );
}
