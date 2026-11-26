"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/components-primitives-avatar";

export type Palette6 = "blue" | "purple" | "amber" | "teal" | "rose" | "slate";

export type Plan6 = {
  id: string;
  name: string;
  description: string;
  palette: Palette6;
  price: string;
  originalPrice?: string;
  priceNote?: string;
  ctaLabel: string;
  ctaHref: string;
  featuredLabel?: string;
  features: string[];
  footerNote?: string;
  footerDesc?: string;
  ctaDark?: boolean;
};

const CARD_PALETTES: Record<
  Palette6,
  {
    base: string;
    blobA: string;
    blobB: string;
    avatarColor:
      | "blue"
      | "orange"
      | "red"
      | "green"
      | "purple"
      | "yellow"
      | "cyan"
      | "pink"
      | "indigo"
      | "lime"
      | "turquoise"
      | "violet";
  }
> = {
  blue: {
    base: "bg-sky-50 dark:bg-blue-950",
    blobA: "bg-blue-500 dark:bg-blue-500",
    blobB: "bg-sky-200 dark:bg-sky-600",
    avatarColor: "blue",
  },
  purple: {
    base: "bg-violet-50 dark:bg-violet-950",
    blobA: "bg-violet-500 dark:bg-violet-500",
    blobB: "bg-fuchsia-200 dark:bg-fuchsia-600",
    avatarColor: "purple",
  },
  amber: {
    base: "bg-amber-50 dark:bg-amber-950",
    blobA: "bg-amber-500 dark:bg-amber-500",
    blobB: "bg-yellow-200 dark:bg-yellow-600",
    avatarColor: "yellow",
  },
  teal: {
    base: "bg-teal-50 dark:bg-teal-950",
    blobA: "bg-teal-500 dark:bg-teal-500",
    blobB: "bg-emerald-200 dark:bg-emerald-600",
    avatarColor: "turquoise",
  },
  rose: {
    base: "bg-rose-50 dark:bg-rose-950",
    blobA: "bg-rose-500 dark:bg-rose-500",
    blobB: "bg-pink-200 dark:bg-pink-600",
    avatarColor: "red",
  },
  slate: {
    base: "bg-slate-100 dark:bg-slate-900",
    blobA: "bg-slate-400 dark:bg-slate-500",
    blobB: "bg-zinc-200 dark:bg-zinc-600",
    avatarColor: "blue",
  },
};

type TabKey = "individuals" | "teams";

