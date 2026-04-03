"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { APP_NAME } from "@/config/app-config";
import { ROUTES } from "@/config/routes";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: "var(--hero-bg)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="text-center max-w-md"
      >
        <p
          className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter"
          style={{ color: "rgba(var(--accent-rgb),0.12)" }}
        >
          404
        </p>

        <h1
          className="-mt-4 text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          Página não encontrada
        </h1>

        <p
          className="mt-4 text-[15px] leading-relaxed"
          style={{ color: "rgba(var(--text-rgb),var(--text-muted))" }}
        >
          Essa rota não existe no {APP_NAME}. Talvez o link esteja errado ou a
          página tenha sido movida.
        </p>

        <motion.div className="mt-10" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-shadow duration-300"
            style={{
              background: "var(--accent)",
              color: "var(--accent-foreground)",
              boxShadow: "0 2px 16px var(--accent-glow)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar ao início
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
