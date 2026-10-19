import { SpecializedTradePage } from '@/components/specialized-trade-page';
import { createPageMetadata } from '@/lib/site-metadata';
import { SPECIALIZED_TRADE_PAGES } from '@/lib/specialized-pages';

const config = SPECIALIZED_TRADE_PAGES.plumbing;

export const metadata = createPageMetadata({
  title: 'Plumbing & Pipefitting Jobs and Skilled Labor',
  description:
    'Pre-register to find plumbing and pipefitting work or connect your business with qualified professionals and crews when your LaborTrader market opens.',
  path: '/trades/plumbing',
});

export default function PlumbingTradePage() {
  return (
    <SpecializedTradePage
      config={config}
      tradeName="Plumbing & Pipefitting"
      path="/trades/plumbing"
    />
  );
}
