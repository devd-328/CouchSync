"use client";

// A portfolio index built as a wheel you turn.
// Enhanced for full cross-browser responsiveness (mobile, tablet, desktop, touch, Safari/Chrome/Firefox).
import * as React from "react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Subtitle or category (e.g. "4K Stream", "Synchronized Video") */
  subtitle?: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
  /** Custom action badge text */
  actionLabel?: string;
  /** Custom data payload */
  data?: unknown;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children" | "onSelect"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default "Watch" */
  action?: string;
  /** Callback when front card or action is selected */
  onSelect?: (item: WorksWheelItem, index: number) => void;
  /** Whether to show navigation arrow pills @default true */
  showControls?: boolean;
}

/* Base geometry multipliers */
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
const BOW = 1.82;
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 400;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Watch Experiences",
  action = "Launch",
  onSelect,
  showControls = true,
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  // Reduced motion preference
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  // Responsive stage observer
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => {
      setStage({ w: el.clientWidth, h: el.clientHeight });
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Responsive metrics tailored for mobile, tablet, and desktop
  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const isMobile = w < 640;
    const isTablet = w >= 640 && w < 1024;

    // Adapt card width ratio according to screen size
    const cardMaxWFactor = isMobile ? 0.65 : isTablet ? 0.44 : 0.34;
    const cardHFactor = isMobile ? 0.42 : 0.38;

    const cardW = Math.min(h * cardHFactor * CARD_RATIO, w * cardMaxWFactor) || 200;
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;

    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;

    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: Math.max(isMobile ? 18 : 22, cardH * 0.13),
      index: Math.max(12, cardH * 0.045),
      isMobile,
    };
  }, [stage, count]);

  // RequestAnimationFrame rendering loop
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  const prevItem = React.useCallback(() => {
    to(Math.max(1, Math.round(target.current) - 1));
  }, [to]);

  const nextItem = React.useCallback(() => {
    to(Math.min(last + 1, Math.round(target.current) + 1));
  }, [to, last]);

  // Native wheel listener with bounds check to allow smooth page scroll
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      // Only prevent page scroll when turning between items
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (
        (event.deltaY > 0 && target.current < last + 1) ||
        (event.deltaY < 0 && target.current > 0)
      ) {
        event.preventDefault();
      }
      to(next);

      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  // Pointer drag for mouse and touch
  const dragY = React.useRef<number | null>(null);
  const dragX = React.useRef<number | null>(null);
  const settling = React.useRef<number>(0);

  const handleCardClick = (e: React.MouseEvent, index: number, item: WorksWheelItem) => {
    // If clicking a non-active card, bring it to the front
    if (index !== active) {
      e.preventDefault();
      to(index + 1);
      return;
    }
    // If it's already active and onSelect is passed
    if (onSelect) {
      e.preventDefault();
      onSelect(item, index);
    }
  };

  return (
    <section
      aria-label={label}
      className={cn(
        "relative h-full min-h-[22rem] sm:min-h-[28rem] lg:min-h-[32rem] w-full overflow-hidden select-none bg-[#0B0D14] text-[#F3F4F6] rounded-2xl sm:rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
        className,
      )}
      {...props}
    >
      {/* Ambient background glow matching CouchSync theme */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.18) 0%, rgba(255, 107, 74, 0.06) 45%, transparent 75%)'
        }}
        aria-hidden="true"
      />

      {/* Subtle top badge */}
      <div className="hidden sm:flex absolute top-3 sm:top-5 left-4 sm:left-6 z-20 items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-orange-400/90 bg-orange-950/60 px-2.5 py-0.5 rounded-full border border-orange-500/20 backdrop-blur-md">
          Interactive Reel
        </span>
      </div>

      {/* Main 3D Stage */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-orange-500 absolute inset-0 cursor-grab touch-pan-y outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing [transform-style:preserve-3d]"
        style={{
          perspective: `${metrics.depth}px`,
          WebkitPerspective: `${metrics.depth}px`,
        }}
        onPointerDown={(event) => {
          dragY.current = event.clientY;
          dragX.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragY.current === null) return;
          const deltaY = dragY.current - event.clientY;
          to(target.current + deltaY / DRAG_UNITS);
          dragY.current = event.clientY;
        }}
        onPointerUp={() => {
          dragY.current = null;
          dragX.current = null;
          if (target.current > 1) to(Math.round(target.current));
          else if (target.current > 0.5) to(1);
          else to(0);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            nextItem();
            event.preventDefault();
          } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            prevItem();
            event.preventDefault();
          }
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d] will-change-transform"
          style={{ WebkitTransformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const isFront = i === active;
            return (
              <div
                key={item.title + i}
                id={`works-wheel-${i}`}
                role="option"
                aria-selected={isFront}
                ref={(node: HTMLElement | null) => {
                  cardRefs.current[i] = node;
                }}
                onClick={(e) => handleCardClick(e, i, item)}
                className="group absolute [backface-visibility:hidden] will-change-transform cursor-pointer transition-shadow"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="relative block size-full overflow-hidden rounded-xl sm:rounded-2xl border border-white/15 bg-[#121622] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6)] group-hover:border-orange-500/50 transition duration-300">
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.hasFallback) {
                        target.dataset.hasFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=85';
                      }
                    }}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Card Title on Card for Mobile/Front */}
                  <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                    {item.subtitle && (
                      <p className="text-[10px] sm:text-xs font-semibold text-orange-400 tracking-wide uppercase truncate mb-0.5">
                        {item.subtitle}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm font-bold text-white drop-shadow-sm truncate">
                      {item.title}
                    </p>
                  </div>

                  {/* Action Affordance Badge */}
                  {action && (
                    <span 
                      className={cn(
                        "pointer-events-none absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold backdrop-blur-md transition-all duration-200 border",
                        isFront 
                          ? "bg-orange-500/90 text-white border-orange-400/40 opacity-100 shadow-md"
                          : "bg-black/60 text-white/90 border-white/10 opacity-0 group-hover:opacity-100"
                      )}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className="size-2.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 9 9 3M4 3h5v5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {item.actionLabel || action}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ring Title (Center stage when in ring formation) */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-extrabold text-white/90 text-center px-4"
        style={{ fontSize: metrics.title }}
      >
        <div className="flex flex-col items-center">
          <span>{label}</span>
          <span className="text-xs sm:text-sm font-normal text-orange-400/90 tracking-normal mt-1 opacity-80">
            Scroll or drag to explore
          </span>
        </div>
      </div>

      {/* Front-card Title (Shown off to the left when wheel is turned into drum) */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 left-[5%] sm:left-[8%] -translate-y-1/2 tracking-tight opacity-0 max-w-[40%] hidden sm:block"
        style={{ fontSize: metrics.title }}
      >
        <span className="text-xs sm:text-sm font-semibold text-orange-400 block tracking-wider uppercase mb-1">
          {items[active]?.subtitle || "Now Featuring"}
        </span>
        <span className="font-extrabold text-white block drop-shadow-md">
          {items[active]?.title}
        </span>
      </div>

      {/* Desktop/Tablet Index List down the right */}
      <ol
        className="hidden md:block absolute top-[10%] right-[3%] text-right leading-[1.8] max-h-[80%] overflow-y-auto z-20"
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, i) => (
          <li key={item.title + i}>
            <button
              type="button"
              onClick={() => to(i + 1)}
              className={cn(
                "cursor-pointer transition-all duration-200 outline-none text-gray-400 hover:text-white px-2 py-0.5 rounded text-right block ml-auto",
                i === active && "text-orange-400 font-bold translate-x-[-4px]",
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>

      {/* Bottom Controls Bar (Prev/Next + Dot Indicators) for Mobile & Desktop */}
      {showControls && (
        <div className="absolute bottom-3.5 sm:bottom-4 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 pointer-events-none">
          {/* Wheel state helper hint */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
            <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-300">↑↓</span>
            <span>scroll or drag</span>
          </div>

          {/* Center dots navigation */}
          <div className="flex items-center gap-1.5 mx-auto pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => to(i + 1)}
                aria-label={`Jump to item ${i + 1}`}
                className={cn(
                  "size-1.5 sm:size-2 rounded-full transition-all duration-300 cursor-pointer",
                  i === active 
                    ? "w-4 sm:w-5 bg-orange-500" 
                    : "bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={prevItem}
              disabled={active === 0}
              aria-label="Previous card"
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white transition cursor-pointer backdrop-blur-sm border border-white/10"
            >
              <svg className="size-3.5 sm:size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextItem}
              disabled={active === last}
              aria-label="Next card"
              className="p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white transition cursor-pointer backdrop-blur-sm border border-white/10"
            >
              <svg className="size-3.5 sm:size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default WorksWheel;
