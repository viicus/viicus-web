import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HowItWorks from "@/components/network/HowItWorks";

describe("HowItWorks", () => {
  it("renders section label in sticky header", () => {
    render(<HowItWorks />);
    expect(screen.getByText("howItWorks.sectionLabel")).toBeInTheDocument();
  });

  it("renders 6 story slides with main and detail text", () => {
    const { container } = render(<HowItWorks />);
    for (let i = 0; i < 6; i++) {
      expect(container.textContent).toContain(`howItWorks.stories.${i}.main`);
      expect(container.textContent).toContain(`howItWorks.stories.${i}.detail`);
    }
  });

  it("renders sticky scroll section with correct height for stories", () => {
    const { container } = render(<HowItWorks />);
    // 6 stories + 1 = 700vh
    const scrollSection = container.querySelector('[style*="height: 700vh"]');
    expect(scrollSection).toBeInTheDocument();
  });

  it("renders 10 rotator items with suffix text", () => {
    const { container } = render(<HowItWorks />);
    for (let i = 0; i < 10; i++) {
      expect(container.textContent).toContain(`howItWorks.rotatorItems.${i}`);
    }
    const suffixes = screen.getAllByText("howItWorks.rotatorSuffix");
    expect(suffixes).toHaveLength(10);
  });

  it("renders rotator section with correct height", () => {
    const { container } = render(<HowItWorks />);
    // 10 + 1 = 11 * 80vh = 880vh
    const rotatorSection = container.querySelector('[style*="height: 880vh"]');
    expect(rotatorSection).toBeInTheDocument();
  });

  it("renders rotator suffix with accent color", () => {
    render(<HowItWorks />);
    const suffixes = screen.getAllByText("howItWorks.rotatorSuffix");
    for (const suffix of suffixes) {
      expect(suffix.style.color).toBe("var(--accent)");
    }
  });

  it("renders act 2 titles", () => {
    render(<HowItWorks />);
    expect(screen.getByText("howItWorks.act2Title1")).toBeInTheDocument();
    expect(screen.getByText("howItWorks.act2Title2")).toBeInTheDocument();
  });

  it("renders act 2 body text (including text split by br)", () => {
    const { container } = render(<HowItWorks />);
    expect(container.textContent).toContain("howItWorks.act2Body1");
    expect(container.textContent).toContain("howItWorks.act2Body1b");
    expect(screen.getByText("howItWorks.act2Body2")).toBeInTheDocument();
  });

  it("renders act 2 conclusion with accent", () => {
    render(<HowItWorks />);
    expect(screen.getByText("howItWorks.act2Body3")).toBeInTheDocument();
    const accent = screen.getByText("howItWorks.act2Body3Accent");
    expect(accent.style.color).toBe("var(--accent)");
  });

  it("renders act 3 intro text", () => {
    render(<HowItWorks />);
    expect(screen.getByText("howItWorks.act3Intro")).toBeInTheDocument();
  });

  it("renders app name brand reveal in act 3", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Viicus.")).toBeInTheDocument();
  });

  it("renders act 3 body paragraphs", () => {
    render(<HowItWorks />);
    expect(screen.getByText("howItWorks.act3Body1")).toBeInTheDocument();
    expect(screen.getByText("howItWorks.act3Body2")).toBeInTheDocument();
  });

  it("renders learn more link to como-funciona", () => {
    render(<HowItWorks />);
    const link = screen.getByText("howItWorks.learnMore");
    expect(link.closest("a")).toHaveAttribute("href", "/how-it-works");
  });

  it("renders two divider lines", () => {
    const { container } = render(<HowItWorks />);
    const dividers = container.querySelectorAll(".h-px.origin-center");
    expect(dividers.length).toBe(2);
  });

  it("has background glow effect in act 3", () => {
    const { container } = render(<HowItWorks />);
    const glow = container.querySelector('[style*="radial-gradient"]');
    expect(glow).toBeInTheDocument();
  });
});
