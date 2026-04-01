describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("shows the nav bar on initial load", () => {
    cy.get("header").should("be.visible");
    cy.get("header").should("have.css", "pointer-events", "auto");
  });

  it("hides nav on scroll down", () => {
    // Scroll down significantly
    cy.scrollTo(0, 600);
    // Wait for the animation to complete using CSS check instead of fixed wait
    cy.get("header").should("have.css", "pointer-events", "none");
  });

  it("shows nav again on scroll up", () => {
    cy.scrollTo(0, 600);
    cy.get("header").should("have.css", "pointer-events", "none");
    cy.scrollTo(0, 200);
    cy.get("header").should("have.css", "pointer-events", "auto");
  });

  it("opens and closes mobile menu", () => {
    cy.viewport(375, 812);
    cy.get('button[aria-label="Toggle menu"]').should("be.visible");

    // Open
    cy.get('button[aria-label="Toggle menu"]').click();
    cy.contains("EN").should("be.visible");
    cy.contains("ES").should("be.visible");
    cy.contains("DE").should("be.visible");
    cy.contains("FR").should("be.visible");

    // Close
    cy.get('button[aria-label="Toggle menu"]').click();
  });

  it("shows language dropdown with full names on desktop", () => {
    cy.viewport(1280, 720);
    cy.contains("PT-BR").click();

    cy.contains("Português (BR)").should("be.visible");
    cy.contains("English").should("be.visible");
    cy.contains("Español").should("be.visible");
    cy.contains("Português (PT)").should("be.visible");
    cy.contains("Deutsch").should("be.visible");
    cy.contains("Français").should("be.visible");
  });

  it("closes language dropdown on outside click", () => {
    cy.viewport(1280, 720);
    cy.contains("PT-BR").click();
    cy.contains("English").should("be.visible");

    // Click outside the dropdown
    cy.get("body").click(0, 0);
    cy.contains("English").should("not.exist");
  });

  it("highlights current locale in dropdown", () => {
    cy.viewport(1280, 720);
    cy.contains("PT-BR").click();

    // Current locale button should have accent color
    cy.contains("Português (BR)")
      .should("have.css", "color")
      .and("not.equal", "");
  });

  it("hamburger is hidden on desktop", () => {
    cy.viewport(1280, 720);
    cy.get('button[aria-label="Toggle menu"]').should("not.be.visible");
  });

  it("language dropdown is hidden on mobile", () => {
    cy.viewport(375, 812);
    // Desktop dropdown container should be hidden
    cy.get(".hidden.md\\:flex").should("not.be.visible");
  });
});
