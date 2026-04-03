"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

/*
 * Animation phases:
 *   0  — Input visible, auto-typing or waiting for user
 *   0.5 — Loading spinner on button
 *   1  — Morph: header/body cross-fade to card layout
 *   2  — Card broadcasting (ripples + neighbor dots)
 *   3  — Final state (counter + message)
 *   4  — Reset & loop
 */
type Phase = 0 | 0.5 | 1 | 2 | 3 | 4;

/* Neighbor dots — positions around the card */
const NEIGHBOR_DOTS = [
  { x: -140, y: -80, delay: 0 },
  { x: 160, y: -60, delay: 0.08 },
  { x: -180, y: 40, delay: 0.14 },
  { x: 120, y: 90, delay: 0.06 },
  { x: -60, y: -130, delay: 0.2 },
  { x: 200, y: 20, delay: 0.12 },
  { x: -120, y: 110, delay: 0.18 },
  { x: 80, y: -110, delay: 0.04 },
  { x: -200, y: -20, delay: 0.16 },
  { x: 170, y: 70, delay: 0.1 },
  { x: -30, y: 130, delay: 0.22 },
  { x: 50, y: -140, delay: 0.02 },
];

/* Category assignment based on demo index */
const DEMO_EMOJIS = ["🚨", "🏗️", "🎵"];
const DEMO_CATEGORIES_KEY = ["security", "infrastructure", "events"];

/* Keyword heuristic for user-typed messages */
type CategoryKey = "security" | "infrastructure" | "events" | "general";
const CATEGORY_EMOJIS: Record<CategoryKey, string> = {
  security: "🚨",
  infrastructure: "🏗️",
  events: "🎵",
  general: "📋",
};

const CATEGORY_KEYWORDS: Record<Exclude<CategoryKey, "general">, RegExp> = {
  security:
    /assalt|rob|furt|roub|susp|polic|tiro|arma|perig|theft|stol|danger|gun|shoot|crime|safe|violen|asalt|ladr|delin|inseg|atrac|robbery|break.?in|burgla/i,
  infrastructure:
    /burac|obra|rua|calçada|esgot|água|luz|poste|semáfor|falt|queda|enchent|alaga|pothole|road|street|sidewalk|sewer|water|light|flood|construct|broken|fix|repair|infraestr|calle|acera|farola/i,
  events:
    /show|fest|feir|evento|música|concert|parque|sábado|domingo|grát|free|band|park|satur|sunday|concierto|feria|espectáculo|concert|samedi|dimanche/i,
};

function detectCategory(text: string): CategoryKey {
  for (const [cat, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    if (regex.test(text)) return cat as Exclude<CategoryKey, "general">;
  }
  return "general";
}

/* Cross-fade transition shared by all morphing sections */
const crossFade = {
  initial: { opacity: 0, y: 6, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -6, filter: "blur(4px)" },
  transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as const },
};

/* Spinner SVG for loading state */
function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="50 20"
        opacity="0.9"
      />
    </svg>
  );
}

