import type { CSSProperties, ReactNode } from 'react';
import { SiteFrame } from './site-frame';
import styles from '@/design-system/landing.module.css';

/** Preview controls supply overrides; the public homepage uses the approved defaults. */
export function LandingSurface({
  children,
  tone = 'graphite',
  photo = 48,
  panel = 78,
  rounded = true,
  motion = true,
}: {
  children: ReactNode;
  tone?: string;
  photo?: number;
  panel?: number;
  rounded?: boolean;
  motion?: boolean;
}) {
  return (
    <SiteFrame
      className={`lt-landing ${styles.landing}`}
      tone={tone}
      motion={motion}
      style={
        {
          '--lt-photo-opacity': photo / 100,
          '--landing-panel-opacity': panel / 100,
          '--landing-radius': rounded ? '16px' : '0px',
        } as CSSProperties
      }
    >
      {children}
    </SiteFrame>
  );
}
