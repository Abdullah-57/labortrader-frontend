'use client';

import { useRef, type CSSProperties } from 'react';
import { useScrollBackground } from '@/design-system/use-scroll-background';

export function SiteBackdrop({
  src,
  position = 'center',
  motion = true,
}: {
  src: string;
  position?: string;
  motion?: boolean;
}) {
  const photo = useRef<HTMLDivElement>(null);
  useScrollBackground(photo, motion);
  return (
    <div className="lt-backdrop" aria-hidden="true">
      <div
        ref={photo}
        className="lt-backdrop-photo"
        style={
          {
            backgroundImage: `url('${src}')`,
            backgroundPosition: position,
          } as CSSProperties
        }
      />
    </div>
  );
}
