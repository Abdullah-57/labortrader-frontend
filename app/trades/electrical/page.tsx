import { SpecializedTradePage } from '@/components/specialized-trade-page';
import { createPageMetadata } from '@/lib/site-metadata';
import { SPECIALIZED_TRADE_PAGES } from '@/lib/specialized-pages';

const config = SPECIALIZED_TRADE_PAGES.electrical;

export const metadata = createPageMetadata({
  title: 'Electrical Jobs and Skilled Labor',
  description:
    'Pre-register to find electrical work or connect your business with qualified electricians, contractors, and crews when your LaborTrader market opens.',
  path: '/trades/electrical',
});

export default function ElectricalTradePage() {
  return (
    <SpecializedTradePage
      config={config}
      tradeName="Electrical Trades"
      path="/trades/electrical"
    />
  );
}
