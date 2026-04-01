import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ComoFuncionaPage from "@/app/[locale]/how-it-works/page";

describe("ComoFuncionaPage", () => {
  it("renders main with noise-overlay", () => {
    const { container } = render(<ComoFuncionaPage />);
    const main = container.querySelector("main.noise-overlay");
    expect(main).toBeInTheDocument();
  });

  it("renders back link to home", () => {
    render(<ComoFuncionaPage />);
    const back = screen.getByText("comoFunciona.back");
    expect(back.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders hero section label", () => {
    render(<ComoFuncionaPage />);
    expect(screen.getByText("comoFunciona.sectionLabel")).toBeInTheDocument();
  });

  it("renders hero title with accent", () => {
    render(<ComoFuncionaPage />);
    expect(screen.getByText("comoFunciona.heroTitle")).toBeInTheDocument();
    const accent = screen.getByText("comoFunciona.heroTitleAccent");
    expect(accent.className).toContain("gradient-text-accent");
  });

  it("renders hero subtitle and scroll hint", () => {
    render(<ComoFuncionaPage />);
    expect(screen.getByText("comoFunciona.heroSubtitle")).toBeInTheDocument();
    expect(screen.getByText("comoFunciona.scrollHint")).toBeInTheDocument();
  });

  it("renders problems section with label and title", () => {
    render(<ComoFuncionaPage />);
    expect(screen.getByText("comoFunciona.problemsLabel")).toBeInTheDocument();
    expect(screen.getByText("comoFunciona.problemsTitle")).toBeInTheDocument();
    expect(screen.getByText("comoFunciona.problemsTitleFaint")).toBeInTheDocument();
  });

  it("renders 6 problem slides", () => {
    const { container } = render(<ComoFuncionaPage />);
    for (let i = 0; i < 6; i++) {
      expect(container.textContent).toContain(`comoFunciona.problems.${i}.title`);
      expect(container.textContent).toContain(`comoFunciona.problems.${i}.body`);
      expect(container.textContent).toContain(`comoFunciona.problems.${i}.punchline`);
    }
  });

  it("renders sticky scroll section for problems with correct height", () => {
    const { container } = render(<ComoFuncionaPage />);
    // 6+1 = 7 * 100vh = 700vh
    const scrollSection = container.querySelector('[style*="height: 700vh"]');
    expect(scrollSection).toBeInTheDocument();
  });

  it("renders transition statement", () => {
    render(<ComoFuncionaPage />);
    expect(screen.getByText("comoFunciona.transitionLine1")).toBeInTheDocument();
    expect(screen.getByText("comoFunciona.transitionLine2")).toBeInTheDocument();
    expect(screen.getByText("comoFunciona.transitionDramatic")).toBeInTheDocument();
  });

  it("renders solutions section with label and title", () => {
    render(<ComoFuncionaPage />);
    expect(screen.getByText("comoFunciona.solutionLabel")).toBeInTheDocument();
    expect(screen.getByText("comoFunciona.solutionTitle")).toBeInTheDocument();
  });

  it("renders 4 solution steps with step number, title, body, detail", () => {
    const { container } = render(<ComoFuncionaPage />);
    for (let i = 0; i < 4; i++) {
      expect(container.textContent).toContain(`comoFunciona.solutions.${i}.step`);
      expect(container.textContent).toContain(`comoFunciona.solutions.${i}.title`);
      expect(container.textContent).toContain(`comoFunciona.solutions.${i}.body`);
      expect(container.textContent).toContain(`comoFunciona.solutions.${i}.detail`);
    }
  });

  it("renders comparison section with label", () => {
    render(<ComoFuncionaPage />);
    expect(screen.getByText("comoFunciona.comparisonLabel")).toBeInTheDocument();
  });

  it("renders 4 comparison cards with before, after, stat", () => {
    const { container } = render(<ComoFuncionaPage />);
    for (let i = 0; i < 4; i++) {
      expect(container.textContent).toContain(`comoFunciona.comparisons.${i}.before`);
      expect(container.textContent).toContain(`comoFunciona.comparisons.${i}.after`);
      expect(container.textContent).toContain(`comoFunciona.comparisons.${i}.stat`);
    }
  });

  it("renders CTA with primary link to home and secondary to o-que-acontece", () => {
    render(<ComoFuncionaPage />);
    const primary = screen.getByText("comoFunciona.ctaPrimary");
    expect(primary.closest("a")).toHaveAttribute("href", "/");
    const secondary = screen.getByText("comoFunciona.ctaSecondary");
    expect(secondary.closest("a")).toHaveAttribute("href", "/what-happens");
  });

  it("renders app name in final CTA", () => {
    const { container } = render(<ComoFuncionaPage />);
    expect(container.textContent).toContain("Viicus.");
  });
});
