import { describe, it, expect } from "vitest";
import { APP_NAME, APP_YEAR } from "@/config/app-config";

describe("App config", () => {
  it("APP_NAME should be defined and non-empty", () => {
    expect(APP_NAME).toBeDefined();
    expect(typeof APP_NAME).toBe("string");
    expect(APP_NAME.length).toBeGreaterThan(0);
  });

  it("APP_YEAR should be a valid year number", () => {
    expect(APP_YEAR).toBeDefined();
    expect(typeof APP_YEAR).toBe("number");
    expect(APP_YEAR).toBeGreaterThanOrEqual(2024);
    expect(APP_YEAR).toBeLessThanOrEqual(2030);
  });
});
