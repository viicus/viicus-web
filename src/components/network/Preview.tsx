"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

const ROTATION_INTERVAL = 4500; // ms between card swaps
const CARD_COUNT = 4;

// Three vivid accents used to recolor the orbit dot as cards cycle,
// so each example feels like a different "channel" on the feed.
const ACCENTS = [
  "var(--vivid-pink)",
  "var(--vivid-yellow)",
  "var(--vivid-mint)",
  "var(--vivid-violet)",
] as const;

const CHIP_ACCENTS = [
  ["var(--vivid-pink)", "var(--vivid-mint)"],
  ["var(--vivid-yellow)", "var(--vivid-violet)"],
  ["var(--vivid-pink)", "var(--vivid-yellow)"],
  ["var(--vivid-mint)", "var(--vivid-violet)"],
] as const;

/**
 * A single feed card that rotates between examples every few seconds.
 * A thin ring orbits behind the card with a colored satellite that stays
 * in perpetual motion — echoes the AuthBackdrop motif from the mobile app.
 */
export default function Preview() {
  const t = useTranslations("preview");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((p) => (p + 1) % CARD_COUNT);
    }, ROTATION_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-28 sm:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.55 }}
          >
            <div className="kicker mb-6">{t("kicker")}</div>

            <h2
              className="type-display-sm text-3xl sm:text-4xl lg:text-5xl"
              style={{ color: "var(--foreground)" }}
            >
              {t("title")}
            </h2>

            <p
              className="mt-6 max-w-md text-base sm:text-lg font-light leading-relaxed"
              style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
            >
              {t("subtitle")}
            </p>

            {/* Card indicators */}
            <div className="mt-10 flex items-center gap-2">
              {Array.from({ length: CARD_COUNT }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Card ${i + 1}`}
                  className="cursor-pointer"
                  style={{ background: "transparent", border: "none", padding: 4 }}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === idx ? 22 : 6,
                      height: 6,
                      background:
                        i === idx
                          ? ACCENTS[i]
                          : "rgba(var(--text-rgb),0.18)",
                    }}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — orbiting card */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="relative flex items-center justify-center h-[440px] sm:h-[500px]"
          >
            <OrbitStage idx={idx} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/**
 * The orbit scene: a thin 1px ring with a colored satellite that rotates
 * forever, and an inner ring (counter-rotating) with another satellite —
 * both clipped behind the card.
 */
function OrbitStage({ idx }: { idx: number }) {
  const accent = ACCENTS[idx % ACCENTS.length];
  const counter = ACCENTS[(idx + 2) % ACCENTS.length];

  return (
    <div className="relative">
      {/* Outer ring — a perfectly static circle */}
      <div
        className="pointer-events-none absolute inset-0 m-auto rounded-full"
        style={{
          width: 480,
          height: 480,
          border: "1px solid rgba(var(--text-rgb),0.08)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        aria-hidden
      />

      {/* Outer orbit — invisible container rotating, dot sits on its edge */}
      <motion.div
        className="pointer-events-none absolute inset-0 m-auto"
        style={{
          width: 480,
          height: 480,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <motion.span
          key={`outer-${idx}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="absolute block rounded-full"
          style={{
            width: 14,
            height: 14,
            top: "50%",
            right: 0,
            transform: "translate(50%, -50%)",
            background: accent,
            boxShadow: `0 0 20px ${accent}`,
          }}
        />
      </motion.div>

      {/* Inner ring — static */}
      <div
        className="pointer-events-none absolute inset-0 m-auto rounded-full"
        style={{
          width: 340,
          height: 340,
          border: "1px solid rgba(var(--text-rgb),0.05)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        aria-hidden
      />

      {/* Inner orbit — counter-rotates */}
      <motion.div
        className="pointer-events-none absolute inset-0 m-auto"
        style={{
          width: 340,
          height: 340,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <motion.span
          key={`inner-${idx}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.08 }}
          className="absolute block rounded-full"
          style={{
            width: 10,
            height: 10,
            top: "50%",
            left: 0,
            transform: "translate(-50%, -50%)",
            background: counter,
            boxShadow: `0 0 14px ${counter}`,
          }}
        />
      </motion.div>

      {/* The card itself — cross-fades between examples */}
      <div className="relative z-10 w-[320px] sm:w-[360px]">
        <AnimatePresence mode="wait">
          <FeedCard key={idx} idx={idx} />
        </AnimatePresence>
      </div>
    </div>
  );
}

function FeedCard({ idx }: { idx: number }) {
  const t = useTranslations(`preview.cards.${idx}`);
  const chipColors = CHIP_ACCENTS[idx % CHIP_ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="relative rounded-3xl p-7 sm:p-9"
      style={{
        background: "var(--background)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: ACCENTS[idx % ACCENTS.length] }}
        />
        <span
          className="type-mono text-[11px] font-medium tracking-wide"
          style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
        >
          {t("tag")}
        </span>
      </div>

      {/* Body */}
      <h3
        className="mt-5 type-display-sm text-xl sm:text-2xl leading-snug"
        style={{ color: "var(--foreground)" }}
      >
        {t("title")}
      </h3>

      <p
        className="mt-3 text-sm sm:text-[15px] font-light leading-relaxed"
        style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
      >
        {t("body")}
      </p>

      {/* Chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Chip label={t("chip1")} accent={chipColors[0]} />
        <Chip label={t("chip2")} accent={chipColors[1]} />
      </div>

      {/* Divider + confirmations */}
      <div
        className="mt-7 border-t pt-4 flex items-center gap-2.5"
        style={{ borderColor: "var(--divider)" }}
      >
        <div className="flex -space-x-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-5 w-5 rounded-full border-2"
              style={{
                borderColor: "var(--background)",
                background: ACCENTS[i % ACCENTS.length],
              }}
            />
          ))}
        </div>
        <span
          className="type-mono text-[11px] font-medium"
          style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
        >
          {t("confirmed")}
        </span>
      </div>
    </motion.div>
  );
}

function Chip({ label, accent }: { label: string; accent: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium lowercase tracking-wide"
      style={{
        background: "var(--surface-soft)",
        color: "var(--foreground)",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: accent }}
      />
      {label}
    </span>
  );
}
