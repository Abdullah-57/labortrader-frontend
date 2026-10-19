import { SpecializedTradePage } from '@/components/specialized-trade-page';
import { createPageMetadata } from '@/lib/site-metadata';
import { SPECIALIZED_TRADE_PAGES } from '@/lib/specialized-pages';
export const metadata = createPageMetadata({
  title: 'Welding, Construction & Other Skilled Trade Work',
  description:
    'Pre-register to find work or hire help in welding, roofing, carpentry, concrete, industrial maintenance, and other skilled trades when your market opens.',
  path: '/trades/other',
});
export default function IndustryPage() {
  return (
    <SpecializedTradePage
      config={SPECIALIZED_TRADE_PAGES['other']}
      tradeName="Other Trades & Specialties"
      path="/trades/other"
    />
  );
}
