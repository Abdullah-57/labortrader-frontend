'use client';

import { useEffect, useRef, useState } from 'react';
import { advantages } from './landing-content-data';

const STEP_LABELS = ['Matching', 'Reputation', 'Pricing', 'Operations'] as const;

export function AdvantageRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0.08);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1);
      return;
    }

    let ticking = false;
    const calculateProgress = () => {
      const element = containerRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start filling when the top of the roadmap is 75% down the viewport
      const startTrigger = windowHeight * 0.75;
      // Complete filling when the bottom of the roadmap reaches 35% of the viewport
      const endTrigger = windowHeight * 0.35;
      const totalSpan = rect.height + (startTrigger - endTrigger);
      const scrolled = startTrigger - rect.top;
      const p = Math.min(Math.max(scrolled / totalSpan, 0), 1);
      setProgress(p);
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Thresholds for step icon illumination:
  const stepThresholds = [0.04, 0.36, 0.68, 0.96];

  // Segment ranges between steps:
  const segmentRanges = [
    { start: 0.04, end: 0.36 },
    { start: 0.36, end: 0.68 },
    { start: 0.68, end: 0.96 },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col"
      aria-label="LaborTrader advantages timeline"
    >
      {advantages.map((item, index) => {
        const Icon = item.icon;
        const isActive = progress >= stepThresholds[index];
        const isLast = index === advantages.length - 1;

        // Calculate fill percentage for the segment between this item and the next item
        let segFill = 0;
        let isSegFilling = false;
        if (!isLast) {
          const range = segmentRanges[index];
          if (progress >= range.end) {
            segFill = 1;
          } else if (progress > range.start) {
            segFill = (progress - range.start) / (range.end - range.start);
            isSegFilling = true;
          }
        }

        return (
          <div
            key={item.title}
            className="group relative flex items-stretch gap-5 sm:gap-7"
          >
            {/* Spine Column: fixed 56px width, items-center ensures exact mathematical centering */}
            <div className="relative flex flex-col items-center shrink-0 w-14">
              {/* Icon Badge: 100% SOLID opaque background so the line never shows through */}
              <div
                className={`relative z-20 flex size-14 shrink-0 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-[#e76532] bg-[#1d1815] text-white shadow-[0_0_24px_rgba(231,101,50,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]'
                    : 'border-white/12 bg-[#15171b] text-[#a9bfd2] group-hover:border-white/25 group-hover:text-white'
                }`}
              >
                <Icon
                  className={`size-6 transition-all duration-300 group-hover:scale-110 ${
                    isActive
                      ? 'text-[#ff7a45] drop-shadow-[0_0_8px_rgba(231,101,50,0.7)]'
                      : 'text-[#a9bfd2]'
                  }`}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              {/* Connecting Road Track between bottom of this icon and top of next icon (no gap, seamlessly connected) */}
              {!isLast && (
                <div
                  className="relative z-0 flex-1 w-1 -mt-1 -mb-1 flex justify-center"
                  aria-hidden="true"
                >
                  {/* Base dark track with highway dashed markings */}
                  <div className="absolute inset-0 bg-white/15 overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          'linear-gradient(to bottom, #ffffff 40%, transparent 40%)',
                        backgroundSize: '4px 14px',
                      }}
                    />
                  </div>

                  {/* Active Orange Glow Fill Line */}
                  <div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#e76532] via-[#ff7338] to-[#e76532] shadow-[0_0_12px_rgba(231,101,50,0.9),0_0_24px_rgba(231,101,50,0.5)] transition-[height] duration-150 ease-out"
                    style={{ height: `${segFill * 100}%` }}
                  />

                  {/* Beacon dot at the leading tip of the filling segment (unclipped, centered over track) */}
                  {isSegFilling && segFill > 0.02 && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 size-2.5 rounded-full bg-[#ff8552] shadow-[0_0_10px_#ff8552,0_0_20px_rgba(231,101,50,1)] transition-[top] duration-150 ease-out pointer-events-none z-10"
                      style={{ top: `calc(${segFill * 100}% - 5px)` }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Right: Content Card */}
            <article
              className={`flex-1 min-w-0 rounded-2xl p-4 sm:p-5 transition-all duration-300 ${
                isLast ? 'mb-0' : 'mb-6 sm:mb-8'
              } border border-transparent hover:border-white/10 hover:bg-white/[0.035] ${
                isActive ? 'bg-white/[0.02]' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-[11px] font-black uppercase tracking-[0.14em] transition-colors duration-200 ${
                    isActive ? 'text-[#e76532]' : 'text-muted-foreground'
                  }`}
                >
                  0{index + 1}
                </span>
                <span className="size-1 rounded-full bg-white/20" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {STEP_LABELS[index]}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#f4f1eb] transition-colors duration-200 group-hover:text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm sm:text-[14.5px] leading-relaxed text-[#c3c6cb]">
                {item.body}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
