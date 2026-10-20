'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, GitFork, Sparkles } from 'lucide-react';
import { paths } from './landing-content-data';

export function AccountPathTree() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full" aria-label="Account selection tree">
      {/* ======================================================== */}
      {/* 1. ROOT NODE / HUB CARD */}
      {/* ======================================================== */}
      <div className="relative mx-auto max-w-xl">
        {/* Main Card with inner overflow-hidden for ambient background glow */}
        <div
          className={`relative z-20 overflow-hidden rounded-2xl border transition-all duration-300 p-6 sm:p-7 text-center ${
            hoveredIndex !== null
              ? 'border-[#e76532]/60 bg-gradient-to-b from-[#1e232b] to-[#14171c] shadow-[0_12px_40px_rgba(231,101,50,0.18)]'
              : 'border-white/12 bg-gradient-to-b from-[#1a1e24] to-[#13161a] shadow-[0_12px_36px_rgba(0,0,0,0.45)]'
          }`}
        >
          {/* Subtle ambient orange radial gradient in top node */}
          <div
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 size-48 rounded-full bg-[#e76532]/15 blur-3xl"
            aria-hidden="true"
          />

          {/* Root Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e76532]/12 border border-[#e76532]/35 text-[#ff7a45] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="size-3.5 text-[#ff7a45]" aria-hidden="true" />
            <span>One Marketplace · 5 Specialized Paths</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#f4f1eb]">
            Where Do You Fit?
          </h3>
          <p className="mt-2 text-sm sm:text-[14.5px] text-[#a9bfd2] leading-relaxed max-w-lg mx-auto">
            LaborTrader provides role-tailored agreements, verified records, and zero subscription fees.
            Select your account type below to explore dedicated tools and launch benefits.
          </p>

          <div className="mt-3.5 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-muted-foreground">
            <GitFork className="size-3.5 text-[#e76532]" aria-hidden="true" />
            <span>Choose any path to begin</span>
          </div>
        </div>

        {/* Bottom Root Connection Port (Placed OUTSIDE overflow-hidden with z-30) */}
        <div
          className={`absolute -bottom-3 left-1/2 -translate-x-1/2 size-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center z-30 ${
            hoveredIndex !== null
              ? 'border-[#e76532] bg-[#1d1815] shadow-[0_0_16px_rgba(231,101,50,0.8)] scale-110'
              : 'border-white/20 bg-[#15171b] shadow-[0_0_8px_rgba(0,0,0,0.5)]'
          }`}
          aria-hidden="true"
        >
          <div
            className={`size-2 rounded-full transition-colors duration-300 ${
              hoveredIndex !== null ? 'bg-[#ff7a45]' : 'bg-[#a9bfd2]'
            }`}
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP TREE BRANCHING (Screen width >= 1024px) */}
      {/* ======================================================== */}
      <div className="hidden lg:block relative mt-3">
        {/* Branching Rail Grid (Mirrors the exact 5-column grid below) */}
        <div
          className="grid grid-cols-5 gap-3.5 xl:gap-4 h-16 relative"
          aria-hidden="true"
        >
          {paths.map((_, i) => {
            const isTarget = hoveredIndex === i;

            return (
              <div key={i} className="relative h-full">
                {/* ---------------- COLUMN 0: WORKER (Far Left) ---------------- */}
                {i === 0 && (
                  <>
                    {/* Horizontal segment: from Center of Col 0 to Right Edge (towards Col 1) */}
                    <div
                      className={`absolute top-1/2 left-1/2 right-[-16px] xl:right-[-18px] h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 0
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Vertical Drop Line to Card 0 */}
                    <div
                      className={`absolute top-1/2 bottom-[-10px] left-1/2 -translate-x-1/2 w-0.5 transition-colors duration-200 z-10 ${
                        isTarget
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Joint Elbow Dot */}
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full border transition-all duration-200 z-20 ${
                        isTarget
                          ? 'border-[#e76532] bg-[#ff7a45] shadow-[0_0_8px_#ff7a45]'
                          : 'border-white/20 bg-[#15171b]'
                      }`}
                    />
                  </>
                )}

                {/* -------- COLUMN 1: INDEPENDENT CONTRACTOR (Mid Left) -------- */}
                {i === 1 && (
                  <>
                    {/* Left segment (from Left Edge to Center): Only active when hovering Card 0 */}
                    <div
                      className={`absolute top-1/2 left-[-16px] xl:left-[-18px] right-1/2 h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 0
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Right segment (from Center to Right Edge): Active when hovering Card 0 or Card 1 */}
                    <div
                      className={`absolute top-1/2 left-1/2 right-[-16px] xl:right-[-18px] h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 0 || hoveredIndex === 1
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Vertical Drop Line to Card 1 */}
                    <div
                      className={`absolute top-1/2 bottom-[-10px] left-1/2 -translate-x-1/2 w-0.5 transition-colors duration-200 z-10 ${
                        isTarget
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Joint Elbow Dot */}
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full border transition-all duration-200 z-20 ${
                        isTarget
                          ? 'border-[#e76532] bg-[#ff7a45] shadow-[0_0_8px_#ff7a45]'
                          : 'border-white/20 bg-[#15171b]'
                      }`}
                    />
                  </>
                )}

                {/* ------------ COLUMN 2: SERVICE BUSINESS (Center) ------------ */}
                {i === 2 && (
                  <>
                    {/* Vertical Trunk from Root Node Port to Busbar */}
                    <div
                      className={`absolute -top-3 bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 transition-colors duration-200 z-10 ${
                        hoveredIndex !== null
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Left Busbar segment in Col 2 (towards Col 1): Active when hovering Card 0 or 1 */}
                    <div
                      className={`absolute top-1/2 left-[-16px] xl:left-[-18px] right-1/2 h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 0 || hoveredIndex === 1
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Right Busbar segment in Col 2 (towards Col 3): Active when hovering Card 3 or 4 */}
                    <div
                      className={`absolute top-1/2 left-1/2 right-[-16px] xl:right-[-18px] h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 3 || hoveredIndex === 4
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Vertical Drop Line to Card 2 */}
                    <div
                      className={`absolute top-1/2 bottom-[-10px] left-1/2 -translate-x-1/2 w-0.5 transition-colors duration-200 z-10 ${
                        isTarget
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Central Junction Hub */}
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 transition-all duration-200 z-20 ${
                        hoveredIndex !== null
                          ? 'border-[#e76532] bg-[#1d1815] shadow-[0_0_10px_#e76532]'
                          : 'border-white/20 bg-[#121417]'
                      }`}
                    />
                  </>
                )}

                {/* ---------- COLUMN 3: HIRING FIRM (Mid Right) ---------- */}
                {i === 3 && (
                  <>
                    {/* Left segment (from Left Edge to Center): Active when hovering Card 3 or Card 4 */}
                    <div
                      className={`absolute top-1/2 left-[-16px] xl:left-[-18px] right-1/2 h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 3 || hoveredIndex === 4
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Right segment (from Center to Right Edge): Only active when hovering Card 4 */}
                    <div
                      className={`absolute top-1/2 left-1/2 right-[-16px] xl:right-[-18px] h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 4
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Vertical Drop Line to Card 3 */}
                    <div
                      className={`absolute top-1/2 bottom-[-10px] left-1/2 -translate-x-1/2 w-0.5 transition-colors duration-200 z-10 ${
                        isTarget
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Joint Elbow Dot */}
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full border transition-all duration-200 z-20 ${
                        isTarget
                          ? 'border-[#e76532] bg-[#ff7a45] shadow-[0_0_8px_#ff7a45]'
                          : 'border-white/20 bg-[#15171b]'
                      }`}
                    />
                  </>
                )}

                {/* ---------- COLUMN 4: PROJECT OWNER (Far Right) ---------- */}
                {i === 4 && (
                  <>
                    {/* Horizontal segment: from Left Edge to Center: Only active when hovering Card 4 */}
                    <div
                      className={`absolute top-1/2 left-[-16px] xl:left-[-18px] right-1/2 h-0.5 transition-colors duration-200 ${
                        hoveredIndex === 4
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Vertical Drop Line to Card 4 */}
                    <div
                      className={`absolute top-1/2 bottom-[-10px] left-1/2 -translate-x-1/2 w-0.5 transition-colors duration-200 z-10 ${
                        isTarget
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/15'
                      }`}
                    />
                    {/* Joint Elbow Dot */}
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full border transition-all duration-200 z-20 ${
                        isTarget
                          ? 'border-[#e76532] bg-[#ff7a45] shadow-[0_0_8px_#ff7a45]'
                          : 'border-white/20 bg-[#15171b]'
                      }`}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* 5 Destination Cards (Desktop) */}
        <div className="grid grid-cols-5 gap-3.5 xl:gap-4 items-stretch">
          {paths.map(({ icon: Icon, ...path }, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <Link
                key={path.role}
                href={path.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative flex flex-col justify-between rounded-2xl p-4 xl:p-5 border transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? 'border-[#e76532] bg-[#1a1d23] shadow-[0_12px_32px_rgba(231,101,50,0.22)] -translate-y-1.5'
                    : 'border-white/12 bg-[#15181d] hover:border-white/25 hover:bg-[#181b21]'
                }`}
              >
                {/* Top Intake Connection Port (Fully visible and unclipped) */}
                <div
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 size-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center z-20 ${
                    isHovered
                      ? 'border-[#e76532] bg-[#1d1815] shadow-[0_0_12px_rgba(231,101,50,0.8)] scale-110'
                      : 'border-white/15 bg-[#15171b]'
                  }`}
                  aria-hidden="true"
                >
                  <div
                    className={`size-1.5 rounded-full transition-colors duration-200 ${
                      isHovered ? 'bg-[#ff7a45]' : 'bg-white/30'
                    }`}
                  />
                </div>

                {/* Card Top: Role Tag + Icon */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md transition-colors duration-200 ${
                        isHovered
                          ? 'bg-[#e76532]/20 text-[#ff7a45] border border-[#e76532]/40'
                          : 'bg-white/5 text-[#a9bfd2] border border-white/10'
                      }`}
                    >
                      {path.role}
                    </span>
                    <div
                      className={`size-9 rounded-xl border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isHovered
                          ? 'border-[#e76532] bg-[#221c19] text-[#ff7a45] shadow-[0_0_14px_rgba(231,101,50,0.45)]'
                          : 'border-white/10 bg-[#1b1e24] text-[#a9bfd2] group-hover:text-white'
                      }`}
                    >
                      <Icon className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-sm xl:text-[15px] font-bold text-[#f4f1eb] leading-snug group-hover:text-white transition-colors duration-200">
                    {path.compactTitle || path.title}
                  </h4>

                  {/* Body description */}
                  <p className="mt-2 text-xs xl:text-[12.5px] text-[#a9bfd2] leading-relaxed line-clamp-3">
                    {path.body}
                  </p>
                </div>

                {/* Card Bottom: CTA Button */}
                <div className="mt-5 pt-3 border-t border-white/5">
                  <span
                    className={`w-full inline-flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      isHovered
                        ? 'bg-gradient-to-r from-[#e76532] to-[#ff7338] text-white shadow-[0_4px_16px_rgba(231,101,50,0.4)]'
                        : 'bg-[#20242b] text-[#f4f1eb] hover:bg-[#252a33] border border-white/10'
                    }`}
                  >
                    <span>{path.compactCta || path.cta}</span>
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MOBILE & TABLET RESPONSIVE TREE (Screen width < 1024px) */}
      {/* ======================================================== */}
      <div className="block lg:hidden relative mt-3">
        {/* Bridge from Root Node Center Port to Left Spine Axis (16px mobile, 20px sm) */}
        <div className="relative h-10" aria-hidden="true">
          {/* Vertical drop from Root Port (center 50%) down to bridge elbow */}
          <div
            className={`absolute -top-3 bottom-1/2 left-1/2 -translate-x-1/2 w-0.5 transition-colors duration-200 ${
              hoveredIndex !== null
                ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                : 'bg-white/20'
            }`}
          />
          {/* Center connector dot at elbow */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full transition-colors duration-200 ${
              hoveredIndex !== null ? 'bg-[#ff7a45]' : 'bg-white/40'
            }`}
          />
          {/* Horizontal busbar from center (50%) to left spine coordinate (16px mobile, 20px sm) */}
          <div
            className={`absolute top-1/2 left-4 sm:left-5 right-1/2 h-0.5 transition-colors duration-200 ${
              hoveredIndex !== null
                ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                : 'bg-white/20'
            }`}
          />
          {/* Left elbow joint node dot where bridge turns down into trunk */}
          <div
            className={`absolute top-1/2 left-4 sm:left-5 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full border-2 transition-all duration-200 z-20 ${
              hoveredIndex !== null
                ? 'border-[#e76532] bg-[#ff7a45] shadow-[0_0_8px_#ff7a45]'
                : 'border-white/30 bg-[#15171b]'
            }`}
          />
          {/* Vertical line from left elbow down into the trunk of Row 0 (seamless 2px overlap) */}
          <div
            className={`absolute top-1/2 bottom-[-2px] left-4 sm:left-5 -translate-x-1/2 w-0.5 transition-colors duration-200 z-10 ${
              hoveredIndex !== null ? 'bg-[#e76532]' : 'bg-white/20'
            }`}
          />
        </div>

        {/* Tree Cards Container with continuous flex-stretch spine and zero inter-row gaps */}
        <div className="flex flex-col">
          {paths.map(({ icon: Icon, ...path }, index) => {
            const isHovered = hoveredIndex === index;
            const isLast = index === paths.length - 1;
            const isUpperSegmentHighlighted =
              hoveredIndex !== null && hoveredIndex >= index;
            const isLowerSegmentHighlighted =
              hoveredIndex !== null && hoveredIndex > index;

            return (
              <div
                key={path.role}
                className="group relative flex items-stretch gap-3 sm:gap-4"
              >
                {/* Dedicated Spine Column: fixed 32px (w-8) on mobile, 40px (w-10) on sm */}
                <div className="relative w-8 sm:w-10 shrink-0 flex flex-col items-center">
                  {/* Segment A: From top of row down to Node Dot (height matches node top: 22px / 26px) */}
                  <div
                    className={`w-0.5 h-[22px] sm:h-[26px] shrink-0 transition-colors duration-200 ${
                      isUpperSegmentHighlighted ? 'bg-[#e76532]' : 'bg-white/20'
                    }`}
                    aria-hidden="true"
                  />

                  {/* Node Dot Anchor: in-flow anchor centered on the vertical line */}
                  <div className="relative shrink-0 flex items-center justify-center z-20">
                    <div
                      className={`size-3.5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                        isHovered
                          ? 'border-[#e76532] bg-[#ff7a45] shadow-[0_0_10px_#ff7a45] scale-110'
                          : isUpperSegmentHighlighted
                            ? 'border-[#e76532] bg-[#1d1815]'
                            : 'border-white/30 bg-[#121417]'
                      }`}
                      aria-hidden="true"
                    >
                      <div
                        className={`size-1 rounded-full transition-colors duration-200 ${
                          isHovered ? 'bg-white' : 'bg-[#a9bfd2]'
                        }`}
                      />
                    </div>

                    {/* Horizontal Branch Line connecting the Node directly to Card left border */}
                    <div
                      className={`absolute left-1/2 top-1/2 -translate-y-1/2 w-[29px] sm:w-[37px] h-0.5 transition-colors duration-200 z-10 ${
                        isHovered
                          ? 'bg-[#e76532] shadow-[0_0_8px_rgba(231,101,50,0.8)]'
                          : 'bg-white/20'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Segment B: flex-1 fills entire remaining height down to bottom of row, with -mb-1 overlapping next row */}
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 -mb-1 transition-colors duration-200 ${
                        isLowerSegmentHighlighted ? 'bg-[#e76532]' : 'bg-white/20'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Right: Card (card margin-bottom creates the gap while spine stretches fully across it) */}
                <Link
                  href={path.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group flex-1 min-w-0 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-2xl p-3.5 sm:p-5 border transition-all duration-200 ${
                    isLast ? 'mb-0' : 'mb-3.5 sm:mb-4'
                  } ${
                    isHovered
                      ? 'border-[#e76532] bg-[#1a1d23] shadow-[0_8px_24px_rgba(231,101,50,0.22)] -translate-y-0.5'
                      : 'border-white/12 bg-[#15181d] hover:border-white/25 hover:bg-[#181b21]'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                    <div
                      className={`size-10 sm:size-11 rounded-xl border flex items-center justify-center transition-all duration-200 shrink-0 ${
                        isHovered
                          ? 'border-[#e76532] bg-[#221c19] text-[#ff7a45] shadow-[0_0_12px_rgba(231,101,50,0.4)]'
                          : 'border-white/10 bg-[#1b1e24] text-[#a9bfd2]'
                      }`}
                    >
                      <Icon className="size-4.5 sm:size-5" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#e76532]">
                          0{index + 1}
                        </span>
                        <span className="size-1 rounded-full bg-white/20" />
                        <span className="text-[11px] sm:text-xs font-bold text-[#a9bfd2] truncate">
                          {path.role}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#f4f1eb] group-hover:text-white transition-colors">
                        {path.title}
                      </h4>
                      <p className="mt-1 text-xs sm:text-[13px] text-[#a9bfd2] leading-relaxed max-w-md line-clamp-2 sm:line-clamp-none">
                        {path.body}
                      </p>
                    </div>
                  </div>

                  <div className="sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                    <span
                      className={`inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all duration-200 w-full sm:w-auto ${
                        isHovered
                          ? 'bg-gradient-to-r from-[#e76532] to-[#ff7338] text-white shadow-[0_4px_16px_rgba(231,101,50,0.35)]'
                          : 'bg-[#20242b] text-[#f4f1eb] border border-white/10'
                      }`}
                    >
                      <span>{path.cta}</span>
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
