import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { COMPANY_PROFILE } from '@/lib/company-profile';

export function FounderCredibility({
  appearance = 'light',
}: {
  appearance?: 'light' | 'dark';
}) {
  const dark = appearance === 'dark';

  return (
    <article
      className={`grid min-w-0 gap-6 border p-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:p-6 ${
        dark
          ? 'border-background/14 bg-lt-panel'
          : 'border-foreground/14 bg-lt-panel'
      }`}
    >
      <Image
        src={COMPANY_PROFILE.founder.imagePath}
        alt="Ben Randall, Founder and CEO of LaborTrader Inc."
        className="aspect-square w-full max-w-48 object-cover object-top sm:max-w-none"
        width={1000}
        height={986}
        sizes="(min-width: 640px) 144px, 192px"
      />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
          Founder-Led. Trade-Tested.
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
          {COMPANY_PROFILE.founder.name}
        </h3>
        <p
          className={`mt-1 text-sm font-black ${
            dark ? 'text-background/66' : 'text-foreground'
          }`}
        >
          {COMPANY_PROFILE.founder.jobTitle}, {COMPANY_PROFILE.legalName}
        </p>
        <p
          className={`mt-4 text-sm leading-6 ${
            dark ? 'text-background/74' : 'text-foreground'
          }`}
        >
          Twenty years in HVAC, including six years as an HVAC contractor and
          business owner, shaped LaborTrader around the labor gaps trade
          businesses face every day.
        </p>
        <Link
          href="/about#founder"
          className={`mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-black uppercase tracking-[0.09em] underline decoration-primary decoration-2 underline-offset-4 ${
            dark ? 'text-background' : 'text-foreground'
          }`}
        >
          Meet the founder
          <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
