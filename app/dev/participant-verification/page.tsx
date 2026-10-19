import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ParticipantVerificationCaptures } from '@/components/participant-verification-captures';
import { SiteFrame } from '@/components/site-frame';
import { participantVerificationCaptureEnabled } from '@/lib/participant-verification-capture-policy';

export const metadata: Metadata = {
  title: 'Local Verification QA',
  robots: { index: false, follow: false, noarchive: true },
};

export const dynamic = 'force-dynamic';

export default function ParticipantVerificationCapturePage() {
  if (!participantVerificationCaptureEnabled()) notFound();
  return (
    <SiteFrame reading>
      <main id="main-content" className="min-h-screen px-4 py-10">
        <ParticipantVerificationCaptures />
      </main>
    </SiteFrame>
  );
}
