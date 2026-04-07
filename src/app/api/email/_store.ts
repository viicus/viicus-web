// In-memory mock store for email preferences (used while real backend is not ready).
// Persists for the lifetime of the Next.js process. Resets on redeploy.

export type EmailCategory =
  | "security"
  | "account"
  | "moderation"
  | "social";

export const ALL_CATEGORIES: EmailCategory[] = [
  "security",
  "account",
  "moderation",
  "social",
];

export const REQUIRED_CATEGORIES: EmailCategory[] = ["security"];

export type EmailPreferences = Record<EmailCategory, boolean>;

export type TokenPayload = {
  email: string;
  category: EmailCategory;
  issuedAt: number;
};

type Store = {
  prefsByEmail: Map<string, EmailPreferences>;
  tokens: Map<string, TokenPayload>;
};

const globalKey = "__viicus_email_mock_store__";
const g = globalThis as unknown as { [k: string]: Store | undefined };

export function getStore(): Store {
  if (!g[globalKey]) {
    g[globalKey] = {
      prefsByEmail: new Map(),
      tokens: new Map(),
    };
  }
  return g[globalKey]!;
}

export function defaultPrefs(): EmailPreferences {
  return {
    security: true,
    account: true,
    moderation: true,
    social: true,
  };
}

export function getOrCreatePrefs(email: string): EmailPreferences {
  const store = getStore();
  let prefs = store.prefsByEmail.get(email);
  if (!prefs) {
    prefs = defaultPrefs();
    store.prefsByEmail.set(email, prefs);
  }
  return prefs;
}

export function setPref(
  email: string,
  category: EmailCategory,
  enabled: boolean,
): EmailPreferences {
  if (REQUIRED_CATEGORIES.includes(category)) {
    enabled = true;
  }
  const prefs = getOrCreatePrefs(email);
  prefs[category] = enabled;
  getStore().prefsByEmail.set(email, prefs);
  return prefs;
}

export function createToken(
  email: string,
  category: EmailCategory,
): string {
  const store = getStore();
  const token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  store.tokens.set(token, { email, category, issuedAt: Date.now() });
  return token;
}

export function readToken(token: string | null): TokenPayload | null {
  if (!token) return null;
  return getStore().tokens.get(token) ?? null;
}
