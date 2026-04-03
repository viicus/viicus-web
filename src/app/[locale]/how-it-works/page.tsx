"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { APP_NAME } from "@/config/app-config";
import { ROUTES } from "@/config/routes";
import { useTranslations } from "next-intl";
import TiltCard from "@/components/TiltCard";

/* ── Fade-up helper ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] as const },
});

const PROBLEM_COUNT = 6;
const PROBLEMS_START = 0.06;
const PROBLEMS_RANGE = 1 - PROBLEMS_START;

const problemRange = (i: number): [number, number] => [
  PROBLEMS_START + (i / PROBLEM_COUNT) * PROBLEMS_RANGE,
  PROBLEMS_START + ((i + 1) / PROBLEM_COUNT) * PROBLEMS_RANGE,
];

const SOLUTION_COUNT = 4;

/* ── Problem slide (sticky scroll) ── */
function ProblemSlide({
  index,
  scrollYProgress,
  problem,
}: {
  index: number;
  scrollYProgress: MotionValue<number>;
  problem: { emoji: string; title: string; body: string; punchline: string };
}) {
  const [start, end] = problemRange(index);
  const len = end - start;

  const fadeIn = start;
  const holdStart = start + len * 0.2;
  const holdEnd = end - len * 0.2;
  const fadeOut = end;

  const isLast = index === PROBLEM_COUNT - 1;

  const opacity = useTransform(
    scrollYProgress,
    isLast
      ? [fadeIn, holdStart]
      : [fadeIn, holdStart, holdEnd, fadeOut],
    isLast ? [0, 1] : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    isLast
      ? [fadeIn, holdStart]
      : [fadeIn, holdStart, holdEnd, fadeOut],
    isLast ? [50, 0] : [50, 0, 0, -30]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex items-center px-6"
    >
      <div className="max-w-4xl mx-auto w-full">
        <span className="text-5xl sm:text-6xl block mb-8">{problem.emoji}</span>
        <p
          className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {problem.title}
        </p>
        <p
          className="mt-8 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {problem.body}
        </p>
        <p
          className="mt-4 text-lg sm:text-xl font-bold leading-relaxed max-w-2xl"
          style={{ color: "var(--foreground)" }}
        >
          {problem.punchline}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Solution step (scroll-driven) ── */
function SolutionStep({
  index,
  scrollYProgress,
  solution,
}: {
  index: number;
  scrollYProgress: MotionValue<number>;
  solution: { step: string; title: string; body: string; detail: string };
}) {
  const start = 0.1 + (index / SOLUTION_COUNT) * 0.75;
  const end = start + 0.12;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const x = useTransform(scrollYProgress, [start, end], [-40, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.95, 1]);

  return (
    <motion.div
      style={{ opacity, x, scale }}
      className="flex gap-6 sm:gap-10 py-10"
    >
      <div className="relative shrink-0 z-10">
        <div
          className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl text-[18px] sm:text-[20px] font-black"
          style={{
            background: "var(--hero-bg)",
            color: "var(--text-accent)",
            border: `1px solid rgba(var(--accent-rgb),0.2)`,
            boxShadow: `0 0 0 6px var(--hero-bg)`,
          }}
        >
          {solution.step}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          {solution.title}
        </p>
        <p
          className="mt-3 text-[15px] leading-relaxed max-w-xl"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {solution.body}
        </p>
        <p
          className="mt-2 text-[15px] font-semibold leading-relaxed"
          style={{ color: "var(--foreground)" }}
        >
          {solution.detail}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Comparison card (scroll-driven) ── */
function ComparisonCard({
  item,
  index,
  scrollYProgress,
  totalCount,
}: {
  item: { before: string; after: string; stat: string };
  index: number;
  scrollYProgress: MotionValue<number>;
  totalCount: number;
}) {
  const start = 0.1 + (index / totalCount) * 0.7;
  const mid = start + 0.08;
  const end = start + 0.16;

  /* Before text starts normal, then gets struck through + fades */
  const beforeOpacity = useTransform(
    scrollYProgress,
    [start, mid - 0.01, end],
    [0.7, 0.7, 0.35]
  );

  /* After text: hidden, then slides in */
  const afterOpacity = useTransform(scrollYProgress, [mid - 0.02, mid + 0.04], [0, 1]);
  const afterY = useTransform(scrollYProgress, [mid - 0.02, mid + 0.04], [20, 0]);

  /* Stat: pops in */
  const statScale = useTransform(scrollYProgress, [mid, mid + 0.06], [0, 1]);
  const statOpacity = useTransform(scrollYProgress, [mid, mid + 0.04], [0, 1]);

  return (
    <TiltCard
      className="rounded-2xl p-6 sm:p-8 hover-lift"
      style={{
        background: `rgba(var(--card-bg-rgb),0.4)`,
        border: `1px solid var(--border-subtle)`,
      }}
    >
      <motion.div style={{ opacity: statScale }} className="mb-4">
        <motion.p
          style={{ scale: statScale, opacity: statOpacity }}
          className="text-3xl sm:text-4xl font-black tracking-tight"
        >
          <span style={{ color: "var(--text-accent)" }}>{item.stat}</span>
        </motion.p>
      </motion.div>

      <motion.p
        style={{ opacity: beforeOpacity }}
        className="text-[14px] leading-relaxed line-through"
      >
        <span style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}>
          {item.before}
        </span>
      </motion.p>

      <motion.p
        style={{ opacity: afterOpacity, y: afterY }}
        className="mt-3 text-[15px] font-semibold leading-relaxed"
      >
        <span style={{ color: "var(--text-accent)" }}>{item.after}</span>
      </motion.p>
    </TiltCard>
  );
}

/* ── Main page ── */
export default function ComoFuncionaPage() {
  const t = useTranslations("comoFunciona");

  const problems = Array.from({ length: PROBLEM_COUNT }, (_, i) => ({
    emoji: t(`problems.${i}.emoji`),
    title: t(`problems.${i}.title`),
    body: t(`problems.${i}.body`),
    punchline: t(`problems.${i}.punchline`),
  }));

  const solutions = Array.from({ length: SOLUTION_COUNT }, (_, i) => ({
    step: t(`solutions.${i}.step`),
    title: t(`solutions.${i}.title`),
    body: t(`solutions.${i}.body`),
    detail: t(`solutions.${i}.detail`),
  }));

  const COMPARISON_COUNT = 4;
  const comparisons = Array.from({ length: COMPARISON_COUNT }, (_, i) => ({
    before: t(`comparisons.${i}.before`),
    after: t(`comparisons.${i}.after`),
    stat: t(`comparisons.${i}.stat`),
  }));

  const problemsRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const comparisonsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: problemsProgress } = useScroll({
    target: problemsRef,
    offset: ["start end", "end end"],
  });

  const { scrollYProgress: solutionsProgress } = useScroll({
    target: solutionsRef,
    offset: ["start end", "end end"],
  });

  const { scrollYProgress: comparisonsProgress } = useScroll({
    target: comparisonsRef,
    offset: ["start end", "end end"],
  });

  /* Solution vertical line drawn by scroll */
  const lineHeight = useTransform(solutionsProgress, [0.08, 0.9], ["0%", "100%"]);
  const lineOpacity = useTransform(solutionsProgress, [0.05, 0.12], [0, 1]);

  return (
    <main className="noise-overlay" style={{ background: "var(--background)" }}>
      {/* ══════════════════════════════════════════
          Hero
      ══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--hero-bg)" }}
      >
        <div
          className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2"
          style={{
            width: "min(90vw, 700px)",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-32">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-[13px] font-medium mb-16 transition-colors duration-200"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {t("back")}
          </Link>

          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("sectionLabel")}
          </motion.p>

          <motion.h1
            {...fadeUp(0.1)}
            className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("heroTitle")}{" "}
            <span className="gradient-text-accent">{t("heroTitleAccent")}</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.2)}
            className="mt-8 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-12 flex items-center gap-3"
          >
            <span
              className="h-px flex-1 max-w-[60px]"
              style={{ background: `rgba(var(--accent-rgb),0.3)` }}
            />
            <span
              className="text-[12px] font-medium uppercase tracking-widest"
              style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
            >
              {t("scrollHint")}
            </span>
          </motion.div>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[200px]"
          style={{
            background: `linear-gradient(to top, var(--background), transparent)`,
          }}
        />
      </section>

      {/* ══════════════════════════════════════════
          Sticky scroll: Problems one at a time
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--background)" }}>
        <div className="mx-auto max-w-4xl px-6 pt-20 pb-10">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("problemsLabel")}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("problemsTitle")}{" "}
            <span style={{ color: `rgba(var(--text-rgb),0.2)` }}>
              {t("problemsTitleFaint")}
            </span>
          </motion.h2>
        </div>

        <div
          ref={problemsRef}
          style={{ height: `${(PROBLEM_COUNT + 1) * 100}vh` }}
          className="relative"
        >
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {/* Counter */}
            <div className="absolute top-[12vh] right-6 sm:right-[calc(50%-28rem)] z-20">
              <motion.p
                style={{ opacity: useTransform(problemsProgress, [0.04, 0.1], [0, 1]) }}
                className="text-[13px] font-medium tabular-nums"
              >
                <span style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}>
                  {t("problemsCounter")}
                </span>
              </motion.p>
            </div>

            {/* Problem slides */}
            {problems.map((problem, i) => (
              <ProblemSlide
                key={i}
                index={i}
                problem={problem}
                scrollYProgress={problemsProgress}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Transition statement
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--background)" }}>
        <div className="mx-auto max-w-4xl px-6 py-40">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.2 }}
            className="mx-auto max-w-xs h-px origin-center mb-24"
            style={{
              background: `linear-gradient(to right, transparent, rgba(var(--accent-rgb),0.25), transparent)`,
            }}
          />

          <motion.p
            {...fadeUp(0)}
            className="text-2xl sm:text-4xl font-bold tracking-tight leading-snug"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("transitionLine1")}
          </motion.p>
          <motion.p
            {...fadeUp(0.12)}
            className="mt-4 text-2xl sm:text-4xl font-bold tracking-tight leading-snug"
            style={{ color: "var(--foreground)" }}
          >
            {t("transitionLine2")}{" "}
            <span style={{ color: "var(--text-accent)" }}>{t("transitionLine2Accent")}</span>
          </motion.p>

          {/* Dramatic "Até agora." */}
          <motion.div
            initial={{ opacity: 0, scale: 1.8, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 1.2,
              delay: 0.4,
              ease: [0.23, 1, 0.32, 1] as const,
            }}
            className="mt-16"
          >
            <p
              className="text-4xl sm:text-6xl font-black tracking-tight"
              style={{
                color: "var(--foreground)",
                textShadow: `0 0 60px rgba(var(--accent-rgb),0.2)`,
              }}
            >
              {t("transitionDramatic")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Solutions: Scroll-driven vertical timeline
      ══════════════════════════════════════════ */}
      <section className="relative" style={{ background: "var(--hero-bg)" }}>
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[200px]"
          style={{
            background: `linear-gradient(to bottom, var(--background), var(--hero-bg))`,
          }}
        />
        <div
          className="pointer-events-none absolute top-[30%] left-1/2 -translate-x-1/2"
          style={{
            width: "min(90vw, 600px)",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(var(--accent-rgb),0.04) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-40">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("solutionLabel")}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("solutionTitle")}
          </motion.h2>
        </div>

        <div
          ref={solutionsRef}
          style={{ height: "300vh" }}
          className="relative"
        >
          <div className="sticky top-[10vh] mx-auto max-w-4xl px-6 pb-20">
            <div className="relative mt-16">
              {/* Animated vertical line */}
              <div className="absolute left-7 sm:left-8 top-0 bottom-0 w-px overflow-hidden hidden sm:block">
                <motion.div
                  style={{
                    height: lineHeight,
                    opacity: lineOpacity,
                    background: `linear-gradient(to bottom, var(--accent), rgba(var(--accent-rgb),0.2))`,
                  }}
                  className="w-full"
                />
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {solutions.map((solution, i) => (
                  <SolutionStep
                    key={i}
                    index={i}
                    solution={solution}
                    scrollYProgress={solutionsProgress}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Before / After: Scroll-driven reveals
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--hero-bg)" }}>
        <div className="mx-auto max-w-4xl px-6 pt-20">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("comparisonLabel")}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("comparisonTitle")}{" "}
            <span className="gradient-text-accent">{t("comparisonTitleAccent")}</span>
          </motion.h2>
        </div>

        <div
          ref={comparisonsRef}
          style={{ height: "250vh" }}
          className="relative"
        >
          <div className="sticky top-[10vh] mx-auto max-w-4xl px-6 pb-20">
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {comparisons.map((item, i) => (
                <ComparisonCard
                  key={i}
                  item={item}
                  index={i}
                  totalCount={comparisons.length}
                  scrollYProgress={comparisonsProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          Final CTA
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--hero-bg)" }}>
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
            {t("ctaLine1")}
          </motion.p>
          <motion.p
            {...fadeUp(0.1)}
            className="mt-4 text-2xl sm:text-4xl font-bold leading-snug tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("ctaLine2")}{" "}
            <span
              className="gradient-text-accent"
              style={{ textShadow: `0 0 40px rgba(var(--accent-rgb),0.15)` }}
            >
              {APP_NAME}.
            </span>
          </motion.p>

          <motion.div {...fadeUp(0.2)} className="mt-12 flex flex-wrap gap-4">
            <Link
              href={ROUTES.HOME}
              className="group relative inline-flex overflow-hidden rounded-full px-8 py-4 text-[15px] font-bold transition-all duration-300 hover:scale-[1.04] cursor-pointer hover-glow"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                boxShadow: `0 4px 24px var(--accent-glow)`,
              }}
            >
              {t("ctaPrimary")}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              href={ROUTES.WHAT_HAPPENS}
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold transition-all duration-300"
              style={{
                border: `1px solid var(--border-subtle)`,
                background: "var(--btn-ghost-bg)",
                color: `rgba(var(--text-rgb),var(--text-medium))`,
              }}
            >
              {t("ctaSecondary")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
