import { SpecializedTradePage } from '@/components/specialized-trade-page';
import { createPageMetadata } from '@/lib/site-metadata';
import { SPECIALIZED_TRADE_PAGES } from '@/lib/specialized-pages';
export const metadata = createPageMetadata({
  title: 'Oil & Gas Jobs, Contractors & Field Labor',
  description:
    'Pre-register for oil and gas field work or hire skilled contractors and service companies for wellsite, pipeline, plant, and refinery projects at launch.',
  path: '/industries/oil-gas',
});
export default function IndustryPage() {
  return (
    <SpecializedTradePage
      config={SPECIALIZED_TRADE_PAGES['oil-gas']}
      tradeName="Oil & Gas"
      path="/industries/oil-gas"
    />
  );
}