function PlanCard({ plan }: { plan: Plan6 }) {
  const pal = CARD_PALETTES[plan.palette];
  const isExternalHref = /^https?:\/\//i.test(plan.ctaHref);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-1.5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-black/6 p-5 dark:border-white/10",
          pal.base,
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -top-12 -right-12 size-52 rounded-full opacity-55 blur-3xl dark:opacity-70",
            pal.blobA,
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute top-1/3 -left-8 size-60 rounded-full opacity-25 blur-3xl dark:opacity-35",
            pal.blobB,
          )}
        />

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.36] mix-blend-overlay dark:opacity-[0.1]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id={`grain-${plan.id}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${plan.id})`} />
        </svg>

        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Avatar
              shape="squircle"
              size="sm"
              color={pal.avatarColor}
              label={`${plan.name} emblem`}
            />
            {plan.featuredLabel && (
              <span className="rounded-full bg-black/10 px-2.5 py-0.5 text-xs font-medium text-foreground/85 backdrop-blur-sm whitespace-nowrap dark:bg-white/15 dark:text-foreground/90">
                {plan.featuredLabel}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-foreground">
              {plan.name}
            </h3>
            <p className="text-sm leading-relaxed text-foreground/75">
              {plan.description}
            </p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
                {plan.price}
              </span>
              {plan.originalPrice && (
                <span className="text-base tabular-nums text-foreground/45 line-through">
                  {plan.originalPrice}
                </span>
              )}
            </div>
            {plan.priceNote && (
              <p className="text-xs font-medium text-foreground/65">
                {plan.priceNote}
              </p>
            )}
          </div>

          <Button
            className={cn(
              "min-h-[44px] w-full rounded-full font-semibold whitespace-nowrap",
              plan.ctaDark
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "border border-black/10 bg-white/85 text-foreground shadow-xs backdrop-blur-sm hover:bg-white dark:border-white/15 dark:bg-white/15 dark:text-foreground dark:hover:bg-white/25",
            )}
            asChild
          >
            {isExternalHref ? (
              <a href={plan.ctaHref} target="_blank" rel="noopener noreferrer">
                {plan.ctaLabel}
              </a>
            ) : (
              <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-5 px-2 pt-5 pb-1.5">
        <ul className="space-y-2.5">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm leading-snug text-foreground"
            >
              <Check
                className="mt-0.5 size-4 shrink-0 text-foreground/55"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {(plan.footerNote || plan.footerDesc) && (
          <div className="space-y-1 border-t border-border pt-3 px-1">
            {plan.footerNote && (
              <p className="text-xs font-semibold text-foreground">
                {plan.footerNote}
              </p>
            )}
            {plan.footerDesc && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {plan.footerDesc}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Pricing6({
  individualPlans = [],
  teamsPlans = [],
  individualsLabel = "Salon & Hair",
  teamsLabel = "Bridal & Events",
  defaultTab = "individuals",
  eyebrow,
  title = "Signature Packages",
  subtitle = "Curated hair, skin, and bridal sessions tailored for everyday care, festive nights, and weddings.",
  headingId = "packages-heading",
}: {
  individualPlans?: Plan6[];
  teamsPlans?: Plan6[];
  individualsLabel?: string;
  teamsLabel?: string;
  defaultTab?: TabKey;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  headingId?: string;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);
  const [activeSlide, setActiveSlide] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const plans = activeTab === "individuals" ? individualPlans : teamsPlans;

  const updateActiveSlide = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollLeft = track.scrollLeft;
    let closestIndex = 0;
    let minDiff = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const diff = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveSlide(closestIndex);
  }, []);

  const scrollToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const clamped = Math.max(0, Math.min(plans.length - 1, index));
      const targetCard = cardRefs.current[clamped];
      if (!track || !targetCard) return;

      track.scrollTo({
        left: Math.max(0, targetCard.offsetLeft - track.offsetLeft),
        behavior,
      });
      setActiveSlide(clamped);
    },
    [plans.length],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateActiveSlide();
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [updateActiveSlide]);

  const handleTabChange = (nextTab: TabKey) => {
    setActiveTab(nextTab);
    setActiveSlide(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: "auto" });
    }
  };

  return (
    <div className="w-full space-y-8 md:space-y-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2 max-w-2xl">
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-muted-foreground">
              {eyebrow}
            </p>
          )}
          <h2
            id={headingId}
            className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-foreground text-balance"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        <div
          role="tablist"
          aria-label="Package categories"
          className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full border border-border bg-muted p-1"
        >
          {(
            [
              ["individuals", individualsLabel],
              ["teams", teamsLabel],
            ] as [TabKey, string][]
          ).map(([key, label]) => {
            const isSelected = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleTabChange(key)}
                className={cn(
                  "min-h-[38px] cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Package Track: horizontal scroll on mobile/tablet, 3-column grid on desktop */}
      <div
        ref={trackRef}
        aria-label="Salon packages"
        className="flex items-stretch gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain scroll-smooth lg:grid lg:grid-cols-3 lg:overflow-visible lg:snap-none lg:pb-0"
      >
        {plans.map((plan, idx) => (
          <div
            key={plan.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="w-[84vw] max-w-[360px] sm:w-[400px] sm:max-w-none md:w-[440px] lg:w-full shrink-0 snap-start lg:snap-align-none"
          >
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {/* Carousel Controls & Slide Indicators (mobile/tablet only) */}
      <div className="flex items-center justify-between gap-4 pt-1 lg:hidden">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
          0{activeSlide + 1} / 0{plans.length} · Scroll or swipe packages
        </p>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1.5 mr-1">
            {plans.map((plan, idx) => {
              const isCurrent = idx === activeSlide;
              return (
                <button
                  key={plan.id}
                  type="button"
                  aria-label={`View ${plan.name}`}
                  onClick={() => scrollToSlide(idx)}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isCurrent
                      ? "w-7 bg-foreground"
                      : "w-2 bg-foreground/25 hover:bg-foreground/45",
                  )}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollToSlide(activeSlide - 1)}
            disabled={activeSlide === 0}
            aria-label="Previous package"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-default disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSlide(activeSlide + 1)}
            disabled={activeSlide >= plans.length - 1}
            aria-label="Next package"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-default disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
