"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { APP_NAME } from "@/config/app-config";
import { ROUTES } from "@/config/routes";

const LOCALE_LABELS: Record<string, string> = {
  pt: "PT-BR",
  en: "EN",
  es: "ES",
  "pt-PT": "PT-PT",
  de: "DE",
  fr: "FR",
};

const LOCALE_NAMES: Record<string, string> = {
  pt: "Português (BR)",
  en: "English",
  es: "Español",
  "pt-PT": "Português (PT)",
  de: "Deutsch",
  fr: "Français",
};

const LOCALES = ["pt", "en", "es", "pt-PT", "de", "fr"] as const;

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const langRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    if (currentY < 10) {
      setVisible(true);
    } else if (currentY < lastScrollY) {
      setVisible(true);
    } else if (currentY > lastScrollY) {
      setVisible(false);
      setMenuOpen(false);
      setLangOpen(false);
    }
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (next: string) => {
    setLangOpen(false);
    setMenuOpen(false);
    router.replace(pathname, { locale: next });
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-16"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <nav
        className="h-full flex items-center justify-between px-5 sm:px-8 border-b"
        style={{
          background: "rgba(var(--hero-bg), 0.72)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center select-none pl-2 sm:pl-4 no-underline">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language dropdown — temporarily hidden for launch
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((p) => !p)}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer px-2 py-1 rounded-lg"
              style={{ color: "rgba(var(--text-rgb), 0.5)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--foreground)")
              }
              onMouseLeave={(e) =>
                !langOpen &&
                (e.currentTarget.style.color = "rgba(var(--text-rgb), 0.5)")
              }
            >
              {LOCALE_LABELS[locale]}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s",
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 rounded-xl py-1.5 min-w-[160px] overflow-hidden"
                  style={{
                    background: "rgba(var(--card-bg-rgb), 0.95)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--border-subtle)",
                    boxShadow: `0 8px 30px rgba(0,0,0,var(--shadow-alpha))`,
                  }}
                >
                  {LOCALES.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className="w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-between"
                      style={{
                        color:
                          loc === locale
                            ? "var(--accent)"
                            : "rgba(var(--text-rgb), 0.7)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(var(--accent-rgb), 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {LOCALE_NAMES[loc]}
                      {loc === locale && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          */}

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-full px-5 py-2 text-sm font-semibold text-white cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "0 2px 12px var(--accent-glow)",
            }}
          >
            {t("download")}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="block w-5 h-[2px] rounded-full"
            style={{ backgroundColor: "var(--foreground)" }}
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-5 h-[2px] rounded-full"
            style={{ backgroundColor: "var(--foreground)" }}
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="block w-5 h-[2px] rounded-full"
            style={{ backgroundColor: "var(--foreground)" }}
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden border-b"
            style={{
              background: "rgba(var(--hero-bg), 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "var(--border-subtle)",
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {/* Language options — temporarily hidden for launch
              <p
                className="text-[11px] font-bold uppercase tracking-widest px-1 pb-1"
                style={{ color: "rgba(var(--text-rgb), 0.3)" }}
              >
                {t("language")}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {LOCALES.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => switchLocale(loc)}
                    className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    style={{
                      color:
                        loc === locale
                          ? "var(--accent)"
                          : "rgba(var(--text-rgb), 0.6)",
                      background:
                        loc === locale
                          ? "rgba(var(--accent-rgb), 0.1)"
                          : "rgba(var(--text-rgb), 0.05)",
                      border:
                        loc === locale
                          ? "1px solid rgba(var(--accent-rgb), 0.2)"
                          : "1px solid transparent",
                    }}
                  >
                    {LOCALE_LABELS[loc]}
                  </button>
                ))}
              </div>
              */}

              <motion.button
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold text-white w-full cursor-pointer"
                style={{
                  backgroundColor: "var(--accent)",
                  boxShadow: "0 2px 12px var(--accent-glow)",
                }}
              >
                {t("download")}
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
