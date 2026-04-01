"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] as const },
});

const FEED_ITEMS_LAYOUT = [
  { type: "🚨", verified: 43 },
  { type: "🎵", verified: 112 },
  { type: "🆘", verified: 28 },
  { type: "🏗️", verified: 67 },
  { type: "📋", verified: 15 },
  { type: "🛒", verified: 89 },
  { type: "💬", verified: 31 },
];

const ITEM_COUNT = FEED_ITEMS_LAYOUT.length;

/* ── Single feed item driven by scroll ── */
function FeedItem({
  item,
  index,
  scrollYProgress,
}: {
  item: (typeof FEED_ITEMS_LAYOUT)[number] & { text: string; where: string; time: string };
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = 0.1 + (index / ITEM_COUNT) * 0.75;
  const end = start + 0.08;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(scrollYProgress, [start, end], [-30, 0]);

  return (
    <motion.div
      style={{
        opacity,
        x,
        borderBottom:
          index < ITEM_COUNT - 1
            ? `1px solid var(--border-subtle)`
            : "none",
      }}
      className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4 transition-colors duration-200 hover:bg-[rgba(var(--accent-rgb),0.03)] cursor-default"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <span className="text-lg shrink-0 select-none">{item.type}</span>
        <div className="min-w-0">
          <p
            className="text-[14px] font-medium truncate"
            style={{ color: "var(--foreground)" }}
          >
            {item.text}
          </p>
          <p
            className="text-[11px] mt-0.5"
            style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
          >
            {item.where} · {item.time}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--accent)" }}
        >
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span
          className="text-[13px] font-bold tabular-nums"
          style={{ color: "var(--accent)" }}
        >
          {item.verified}
        </span>
      </div>
    </motion.div>
  );
}

export default function Community() {
  const t = useTranslations("community");

  const feedItems = FEED_ITEMS_LAYOUT.map((layout, i) => ({
    ...layout,
    text: t(`feedItems.${i}.text`),
    where: t(`feedItems.${i}.where`),
    time: t(`feedItems.${i}.time`),
  }));

  const feedRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: feedRef,
    offset: ["start end", "end end"],
  });

  /* Feed container fades in */
  const feedOpacity = useTransform(scrollYProgress, [0.05, 0.12], [0, 1]);
  const feedY = useTransform(scrollYProgress, [0.05, 0.12], [40, 0]);

  return (
    <section
      className="relative px-6 overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Section transition from Features (--hero-bg → --background) */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[200px]"
        style={{
          background: `linear-gradient(to bottom, var(--hero-bg), var(--background))`,
        }}
      />
      {/* ── Header: Verification concept ── */}
      <div className="relative z-10 mx-auto max-w-4xl pt-40 pb-16">
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
          {t("title1")}
        </motion.h2>
        <motion.h2
          {...fadeUp(0.2)}
          className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
          style={{ color: "var(--accent)" }}
        >
          {t("title2")}
        </motion.h2>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-10 text-lg sm:text-xl leading-relaxed max-w-2xl"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >

          {t("body")}{" "}
          <span style={{ color: "var(--foreground)" }}>
            {t("bodyBold")}
          </span>
        </motion.p>

        {/* 3 principles */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div key={i} {...fadeUp(0.1 * i)}>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--foreground)" }}
              >
                {t(`principles.${i}.value`)}
              </p>
              <p
                className="mt-2 text-[14px] leading-relaxed"
                style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
              >
                {t(`principles.${i}.sub`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.2 }}
        className="mx-auto max-w-xs h-px origin-center"
        style={{
          background: `linear-gradient(to right, transparent, rgba(var(--text-rgb),0.1), transparent)`,
        }}
      />

      {/* ── Scroll-driven live feed ── */}
      <div
        ref={feedRef}
        style={{ height: "200vh" }}
        className="relative"
      >
        <div className="sticky top-[10vh] mx-auto max-w-4xl px-0 pb-20">
          <motion.p
            {...fadeUp(0)}
            className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("feedTitle1")}
          </motion.p>
          <motion.p
            {...fadeUp(0.1)}
            className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-10"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("feedTitle2")}
          </motion.p>
          <motion.div
            style={{
              opacity: feedOpacity,
              y: feedY,
              border: `1px solid var(--border-subtle)`,
              background: `rgba(var(--card-bg-rgb),0.4)`,
            }}
            className="rounded-2xl overflow-hidden"
          >
            {/* Feed header */}
            <div
              className="px-5 sm:px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: `1px solid var(--border-subtle)` }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 rounded-full animate-pulse"
                  style={{ background: "var(--accent)" }}
                />
                <span
                  className="text-[12px] font-bold uppercase tracking-widest"
                  style={{
                    color: `rgba(var(--text-rgb),var(--text-muted))`,
                  }}
                >
                  {t("feedHeader")}
                </span>
              </div>
              <span
                className="text-[11px] font-medium"
                style={{
                  color: `rgba(var(--text-rgb),var(--text-faint))`,
                }}
              >
                {t("feedLocation")}
              </span>
            </div>

            {/* Feed items appear one by one via scroll */}
            {feedItems.map((item, i) => (
              <FeedItem
                key={i}
                item={item}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Numbers moment ── */}
      <div className="mx-auto max-w-4xl pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
          {Array.from({ length: 3 }, (_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.23, 1, 0.32, 1] as const,
              }}
              className="text-center"
            >
              <p
                className="text-4xl sm:text-5xl font-black tracking-tight"
                style={{ color: "var(--accent)" }}
              >
                {t(`stats.${i}.value`)}
              </p>
              <p
                className="mt-3 text-[14px] font-medium leading-relaxed"
                style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
              >
                {t(`stats.${i}.label`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Closing ── */}
      <div className="mx-auto max-w-4xl pb-40">
        <motion.p
          {...fadeUp(0)}
          className="text-lg sm:text-xl leading-relaxed"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("closing1")}
        </motion.p>
        <motion.p
          {...fadeUp(0.1)}
          className="mt-3 text-lg sm:text-xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          {t("closing2")}
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="mt-8">
          <Link
            href={ROUTES.VERIFICATION}
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
