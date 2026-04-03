"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { APP_NAME } from "@/config/app-config";
import { ROUTES } from "@/config/routes";
import { useTranslations } from "next-intl";
import TiltCard from "@/components/TiltCard";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] as const },
});

const STEP_COUNT = 5;
const PRINCIPLE_COUNT = 4;
const COMPARISON_COUNT = 5;

export default function VerificacaoPage() {
  const t = useTranslations("verificacao");

  const steps = Array.from({ length: STEP_COUNT }, (_, i) => ({
    number: t(`steps.${i}.number`),
    title: t(`steps.${i}.title`),
    body: t(`steps.${i}.body`),
    detail: t(`steps.${i}.detail`),
  }));

  const principles = Array.from({ length: PRINCIPLE_COUNT }, (_, i) => ({
    icon: t(`principles.${i}.icon`),
    title: t(`principles.${i}.title`),
    body: t(`principles.${i}.body`),
    detail: t(`principles.${i}.detail`, { appName: APP_NAME }),
  }));

  const comparisons = Array.from({ length: COMPARISON_COUNT }, (_, i) => ({
    them: t(`comparisons.${i}.them`),
    us: t(`comparisons.${i}.us`),
  }));

  return (
    <main className="noise-overlay" style={{ background: "var(--background)" }}>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "var(--hero-bg)" }}>
        <div
          className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2"
          style={{
            width: "min(90vw, 700px)",
            height: "500px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-24">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-[13px] font-medium mb-16 transition-colors duration-200"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            {t("heroSubtitle", { appName: APP_NAME })}
          </motion.p>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[200px]"
          style={{
            background: `linear-gradient(to top, var(--background), transparent)`,
          }}
        />
      </section>

      {/* ── How verification works — step by step ── */}
      <section style={{ background: "var(--background)" }}>
        <div className="mx-auto max-w-4xl px-6 pt-24 pb-32">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("stepsLabel")}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("stepsTitle")}
          </motion.h2>

          <div className="mt-20 relative">
            {/* Vertical line */}
            <div
              className="absolute left-[19px] top-0 bottom-0 w-px"
              style={{ background: `rgba(var(--accent-rgb),0.15)` }}
            />

            <div className="space-y-16">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  {...fadeUp(i * 0.08)}
                  className="relative flex gap-8"
                >
                  {/* Step number */}
                  <div
                    className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-[15px] font-black"
                    style={{
                      background: "var(--accent)",
                      color: "var(--accent-foreground)",
                      boxShadow: `0 0 20px var(--accent-glow)`,
                    }}
                  >
                    {step.number}
                  </div>

                  <div className="flex-1 pb-2">
                    <h3
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: "var(--foreground)" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="mt-3 text-[15px] leading-relaxed"
                      style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
                    >
                      {step.body}
                    </p>
                    <p
                      className="mt-3 text-[13px] leading-relaxed"
                      style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
                    >
                      {step.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section className="relative" style={{ background: "var(--hero-bg)" }}>
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[200px]"
          style={{
            background: `linear-gradient(to bottom, var(--background), var(--hero-bg))`,
          }}
        />
        <div
          className="pointer-events-none absolute top-[40%] left-1/2 -translate-x-1/2"
          style={{
            width: "min(90vw, 600px)",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(var(--accent-rgb),0.04) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-40 pb-32">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("principlesLabel")}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("principlesTitle")}{" "}
            <span className="gradient-text-accent">{t("principlesTitleAccent")}</span>
          </motion.h2>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {principles.map((principle, i) => (
              <motion.div
                key={principle.title}
                {...fadeUp(i * 0.08)}
              >
                <TiltCard
                  className="rounded-2xl p-8 hover-lift"
                  style={{
                    background: `rgba(var(--card-bg-rgb),0.5)`,
                    border: `1px solid var(--border-subtle)`,
                  }}
                >
                  <span className="text-3xl">{principle.icon}</span>
                  <h3
                    className="mt-5 text-xl font-bold"
                    style={{ color: "var(--foreground)" }}
                  >
                    {principle.title}
                  </h3>
                  <p
                    className="mt-3 text-[14px] leading-relaxed"
                    style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
                  >
                    {principle.body}
                  </p>
                  <p
                    className="mt-4 text-[13px] leading-relaxed"
                    style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
                  >
                    {principle.detail}
                  </p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section style={{ background: "var(--hero-bg)" }}>
        <div className="mx-auto max-w-4xl px-6 pb-32">
          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("comparisonLabel")}
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-16"
            style={{ color: "var(--foreground)" }}
          >
            {t("comparisonTitle", { appName: APP_NAME })}
          </motion.h2>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: `1px solid var(--border-subtle)`,
              background: `rgba(var(--card-bg-rgb),0.4)`,
            }}
          >
            {/* Header */}
            <div
              className="grid grid-cols-2 px-6 py-4"
              style={{ borderBottom: `1px solid var(--border-subtle)` }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
              >
                {t("comparisonHeaderThem")}
              </p>
              <p
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "var(--text-accent)" }}
              >
                {APP_NAME}
              </p>
            </div>

            {comparisons.map((row, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.05)}
                className="grid grid-cols-2 px-6 py-5"
                style={{
                  borderBottom:
                    i < comparisons.length - 1
                      ? `1px solid var(--border-subtle)`
                      : "none",
                }}
              >
                <p
                  className="text-[14px] pr-4"
                  style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
                >
                  {row.them}
                </p>
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {row.us}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust statement ── */}
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
            {t("trustLine1")}
          </motion.p>
          <motion.p
            {...fadeUp(0.1)}
            className="mt-4 text-2xl sm:text-4xl font-bold leading-snug tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("trustLine2")}{" "}
            <span className="gradient-text-accent">
              {t("trustLine2Accent")}
            </span>
          </motion.p>

          <motion.div {...fadeUp(0.2)} className="mt-12">
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
          </motion.div>
        </div>
      </section>
    </main>
  );
}
