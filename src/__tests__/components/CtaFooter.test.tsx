import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CtaFooter from "@/components/network/CtaFooter";

describe("CtaFooter", () => {
  it("renders narrative paragraphs", () => {
    render(<CtaFooter />);
    expect(screen.getByText("ctaFooter.narrative1")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.narrative2")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.narrative2Bold")).toBeInTheDocument();
  });

  it("renders narrative3 with appName param interpolated", () => {
    render(<CtaFooter />);
    // t("narrative3", { appName: APP_NAME }) => text contains "ctaFooter.narrative3"
    // The parent <p> contains both narrative3 and narrative3Bold
    const elements = screen.getAllByText(/ctaFooter\.narrative3/);
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders remaining narrative paragraphs", () => {
    render(<CtaFooter />);
    expect(screen.getByText("ctaFooter.narrative3Bold")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.narrative4")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.narrative5")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.narrative5Accent")).toBeInTheDocument();
  });

  it("renders gradient text on narrative2Bold and narrative5Accent", () => {
    render(<CtaFooter />);
    const bold = screen.getByText("ctaFooter.narrative2Bold");
    expect(bold.className).toContain("gradient-text");
    const accent = screen.getByText("ctaFooter.narrative5Accent");
    expect(accent.className).toContain("gradient-text-accent");
  });

  it("renders CTA section with label, title, body", () => {
    render(<CtaFooter />);
    expect(screen.getByText("ctaFooter.ctaLabel")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.ctaTitle")).toBeInTheDocument();
    expect(screen.getByText("ctaFooter.ctaBody")).toBeInTheDocument();
  });

  it("renders CTA download button as link", () => {
    render(<CtaFooter />);
    const button = screen.getByText("ctaFooter.ctaButton");
    expect(button.closest("a")).toHaveAttribute("href", "#");
  });

  it("renders CTA note text", () => {
    render(<CtaFooter />);
    expect(screen.getByText("ctaFooter.ctaNote")).toBeInTheDocument();
  });

  it("renders footer with 3 links to correct paths", () => {
    render(<CtaFooter />);
    const terms = screen.getByText("ctaFooter.footerTerms");
    const privacy = screen.getByText("ctaFooter.footerPrivacy");
    const contact = screen.getByText("ctaFooter.footerContact");

    expect(terms.closest("a")).toHaveAttribute("href", "/terms");
    expect(privacy.closest("a")).toHaveAttribute("href", "/privacy");
    expect(contact.closest("a")).toHaveAttribute("href", "/contact");
  });

  it("renders copyright with correct year and name", () => {
    render(<CtaFooter />);
    const copyright = screen.getByText(/© 2026 Viicus/);
    expect(copyright).toBeInTheDocument();
  });

  it("renders section transition gradient", () => {
    const { container } = render(<CtaFooter />);
    const gradient = container.querySelector('.pointer-events-none.absolute');
    expect(gradient).toBeInTheDocument();
  });

  it("renders glowing accent line above CTA", () => {
    const { container } = render(<CtaFooter />);
    const glowLine = container.querySelector('.h-px.w-16');
    expect(glowLine).toBeInTheDocument();
  });
});
