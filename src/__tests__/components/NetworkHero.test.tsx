import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NetworkHero from "@/components/network/NetworkHero";

describe("NetworkHero", () => {
  it("renders a full-screen hero section", () => {
    const { container } = render(<NetworkHero />);
    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
    expect(section?.className).toContain("h-screen");
  });

  it("embeds the NetworkCanvas component", () => {
    const { container } = render(<NetworkHero />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("renders badge with translation key", () => {
    render(<NetworkHero />);
    expect(screen.getByText("hero.badge")).toBeInTheDocument();
  });

  it("renders both title lines", () => {
    render(<NetworkHero />);
    expect(screen.getByText("hero.titleLine1")).toBeInTheDocument();
    expect(screen.getByText("hero.titleLine2Accent")).toBeInTheDocument();
    expect(screen.getByText("hero.titleLine2Rest")).toBeInTheDocument();
  });

  it("applies gradient styling to accent title", () => {
    render(<NetworkHero />);
    const accent = screen.getByText("hero.titleLine2Accent");
    expect(accent.className).toContain("bg-gradient-to-r");
    expect(accent.className).toContain("bg-clip-text");
    expect(accent.className).toContain("text-transparent");
  });

  it("renders subtitle", () => {
    render(<NetworkHero />);
    expect(screen.getByText("hero.subtitle")).toBeInTheDocument();
  });

  it("renders primary CTA as button and secondary as link", () => {
    render(<NetworkHero />);
    const primary = screen.getByText("hero.ctaPrimary");
    expect(primary.tagName).toBe("BUTTON");

    const secondary = screen.getByText("hero.ctaSecondary");
    expect(secondary.closest("a")).toHaveAttribute("href", "/how-it-works");
  });

  it("passes translations to NetworkCanvas (canvas renders)", () => {
    const { container } = render(<NetworkHero />);
    // Canvas should be initialized and requesting animation frames
    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it("accepts custom personCount", () => {
    const { container } = render(<NetworkHero personCount={30} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });

  it("has z-indexed content layer above canvas", () => {
    const { container } = render(<NetworkHero />);
    const contentDiv = container.querySelector(".z-20");
    expect(contentDiv).toBeInTheDocument();
    // Canvas should be in a lower z-layer
  });

  it("renders edge fade gradients", () => {
    const { container } = render(<NetworkHero />);
    // Bottom, top, left, right edge fades
    const fades = container.querySelectorAll(".pointer-events-none.absolute");
    expect(fades.length).toBeGreaterThanOrEqual(4);
  });
});
