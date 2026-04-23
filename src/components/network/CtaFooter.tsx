"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { APP_NAME, APP_YEAR } from "@/config/app-config";
import { ROUTES } from "@/config/routes";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] as const },
});

export default function CtaFooter() {
  const t = useTranslations("ctaFooter");

  return (
    <section
      className="relative px-6 overflow-hidden"
      style={{ background: "var(--hero-bg)" }}
    >
      {/* Background blush */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(var(--vivid-pink-rgb),0.05) 0%, transparent 70%)",
        }}
      />

      {/* --- Closing statement --- */}
      <div className="relative z-10 mx-auto max-w-5xl pt-32 sm:pt-40 pb-20 sm:pb-28">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="kicker mb-10"
        >
          {t("kicker")}
        </motion.div>

        <motion.p
          {...fadeUp(0)}
          className="type-display-sm text-3xl sm:text-5xl lg:text-6xl"
          style={{ color: `rgba(var(--text-rgb),0.32)` }}
        >
          {t("narrative1")}
        </motion.p>
        <motion.p
          {...fadeUp(0.1)}
          className="mt-3 type-display-sm text-3xl sm:text-5xl lg:text-6xl"
          style={{ color: "var(--foreground)" }}
        >
          {t("narrative2")}{" "}
          <span className="gradient-text-hero">{t("narrative2Bold")}</span>
        </motion.p>
      </div>

      {/* --- CTA block --- */}
      <div className="relative mx-auto max-w-xl pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] as const }}
          className="text-center"
        >
          <div className="flex justify-center items-center gap-1.5 mb-6" aria-hidden>
            <span className="h-2 w-2 rounded-full dot-pink" />
            <span className="h-2 w-2 rounded-full dot-yellow" />
            <span className="h-2 w-2 rounded-full dot-mint" />
          </div>

          <p
            className="type-display-sm text-2xl sm:text-3xl"
            style={{ color: "var(--foreground)" }}
          >
            {t("ctaTitle")}
          </p>

          <p
            className="mt-4 text-sm font-light"
            style={{ color: `rgba(var(--text-rgb),var(--text-medium))` }}
          >
            {t("ctaBody")}
          </p>

          <div className="mt-8 flex justify-center">
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-sm font-medium tracking-wide cursor-pointer"
              style={{
                background: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              <span>{t("ctaButton")}</span>
              <span
                className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                style={{ background: "var(--vivid-pink)" }}
              />
            </motion.a>
          </div>

          <p
            className="mt-4 text-xs font-light"
            style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
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
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-5xl py-10 flex flex-col sm:flex-row items-center justify-between gap-5 border-t"
        style={{ borderColor: "var(--divider)" }}
      >
        <div className="flex items-end gap-0.5">
          <span
            className="type-display text-xl lowercase"
            style={{ color: "var(--foreground)" }}
          >
            {APP_NAME.toLowerCase()}
          </span>
          <span
            className="mb-[5px] h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--vivid-pink)" }}
            aria-hidden
          />
        </div>

        <div className="flex items-center gap-6">
          {[
            { label: t("footerTerms"), href: ROUTES.TERMS },
            { label: t("footerPrivacy"), href: ROUTES.PRIVACY },
            { label: t("footerContact"), href: ROUTES.CONTACT },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href as "/terms" | "/privacy" | "/contact"}
              className="text-xs font-medium transition-colors lowercase"
              style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--foreground)";
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
          className="text-xs font-light"
          style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
        >
          &copy; {APP_YEAR} {APP_NAME.toLowerCase()}
        </p>
      </motion.div>
    </section>
  );
}
