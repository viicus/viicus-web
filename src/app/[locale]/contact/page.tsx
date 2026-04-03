"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { APP_NAME } from "@/config/app-config";
import { CONTACT } from "@/config/contact";
import { ROUTES } from "@/config/routes";
import TiltCard from "@/components/TiltCard";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] as const },
});

const CHANNEL_ICONS = [
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  ),
  (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  ),
];

const CHANNEL_HREFS = [
  `mailto:${CONTACT.EMAIL_GENERAL}`,
  `mailto:${CONTACT.EMAIL_PRIVACY}`,
  `mailto:${CONTACT.EMAIL_DPO}`,
  `mailto:${CONTACT.EMAIL_LEGAL}`,
  `mailto:${CONTACT.EMAIL_SECURITY}`,
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "16px",
  background: `rgba(var(--card-bg-rgb),0.5)`,
  border: `1px solid var(--border-subtle)`,
  color: "var(--foreground)",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputFocusRing = "focus:border-[rgba(var(--accent-rgb),0.5)] focus:shadow-[0_0_0_3px_rgba(var(--accent-rgb),0.1)]";

export default function ContatoPage() {
  const t = useTranslations("contato");
  const [assunto, setAssunto] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
            >
              {t("breadcrumbHome")}
            </Link>
            <span style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}>
              &gt;
            </span>
            <span style={{ color: "var(--text-accent)" }}>{t("breadcrumbCurrent")}</span>
          </nav>

          <motion.p
            {...fadeUp(0)}
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {t("sectionLabel")}
          </motion.p>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("title")}
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 text-lg leading-relaxed max-w-xl"
            style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-[120px]"
          style={{ background: `linear-gradient(to top, var(--background), transparent)` }}
        />
      </section>

      {/* ── Channels ── */}
      <section style={{ background: "var(--background)" }}>
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="space-y-6">
            {CHANNEL_ICONS.map((icon, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.06)}
              >
              <TiltCard
                className="group block rounded-2xl p-6 sm:p-8 transition-all duration-300 hover-lift"
                style={{
                  background: `rgba(var(--card-bg-rgb),0.5)`,
                  border: `1px solid var(--border-subtle)`,
                }}
              >
              <a
                href={CHANNEL_HREFS[i]}
                className="block"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl"
                    style={{
                      background: `rgba(var(--accent-rgb),0.08)`,
                      color: "var(--text-accent)",
                    }}
                  >
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <h3
                        className="text-[16px] font-bold"
                        style={{ color: "var(--foreground)" }}
                      >
                        {t(`channels.${i}.title`)}
                      </h3>
                      <span
                        className="text-[13px] font-semibold"
                        style={{ color: "var(--text-accent)" }}
                      >
                        {[CONTACT.EMAIL_GENERAL, CONTACT.EMAIL_PRIVACY, CONTACT.EMAIL_DPO, CONTACT.EMAIL_LEGAL, CONTACT.EMAIL_SECURITY][i]}
                      </span>
                    </div>

                    <p
                      className="mt-2 text-[14px] leading-relaxed"
                      style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
                    >
                      {t(`channels.${i}.description`)}
                    </p>

                    <p
                      className="mt-3 text-[12px] font-medium"
                      style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
                    >
                      {t(`channels.${i}.response`)}
                    </p>
                  </div>

                  {/* Arrow icon */}
                  <div
                    className="shrink-0 self-center transition-transform duration-300 group-hover:translate-x-1"
                    style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </div>
              </a>
              </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* ── Contact Form ── */}
          <motion.div {...fadeUp(0)} className="mt-20">
            <h2
              className="text-[12px] font-bold uppercase tracking-[0.25em] mb-2"
              style={{ color: "var(--text-accent)" }}
            >
              {t("formTitle")}
            </h2>
            <p
              className="text-[14px] leading-relaxed mb-10"
              style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
            >
              {t("formSubtitle")}
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  className="flex flex-col items-center justify-center rounded-2xl p-12 text-center"
                  style={{
                    background: `rgba(var(--card-bg-rgb),0.5)`,
                    border: `1px solid var(--border-subtle)`,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-16 h-16 rounded-full mb-6"
                    style={{
                      background: `rgba(var(--accent-rgb),0.1)`,
                      color: "var(--text-accent)",
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    {t("successTitle")}
                  </h3>
                  <p
                    className="text-[14px] leading-relaxed max-w-sm"
                    style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
                  >
                    {t("successMessage")}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Assunto */}
                  <div>
                    <label
                      htmlFor="assunto"
                      className="block text-[13px] font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {t("subjectLabel")}
                    </label>
                    <select
                      id="assunto"
                      value={assunto}
                      onChange={(e) => setAssunto(e.target.value)}
                      required
                      className={inputFocusRing}
                      style={{
                        ...inputStyle,
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 16px center",
                        paddingRight: "44px",
                      }}
                    >
                      <option value="" disabled>
                        {t("subjectPlaceholder")}
                      </option>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <option key={i} value={t(`subjectOptions.${i}`)}>
                          {t(`subjectOptions.${i}`)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nome */}
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-[13px] font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {t("nameLabel")}
                    </label>
                    <input
                      id="nome"
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                      placeholder={t("namePlaceholder")}
                      className={inputFocusRing}
                      style={inputStyle}
                    />
                  </div>

                  {/* E-mail */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[13px] font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {t("emailLabel")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={t("emailPlaceholder")}
                      className={inputFocusRing}
                      style={inputStyle}
                    />
                  </div>

                  {/* Mensagem */}
                  <div>
                    <label
                      htmlFor="mensagem"
                      className="block text-[13px] font-medium mb-2"
                      style={{ color: "var(--foreground)" }}
                    >
                      {t("messageLabel")}
                    </label>
                    <textarea
                      id="mensagem"
                      value={mensagem}
                      onChange={(e) => setMensagem(e.target.value)}
                      required
                      rows={5}
                      placeholder={t("messagePlaceholder")}
                      className={inputFocusRing}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        minHeight: "120px",
                      }}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="relative overflow-hidden rounded-2xl px-8 py-4 text-[15px] font-bold transition-all duration-300 hover-glow"
                    style={{
                      background: "var(--accent)",
                      color: "var(--accent-foreground)",
                      width: "100%",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {/* Shine sweep */}
                    <span
                      className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)",
                        transform: "translateX(-100%)",
                        animation: "none",
                      }}
                    />
                    <style>{`
                      .hover-glow:hover > span:first-of-type {
                        animation: shineSweep 0.8s ease forwards !important;
                        opacity: 1 !important;
                      }
                      @keyframes shineSweep {
                        from { transform: translateX(-100%); }
                        to { transform: translateX(100%); }
                      }
                      .hover-glow:hover {
                        box-shadow: 0 0 30px rgba(var(--accent-rgb),0.3);
                      }
                    `}</style>
                    {t("submitButton")}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Important notice ── */}
          <motion.div
            {...fadeUp(0)}
            className="mt-16 rounded-2xl p-6 sm:p-8"
            style={{
              background: `rgba(var(--accent-rgb),0.04)`,
              border: `1px solid rgba(var(--accent-rgb),0.1)`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="shrink-0 mt-0.5"
                style={{ color: "var(--text-accent)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>

              <div>
                <p
                  className="text-[14px] font-bold"
                  style={{ color: "var(--foreground)" }}
                >
                  {t("emergencyTitle")}
                </p>
                <p
                  className="mt-2 text-[13px] leading-relaxed"
                  style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
                >
                  {t("emergencyBody", { appName: APP_NAME })}
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  {[
                    { number: CONTACT.EMERGENCY_POLICE, label: t("emergency190") },
                    { number: CONTACT.EMERGENCY_SAMU, label: t("emergency192") },
                    { number: CONTACT.EMERGENCY_FIRE, label: t("emergency193") },
                    { number: CONTACT.EMERGENCY_WOMEN, label: t("emergency180") },
                  ].map((emergency) => (
                    <div key={emergency.number} className="flex items-center gap-2">
                      <span
                        className="text-[18px] font-black tabular-nums"
                        style={{ color: "var(--text-accent)" }}
                      >
                        {emergency.number}
                      </span>
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
                      >
                        {emergency.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Address ── */}
          <motion.div {...fadeUp(0)} className="mt-16">
            <h3
              className="text-[12px] font-bold uppercase tracking-[0.25em] mb-6"
              style={{ color: "var(--text-accent)" }}
            >
              {t("addressTitle")}
            </h3>
            <p
              className="text-[14px] leading-[1.8]"
              style={{ color: `rgba(var(--text-rgb),var(--text-muted))` }}
            >
              {CONTACT.COMPANY_NAME}
              <br />
              CNPJ: {CONTACT.CNPJ}
              <br />
              {CONTACT.ADDRESS}
              <br />
              {CONTACT.CITY}
            </p>
          </motion.div>

          <div
            className="h-px mt-20 mb-10"
            style={{ background: "var(--border-subtle)" }}
          />

          <div className="flex items-center justify-between">
            <p
              className="text-[13px]"
              style={{ color: `rgba(var(--text-rgb),var(--text-faint))` }}
            >
              {t("seeAlso")}
            </p>
            <div className="flex gap-6">
              {[
                { label: t("linkTerms"), href: ROUTES.TERMS },
                { label: t("linkPrivacy"), href: ROUTES.PRIVACY },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-medium transition-colors duration-200"
                  style={{ color: "var(--text-accent)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Back to top button ── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              boxShadow: "0 4px 20px rgba(var(--accent-rgb),0.3)",
              border: "none",
            }}
            aria-label={t("backToTop")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
