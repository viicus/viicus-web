import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import VerificacaoPage from "@/app/[locale]/verification/page";

describe("VerificacaoPage", () => {
  it("renders main with noise-overlay", () => {
    const { container } = render(<VerificacaoPage />);
    expect(container.querySelector("main.noise-overlay")).toBeInTheDocument();
  });

  it("renders back link to home", () => {
    render(<VerificacaoPage />);
    const back = screen.getByText("verificacao.back");
    expect(back.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders hero section with title and accent", () => {
    render(<VerificacaoPage />);
    expect(screen.getByText("verificacao.sectionLabel")).toBeInTheDocument();
    expect(screen.getByText("verificacao.heroTitle")).toBeInTheDocument();
    const accent = screen.getByText("verificacao.heroTitleAccent");
    expect(accent.className).toContain("gradient-text-accent");
  });

  it("renders hero subtitle with appName interpolation", () => {
    render(<VerificacaoPage />);
    // t("heroSubtitle", { appName: APP_NAME }) replaces {appName} with Viicus
    const el = screen.getByText(/verificacao\.heroSubtitle/);
    expect(el).toBeInTheDocument();
  });

  it("renders steps section with label and title", () => {
    render(<VerificacaoPage />);
    expect(screen.getByText("verificacao.stepsLabel")).toBeInTheDocument();
    expect(screen.getByText("verificacao.stepsTitle")).toBeInTheDocument();
  });

  it("renders 5 verification steps with number, title, body, detail", () => {
    render(<VerificacaoPage />);
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`verificacao.steps.${i}.number`)).toBeInTheDocument();
      expect(screen.getByText(`verificacao.steps.${i}.title`)).toBeInTheDocument();
      expect(screen.getByText(`verificacao.steps.${i}.body`)).toBeInTheDocument();
      expect(screen.getByText(`verificacao.steps.${i}.detail`)).toBeInTheDocument();
    }
  });

  it("renders step numbers in styled circles", () => {
    const { container } = render(<VerificacaoPage />);
    const stepCircles = container.querySelectorAll(".rounded-full.shrink-0");
    expect(stepCircles.length).toBeGreaterThanOrEqual(5);
  });

  it("renders vertical timeline line", () => {
    const { container } = render(<VerificacaoPage />);
    const timelineLine = container.querySelector('.absolute.left-\\[19px\\]');
    expect(timelineLine).toBeInTheDocument();
  });

  it("renders principles section with label and title", () => {
    render(<VerificacaoPage />);
    expect(screen.getByText("verificacao.principlesLabel")).toBeInTheDocument();
    expect(screen.getByText("verificacao.principlesTitle")).toBeInTheDocument();
    const accent = screen.getByText("verificacao.principlesTitleAccent");
    expect(accent.className).toContain("gradient-text-accent");
  });

  it("renders 4 principle cards with icon, title, body, detail", () => {
    render(<VerificacaoPage />);
    for (let i = 0; i < 4; i++) {
      expect(screen.getByText(`verificacao.principles.${i}.icon`)).toBeInTheDocument();
      expect(screen.getByText(`verificacao.principles.${i}.title`)).toBeInTheDocument();
      expect(screen.getByText(`verificacao.principles.${i}.body`)).toBeInTheDocument();
    }
  });

  it("renders comparison table with header", () => {
    render(<VerificacaoPage />);
    expect(screen.getByText("verificacao.comparisonLabel")).toBeInTheDocument();
    expect(screen.getByText("verificacao.comparisonHeaderThem")).toBeInTheDocument();
    // App name in table header
    expect(screen.getByText("Viicus")).toBeInTheDocument();
  });

  it("renders 5 comparison rows with them and us", () => {
    render(<VerificacaoPage />);
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`verificacao.comparisons.${i}.them`)).toBeInTheDocument();
      expect(screen.getByText(`verificacao.comparisons.${i}.us`)).toBeInTheDocument();
    }
  });

  it("renders trust statement", () => {
    render(<VerificacaoPage />);
    expect(screen.getByText("verificacao.trustLine1")).toBeInTheDocument();
    expect(screen.getByText("verificacao.trustLine2")).toBeInTheDocument();
    const accent = screen.getByText("verificacao.trustLine2Accent");
    expect(accent.className).toContain("gradient-text-accent");
  });

  it("renders CTA button linking to home", () => {
    render(<VerificacaoPage />);
    const cta = screen.getByText("verificacao.ctaPrimary");
    expect(cta.closest("a")).toHaveAttribute("href", "/");
  });
});
