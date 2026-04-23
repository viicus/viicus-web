"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * One big statement. A single idea in a single viewport.
 * Giant type, lots of breathing room, the pink dot as the only visual mark.
 */
export default function Statement() {
  const t = useTranslations("statement");

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-32 sm:py-44 lg:py-56">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="kicker mb-10 sm:mb-14"
        >
          {t("kicker")}
        </motion.div>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
          }}
          className="type-display text-5xl sm:text-7xl lg:text-[8.5rem]"
          style={{ color: "var(--foreground)" }}
        >
          <Line>{t("line1")}</Line>
          <Line muted>{t("line2")}</Line>
          <Line>{t("line3")}</Line>
          <Line accent>{t("line4")}</Line>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 sm:mt-16 max-w-lg text-base sm:text-lg font-light leading-relaxed"
          style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
        >
          {t("footnote")}
        </motion.p>
      </div>
    </section>
  );
}

function Line({
  children,
  muted = false,
  accent = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
  accent?: boolean;
}) {
  const color = muted
    ? `rgba(var(--text-rgb),0.32)`
    : accent
    ? undefined
    : "var(--foreground)";

  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
      }}
      className={`block ${accent ? "gradient-text-hero" : ""}`}
      style={color ? { color } : undefined}
    >
      {children}
    </motion.span>
  );
}
