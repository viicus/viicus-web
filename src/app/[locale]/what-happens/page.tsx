"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { useTranslations } from "next-intl";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] as const },
});

const CATEGORY_COUNT = 8;
const EXAMPLE_COUNT = 3;

export default function OQueAcontecePage() {
  const t = useTranslations("oQueAcontece");

  const categories = Array.from({ length: CATEGORY_COUNT }, (_, i) => ({
    emoji: t(`categories.${i}.emoji`),
    tag: t(`categories.${i}.tag`),
    title: t(`categories.${i}.title`),
    body: t(`categories.${i}.body`),
    examples: Array.from({ length: EXAMPLE_COUNT }, (_, j) => t(`categories.${i}.examples.${j}`)),
    color: "var(--text-accent)",
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
            {t("heroSubtitle")}
          </motion.p>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[200px]"
          style={{
            background: `linear-gradient(to top, var(--background), transparent)`,
          }}
        />
      </section>

      {/* ── Categories ── */}
      <section style={{ background: "var(--background)" }}>
        <div className="mx-auto max-w-4xl px-6 py-24">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.tag}
              {...fadeUp(0)}
              className="py-20"
              style={{
                borderBottom:
                  i < categories.length - 1
                    ? `1px solid var(--border-subtle)`
                    : "none",
              }}
            >
              <div className="flex items-start gap-6">
                <span className="text-4xl shrink-0 mt-1">{cat.emoji}</span>
                <div className="flex-1">
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: "var(--text-accent)" }}
                  >
                    {cat.tag}
                  </p>
                  <h3
                    className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight"
                    style={{ color: "var(--foreground)" }}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className="mt-4 text-[15px] leading-relaxed max-w-2xl"
                    style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
                  >
                    {cat.body}
                  </p>

                  {/* Examples */}
                  <div className="mt-8 space-y-3">
                    {cat.examples.map((ex, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-3 rounded-xl px-4 py-3"
                        style={{
                          background: `rgba(var(--card-bg-rgb),0.5)`,
                          border: `1px solid var(--border-subtle)`,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                          style={{ color: "var(--text-accent)" }}
                        >
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        <p
                          className="text-[13px] font-medium"
                          style={{ color: "var(--foreground)" }}
                        >
                          {ex}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="relative" style={{ background: "var(--hero-bg)" }}>
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 h-[200px]"
          style={{
            background: `linear-gradient(to bottom, var(--background), var(--hero-bg))`,
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 pt-40 pb-40">
          <motion.p
            {...fadeUp(0)}
            className="text-2xl sm:text-4xl font-bold leading-snug tracking-tight"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("closingLine1")}
          </motion.p>
          <motion.p
            {...fadeUp(0.1)}
            className="mt-4 text-2xl sm:text-4xl font-bold leading-snug tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("closingLine2")}{" "}
            <span style={{ color: "var(--text-accent)" }}>{t("closingLine2Accent")}</span>
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
