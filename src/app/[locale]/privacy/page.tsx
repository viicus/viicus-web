"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { APP_NAME, APP_YEAR } from "@/config/app-config";
import { CONTACT } from "@/config/contact";
import { ROUTES } from "@/config/routes";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] as const },
});

const SECTION_COUNT = 14;

const legalParams = {
  appName: APP_NAME,
  companyName: CONTACT.COMPANY_NAME,
  emailLegal: CONTACT.EMAIL_LEGAL,
  emailPrivacy: CONTACT.EMAIL_PRIVACY,
  emailDpo: CONTACT.EMAIL_DPO,
  tbd: CONTACT.CNPJ,
};

export default function PrivacidadePage() {
  const t = useTranslations("privacidade");

  const sections = Array.from({ length: SECTION_COUNT }, (_, i) => ({
    title: t(`sections.${i}.title`),
    summary: t(`sections.${i}.summary`),
    content: Array.from(
      { length: Number(t(`sections.${i}.contentLength`)) },
      (_, j) => t(`sections.${i}.content.${j}`, legalParams)
    ),
  }));
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [activeSection, setActiveSection] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const toggleSection = useCallback((index: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  // Scroll spy — single scroll listener, finds topmost visible section
  useEffect(() => {
    const OFFSET = 160;

    const handleScroll = () => {
      const refs = sectionRefs.current;
      const midline = window.innerHeight * 0.4;

      let active = 0;
      for (let i = 0; i < refs.length; i++) {
        const el = refs[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= midline) {
            active = i;
          }
        }
      }

      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 40) {
        for (let i = refs.length - 1; i > active; i--) {
          const el = refs[i];
          if (el && el.getBoundingClientRect().top < window.innerHeight) {
            active = i;
            break;
          }
        }
      }

      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const el = sectionRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="noise-overlay" style={{ background: "var(--background)" }}>
      {/* ── Hero ── */}
      <section className="relative" style={{ background: "var(--hero-bg)" }}>
        <div
          className="pointer-events-none absolute top-[20%] left-1/2 -translate-x-1/2"
          style={{
            width: "min(90vw, 600px)",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(var(--accent-rgb),0.04) 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-20">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-2 text-[13px] font-medium mb-16"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            <Link
              href={ROUTES.HOME}
              className="transition-colors duration-200 hover:opacity-80"
              style={{ color: "var(--accent)" }}
            >
              {t("breadcrumbHome")}
            </Link>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.4 }}
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
            <span>{t("breadcrumbCurrent")}</span>
          </nav>

          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--accent)" }}
          >
            {t("heroLabel")}
          </motion.p>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("pageTitle")}
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-4 text-[14px]"
            style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
          >
            {t("lastUpdated", { date: t("lastUpdatedDate") })}
          </motion.p>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[120px]"
          style={{
            background: `linear-gradient(to top, var(--background), transparent)`,
          }}
        />
      </section>

      {/* ── Body ── */}
      <section style={{ background: "var(--background)" }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex gap-16">
            {/* Sticky sidebar — desktop only */}
            <aside className="hidden lg:block w-64 shrink-0">
              <nav className="sticky top-32">
                <ul className="space-y-1">
                  {sections.map((section, i) => {
                    const isActive = activeSection === i;
                    return (
                      <li key={i}>
                        <button
                          onClick={() => scrollToSection(i)}
                          className="w-full text-left px-3 py-2 rounded-lg text-[13px] leading-snug transition-all duration-200"
                          style={{
                            color: isActive
                              ? "var(--accent)"
                              : `rgba(var(--text-rgb),var(--text-muted))`,
                            background: isActive
                              ? `rgba(var(--accent-rgb),0.08)`
                              : "transparent",
                            fontWeight: isActive ? 600 : 400,
                          }}
                        >
                          {section.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {/* Main content */}
            <div className="min-w-0 flex-1 max-w-3xl">
              <motion.p
                {...fadeUp(0)}
                className="text-[15px] leading-relaxed mb-16"
                style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
              >
                {t("introParagraph", legalParams)}
              </motion.p>

              {sections.map((section, i) => {
                const isOpen = openSections.has(i);
                return (
                  <motion.div
                    key={i}
                    {...fadeUp(0)}
                    id={`privacidade-${i + 1}`}
                    ref={(el) => {
                      sectionRefs.current[i] = el;
                    }}
                    className="mb-6"
                    style={{ scrollMarginTop: "128px" }}
                  >
                    <div
                      className="rounded-xl border transition-colors duration-200"
                      style={{
                        borderColor: isOpen
                          ? `rgba(var(--accent-rgb),0.15)`
                          : "var(--border-subtle)",
                        background: isOpen
                          ? `rgba(var(--accent-rgb),0.02)`
                          : "transparent",
                      }}
                    >
                      {/* Accordion header */}
                      <button
                        onClick={() => toggleSection(i)}
                        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                      >
                        <div className="min-w-0">
                          <h2
                            className="text-lg font-bold tracking-tight"
                            style={{ color: "var(--foreground)" }}
                          >
                            {section.title}
                          </h2>
                        </div>
                        <motion.svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0"
                          style={{
                            color: `rgba(var(--text-rgb),var(--text-muted))`,
                          }}
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </motion.svg>
                      </button>

                      {/* Summary box — always visible */}
                      <div className="px-6 pb-4 -mt-1">
                        <div
                          className="flex items-start gap-2.5 rounded-xl px-4 py-3"
                          style={{
                            background: `linear-gradient(135deg, rgba(var(--accent-rgb),0.06), rgba(var(--accent-rgb),0.02))`,
                            border: `1px solid rgba(var(--accent-rgb),0.1)`,
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
                            className="shrink-0 mt-0.5"
                            style={{ color: "var(--accent)" }}
                          >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                          </svg>
                          <p
                            className="text-[13px] leading-relaxed italic"
                            style={{ color: `rgba(var(--text-rgb),0.55)` }}
                          >
                            {section.summary}
                          </p>
                        </div>
                      </div>

                      {/* Collapsible content */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
                              opacity: { duration: 0.2 },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              {section.content.map((paragraph, j) => (
                                <p
                                  key={j}
                                  className="mt-4 text-[14px] leading-[1.8] whitespace-pre-line"
                                  style={{
                                    color: `rgba(var(--text-rgb),var(--text-muted))`,
                                  }}
                                >
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}

              <div
                className="h-px mt-20 mb-10"
                style={{ background: "var(--border-subtle)" }}
              />

              <p
                className="text-[13px]"
                style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
              >
                {t("footer", { year: APP_YEAR, ...legalParams })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Back to top ── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-colors duration-200"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground, #fff)",
            }}
            aria-label={t("backToTop")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
