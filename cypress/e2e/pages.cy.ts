describe("Secondary Pages", () => {
  describe("Como Funciona", () => {
    beforeEach(() => {
      cy.visit("/how-it-works");
    });

    it("loads with hero section", () => {
      cy.get("main").should("exist");
      cy.get("h1").should("exist").and("have.text.length.gt", 0);
    });

    it("has a back link to home", () => {
      cy.get('a[href="/"]').first().should("exist").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });

    it("renders problems and solutions sections", () => {
      cy.get("h2").should("have.length.at.least", 2);
    });

    it("renders CTA buttons at the bottom", () => {
      cy.scrollTo("bottom", { duration: 1000 });
      cy.get('a[href="/what-happens"]').should("exist");
    });
  });

  describe("O Que Acontece", () => {
    beforeEach(() => {
      cy.visit("/what-happens");
    });

    it("loads with hero section", () => {
      cy.get("main").should("exist");
      cy.get("h1").should("exist").and("have.text.length.gt", 0);
    });

    it("renders all 8 category sections", () => {
      cy.scrollTo("center", { duration: 500 });
      cy.get("h3").should("have.length.at.least", 8);
    });

    it("renders examples with checkmarks", () => {
      cy.get('polyline[points="22 4 12 14.01 9 11.01"]')
        .should("have.length", 24);
    });

    it("has back link to home", () => {
      cy.get('a[href="/"]').first().should("exist");
    });
  });

  describe("Verificacao", () => {
    beforeEach(() => {
      cy.visit("/verification");
    });

    it("loads with hero section", () => {
      cy.get("main").should("exist");
      cy.get("h1").should("exist");
    });

    it("renders verification steps with numbered circles", () => {
      cy.scrollTo(0, 600);
      cy.get("h3").should("have.length.at.least", 5);
    });

    it("renders comparison table", () => {
      cy.scrollTo("bottom", { duration: 1000 });
      // Table header should show app name
      cy.contains("Viicus").should("exist");
    });

    it("has back link to home", () => {
      cy.get('a[href="/"]').first().should("exist");
    });
  });

  describe("Termos", () => {
    beforeEach(() => {
      cy.visit("/terms");
    });

    it("loads with page title and breadcrumbs", () => {
      cy.get("main").should("exist");
      cy.get("h1").should("exist").and("have.text.length.gt", 0);
      cy.get('a[href="/"]').should("exist");
    });

    it("renders accordion sections", () => {
      cy.get("h2").should("have.length.at.least", 10);
    });

    it("expands accordion section on click and shows content", () => {
      // Click the first accordion
      cy.get("h2").first().closest("button").click();
      // Content should become visible (overflow-hidden div gains height)
      cy.get("h2").first().closest("button")
        .parent()
        .find(".overflow-hidden")
        .should("exist");
    });

    it("shows back-to-top button after scrolling", () => {
      cy.scrollTo(0, 600);
      cy.get('[aria-label]').filter(':contains("")')
        .last()
        .should("be.visible");
    });
  });

  describe("Privacidade", () => {
    beforeEach(() => {
      cy.visit("/privacy");
    });

    it("loads with page title", () => {
      cy.get("main").should("exist");
      cy.get("h1").should("exist").and("have.text.length.gt", 0);
    });

    it("renders accordion sections", () => {
      cy.get("h2").should("have.length.at.least", 10);
    });

    it("has sidebar navigation on desktop", () => {
      cy.viewport(1280, 720);
      cy.get("aside").should("be.visible");
      cy.get("aside button").should("have.length", 14);
    });

    it("hides sidebar on mobile", () => {
      cy.viewport(375, 812);
      cy.get("aside").should("not.be.visible");
    });
  });

  describe("Contato", () => {
    beforeEach(() => {
      cy.visit("/contact");
    });

    it("loads with page title", () => {
      cy.get("main").should("exist");
      cy.get("h1").should("exist").and("have.text.length.gt", 0);
    });

    it("renders 5 contact channel cards", () => {
      cy.get('a[href^="mailto:"]').should("have.length", 5);
    });

    it("renders contact form with all required fields", () => {
      cy.scrollTo("center");
      cy.get("form").should("exist");
      cy.get("#assunto").should("exist").and("have.attr", "required");
      cy.get("#nome").should("exist").and("have.attr", "required");
      cy.get("#email").should("exist").and("have.attr", "required");
      cy.get("#mensagem").should("exist").and("have.attr", "required");
    });

    it("validates email field type", () => {
      cy.get("#email").should("have.attr", "type", "email");
    });

    it("submits form and shows success", () => {
      cy.scrollTo("center");
      cy.get("#assunto").select(1);
      cy.get("#nome").type("Test User");
      cy.get("#email").type("test@example.com");
      cy.get("#mensagem").type("Test message");
      cy.get('button[type="submit"]').click();

      // Form should disappear, success should appear
      cy.get("form").should("not.exist");
      // Success checkmark SVG
      cy.get('path[d="M20 6 9 17l-5-5"]').should("exist");
    });

    it("renders emergency numbers", () => {
      cy.scrollTo("bottom", { duration: 500 });
      cy.contains("190").should("exist");
      cy.contains("192").should("exist");
      cy.contains("193").should("exist");
      cy.contains("180").should("exist");
    });

    it("renders footer links", () => {
      cy.scrollTo("bottom", { duration: 500 });
      cy.get('a[href="/terms"]').should("exist");
      cy.get('a[href="/privacy"]').should("exist");
    });
  });
});
