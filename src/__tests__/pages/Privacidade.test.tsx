import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PrivacidadePage from "@/app/[locale]/privacy/page";

describe("PrivacidadePage", () => {
  it("renders main with noise-overlay", () => {
    const { container } = render(<PrivacidadePage />);
    expect(container.querySelector("main.noise-overlay")).toBeInTheDocument();
  });

  it("renders page title", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText("privacidade.pageTitle")).toBeInTheDocument();
  });

  it("renders breadcrumbs with home link", () => {
    render(<PrivacidadePage />);
    const homeLink = screen.getByText("privacidade.breadcrumbHome");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("privacidade.breadcrumbCurrent")).toBeInTheDocument();
  });

  it("renders hero label", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText("privacidade.heroLabel")).toBeInTheDocument();
  });

  it("renders last updated date", () => {
    render(<PrivacidadePage />);
    const el = screen.getByText(/privacidade\.lastUpdated/);
    expect(el).toBeInTheDocument();
  });

  it("renders intro paragraph", () => {
    render(<PrivacidadePage />);
    const intro = screen.getByText(/privacidade\.introParagraph/);
    expect(intro).toBeInTheDocument();
  });

  it("renders 14 section titles in main content", () => {
    render(<PrivacidadePage />);
    for (let i = 0; i < 14; i++) {
      const titles = screen.getAllByText(`privacidade.sections.${i}.title`);
      expect(titles.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders summaries for all sections", () => {
    render(<PrivacidadePage />);
    for (let i = 0; i < 14; i++) {
      expect(screen.getByText(`privacidade.sections.${i}.summary`)).toBeInTheDocument();
    }
  });

  it("renders sidebar with all section buttons", () => {
    const { container } = render(<PrivacidadePage />);
    const sidebar = container.querySelector("aside.hidden.lg\\:block");
    expect(sidebar).toBeInTheDocument();
    const sidebarButtons = sidebar?.querySelectorAll("button");
    expect(sidebarButtons?.length).toBe(14);
  });

  it("toggles accordion sections on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<PrivacidadePage />);

    // Find the first section's accordion button
    const accordionButtons = container.querySelectorAll(
      'button.w-full.flex.items-center.justify-between'
    );
    expect(accordionButtons.length).toBe(14);

    // Click to expand first section
    await user.click(accordionButtons[0]);

    // Click again to collapse
    await user.click(accordionButtons[0]);
  });

  it("renders back-to-top button after scroll", () => {
    render(<PrivacidadePage />);
    expect(screen.queryByLabelText("privacidade.backToTop")).not.toBeInTheDocument();

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByLabelText("privacidade.backToTop")).toBeInTheDocument();
  });

  it("calls scrollTo on back-to-top click", async () => {
    const user = userEvent.setup();
    render(<PrivacidadePage />);

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    await user.click(screen.getByLabelText("privacidade.backToTop"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("renders footer with year and appName", () => {
    render(<PrivacidadePage />);
    const footer = screen.getByText(/privacidade\.footer/);
    expect(footer).toBeInTheDocument();
  });

  it("expands accordion on click revealing content area", async () => {
    const user = userEvent.setup();
    const { container } = render(<PrivacidadePage />);

    const accordionButtons = container.querySelectorAll(
      'button.w-full.flex.items-center.justify-between'
    );

    // Before click, no expanded content
    const initialOverflow = container.querySelectorAll('.overflow-hidden');

    await user.click(accordionButtons[0]);

    // After click, an overflow-hidden div should appear (the expanded content)
    const afterOverflow = container.querySelectorAll('.overflow-hidden');
    expect(afterOverflow.length).toBeGreaterThan(initialOverflow.length);
  });
});
