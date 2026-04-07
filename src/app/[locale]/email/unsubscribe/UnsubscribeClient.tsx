"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/config/routes";
import { APP_NAME } from "@/config/app-config";

type State =
  | { status: "loading" }
  | { status: "missing_token" }
  | { status: "error"; message?: string }
  | {
      status: "done";
      email: string;
      category: string;
    }
  | {
      status: "reactivated";
      email: string;
      category: string;
    };

export default function UnsubscribeClient() {
  const t = useTranslations("emailUnsubscribe");
  const tCat = useTranslations("emailCategories");
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ status: "missing_token" });
      return;
    }
    let cancelled = false;
    fetch(`/api/email/unsubscribe?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
    })
      .then(async (r) => {
        if (cancelled) return;
        if (!r.ok) {
          const body = await r.json().catch(() => ({}));
          setState({ status: "error", message: body?.error });
          return;
        }
        const body = await r.json();
        setState({
          status: "done",
          email: body.email,
          category: body.category,
        });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function reactivate() {
    if (state.status !== "done") return;
    const r = await fetch(
      `/api/email/preferences?token=${encodeURIComponent(token!)}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ category: state.category, enabled: true }),
      },
    );
    if (r.ok) {
      setState({
        status: "reactivated",
        email: state.email,
        category: state.category,
      });
    }
  }

  return (
    <main
      className="noise-overlay min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--background)" }}
    >
      <div className="relative w-full max-w-xl">
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2"
          style={{
            width: "min(90vw, 600px)",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(var(--accent-rgb),0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="relative z-10 rounded-2xl px-8 py-12 sm:px-12 sm:py-16"
          style={{
            background: "rgba(var(--card-bg-rgb),0.5)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <p
            className="text-[12px] font-bold uppercase tracking-[0.25em]"
            style={{ color: "var(--text-accent)" }}
          >
            {APP_NAME}
          </p>

          {state.status === "loading" && (
            <Heading title={t("loadingTitle")} body={t("loadingBody")} />
          )}

          {state.status === "missing_token" && (
            <Heading
              title={t("missingTitle")}
              body={t("missingBody")}
              accent={t("missingTitleAccent")}
            />
          )}

          {state.status === "error" && (
            <Heading
              title={t("errorTitle")}
              body={t("errorBody")}
              accent={t("errorTitleAccent")}
            />
          )}

          {state.status === "done" && (
            <>
              <Heading
                title={t("doneTitle")}
                accent={t("doneTitleAccent")}
                body={t("doneBody", {
                  email: state.email,
                  category: tCat(state.category),
                })}
              />
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={reactivate}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--foreground)",
                  }}
                >
                  {t("ctaReactivate")}
                </button>
                <Link
                  href={`${ROUTES.EMAIL_PREFERENCES}?token=${encodeURIComponent(
                    token!,
                  )}`}
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer hover-glow"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-foreground)",
                    boxShadow: "0 4px 24px var(--accent-glow)",
                  }}
                >
                  {t("ctaManage")}
                </Link>
              </div>
            </>
          )}

          {state.status === "reactivated" && (
            <Heading
              title={t("reactivatedTitle")}
              accent={t("reactivatedTitleAccent")}
              body={t("reactivatedBody", {
                category: tCat(state.category),
              })}
            />
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

function Heading({
  title,
  accent,
  body,
}: {
  title: string;
  accent?: string;
  body?: string;
}) {
  return (
    <>
      <h1
        className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight leading-tight"
        style={{ color: "var(--foreground)" }}
      >
        {title}
        {accent && (
          <>
            {" "}
            <span className="gradient-text-accent">{accent}</span>
          </>
        )}
      </h1>
      {body && (
        <p
          className="mt-6 text-[15px] sm:text-base leading-relaxed"
          style={{ color: "rgba(var(--text-rgb),var(--text-muted))" }}
        >
          {body}
        </p>
      )}
    </>
  );
}