export default function ReportDemo() {
  const t = useTranslations("reportDemo");

  const sectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-20%" });

  const [phase, setPhase] = useState<Phase>(0);
  const [typedText, setTypedText] = useState("");
  const [userTyping, setUserTyping] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);
  const [neighborCount, setNeighborCount] = useState(0);

  const demoMessages = [
    t("demoMessages.0"),
    t("demoMessages.1"),
    t("demoMessages.2"),
  ];

  const targetCount = 47;
  const currentDemo = demoMessages[demoIndex % demoMessages.length];

  // When user typed their own text, detect category from content.
  // When auto-typing demo, use the demo's pre-assigned category.
  const detectedCat: CategoryKey = userTyping
    ? detectCategory(typedText)
    : DEMO_CATEGORIES_KEY[demoIndex % DEMO_CATEGORIES_KEY.length] as CategoryKey;
  const currentEmoji = CATEGORY_EMOJIS[detectedCat];
  const currentCategory = t(`categories.${detectedCat}`);

  const isInputPhase = phase === 0 || phase === 0.5;
  const isCardPhase = phase >= 1 && phase <= 3;

  /* ── Auto-type effect ── */
  useEffect(() => {
    if (!isInView || phase !== 0 || userTyping) return;

    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    setTypedText("");

    const delay = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setTypedText(currentDemo.slice(0, i));
        if (i >= currentDemo.length) {
          clearInterval(interval);
          setTimeout(() => {
            if (!userTyping) handleSubmit();
          }, 1200);
        }
      }, 45);
    }, 800);

    return () => {
      clearTimeout(delay);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, phase, demoIndex, userTyping]);

  /* ── Counter animation ── */
  useEffect(() => {
    if (phase !== 3) {
      setNeighborCount(0);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      count += Math.ceil((targetCount - count) * 0.15);
      if (count >= targetCount) {
        count = targetCount;
        clearInterval(interval);
      }
      setNeighborCount(count);
    }, 40);

    return () => clearInterval(interval);
  }, [phase]);

  /* ── Phase transitions ── */
  const handleSubmit = useCallback(() => {
    if (phase !== 0 || typedText.length === 0) return;

    // Loading spinner
    setPhase(0.5);

    setTimeout(() => {
      setPhase(1); // morph
      setTimeout(() => setPhase(2), 700); // broadcasting
      setTimeout(() => setPhase(3), 1900); // final
      setTimeout(() => {
        setPhase(4); // reset
        setTimeout(() => {
          setPhase(0);
          setTypedText("");
          setUserTyping(false);
          setDemoIndex((prev) => (prev + 1) % demoMessages.length);
        }, 600);
      }, 5800);
    }, 1200);
  }, [phase, typedText, demoMessages.length]);

  const handleUserInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserTyping(true);
    setTypedText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-32 sm:py-40"
      style={{ background: "var(--background)" }}
    >
      {/* Section transition */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[200px]"
        style={{
          background: `linear-gradient(to bottom, var(--hero-bg), var(--background))`,
        }}
      />

      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(90vw, 600px)",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(var(--accent-rgb),0.04) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-[12px] font-bold uppercase tracking-[0.25em]"
          style={{ color: "var(--text-accent)" }}
        >
          {t("sectionLabel")}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
          style={{ color: "var(--foreground)" }}
        >
          {t("title")}{" "}
          <span className="gradient-text-accent">{t("titleAccent")}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("subtitle")}
        </motion.p>

        {/* ── Interactive area ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="mt-16 flex justify-center"
        >
          <div className="relative w-full max-w-lg">
            {/* ── Ripple rings (outside card) ── */}
            {phase >= 2 && phase <= 3 &&
              [0, 1, 2].map((i) => (
                <motion.div
                  key={`ripple-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-0"
                  initial={{ width: 40, height: 40, opacity: 0.5 }}
                  animate={{
                    width: [40, 500],
                    height: [40, 500],
                    opacity: [0.4, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.4,
                    ease: "easeOut",
                    repeat: phase === 2 ? 1 : 0,
                  }}
                  style={{
                    border: `2px solid rgba(var(--accent-rgb),0.3)`,
                  }}
                />
              ))}

            {/* ── Neighbor dots (outside card) ── */}
            {phase >= 2 && phase <= 3 &&
              NEIGHBOR_DOTS.map((dot, i) => (
                <motion.div
                  key={`dot-${i}`}
                  className="absolute top-1/2 left-1/2 pointer-events-none z-0"
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{
                    x: dot.x,
                    y: dot.y,
                    opacity: [0, 1, 1],
                    scale: [0, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    delay: dot.delay + 0.3,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[12px] font-bold -translate-x-1/2 -translate-y-1/2"
                    style={{
                      background: `rgba(var(--card-bg-rgb),0.9)`,
                      border: `1px solid var(--border-subtle)`,
                      color: `rgba(var(--text-rgb),var(--text-muted))`,
                      boxShadow: `0 2px 12px rgba(0,0,0,var(--shadow-alpha))`,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: dot.delay + 0.6, duration: 0.3 }}
                      style={{ background: "var(--accent)" }}
                    />
                  </div>
                </motion.div>
              ))}

            {/* ══════════════════════════════════════════
                Single card shell — content morphs inside
            ══════════════════════════════════════════ */}
            <motion.div
              layout
              className="relative z-10 rounded-2xl overflow-hidden"
              animate={{
                borderColor:
                  isCardPhase
                    ? "rgba(var(--accent-rgb),0.25)"
                    : "var(--border-subtle)",
                boxShadow:
                  isCardPhase
                    ? `0 16px 60px rgba(0,0,0,calc(var(--shadow-alpha) + 0.04)), 0 0 40px rgba(var(--accent-rgb),0.08)`
                    : `0 8px 40px rgba(0,0,0,var(--shadow-alpha))`,
              }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              style={{
                border: `1px solid var(--border-subtle)`,
                background:
                  isCardPhase
                    ? `rgba(var(--card-bg-rgb),0.88)`
                    : `rgba(var(--card-bg-rgb),0.6)`,
                backdropFilter: "blur(12px)",
                // Smooth background transition
                transition: "background 0.6s cubic-bezier(0.23,1,0.32,1)",
                // Fade out for reset
                opacity: phase === 4 ? 0 : 1,
              }}
            >
              {/* ── Header ── */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: `1px solid var(--border-subtle)` }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isInputPhase ? (
                    <motion.div
                      key="input-header"
                      {...crossFade}
                      className="flex items-center gap-2.5"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold"
                        style={{
                          background: `rgba(var(--accent-rgb),0.15)`,
                          color: "var(--text-accent)",
                        }}
                      >
                        V
                      </div>
                      <div>
                        <p
                          className="text-[13px] font-semibold"
                          style={{ color: "var(--foreground)" }}
                        >
                          {t("inputAuthor")}
                        </p>
                        <p
                          className="text-[11px]"
                          style={{
                            color: `rgba(var(--text-rgb),var(--text-faint))`,
                          }}
                        >
                          {t("inputLocation")}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="card-header"
                      {...crossFade}
                      className="flex items-center gap-3"
                    >
                      <motion.span
                        className="text-xl"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.5,
                          ease: [0.23, 1, 0.32, 1],
                          delay: 0.1,
                        }}
                      >
                        {currentEmoji}
                      </motion.span>
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: "var(--text-accent)" }}
                        >
                          {currentCategory}
                        </p>
                        <p
                          className="text-[11px]"
                          style={{
                            color: `rgba(var(--text-rgb),var(--text-faint))`,
                          }}
                        >
                          {t("cardLocation")} · {t("cardTime")}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Live badge — appears in card phase */}
                <AnimatePresence>
                  {isCardPhase && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        delay: 0.3,
                        duration: 0.4,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1"
                      style={{
                        background: `rgba(var(--accent-rgb),0.12)`,
                      }}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span
                          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                          style={{ background: "var(--accent)" }}
                        />
                        <span
                          className="relative inline-flex h-1.5 w-1.5 rounded-full"
                          style={{ background: "var(--accent)" }}
                        />
                      </span>
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: "var(--text-accent)" }}
                      >
                        {t("cardLive")}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Body ── */}
              <div className="px-5 py-4">
                <AnimatePresence mode="wait" initial={false}>
                  {isInputPhase ? (
                    <motion.div key="input-body" {...crossFade}>
                      <textarea
                        ref={inputRef}
                        value={typedText}
                        onChange={handleUserInput}
                        onKeyDown={handleKeyDown}
                        placeholder={t("inputPlaceholder")}
                        rows={3}
                        className="w-full bg-transparent resize-none outline-none text-[15px] leading-relaxed placeholder:opacity-30"
                        style={{ color: "var(--foreground)" }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div key="card-body" {...crossFade}>
                      <p
                        className="text-[15px] font-medium leading-relaxed"
                        style={{ color: "var(--foreground)" }}
                      >
                        {typedText}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Footer ── */}
              <div className="px-5 pb-4">
                <AnimatePresence mode="wait" initial={false}>
                  {/* Submit button (input phase) */}
                  {isInputPhase && (
                    <motion.div
                      key="submit-bar"
                      {...crossFade}
                      className="flex justify-end"
                    >
                      <motion.button
                        whileHover={phase === 0 ? { scale: 1.04 } : {}}
                        whileTap={phase === 0 ? { scale: 0.97 } : {}}
                        onClick={handleSubmit}
                        disabled={typedText.length === 0 || phase === 0.5}
                        className="relative rounded-full px-6 py-2 text-[13px] font-bold transition-all duration-200 cursor-pointer disabled:cursor-default overflow-hidden"
                        style={{
                          background: "var(--accent)",
                          color: "var(--accent-foreground)",
                          boxShadow: "0 2px 12px var(--accent-glow)",
                          minWidth: "110px",
                        }}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {phase === 0.5 ? (
                            <motion.span
                              key="loading"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <Spinner />
                              <span>{t("sending")}</span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="label"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              transition={{ duration: 0.2 }}
                            >
                              {t("submitButton")}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Notification counter (card phase 3) */}
                  {phase === 3 && (
                    <motion.div
                      key="counter-bar"
                      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                      transition={{
                        duration: 0.5,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      <div
                        className="rounded-xl px-4 py-3 flex items-center justify-between"
                        style={{
                          background: `rgba(var(--accent-rgb),0.06)`,
                          border: `1px solid rgba(var(--accent-rgb),0.12)`,
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: "var(--text-accent)" }}
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span
                            className="text-[13px] font-bold tabular-nums"
                            style={{ color: "var(--text-accent)" }}
                          >
                            {neighborCount}
                          </span>
                          <span
                            className="text-[13px] font-medium"
                            style={{
                              color: `rgba(var(--text-rgb),var(--text-muted))`,
                            }}
                          >
                            {t("neighborsNotified")}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: "var(--status-success)" }}
                          >
                            <polyline points="22 4 12 14.01 9 11.01" />
                          </svg>
                          <span
                            className="text-[12px] font-semibold"
                            style={{ color: "var(--status-success)" }}
                          >
                            {t("verifying")}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Progress bar during phase 1–2 (between submit and counter) */}
                  {(phase === 1 || phase === 2) && (
                    <motion.div
                      key="progress-bar"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="h-1 rounded-full overflow-hidden"
                        style={{
                          background: `rgba(var(--accent-rgb),0.1)`,
                        }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: phase === 1 ? 0.6 : 1.1,
                            ease: "easeInOut",
                          }}
                          style={{ background: "var(--accent)" }}
                        />
                      </div>
                      <p
                        className="mt-2 text-[11px] font-medium text-center"
                        style={{
                          color: `rgba(var(--text-rgb),var(--text-faint))`,
                        }}
                      >
                        {t("broadcasting")}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
