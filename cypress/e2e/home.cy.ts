describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads with main element and noise overlay", () => {
    cy.get("main.noise-overlay").should("exist");
  });

  it("renders the navigation bar with app name", () => {
    cy.get("header").should("be.visible");
    cy.get("header").contains("Viicus").should("be.visible");
  });

  it("renders the hero section with canvas", () => {
    cy.get("section").first().should("exist");
    cy.get("canvas")
      .should("exist")
      .and("be.visible")
      .and("have.prop", "width")
      .and("be.greaterThan", 0);
  });

  it("renders hero CTA buttons", () => {
    cy.get("section").first().within(() => {
      cy.get("button").should("have.length.at.least", 1);
      cy.get('a[href*="how-it-works"]')
        .should("exist")
        .and("have.text.length.gt", 0);
    });
  });

  it("scrolls through all sections without errors", () => {
    cy.scrollTo("bottom", { duration: 2000 });
    cy.get("main").should("exist");
  });

  it("renders footer links that navigate correctly", () => {
    cy.scrollTo("bottom", { duration: 1000 });
    cy.get('a[href*="terms"]').should("exist").and("have.text.length.gt", 0);
    cy.get('a[href*="privacy"]').should("exist");
    cy.get('a[href*="contact"]').should("exist");
  });

  it("renders copyright in footer", () => {
    cy.scrollTo("bottom", { duration: 1000 });
    cy.contains("2026").should("exist");
    cy.contains("Viicus").should("exist");
  });
});
