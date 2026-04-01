import { describe, it, expect } from "vitest";
import pt from "../../../messages/pt.json";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import ptPT from "../../../messages/pt-PT.json";
import de from "../../../messages/de.json";
import fr from "../../../messages/fr.json";

const locales = { pt, en, es, "pt-PT": ptPT, de, fr };
const localeNames = Object.keys(locales) as (keyof typeof locales)[];

/** Recursively collect all leaf keys from a nested object */
function collectKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...collectKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

/** Collect top-level namespace keys */
function getNamespaces(obj: Record<string, unknown>): string[] {
  return Object.keys(obj).sort();
}

describe("Translation files", () => {
  const ptKeys = collectKeys(pt);
  const ptNamespaces = getNamespaces(pt);

  it("all locale files should be valid JSON objects", () => {
    for (const name of localeNames) {
      expect(typeof locales[name]).toBe("object");
      expect(locales[name]).not.toBeNull();
    }
  });

  it("all locales should have the same namespaces as PT", () => {
    for (const name of localeNames) {
      if (name === "pt") continue;
      const namespaces = getNamespaces(locales[name] as Record<string, unknown>);
      expect(namespaces, `${name} missing namespaces`).toEqual(ptNamespaces);
    }
  });

  it("all locales should have the exact same keys as PT", () => {
    for (const name of localeNames) {
      if (name === "pt") continue;
      const keys = collectKeys(locales[name] as Record<string, unknown>);
      const missingInLocale = ptKeys.filter((k) => !keys.includes(k));
      const extraInLocale = keys.filter((k) => !ptKeys.includes(k));

      expect(missingInLocale, `${name} missing keys`).toEqual([]);
      expect(extraInLocale, `${name} extra keys`).toEqual([]);
    }
  });

  it("no translation value should be empty", () => {
    for (const name of localeNames) {
      const keys = collectKeys(locales[name] as Record<string, unknown>);
      for (const key of keys) {
        const value = key.split(".").reduce(
          (obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>,
          locales[name] as Record<string, unknown>
        );
        expect(value, `${name}.${key} is empty`).toBeTruthy();
      }
    }
  });

  it("contentLength values should be consistent across locales", () => {
    const contentLengthKeys = ptKeys.filter((k) => k.endsWith(".contentLength"));
    for (const key of contentLengthKeys) {
      const ptValue = key.split(".").reduce(
        (obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>,
        pt as Record<string, unknown>
      );
      for (const name of localeNames) {
        if (name === "pt") continue;
        const value = key.split(".").reduce(
          (obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>,
          locales[name] as Record<string, unknown>
        );
        expect(value, `${name}.${key} contentLength mismatch`).toBe(ptValue);
      }
    }
  });

  it("placeholder tokens should be preserved in all locales", () => {
    const placeholders = ["{appName}", "{year}", "{date}"];
    for (const key of ptKeys) {
      const ptValue = key.split(".").reduce(
        (obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>,
        pt as Record<string, unknown>
      ) as string;
      if (typeof ptValue !== "string") continue;

      for (const ph of placeholders) {
        if (!ptValue.includes(ph)) continue;
        for (const name of localeNames) {
          if (name === "pt") continue;
          const value = key.split(".").reduce(
            (obj: Record<string, unknown>, k) => obj?.[k] as Record<string, unknown>,
            locales[name] as Record<string, unknown>
          ) as string;
          expect(value, `${name}.${key} missing placeholder ${ph}`).toContain(ph);
        }
      }
    }
  });

  it("all locales should have required namespaces", () => {
    const required = [
      "nav", "hero", "howItWorks", "features", "community",
      "ctaFooter", "canvas", "common", "termos", "privacidade",
      "contato", "comoFunciona", "oQueAcontece", "verificacao",
    ];
    for (const name of localeNames) {
      const namespaces = getNamespaces(locales[name] as Record<string, unknown>);
      for (const ns of required) {
        expect(namespaces, `${name} missing namespace: ${ns}`).toContain(ns);
      }
    }
  });
});
