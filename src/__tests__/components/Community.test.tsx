import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Community from "@/components/network/Community";

describe("Community", () => {
  it("renders section label", () => {
    render(<Community />);
    expect(screen.getByText("community.sectionLabel")).toBeInTheDocument();
  });

  it("renders both title lines", () => {
    render(<Community />);
    expect(screen.getByText("community.title1")).toBeInTheDocument();
    expect(screen.getByText("community.title2")).toBeInTheDocument();
  });

  it("renders body with bold span", () => {
    render(<Community />);
    expect(screen.getByText("community.body")).toBeInTheDocument();
    expect(screen.getByText("community.bodyBold")).toBeInTheDocument();
  });

  it("renders 3 principles with value and sub", () => {
    render(<Community />);
    for (let i = 0; i < 3; i++) {
      expect(screen.getByText(`community.principles.${i}.value`)).toBeInTheDocument();
      expect(screen.getByText(`community.principles.${i}.sub`)).toBeInTheDocument();
    }
  });

  it("renders feed section with header and location", () => {
    render(<Community />);
    expect(screen.getByText("community.feedHeader")).toBeInTheDocument();
    expect(screen.getByText("community.feedLocation")).toBeInTheDocument();
  });

  it("renders feed with live indicator dot", () => {
    const { container } = render(<Community />);
    const pulsingDot = container.querySelector(".animate-pulse");
    expect(pulsingDot).toBeInTheDocument();
  });

  it("renders 7 feed items with text and metadata", () => {
    render(<Community />);
    for (let i = 0; i < 7; i++) {
      expect(screen.getByText(`community.feedItems.${i}.text`)).toBeInTheDocument();
    }
  });

  it("renders feed items with emojis", () => {
    const { container } = render(<Community />);
    const emojis = ["🚨", "🎵", "🆘", "🏗️", "📋", "🛒", "💬"];
    for (const emoji of emojis) {
      expect(container.textContent).toContain(emoji);
    }
  });

  it("renders scroll-driven feed section with 200vh height", () => {
    const { container } = render(<Community />);
    const scrollSection = container.querySelector('[style*="height: 200vh"]');
    expect(scrollSection).toBeInTheDocument();
  });

  it("renders 3 stats with value and label", () => {
    render(<Community />);
    for (let i = 0; i < 3; i++) {
      expect(screen.getByText(`community.stats.${i}.value`)).toBeInTheDocument();
      expect(screen.getByText(`community.stats.${i}.label`)).toBeInTheDocument();
    }
  });

  it("renders closing text", () => {
    render(<Community />);
    expect(screen.getByText("community.closing1")).toBeInTheDocument();
    expect(screen.getByText("community.closing2")).toBeInTheDocument();
  });

  it("renders learn more link to verificacao", () => {
    render(<Community />);
    const link = screen.getByText("community.learnMore");
    expect(link.closest("a")).toHaveAttribute("href", "/verification");
  });

  it("renders title2 with accent color", () => {
    render(<Community />);
    const title2 = screen.getByText("community.title2");
    expect(title2.style.color).toBe("var(--accent)");
  });
});
