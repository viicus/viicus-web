"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";

/* ── Fade-up for non-sticky sections ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] as const },
});

/* ── Winding SVG path (top→bottom, S-curves) ── */
const PATH_D = [
  "M 500,0",
  "Q 850,125 500,250",
  "Q 150,375 500,500",
  "Q 850,625 500,750",
  "Q 150,875 500,1000",
].join(" ");

/* ── Layout data for events along the path (5 well-spaced) ── */
const EVENTS_LAYOUT = [
  { emoji: "🚨", verified: 43, cx: 750, cy: 100, cardSide: "left" as const, threshold: 0.22 },
  { emoji: "🎵", verified: 112, cx: 250, cy: 300, cardSide: "right" as const, threshold: 0.35 },
  { emoji: "🏗️", verified: 67, cx: 750, cy: 500, cardSide: "left" as const, threshold: 0.50 },
  { emoji: "💬", verified: 31, cx: 250, cy: 700, cardSide: "right" as const, threshold: 0.65 },
  { emoji: "🛒", verified: 89, cx: 750, cy: 900, cardSide: "left" as const, threshold: 0.80 },
];

/* ── Desktop: Event card + dot on the path ── */
function EventNode({
  event,
  scrollYProgress,
}: {
  event: (typeof EVENTS_LAYOUT)[number] & { tag: string; text: string; body: string };
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [event.threshold - 0.04, event.threshold],
    [0, 1]
  );
  const scale = useTransform(
    scrollYProgress,
    [event.threshold - 0.04, event.threshold],
    [0.85, 1]
  );
  const slideY = useTransform(
    scrollYProgress,
    [event.threshold - 0.04, event.threshold],
    [16, 0]
  );

  return (
    <motion.div
      style={{
        opacity,
        scale,
        y: slideY,
        left: `${event.cx / 10}%`,
        top: `${event.cy / 10}%`,
      }}
      className="absolute z-20"
    >
      {/* Dot on the path */}
      <div
        className="absolute w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "var(--accent)",
          boxShadow: `0 0 16px var(--accent-glow)`,
        }}
      />

      {/* Card extending from dot */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={
          event.cardSide === "left"
            ? { right: "100%", marginRight: 20 }
            : { left: "100%", marginLeft: 20 }
        }
      >
        <div
          className="rounded-2xl px-4 py-3 backdrop-blur-md flex items-center gap-3 max-w-[340px] hover-lift"
          style={{
            background: `rgba(var(--card-bg-rgb), 0.7)`,
            border: `1px solid var(--border-subtle)`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.06)`,
          }}
        >
          <span className="text-lg shrink-0 select-none">{event.emoji}</span>
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              {event.tag}
            </p>
            <p
              className="text-[13px] font-semibold leading-tight"
              style={{ color: "var(--foreground)" }}
            >
              {event.text}
            </p>
            <p
              className="text-[11px] mt-1 leading-snug"
              style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
            >
              {event.body}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--accent)" }}
            >
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span
              className="text-[11px] font-bold tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              {event.verified}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main component ── */
export default function Features() {
  const t = useTranslations("features");

  const events = EVENTS_LAYOUT.map((layout, i) => ({
    ...layout,
    tag: t(`events.${i}.tag`),
    text: t(`events.${i}.text`),
    body: t(`events.${i}.body`),
  }));

  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.95], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);

  return (
    <section className="relative" style={{ background: "var(--hero-bg)" }}>
      {/* Section transition from previous (--background → --hero-bg) */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[200px]"
        style={{
          background: `linear-gradient(to bottom, var(--background), var(--hero-bg))`,
        }}
      />

      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2"
        style={{
          width: "min(90vw, 800px)",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(var(--accent-rgb),0.04) 0%, transparent 70%)`,
        }}
      />

      {/* ── Header ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-40 pb-16">
        <motion.p
          {...fadeUp(0)}
          className="text-[12px] font-bold uppercase tracking-[0.25em]"
          style={{ color: "var(--accent)" }}
        >
          {t("sectionLabel")}
        </motion.p>
        <motion.h2
          {...fadeUp(0.1)}
          className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          {t("title")}{" "}
          <span className="gradient-text-accent">{t("titleAccent")}</span>
        </motion.h2>
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("subtitle")}
        </motion.p>
      </div>

      {/* ── Desktop: Scroll-driven SVG path ── */}
      <div
        ref={sectionRef}
        style={{ height: "500vh" }}
        className="relative hidden sm:block"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.svg
            style={{ opacity: pathOpacity }}
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d={PATH_D}
              stroke={`rgba(var(--text-rgb), 0.05)`}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <motion.path
              d={PATH_D}
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ pathLength, opacity: 0.12, filter: "blur(10px)" }}
            />
            <motion.path
              d={PATH_D}
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </motion.svg>

          <div className="absolute inset-0">
            {events.map((event, i) => (
              <EventNode
                key={i}
                event={event}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: Vertical timeline ── */}
      <div className="sm:hidden px-6 pb-24">
        <div
          className="relative pl-8 space-y-10"
          style={{ borderLeft: `2px solid rgba(var(--accent-rgb), 0.2)` }}
        >
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: 0.05,
                ease: [0.23, 1, 0.32, 1] as const,
              }}
              className="relative"
            >
              {/* Dot on timeline */}
              <div
                className="absolute -left-[calc(2rem+5px)] top-1 w-2.5 h-2.5 rounded-full"
                style={{
                  background: "var(--accent)",
                  boxShadow: `0 0 10px var(--accent-glow)`,
                }}
              />
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "var(--accent)" }}
              >
                {event.tag}
              </p>
              <p
                className="text-[15px] font-semibold mt-1 leading-tight"
                style={{ color: "var(--foreground)" }}
              >
                {event.text}
              </p>
              <p
                className="text-[13px] mt-1 leading-relaxed"
                style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
              >
                {event.body}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--accent)" }}
                >
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span
                  className="text-[12px] font-bold tabular-nums"
                  style={{ color: "var(--accent)" }}
                >
                  {event.verified} verificações
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Punchline ── */}
      <div className="mx-auto max-w-4xl px-6 pb-40">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1 }}
          className="h-px origin-left mb-20"
          style={{ background: "var(--border-subtle)" }}
        />

        <motion.p
          {...fadeUp(0)}
          className="text-2xl sm:text-4xl font-bold leading-snug tracking-tight"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("punchline1")}{" "}
          <span style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}>
            {t("punchline1Faint")}
          </span>
        </motion.p>

        <motion.p
          {...fadeUp(0.15)}
          className="mt-6 text-2xl sm:text-4xl font-bold leading-snug tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {t("punchline2")}{" "}
          <span style={{ color: "var(--accent)" }}>{t("punchline2Accent")}</span>
        </motion.p>

        <motion.div {...fadeUp(0.25)} className="mt-10">
          <Link
            href={ROUTES.WHAT_HAPPENS}
            className="inline-flex items-center gap-2 text-[14px] font-semibold transition-all duration-300 hover:gap-3"
            style={{ color: "var(--accent)" }}
          >
            {t("learnMore")}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
