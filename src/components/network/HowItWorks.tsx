"use client";

import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { APP_NAME } from "@/config/app-config";
import { ROUTES } from "@/config/routes";

const STORY_COUNT = 6;

/*
 * Layout:
 * - Title + first story appear together at 30% scroll
 * - Stories 2-4 cycle through the remaining scroll space
 */
const TITLE_START = 0.02; // title begins fading as section peeks in
const TITLE_END = 0.08;   // title fully visible early
const STORIES_START = 0.08; // first story appears with title
const STORIES_RANGE = 1 - STORIES_START;

const storyRange = (i: number): [number, number] => [
  STORIES_START + (i / STORY_COUNT) * STORIES_RANGE,
  STORIES_START + ((i + 1) / STORY_COUNT) * STORIES_RANGE,
];

/* ── Fade-up helper for non-sticky parts ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" as const },
  transition: { duration: 0.9, delay, ease: [0.23, 1, 0.32, 1] as const },
});

/* ── Single story slide ── */
function StorySlide({
  index,
  scrollYProgress,
  stories,
}: {
  index: number;
  scrollYProgress: MotionValue<number>;
  stories: { main: string; detail: string }[];
}) {
  const [start, end] = storyRange(index);
  const len = end - start;

  const fadeIn = start;
  const holdStart = start + len * 0.2;
  const holdEnd = end - len * 0.2;
  const fadeOut = end;

  /* last story doesn't fade out — it stays until section ends */
  const isLast = index === STORY_COUNT - 1;

  const opacity = useTransform(
    scrollYProgress,
    isLast
      ? [fadeIn, holdStart]
      : [fadeIn, holdStart, holdEnd, fadeOut],
    isLast
      ? [0, 1]
      : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    isLast
      ? [fadeIn, holdStart]
      : [fadeIn, holdStart, holdEnd, fadeOut],
    isLast
      ? [50, 0]
      : [50, 0, 0, -30]
  );

  const story = stories[index];

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center px-6"
    >
      <div className="max-w-4xl mx-auto w-full">
        <p
          className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {story.main}
        </p>
        <p
          className="mt-10 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {story.detail}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Scroll-driven text rotator: sticky section ── */
const ROTATOR_COUNT = 10;

function RotatorSlide({
  index,
  total,
  scrollYProgress,
  items,
  suffix,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  items: string[];
  suffix: string;
}) {
  // Reserve the first 15% for the first item to "arrive" and hold
  const PAD = 0.15;
  const usable = 1 - PAD;
  const segLen = usable / total;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const start = PAD + index * segLen;
  const end = start + segLen;

  // First item: already visible when section starts, holds, then fades out
  const fadeIn = isFirst ? 0 : start;
  const holdStart = isFirst ? 0 : start + segLen * 0.15;
  const holdEnd = end - segLen * 0.15;
  const fadeOut = end;

  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [holdEnd, fadeOut]
      : isLast
        ? [fadeIn, holdStart]
        : [fadeIn, holdStart, holdEnd, fadeOut],
    isFirst
      ? [1, 0]
      : isLast
        ? [0, 1]
        : [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollYProgress,
    isFirst
      ? [holdEnd, fadeOut]
      : isLast
        ? [fadeIn, holdStart]
        : [fadeIn, holdStart, holdEnd, fadeOut],
    isFirst
      ? [0, -40]
      : isLast
        ? [60, 0]
        : [60, 0, 0, -40]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center justify-center px-6"
    >
      <div className="text-center">
        <p className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
          <span style={{ color: "var(--foreground)" }}>{items[index]}</span>
          <br />
          <span style={{ color: "var(--accent)" }}>{suffix}</span>
        </p>
      </div>
    </motion.div>
  );
}

/* ── Main component ── */
export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  const stories = Array.from({ length: 6 }, (_, i) => ({
    main: t(`stories.${i}.main`),
    detail: t(`stories.${i}.detail`),
  }));

  const rotatorItems = Array.from({ length: ROTATOR_COUNT }, (_, i) => t(`rotatorItems.${i}`));
  const rotatorSuffix = t("rotatorSuffix");

  const stickyRef = useRef<HTMLDivElement>(null);
  const rotatorRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start end", "end end"],
  });

  const { scrollYProgress: rotatorProgress } = useScroll({
    target: rotatorRef,
    offset: ["start end", "end end"],
  });

  /* Title: fades in and slides up */
  const titleOpacity = useTransform(scrollYProgress, [TITLE_START, TITLE_END], [0, 1]);
  const titleY = useTransform(scrollYProgress, [TITLE_START, TITLE_END], [40, 0]);

  return (
    <section className="relative" style={{ background: "var(--background)" }}>
      {/* Atmospheric glow behind stories */}
      <div
        className="pointer-events-none absolute top-[30%] left-1/2 -translate-x-1/2"
        style={{
          width: "min(90vw, 700px)",
          height: "500px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(var(--accent-rgb),0.03) 0%, transparent 70%)`,
        }}
      />
      {/* ── Act 1: Sticky scroll stories ── */}
      <div
        ref={stickyRef}
        style={{ height: `${(STORY_COUNT + 1) * 100}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Shared column — all 3 layers aligned to same max-w-4xl */}
          <div className="absolute inset-0 px-6 pointer-events-none z-10">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {/* Top title */}
              <motion.p
                style={{
                  opacity: titleOpacity,
                  y: titleY,
                  color: `rgba(var(--text-rgb),var(--text-faint))`,
                  letterSpacing: "0.15em",
                }}
                className="pt-[12vh] text-[13px] font-medium uppercase shrink-0"
              >
                {t("sectionLabel")}
              </motion.p>



            </div>
          </div>

          {/* Stories cycle in the center */}
          {stories.map((_, i) => (
            <StorySlide
              key={i}
              index={i}
              scrollYProgress={scrollYProgress}
              stories={stories}
            />
          ))}
        </div>
      </div>

      {/* ── Text Rotator: sticky scroll "X não funcionam." ── */}
      <div
        ref={rotatorRef}
        style={{ height: `${(ROTATOR_COUNT + 1) * 80}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {rotatorItems.map((_, i) => (
            <RotatorSlide
              key={i}
              index={i}
              total={ROTATOR_COUNT}
              scrollYProgress={rotatorProgress}
              items={rotatorItems}
              suffix={rotatorSuffix}
            />
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

      {/* ── Act 2: The realization ── */}
      <div className="mx-auto max-w-4xl px-6 py-40">
        <motion.p
          {...fadeUp(0)}
          className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {t("act2Title1")}
        </motion.p>
        <motion.p
          {...fadeUp(0.1)}
          className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight"
          style={{ color: `rgba(var(--text-rgb),0.2)` }}
        >
          {t("act2Title2")}
        </motion.p>

        <motion.p
          {...fadeUp(0.25)}
          className="mt-16 text-xl sm:text-2xl font-medium leading-relaxed"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("act2Body1")}
          <br />
          {t("act2Body1b")}
        </motion.p>

        <motion.p
          {...fadeUp(0.35)}
          className="mt-12 text-xl sm:text-2xl font-medium leading-relaxed"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("act2Body2")}
        </motion.p>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-4 text-3xl sm:text-5xl font-bold leading-tight tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {t("act2Body3")}{" "}
          <span style={{ color: "var(--accent)" }}>{t("act2Body3Accent")}</span>
        </motion.p>
      </div>

      {/* ── Divider ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.2 }}
        className="mx-auto max-w-xs h-px origin-center"
        style={{
          background: `linear-gradient(to right, transparent, rgba(var(--accent-rgb),0.25), transparent)`,
        }}
      />

      {/* ── Act 3: The answer — dramatic brand reveal ── */}
      <div className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        <div className="mx-auto max-w-4xl px-6 py-40 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] as const }}
            className="text-xl sm:text-2xl font-medium"
            style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
          >
            {t("act3Intro")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 2.5, filter: "blur(20px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 1.4,
              delay: 0.3,
              ease: [0.23, 1, 0.32, 1] as const,
            }}
            className="mt-16"
          >
            <p
              className="text-6xl sm:text-8xl font-black tracking-tight leading-none"
              style={{
                color: "var(--foreground)",
                textShadow: `0 0 80px rgba(var(--accent-rgb),0.3)`,
              }}
            >
              {APP_NAME}.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: [0.23, 1, 0.32, 1] as const,
            }}
            className="mt-10 text-xl sm:text-2xl font-medium leading-relaxed max-w-2xl"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("act3Body1")}{" "}
            <span style={{ color: "var(--foreground)" }}>
              {t("act3Body1Bold")}
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 1,
              delay: 1,
              ease: [0.23, 1, 0.32, 1] as const,
            }}
            className="mt-4 text-xl sm:text-2xl font-medium leading-relaxed max-w-2xl"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("act3Body2")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.8,
              delay: 1.2,
              ease: [0.23, 1, 0.32, 1] as const,
            }}
            className="mt-10"
          >
            <Link
              href={ROUTES.HOW_IT_WORKS}
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

        {/* Background glow effect behind app name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "min(80vw, 600px)",
            height: "min(80vw, 600px)",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(var(--accent-rgb),0.08) 0%, transparent 70%)`,
          }}
        />
      </div>
    </section>
  );
}
