'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, MapPin, PackageSearch, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import styles from './pro-shop-storefront-preview.module.css';

type ShopCategory =
  | 'all'
  | 'supplies'
  | 'tools-rentals'
  | 'clothing'
  | 'training'
  | 'software'
  | 'vehicles'
  | 'marketing'
  | 'business-services';

type PreviewListing = Readonly<{
  title: string;
  provider: string;
  categoryLabel: string;
  categories: readonly ShopCategory[];
  price: string;
  coverage: string;
  audience: string;
  image: string;
  imageAlt: string;
}>;

const shopByNeedCategories: ReadonlyArray<{
  value: ShopCategory;
  label: string;
}> = [
  { value: 'all', label: 'For You' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'tools-rentals', label: 'Tools & Rentals' },
  { value: 'clothing', label: 'Clothing & Workwear' },
  { value: 'training', label: 'Training' },
  { value: 'software', label: 'Software' },
  { value: 'vehicles', label: 'Vehicles & Fleet' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business-services', label: 'Business Services' },
];

const previewListings: readonly PreviewListing[] = [
  {
    title: 'Pro-Grade Cordless Tool Kit',
    provider: 'Professional tool supplier',
    categoryLabel: 'Tools & Equipment',
    categories: ['supplies', 'tools-rentals'],
    price: 'Member pricing available',
    coverage: 'Ships nationwide',
    audience: 'Electrical · HVAC · Plumbing',
    image: '/pro-shop/tools.webp',
    imageAlt:
      'Cordless drill, impact driver, batteries, and organized trade tool case',
  },
  {
    title: 'All-Weather Trade Workwear',
    provider: 'Workwear and PPE provider',
    categoryLabel: 'Clothing & Workwear',
    categories: ['supplies', 'clothing'],
    price: 'Sample pricing from $89',
    coverage: 'Delivery and local pickup',
    audience: 'Workers · Contractors · Crews',
    image: '/pro-shop/workwear.webp',
    imageAlt: 'Work boots, durable work jacket, hard hat, and safety glasses',
  },
  {
    title: 'Commercial Service Van',
    provider: 'Commercial fleet provider',
    categoryLabel: 'Vehicles & Fleet',
    categories: ['vehicles', 'business-services'],
    price: 'Request a fleet quote',
    coverage: 'Regional and nationwide programs',
    audience: 'Contractors · Service businesses',
    image: '/pro-shop/vehicle.webp',
    imageAlt:
      'Clean white commercial service van shown at a three-quarter angle',
  },
  {
    title: 'Safety and Certification Training',
    provider: 'Trade training provider',
    categoryLabel: 'Training & Certification',
    categories: ['training', 'business-services'],
    price: 'Sample pricing from $59',
    coverage: 'Online and Oklahoma classes',
    audience: 'Workers · Contractors · Teams',
    image: '/pro-shop/training.webp',
    imageAlt:
      'Hard hat, safety training materials, clipboard, and protective equipment',
  },
  {
    title: 'Field Operations Suite',
    provider: 'Trade software provider',
    categoryLabel: 'Software',
    categories: ['software', 'business-services'],
    price: 'Sample plans from $49/month',
    coverage: 'Available nationwide',
    audience: 'Service businesses · Hiring teams',
    image: '/pro-shop/software.webp',
    imageAlt:
      'Rugged tablet and laptop displaying a generic field operations dashboard',
  },
  {
    title: 'Contractor Growth Package',
    provider: 'Trade marketing provider',
    categoryLabel: 'Marketing',
    categories: ['marketing', 'business-services'],
    price: 'Request a proposal',
    coverage: 'Local and multi-state support',
    audience: 'Contractors · Service businesses',
    image: '/pro-shop/marketing.webp',
    imageAlt:
      'Laptop, phone, and camera arranged for a contractor marketing workspace',
  },
];

export function ProShopStorefrontPreview() {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('all');
  const [query, setQuery] = useState('');

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return previewListings.filter((listing) => {
      const matchesCategory =
        activeCategory === 'all' || listing.categories.includes(activeCategory);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          listing.title,
          listing.provider,
          listing.categoryLabel,
          listing.coverage,
          listing.audience,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  function clearFilters() {
    setActiveCategory('all');
    setQuery('');
  }

  return (
    <div
      className={`lt-panel mt-10 overflow-hidden border border-background/16 bg-lt-panel text-foreground shadow-[0_24px_80px_rgba(0,0,0,0.22)] ${styles.preview}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 bg-lt-panel px-5 py-3 text-[#f3eddf] sm:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Pro Shop Preview
        </p>
        <p className="text-xs font-bold text-[#f3eddf]/68">
          Directory and affiliate marketplace preview
        </p>
      </div>

      <div className="grid gap-5 border-b border-foreground/10 bg-lt-panel px-5 py-5 sm:px-7 lg:grid-cols-[minmax(11rem,.55fr)_minmax(18rem,1.25fr)_auto] lg:items-center">
        <div>
          <p className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
            LaborTrader Pro Shop
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.11em] text-primary">
            Built for the workday
          </p>
        </div>

        <div className="relative min-w-0">
          <label className="sr-only" htmlFor="pro-shop-preview-search">
            Search sample Pro Shop offers
          </label>
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-foreground"
            aria-hidden="true"
          />
          <Input
            id="pro-shop-preview-search"
            data-leading-icon
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search offers"
            className="form-input h-12 border-foreground/18 bg-lt-panel pr-4 pl-12 text-sm font-bold shadow-none focus-visible:border-primary focus-visible:ring-primary/20"
          />
        </div>

        <div className="flex min-h-12 items-center gap-2 border border-foreground/12 bg-lt-panel px-4 text-sm font-semibold">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          <span>Tulsa, OK · HVAC Business</span>
        </div>
      </div>

      <nav
        className="border-b border-foreground/10 bg-lt-panel px-5 py-4 sm:px-7"
        aria-label="Preview Pro Shop categories"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
          Shop by Need
        </p>
        <div className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
          {shopByNeedCategories.map((category) => {
            const selected = activeCategory === category.value;

            return (
              <Button
                key={category.value}
                type="button"
                variant="outline"
                size="lg"
                aria-pressed={selected}
                onClick={() => setActiveCategory(category.value)}
                className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black uppercase tracking-[0.06em] ${
                  selected
                    ? 'border-foreground bg-lt-panel text-[#f3eddf] hover:bg-lt-panel hover:text-[#f3eddf]'
                    : 'border-foreground/14 bg-lt-panel hover:border-primary hover:bg-lt-panel'
                }`}
              >
                {category.label}
              </Button>
            );
          })}
        </div>
      </nav>

      <div className={styles.content}>
        <div className="grid overflow-hidden bg-lt-panel text-[#f3eddf] lg:grid-cols-[minmax(0,1.35fr)_minmax(17rem,.65fr)]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Featured Collection
            </p>
            <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
              What the job needs, without the general-market noise.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[#f3eddf]/70 sm:text-base sm:leading-7">
              Find offers for your trade and market, then shop directly with the
              vendor.
            </p>
          </div>
          <div className="border-t border-[#f3eddf]/12 bg-lt-panel p-6 sm:p-8 lg:border-t-0 lg:border-l">
            <ul className="space-y-3 text-sm font-bold">
              {[
                'Local pickup and nationwide delivery',
                'Products and professional services',
                'Direct access to the provider',
              ].map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-lt-panel border border-primary text-background">
                    <Check className="size-3" aria-hidden="true" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary underline decoration-2 underline-offset-4"
              href="#categories"
            >
              Explore Every Category
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-b border-foreground/12 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Recommended for Your Work
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              Products and Services for the Field
            </h3>
          </div>
          <output
            className="text-sm font-bold text-foreground"
            aria-live="polite"
          >
            {filteredListings.length}{' '}
            {filteredListings.length === 1 ? 'sample offer' : 'sample offers'}
          </output>
        </div>

        {filteredListings.length > 0 ? (
          <ul className={styles.products}>
            {filteredListings.map((listing) => (
              <li key={listing.title} className="min-w-0">
                <article className="lt-panel flex h-full min-w-0 flex-col overflow-hidden border border-foreground/10 bg-lt-panel shadow-[0_10px_30px_rgba(32,34,30,0.07)]">
                  <div
                    className={`relative aspect-square overflow-hidden bg-lt-panel ${styles.productImage}`}
                  >
                    <Image
                      src={listing.image}
                      alt={listing.imageAlt}
                      fill
                      sizes="(min-width: 1280px) 29vw, 44vw"
                      className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                    <span className="absolute top-3 left-3 bg-lt-panel px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-[#f3eddf]">
                      Sample Listing
                    </span>
                  </div>
                  <div className={styles.productBody}>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-primary">
                      {listing.categoryLabel}
                    </p>
                    <h4 className="mt-2 text-xl font-semibold leading-tight tracking-[-0.035em]">
                      {listing.title}
                    </h4>
                    <p className="mt-2 text-sm font-bold text-foreground">
                      {listing.provider}
                    </p>
                    <p className="mt-5 text-lg font-semibold tracking-[-0.025em]">
                      {listing.price}
                    </p>
                    <div className="mt-5 border-t border-foreground/10 pt-4">
                      <p className="text-xs font-bold leading-5 text-foreground">
                        {listing.coverage}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-foreground">
                        {listing.audience}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 grid min-h-64 place-items-center border border-foreground/12 bg-lt-panel p-8 text-center">
            <div>
              <PackageSearch
                className="mx-auto size-7 text-primary"
                aria-hidden="true"
              />
              <h4 className="mt-4 text-xl font-semibold tracking-[-0.035em]">
                No sample offers match that search.
              </h4>
              <p className="mt-2 text-sm leading-6 text-foreground">
                Clear the filters to return to the full storefront preview.
              </p>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="mt-5 min-h-11 max-w-full whitespace-normal rounded-none border-foreground bg-lt-panel px-5 font-semibold text-[#f3eddf] hover:bg-lt-panel hover:text-primary"
                onClick={clearFilters}
              >
                Clear Search and Filters
              </Button>
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-4 border border-foreground/12 bg-lt-panel p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm font-bold leading-6 text-foreground">
            Each live offer will link directly to the vendor for purchases,
            fulfillment, returns, and support.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 border border-foreground/16 px-4 text-sm font-semibold hover:border-primary hover:text-primary"
              href="#categories"
            >
              Browse Categories
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-lt-panel border border-primary px-4 text-sm font-semibold text-background hover:text-primary"
              href="/advertise#provider-application"
            >
              List Your Offer
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
