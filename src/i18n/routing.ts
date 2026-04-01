import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pt", "en", "es", "pt-PT", "de", "fr"],
  defaultLocale: "pt",
  localePrefix: "never",
});
