import type { CSSProperties, ReactNode } from 'react';
import {
  siteBackgrounds,
  type SiteBackground,
} from '@/design-system/backgrounds';
import { SiteBackdrop } from './site-backdrop';

/** Public page frame. Keep page-specific colors and background mechanics out of routes. */
export function SiteFrame({
  children,
  background = 'landing',
  reading = false,
  className = '',
  tone,
  motion = true,
  style,
}: {
  children: ReactNode;
  background?: SiteBackground | 'none' | null;
  reading?: boolean;
  className?: string;
  tone?: string;
  motion?: boolean;
  style?: CSSProperties;
}) {
  const hasImage = Boolean(background && background !== 'none');
  const image = hasImage && background ? siteBackgrounds[background as SiteBackground] : null;
  return (
    <div
      className={`lt-site ${className}`}
      data-tone={tone}
      style={style}
      data-background={background || 'none'}
      data-reading={reading || undefined}
    >
      {image && (
        <SiteBackdrop src={image.src} position={image.position} motion={motion} />
      )}
      {children}
    </div>
  );
}
