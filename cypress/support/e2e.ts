// Cypress E2E support file

// Disable uncaught exception failures (Next.js hydration can throw)
Cypress.on("uncaught:exception", () => false);

// Custom command: set locale cookie
Cypress.Commands.add("setLocale", (locale: string) => {
  cy.setCookie("NEXT_LOCALE", locale);
});

// Type declarations
declare global {
  namespace Cypress {
    interface Chainable {
      setLocale(locale: string): Chainable<void>;
    }
  }
}
