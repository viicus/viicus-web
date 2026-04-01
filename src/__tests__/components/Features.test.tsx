import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Features from "@/components/network/Features";

describe("Features", () => {
  it("renders section label", () => {
    render(<Features />);
    expect(screen.getByText("features.sectionLabel")).toBeInTheDocument();
  });

  it("renders title with accent span", () => {
    render(<Features />);
    const title = screen.getByText("features.title");
    const accent = screen.getByText("features.titleAccent");
    expect(title).toBeInTheDocument();
    expect(accent).toBeInTheDocument();
    expect(accent.className).toContain("gradient-text-accent");
  });

  it("renders subtitle", () => {
    render(<Features />);
    expect(screen.getByText("features.subtitle")).toBeInTheDocument();
  });

  it("renders 5 events with tag, text, and body", () => {
    render(<Features />);
    for (let i = 0; i < 5; i++) {
      // Events appear in both desktop and mobile layouts
      const tags = screen.getAllByText(`features.events.${i}.tag`);
      const texts = screen.getAllByText(`features.events.${i}.text`);
      const bodies = screen.getAllByText(`features.events.${i}.body`);
      expect(tags.length).toBeGreaterThanOrEqual(1);
      expect(texts.length).toBeGreaterThanOrEqual(1);
      expect(bodies.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders event emojis", () => {
    const { container } = render(<Features />);
    // Emojis are rendered in the mobile timeline
    const emojis = ["🚨", "🎵", "🏗️", "💬", "🛒"];
    for (const emoji of emojis) {
      expect(container.textContent).toContain(emoji);
    }
  });

  it("renders desktop scroll section with 500vh height", () => {
    const { container } = render(<Features />);
    const scrollSection = container.querySelector('[style*="height: 500vh"]');
    expect(scrollSection).toBeInTheDocument();
  });

  it("renders sticky container for desktop", () => {
    const { container } = render(<Features />);
    const sticky = container.querySelector(".sticky.top-0.h-screen");
    expect(sticky).toBeInTheDocument();
  });

  it("renders mobile timeline with left border", () => {
    const { container } = render(<Features />);
    const mobileTimeline = container.querySelector(".sm\\:hidden");
    expect(mobileTimeline).toBeInTheDocument();
  });

  it("renders SVG path for desktop animation", () => {
    const { container } = render(<Features />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });

  it("renders punchline text", () => {
    render(<Features />);
    expect(screen.getByText("features.punchline1")).toBeInTheDocument();
    expect(screen.getByText("features.punchline2")).toBeInTheDocument();
    expect(screen.getByText("features.punchline2Accent")).toBeInTheDocument();
  });

  it("renders learn more link to o-que-acontece", () => {
    render(<Features />);
    const link = screen.getByText("features.learnMore");
    expect(link.closest("a")).toHaveAttribute("href", "/what-happens");
  });

  it("has transition gradient at top", () => {
    const { container } = render(<Features />);
    const gradients = container.querySelectorAll(".pointer-events-none.absolute");
    expect(gradients.length).toBeGreaterThanOrEqual(1);
  });
});
