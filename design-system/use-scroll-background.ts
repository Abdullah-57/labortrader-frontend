'use client';

import { useEffect, type RefObject } from 'react';

export function useScrollBackground(
  photo: RefObject<HTMLElement | null>,
  enabled = true,
  property = '--lt-scroll-progress',
  root?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const element = photo.current;
    if (!element) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let active = false;
    const paint = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
      element.style.setProperty(property, String(progress));
    };
    const queuePaint = () => {
      if (active && !frame) frame = window.requestAnimationFrame(paint);
    };
    const syncMotion = () => {
      active = enabled && !reducedMotion.matches;
      window.removeEventListener('scroll', queuePaint);
      window.cancelAnimationFrame(frame);
      frame = 0;
      if (active) {
        window.addEventListener('scroll', queuePaint, { passive: true });
        queuePaint();
      } else element.style.setProperty(property, '0');
    };
    const observer = new ResizeObserver(queuePaint);
    observer.observe(root?.current ?? document.body);
    window.addEventListener('resize', queuePaint);
    reducedMotion.addEventListener('change', syncMotion);
    syncMotion();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', queuePaint);
      window.removeEventListener('resize', queuePaint);
      reducedMotion.removeEventListener('change', syncMotion);
      observer.disconnect();
    };
  }, [photo, enabled, property, root]);
}
