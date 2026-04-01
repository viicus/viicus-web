describe("Internationalization", () => {
  it("loads with default PT locale", () => {
    cy.visit("/");
    cy.get("header").contains("PT-BR").should("be.visible");
  });

  it("switches to English via cookie", () => {
    cy.setLocale("en");
    cy.visit("/");
    cy.get("header").contains("EN").should("be.visible");
  });

  it("switches to Spanish via cookie", () => {
    cy.setLocale("es");
    cy.visit("/");
    cy.get("header").contains("ES").should("be.visible");
  });

  it("switches to German via cookie", () => {
    cy.setLocale("de");
    cy.visit("/");
    cy.get("header").contains("DE").should("be.visible");
  });

  it("switches to French via cookie", () => {
    cy.setLocale("fr");
    cy.visit("/");
    cy.get("header").contains("FR").should("be.visible");
  });

  it("switches to PT-PT via cookie", () => {
    cy.setLocale("pt-PT");
    cy.visit("/");
    cy.get("header").contains("PT-PT").should("be.visible");
  });

  it("all secondary pages load with English locale", () => {
    cy.setLocale("en");
    const pages = [
      "/how-it-works",
      "/what-happens",
      "/verification",
      "/terms",
      "/privacy",
      "/contact",
    ];
    for (const page of pages) {
      cy.visit(page);
      cy.get("main").should("exist");
      // Should show EN in nav
      cy.get("header").contains("EN").should("exist");
    }
  });

  it("switches language via desktop dropdown and navigates", () => {
    cy.viewport(1280, 720);
    cy.visit("/");

    // Open dropdown
    cy.contains("PT-BR").click();
    cy.contains("English").should("be.visible");

    // Click English
    cy.contains("English").click();

    // Should have navigated - page should still work
    cy.get("main").should("exist");
    cy.get("canvas").should("exist");
  });

  it("switches language via mobile menu", () => {
    cy.viewport(375, 812);
    cy.visit("/");

    // Open mobile menu
    cy.get('button[aria-label="Toggle menu"]').click();

    // Click EN
    cy.get("button").contains("EN").click();

    // Page should still work
    cy.get("main").should("exist");
  });

  it("preserves locale across page navigation", () => {
    cy.setLocale("en");
    cy.visit("/");
    cy.get("header").contains("EN").should("be.visible");

    // Navigate to a secondary page
    cy.get('a[href*="how-it-works"]').first().click();
    cy.url().should("include", "how-it-works");
    cy.get("main").should("exist");
  });

  it("all 6 locales have working home page", () => {
    const locales = ["pt", "en", "es", "pt-PT", "de", "fr"];
    for (const locale of locales) {
      cy.setLocale(locale);
      cy.visit("/");
      cy.get("main").should("exist");
      cy.get("canvas").should("exist");
      cy.get("h1, [class*='text-5xl'], [class*='text-7xl']").should("exist");
    }
  });
});
