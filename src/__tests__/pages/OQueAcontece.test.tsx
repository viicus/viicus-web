import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OQueAcontecePage from "@/app/[locale]/what-happens/page";

describe("OQueAcontecePage", () => {
  it("renders main with noise-overlay", () => {
    const { container } = render(<OQueAcontecePage />);
    expect(container.querySelector("main.noise-overlay")).toBeInTheDocument();
  });

  it("renders back link to home", () => {
    render(<OQueAcontecePage />);
    const back = screen.getByText("oQueAcontece.back");
    expect(back.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders hero title with accent", () => {
    render(<OQueAcontecePage />);
    expect(screen.getByText("oQueAcontece.heroTitle")).toBeInTheDocument();
    const accent = screen.getByText("oQueAcontece.heroTitleAccent");
    expect(accent.className).toContain("gradient-text-accent");
  });

  it("renders section label and subtitle", () => {
    render(<OQueAcontecePage />);
    expect(screen.getByText("oQueAcontece.sectionLabel")).toBeInTheDocument();
    expect(screen.getByText("oQueAcontece.heroSubtitle")).toBeInTheDocument();
  });

  it("renders 8 categories with tag, title, body", () => {
    render(<OQueAcontecePage />);
    for (let i = 0; i < 8; i++) {
      expect(screen.getByText(`oQueAcontece.categories.${i}.tag`)).toBeInTheDocument();
      expect(screen.getByText(`oQueAcontece.categories.${i}.title`)).toBeInTheDocument();
      expect(screen.getByText(`oQueAcontece.categories.${i}.body`)).toBeInTheDocument();
    }
  });

  it("renders 3 examples per category (24 total)", () => {
    render(<OQueAcontecePage />);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 3; j++) {
        expect(screen.getByText(`oQueAcontece.categories.${i}.examples.${j}`)).toBeInTheDocument();
      }
    }
  });

  it("renders category emojis", () => {
    render(<OQueAcontecePage />);
    for (let i = 0; i < 8; i++) {
      expect(screen.getByText(`oQueAcontece.categories.${i}.emoji`)).toBeInTheDocument();
    }
  });

  it("renders checkmark SVGs in examples", () => {
    const { container } = render(<OQueAcontecePage />);
    // Each example has a checkmark polyline "22 4 12 14.01 9 11.01"
    const checkmarks = container.querySelectorAll('polyline[points="22 4 12 14.01 9 11.01"]');
    expect(checkmarks.length).toBe(24); // 8 categories × 3 examples
  });

  it("renders dividers between categories (not after last)", () => {
    const { container } = render(<OQueAcontecePage />);
    // Categories rendered with borderBottom except last
    const categorySections = container.querySelectorAll('.py-20');
    expect(categorySections.length).toBe(8);
  });

  it("renders closing section", () => {
    render(<OQueAcontecePage />);
    expect(screen.getByText("oQueAcontece.closingLine1")).toBeInTheDocument();
    expect(screen.getByText("oQueAcontece.closingLine2")).toBeInTheDocument();
    const accent = screen.getByText("oQueAcontece.closingLine2Accent");
    expect(accent.style.color).toBe("var(--accent)");
  });

  it("renders CTA button linking to home", () => {
    render(<OQueAcontecePage />);
    const cta = screen.getByText("oQueAcontece.ctaPrimary");
    expect(cta.closest("a")).toHaveAttribute("href", "/");
  });
});
