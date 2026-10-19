import { SignupCounterStrip } from './signup-counter-strip';
import { getPublicSignupCounts } from '@/lib/public-signup-counts';
import {
  publicCounterDisplayMinimum,
  type SignupCountScope,
} from '@/lib/signup-counts-domain';

export async function IndustrySignupCounts({
  scope,
  label,
  href,
}: {
  scope: SignupCountScope;
  label: string;
  href?: string;
}) {
  return (
    <SignupCounterStrip
      counts={await getPublicSignupCounts(scope)}
      label={label}
      href={href}
      displayMinimum={publicCounterDisplayMinimum()}
    />
  );
}
