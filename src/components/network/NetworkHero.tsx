"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/config/app-config";
import NetworkCanvas, { type CanvasTranslations } from "./NetworkCanvas";

export default function NetworkHero({ personCount = 75 }: { personCount?: number }) {
  const t = useTranslations("hero");
  const tc = useTranslations("canvas");

  const canvasTranslations: CanvasTranslations = {
    typeLabels: [tc("typeLabels.0"), tc("typeLabels.1"), tc("typeLabels.2")],
    titles: [0, 1, 2].map((type) =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => tc(`titles.${type}.${i}`))
    ),
    actions: [0, 1, 2].map((type) =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [
        tc(`actions.${type}.${i}.0`),
        tc(`actions.${type}.${i}.1`),
      ] as [string, string])
    ),
    dismissReasons: [0, 1, 2].map((type) =>
      [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [
        tc(`dismissReasons.${type}.${i}.0`),
        tc(`dismissReasons.${type}.${i}.1`),
      ] as [string, string])
    ),
    recentlyReported: tc("recentlyReported"),
    confirmed: tc("confirmed"),
    dismissed: tc("dismissed"),
    votes: tc("votes"),
    communityNotified: tc("communityNotified"),
    authoritiesNotified: tc("authoritiesNotified"),
    eventDismissed: tc("eventDismissed"),
    infoNotVerified: tc("infoNotVerified"),
    paused: tc("paused"),
    collecting: tc("collecting"),
  };

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mouseActive, setMouseActive] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!mouseActive) setMouseActive(true);
    },
    [mouseActive]
  );

  return (
    <section
      className="relative w-full overflow-hidden min-h-[760px] md:min-h-[860px] lg:min-h-[900px]"
      style={{ background: "var(--hero-bg)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouseActive(false)}
    >
      <NetworkCanvas personCount={personCount} translations={canvasTranslations} />

      {/* Cursor glow — subtle magenta wash */}
      {mouseActive && (
        <div
          className="pointer-events-none fixed z-10 rounded-full"
          style={{
            left: mousePos.x - 220,
            top: mousePos.y - 220,
            width: 440,
            height: 440,
            background: `radial-gradient(circle, rgba(var(--accent-rgb),0.05) 0%, transparent 70%)`,
            transition: "left 0.15s ease-out, top 0.15s ease-out",
          }}
        />
      )}

      {/* Decorative orbit rings (echo the mobile auth backdrop) */}
      <DecorativeRings />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-start justify-center px-6 sm:px-10 lg:px-16 py-20 max-w-7xl mx-auto w-full min-h-[760px] md:min-h-[860px] lg:min-h-[900px]">
        {/* Live badge — compact, moved to top */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ background: "var(--vivid-pink)" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: "var(--vivid-pink)" }}
            />
          </span>
          <span
            className="text-xs font-medium lowercase"
            style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
          >
            {t("badge")}
          </span>
        </motion.div>

        {/* Brand mark — three vivid dots */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-1.5 mb-5"
          aria-hidden
        >
          <span className="h-2.5 w-2.5 rounded-full dot-pink" />
          <span className="h-2.5 w-2.5 rounded-full dot-yellow" />
          <span className="h-2.5 w-2.5 rounded-full dot-mint" />
        </motion.div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-end gap-1 mb-4"
        >
          <span
            className="type-display text-5xl sm:text-6xl md:text-7xl"
            style={{ color: "var(--foreground)" }}
          >
            {APP_NAME.toLowerCase()}
          </span>
          <span
            className="mb-2 sm:mb-2.5 md:mb-3 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full"
            style={{ background: "var(--vivid-pink)" }}
            aria-hidden
          />
        </motion.div>

        {/* Headline */}
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42 }}
            className="type-display-sm text-3xl sm:text-4xl md:text-5xl"
            style={{ color: "var(--foreground)" }}
          >
            {t("titleLine1")}
            <br />
            <span className="gradient-text-hero">{t("titleLine2Accent")}</span>
            <span style={{ color: "var(--foreground)" }}>{t("titleLine2Rest")}</span>
          </motion.h1>

          {/* Kicker — editorial strip */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.55 }}
            className="mt-5 kicker"
          >
            {t("kicker")}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.68 }}
            className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed font-light"
            style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.82 }}
          className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-3.5 text-sm font-medium tracking-wide cursor-pointer w-full sm:w-auto"
            style={{
              background: "var(--foreground)",
              color: "var(--background)",
            }}
          >
            <span>{t("ctaPrimary")}</span>
            <span
              className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
              style={{ background: "var(--vivid-pink)" }}
            />
          </motion.button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href={ROUTES.HOW_IT_WORKS}
              className="block rounded-2xl px-7 py-3.5 text-sm font-medium cursor-pointer text-center transition-colors w-full sm:w-auto"
              style={{
                border: "1px solid var(--border-subtle)",
                color: "var(--foreground)",
              }}
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Edge fades */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-40"
        style={{
          background:
            "linear-gradient(to top, var(--hero-bg), rgba(var(--hero-bg-rgb),0.5), transparent)",
        }}
      />
    </section>
  );
}

/**
 * Decorative thin rings that slowly orbit in the background — matches the
 * AuthBackdrop motif used by the iOS / Android auth flow.
 */
function DecorativeRings() {
  return (
    <>
      {/* Top-right ring with a yellow satellite */}
      <div
        className="pointer-events-none absolute z-0 animate-orbit"
        style={{
          width: 520,
          height: 520,
          top: -220,
          right: -240,
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(var(--text-rgb),0.08)" }}
        />
        <span
          className="absolute rounded-full"
          style={{
            width: 14,
            height: 14,
            top: "50%",
            right: 0,
            transform: "translate(50%, -50%)",
            background: "var(--vivid-yellow)",
          }}
        />
      </div>

      {/* Bottom-left ring with mint + violet satellites */}
      <div
        className="pointer-events-none absolute z-0 animate-orbit-reverse"
        style={{
          width: 340,
          height: 340,
          bottom: -160,
          left: -140,
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(var(--text-rgb),0.10)" }}
        />
        <span
          className="absolute rounded-full"
          style={{
            width: 12,
            height: 12,
            top: "50%",
            right: 0,
            transform: "translate(50%, -50%)",
            background: "var(--vivid-mint)",
          }}
        />
        <span
          className="absolute rounded-full"
          style={{
            width: 12,
            height: 12,
            top: "50%",
            left: 0,
            transform: "translate(-50%, -50%)",
            background: "var(--vivid-violet)",
          }}
        />
      </div>
    </>
  );
}
