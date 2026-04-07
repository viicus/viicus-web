"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/config/app-config";

type Category = "security" | "account" | "moderation" | "social";

type Prefs = Record<Category, boolean>;

type State =
  | { status: "loading" }
  | { status: "missing_token" }
  | { status: "error"; message?: string }
  | { status: "ready"; email: string; preferences: Prefs };

const REQUIRED: Category[] = ["security"];
const ORDER: Category[] = ["security", "account", "moderation", "social"];

export default function PreferencesClient() {
  const t = useTranslations("emailPreferences");
  const tCat = useTranslations("emailCategories");
  const tDesc = useTranslations("emailCategoryDescriptions");
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ status: "loading" });
  const [savingKey, setSavingKey] = useState<Category | null>(null);

  useEffect(() => {
    if (!token) {
      setState({ status: "missing_token" });
      return;
    }
    let cancelled = false;
    fetch(`/api/email/preferences?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        if (cancelled) return;
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          setState({ status: "error", message: body?.error });
          return;
        }
        const body = await r.json();
        setState({
          status: "ready",
          email: body.email,
          preferences: body.preferences,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function toggle(category: Category, enabled: boolean) {
    if (REQUIRED.includes(category)) return;
    if (state.status !== "ready") return;
    setSavingKey(category);
    const optimistic: Prefs = { ...state.preferences, [category]: enabled };
    setState({ ...state, preferences: optimistic });
    try {
      const r = await fetch(
        `/api/email/preferences?token=${encodeURIComponent(token!)}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ category, enabled }),
        },
      );
      if (r.ok) {
        const body = await r.json();
        setState({
          status: "ready",
          email: body.email,
          preferences: body.preferences,
        });
      }
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <main
      className="noise-overlay min-h-screen px-6 py-24"
      style={{ background: "var(--background)" }}
    >
      <div className="relative mx-auto max-w-2xl">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2"
          style={{
            width: "min(90vw, 700px)",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10"
        >
          <p
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {APP_NAME}
          </p>
          <h1
            className="mt-6 text-3xl sm:text-5xl font-bold tracking-tight leading-tight"
            style={{ color: "var(--foreground)" }}
          >
            {t("title")}{" "}
            <span className="gradient-text-accent">{t("titleAccent")}</span>
          </h1>
          <p
            className="mt-6 text-[15px] sm:text-base leading-relaxed"
            style={{ color: "rgba(var(--text-rgb),var(--text-muted))" }}
          >
            {t("subtitle")}
          </p>

          {state.status === "loading" && (
            <p
              className="mt-12 text-[14px]"
              style={{ color: "rgba(var(--text-rgb),var(--text-faint))" }}
            >
              {t("loading")}
            </p>
          )}

          {state.status === "missing_token" && (
            <ErrorBox title={t("missingTitle")} body={t("missingBody")} />
          )}

          {state.status === "error" && (
            <ErrorBox title={t("errorTitle")} body={t("errorBody")} />
          )}

          {state.status === "ready" && (
            <>
              <p
                className="mt-10 text-[13px]"
                style={{ color: "rgba(var(--text-rgb),var(--text-faint))" }}
              >
                {t("signedInAs")}{" "}
                <span style={{ color: "var(--foreground)" }}>{state.email}</span>
              </p>

              <div
                className="mt-6 rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(var(--card-bg-rgb),0.5)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                {ORDER.map((cat, i) => {
                  const required = REQUIRED.includes(cat);
                  const enabled = state.preferences[cat];
                  return (
                    <div
                      key={cat}
                      className="flex items-start gap-4 px-6 py-5"
                      style={{
                        borderBottom:
                          i < ORDER.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className="text-[15px] font-bold"
                            style={{ color: "var(--foreground)" }}
                          >
                            {tCat(cat)}
                          </h3>
                          {required && (
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                              style={{
                                background: "rgba(var(--accent-rgb),0.12)",
                                color: "var(--text-accent)",
                              }}
                            >
                              {t("required")}
                            </span>
                          )}
                        </div>
                        <p
                          className="mt-1.5 text-[13px] leading-relaxed"
                          style={{
                            color: "rgba(var(--text-rgb),var(--text-muted))",
                          }}
                        >
                          {tDesc(cat)}
                        </p>
                      </div>
                      <Toggle
                        checked={enabled}
                        disabled={required || savingKey === cat}
                        onChange={(v) => toggle(cat, v)}
                        label={tCat(cat)}
                      />
                    </div>
                  );
                })}
              </div>

              <p
                className="mt-6 text-[12px]"
                style={{ color: "rgba(var(--text-rgb),var(--text-faint))" }}
              >
                {t("autosave")}
              </p>
            </>
          )}

          <div
            className="mt-12 pt-6 text-[12px]"
            style={{
              borderTop: "1px solid var(--border-subtle)",
              color: "rgba(var(--text-rgb),var(--text-faint))",
            }}
          >
            {t("footer")}{" "}
            <Link
              href={ROUTES.PRIVACY}
              className="underline"
              style={{ color: "var(--text-accent)" }}
            >
              {t("footerPrivacy")}
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function ErrorBox({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="mt-12 rounded-2xl px-6 py-6"
      style={{
        background: "rgba(var(--card-bg-rgb),0.5)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <h2
        className="text-lg font-bold"
        style={{ color: "var(--foreground)" }}
      >
        {title}
      </h2>
      <p
        className="mt-2 text-[14px] leading-relaxed"
        style={{ color: "rgba(var(--text-rgb),var(--text-muted))" }}
      >
        {body}
      </p>
    </div>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
      style={{
        background: checked
          ? "var(--accent)"
          : "rgba(var(--text-rgb),0.18)",
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: checked ? "0 0 16px var(--accent-glow)" : "none",
      }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200"
        style={{
          transform: checked ? "translateX(22px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}
