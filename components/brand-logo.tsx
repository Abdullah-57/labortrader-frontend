import Image from 'next/image';
import { cn } from '@/lib/utils';

const brandAssets = {
  wordmark: {
    default: '/brand/labortrader-logo.svg',
    inverse: '/brand/labortrader-logo-inverse.svg',
    width: 1510,
    height: 326,
    alt: 'LaborTrader: The Skilled Labor Marketplace',
  },
  mark: {
    default: '/brand/labortrader-mark.svg',
    inverse: '/brand/labortrader-mark-inverse.svg',
    width: 1059,
    height: 1239,
    alt: 'LaborTrader',
  },
} as const;

type BrandLogoProps = {
  /** Use `inverse` when the logo sits on a dark surface. */
  appearance?: 'default' | 'inverse';
  /** The approved full wordmark is the default; the mark is for icon contexts. */
  variant?: 'wordmark' | 'mark';
  /** Pass an empty string when a labelled parent link already names LaborTrader. */
  alt?: string;
  className?: string;
  preload?: boolean;
};

/**
 * The single rendering point for LaborTrader's approved brand artwork.
 * Source files are copied byte-for-byte from the shared LaborTrader Logos folder.
 */
export function BrandLogo({
  appearance = 'default',
  variant = 'wordmark',
  alt,
  className,
  preload = false,
}: BrandLogoProps) {
  const asset = brandAssets[variant];

  return (
    <Image
      src={asset[appearance]}
      width={asset.width}
      height={asset.height}
      alt={alt ?? asset.alt}
      className={cn('block h-auto max-w-full', className)}
      loading={preload ? 'eager' : 'lazy'}
      fetchPriority={preload ? 'high' : 'auto'}
      unoptimized
    />
  );
}
