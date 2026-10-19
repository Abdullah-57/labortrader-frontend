'use client';

import type { MouseEvent, ReactNode } from 'react';
import { useCallback, useEffect, useState } from 'react';

type DetailsJumpLinkProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

export function DetailsJumpLink({
  targetId,
  className,
  children,
}: DetailsJumpLinkProps) {
  const [expanded, setExpanded] = useState(false);

  const revealTarget = useCallback(
    ({ focus, updateHistory }: { focus: boolean; updateHistory: boolean }) => {
      const target = document.getElementById(targetId);
      if (!(target instanceof HTMLDetailsElement)) return false;

      target.open = true;
      setExpanded(true);

      if (updateHistory) {
        const nextHash = `#${targetId}`;
        if (window.location.hash === nextHash) {
          window.history.replaceState(null, '', nextHash);
        } else {
          window.history.pushState(null, '', nextHash);
        }
      }

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      window.requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        });

        if (focus) {
          const summary = target.querySelector('summary');
          if (summary instanceof HTMLElement) {
            summary.focus({ preventScroll: true });
          }
        }
      });

      return true;
    },
    [targetId],
  );

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!(target instanceof HTMLDetailsElement)) return;

    const syncExpandedState = () => setExpanded(target.open);
    const revealFromLocation = () => {
      if (window.location.hash === `#${targetId}`) {
        revealTarget({ focus: false, updateHistory: false });
      }
    };

    syncExpandedState();
    revealFromLocation();
    target.addEventListener('toggle', syncExpandedState);
    window.addEventListener('hashchange', revealFromLocation);
    window.addEventListener('popstate', revealFromLocation);

    return () => {
      target.removeEventListener('toggle', syncExpandedState);
      window.removeEventListener('hashchange', revealFromLocation);
      window.removeEventListener('popstate', revealFromLocation);
    };
  }, [revealTarget, targetId]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    if (revealTarget({ focus: true, updateHistory: true })) {
      event.preventDefault();
    }
  }

  return (
    <a
      className={className}
      href={`#${targetId}`}
      aria-controls={targetId}
      aria-expanded={expanded}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
