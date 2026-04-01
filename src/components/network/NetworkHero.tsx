"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
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

  return (
    <section className="relative min-h-screen w-full overflow-hidden" style={{ background: "var(--hero-bg)" }}>
      <NetworkCanvas personCount={personCount} translations={canvasTranslations} />

      {/* Radial glow behind text */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(var(--person-rgb),0.05) 0%, transparent 100%)" }}
      />

      {/* Content */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-24 sm:py-0">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mb-5 sm:mb-7 flex items-center gap-2.5 rounded-full px-4 sm:px-5 py-2 backdrop-blur-sm"
          style={{
            border: "1px solid rgba(var(--accent-rgb),0.2)",
            background: "rgba(var(--accent-rgb),0.06)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: "var(--accent-light)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
          </span>
          <span className="text-[13px] font-medium tracking-wide" style={{ color: "rgba(var(--accent-rgb),0.9)" }}>
            {t("badge")}
          </span>
        </motion.div>

        {/* Title */}
        <div className="max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="block text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl"
            style={{ color: "var(--foreground)" }}
          >
            {t("titleLine1")}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mt-1 block text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {t("titleLine2Accent")}
            </span>{" "}
            <span style={{ color: "var(--foreground)" }}>{t("titleLine2Rest")}</span>
          </motion.span>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85, ease: [0.23, 1, 0.32, 1] }}
          className="mt-5 sm:mt-6 max-w-md text-center text-[15px] sm:text-[17px] leading-relaxed"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.05, ease: [0.23, 1, 0.32, 1] }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold text-white cursor-pointer transition-shadow duration-300 w-full sm:w-auto text-center"
            style={{
              background: "var(--accent)",
              boxShadow: "0 2px 16px var(--accent-glow)",
            }}
          >
            {t("ctaPrimary")}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </motion.button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
            <Link
              href={ROUTES.HOW_IT_WORKS}
              className="block rounded-full px-7 py-3.5 text-sm font-medium cursor-pointer transition-all duration-300 w-full sm:w-auto text-center"
              style={{
                border: `1px solid var(--border-subtle)`,
                background: "var(--hero-bg)",
                color: `rgba(var(--text-rgb),var(--text-medium))`,
              }}
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </motion.div>

      </div>

      {/* Edge fades */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-40" style={{ background: `linear-gradient(to top, var(--hero-bg), rgba(var(--hero-bg-rgb),0.5), transparent)` }} />
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 h-24" style={{ background: `linear-gradient(to bottom, rgba(var(--hero-bg-rgb),0.6), transparent)` }} />
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-24" style={{ background: `linear-gradient(to right, rgba(var(--hero-bg-rgb),0.4), transparent)` }} />
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 z-10 w-24" style={{ background: `linear-gradient(to left, rgba(var(--hero-bg-rgb),0.4), transparent)` }} />
    </section>
  );
}
