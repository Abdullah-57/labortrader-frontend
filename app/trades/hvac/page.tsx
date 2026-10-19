import { SpecializedTradePage } from '@/components/specialized-trade-page';
import { createPageMetadata } from '@/lib/site-metadata';
import { SPECIALIZED_TRADE_PAGES } from '@/lib/specialized-pages';

const config = SPECIALIZED_TRADE_PAGES.hvac;

export const metadata = createPageMetadata({
  title: 'HVAC & Refrigeration Jobs and Skilled Labor',
  description:
    'Pre-register to find HVAC and refrigeration work or connect your business with qualified technicians and crews when your LaborTrader market opens.',
  path: '/trades/hvac',
});

export default function HvacTradePage() {
  return (
    <SpecializedTradePage
      config={config}
      tradeName="HVAC & Refrigeration"
      path="/trades/hvac"
    />
  );
}
