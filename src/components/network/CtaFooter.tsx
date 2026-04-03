"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { APP_NAME, APP_YEAR } from "@/config/app-config";
import { ROUTES } from "@/config/routes";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] as const },
});

export default function CtaFooter() {
  const t = useTranslations("ctaFooter");

  return (
    <section
      className="relative px-6 overflow-hidden"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* Section transition gradient (from previous section) */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-[200px]"
        style={{
          background: `linear-gradient(to bottom, var(--background), var(--hero-bg))`,
        }}
      />

      {/* Background atmosphere */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(var(--accent-rgb),0.05) 0%, transparent 70%)",
        }}
      />

      {/* --- The closing narrative --- */}
      <div className="relative z-10 mx-auto max-w-4xl pt-40 pb-20">
        <motion.p
          {...fadeUp(0)}
          className="text-2xl sm:text-4xl font-medium leading-snug tracking-tight"
          style={{ color: `rgba(var(--text-rgb),0.3)` }}
        >
          {t("narrative1")}
        </motion.p>
        <motion.p
          {...fadeUp(0.12)}
          className="mt-4 text-2xl sm:text-4xl font-medium leading-snug tracking-tight"
          style={{ color: `rgba(var(--text-rgb),0.3)` }}
        >
          {t("narrative2")}{" "}
          <span className="gradient-text font-bold">{t("narrative2Bold")}</span>
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 h-px origin-left max-w-[120px]"
          style={{ background: `rgba(var(--accent-rgb),0.3)` }}
        />

        <motion.p
          {...fadeUp(0.15)}
          className="mt-20 text-xl sm:text-2xl font-medium leading-relaxed"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("narrative3", { appName: APP_NAME })}{" "}
          <span style={{ color: "var(--foreground)" }}>
            {t("narrative3Bold")}
          </span>
        </motion.p>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-6 text-xl sm:text-2xl font-medium leading-relaxed"
          style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
        >
          {t("narrative4")}
        </motion.p>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-6 text-xl sm:text-2xl font-bold leading-relaxed"
          style={{ color: "var(--foreground)" }}
        >
          {t("narrative5")}{" "}
          <span className="gradient-text-accent">
            {t("narrative5Accent")}
          </span>
        </motion.p>
      </div>

      {/* --- Premium CTA --- */}
      <div className="relative mx-auto max-w-lg py-24">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 1,
            ease: [0.23, 1, 0.32, 1] as const,
          }}
          className="text-center"
        >
          {/* Glowing accent line */}
          <div className="flex justify-center mb-10">
            <div
              className="h-px w-16"
              style={{
                background: `linear-gradient(to right, transparent, var(--accent), transparent)`,
                boxShadow: `0 0 20px var(--accent-glow)`,
              }}
            />
          </div>

          <p
            className="text-[11px] font-bold uppercase tracking-[0.35em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("ctaLabel")}
          </p>

          <p
            className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("ctaTitle")}
          </p>

          <p
            className="mt-3 text-[15px] leading-relaxed"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("ctaBody")}
          </p>

          {/* Download button */}
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.a
              href="#"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative overflow-hidden rounded-2xl px-8 py-4 text-[15px] font-bold cursor-pointer text-center"
              style={{
                background: "var(--accent)",
                color: "var(--accent-foreground)",
                boxShadow: `0 4px 24px var(--accent-glow)`,
              }}
            >
              {t("ctaButton")}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </motion.a>
          </div>

          <p
            className="mt-5 text-[12px]"
            style={{ color: `rgba(var(--text-rgb),0.15)` }}
          >
            {t("ctaNote")}
          </p>
        </motion.div>
      </div>

      {/* --- Footer --- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-4xl py-16 flex flex-col items-center gap-6"
      >
        <div
          className="h-px w-16"
          style={{ background: "var(--border-subtle)" }}
        />
        <div className="flex items-center gap-6">
          {[
            { label: t("footerTerms"), href: ROUTES.TERMS },
            { label: t("footerPrivacy"), href: ROUTES.PRIVACY },
            { label: t("footerContact"), href: ROUTES.CONTACT },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href as "/terms" | "/privacy" | "/contact"}
              className="text-[12px] font-medium transition-colors duration-200"
              style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = `rgba(var(--text-rgb),var(--text-faint))`;
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p
          className="text-[11px]"
          style={{ color: `rgba(var(--text-rgb),0.08)` }}
        >
          &copy; {APP_YEAR} {APP_NAME}
        </p>
      </motion.div>
    </section>
  );
}
