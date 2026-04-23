"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const ACCENTS = ["var(--vivid-pink)", "var(--vivid-yellow)", "var(--vivid-mint)"] as const;

/**
 * Three principles, side-by-side. Each column is a dot + number + two lines.
 * No cards, no borders — just typography and whitespace.
 */
export default function Pillars() {
  const t = useTranslations("pillars");
  const items = [
    { key: "one",   accent: ACCENTS[0] },
    { key: "two",   accent: ACCENTS[1] },
    { key: "three", accent: ACCENTS[2] },
  ] as const;

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--hero-bg)" }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-28 sm:py-36">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="kicker mb-16 sm:mb-24"
        >
          {t("kicker")}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-10 lg:gap-16">
          {items.map((it, idx) => (
            <motion.div
              key={it.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: it.accent }}
                />
                <span
                  className="type-mono text-xs font-medium"
                  style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
                >
                  {t(`${it.key}.tag`)}
                </span>
              </div>

              <h3
                className="type-display-sm text-2xl sm:text-3xl lg:text-4xl"
                style={{ color: "var(--foreground)" }}
              >
                {t(`${it.key}.title`)}
              </h3>

              <p
                className="text-base font-light leading-relaxed max-w-xs"
                style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
              >
                {t(`${it.key}.copy`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
