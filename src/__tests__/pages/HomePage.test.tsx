import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/[locale]/page";

describe("HomePage", () => {
  it("renders main element with noise-overlay class", () => {
    const { container } = render(<HomePage />);
    const main = container.querySelector("main");
    expect(main).toBeInTheDocument();
    expect(main?.className).toContain("noise-overlay");
  });

  it("renders NetworkHero with canvas", () => {
    const { container } = render(<HomePage />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("renders hero section", () => {
    render(<HomePage />);
    expect(screen.getByText("hero.badge")).toBeInTheDocument();
    expect(screen.getByText("hero.titleLine1")).toBeInTheDocument();
  });

  it("renders HowItWorks section", () => {
    render(<HomePage />);
    expect(screen.getByText("howItWorks.sectionLabel")).toBeInTheDocument();
  });

  it("renders Features section", () => {
    render(<HomePage />);
    expect(screen.getByText("features.sectionLabel")).toBeInTheDocument();
  });

  it("renders Community section", () => {
    render(<HomePage />);
    expect(screen.getByText("community.sectionLabel")).toBeInTheDocument();
  });

  it("renders CtaFooter with copyright", () => {
    render(<HomePage />);
    expect(screen.getByText(/© 2026 Viicus/)).toBeInTheDocument();
  });

  it("renders all navigation links in footer", () => {
    render(<HomePage />);
    expect(screen.getByText("ctaFooter.footerTerms")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.footerPrivacy")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.footerContact")).toBeInTheDocument();
  });

  it("renders at least 5 sections (hero, howItWorks, features, community, ctaFooter)", () => {
    const { container } = render(<HomePage />);
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThanOrEqual(5);
  });
});
