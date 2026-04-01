import { describe, it, expect } from "vitest";
import { routing } from "@/i18n/routing";

describe("i18n routing config", () => {
  it("should have pt as default locale", () => {
    expect(routing.defaultLocale).toBe("pt");
  });

  it("should include all 6 supported locales", () => {
    expect(routing.locales).toContain("pt");
    expect(routing.locales).toContain("en");
    expect(routing.locales).toContain("es");
    expect(routing.locales).toContain("pt-PT");
    expect(routing.locales).toContain("de");
    expect(routing.locales).toContain("fr");
    expect(routing.locales).toHaveLength(6);
  });

  it("should use localePrefix never", () => {
    expect(routing.localePrefix).toBe("never");
  });

  it("should have a matching message file for each locale", async () => {
    for (const locale of routing.locales) {
      const messages = await import(`../../../messages/${locale}.json`);
      expect(messages.default).toBeDefined();
      expect(typeof messages.default).toBe("object");
    }
  });
});
