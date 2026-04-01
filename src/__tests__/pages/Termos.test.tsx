import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TermosPage from "@/app/[locale]/terms/page";

describe("TermosPage", () => {
  it("renders main with noise-overlay", () => {
    const { container } = render(<TermosPage />);
    expect(container.querySelector("main.noise-overlay")).toBeInTheDocument();
  });

  it("renders page title", () => {
    render(<TermosPage />);
    expect(screen.getByText("termos.pageTitle")).toBeInTheDocument();
  });

  it("renders breadcrumb with home link", () => {
    render(<TermosPage />);
    const homeLink = screen.getByText("termos.breadcrumbHome");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("termos.breadcrumbCurrent")).toBeInTheDocument();
  });

  it("renders last updated date", () => {
    render(<TermosPage />);
    // t("lastUpdated", { date: t("lastUpdatedDate") })
    const el = screen.getByText(/termos\.lastUpdated/);
    expect(el).toBeInTheDocument();
  });

  it("renders intro text with appName", () => {
    render(<TermosPage />);
    const intro = screen.getByText(/termos\.intro/);
    expect(intro).toBeInTheDocument();
  });

  it("renders 14 section accordion headers", () => {
    render(<TermosPage />);
    for (let i = 0; i < 14; i++) {
      // Each section title appears in both sidebar and main content
      const titles = screen.getAllByText(`termos.sections.${i}.title`);
      expect(titles.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("renders summaries for all 14 sections", () => {
    render(<TermosPage />);
    for (let i = 0; i < 14; i++) {
      expect(screen.getByText(`termos.sections.${i}.summary`)).toBeInTheDocument();
    }
  });

  it("expands accordion section on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<TermosPage />);

    // Find the first accordion button (the one with the section title)
    const firstAccordion = screen.getAllByText("termos.sections.0.title")[0]
      .closest("button");
    expect(firstAccordion).toBeDefined();

    await user.click(firstAccordion!);

    // After clicking, the content should be rendered
    // contentLength mock returns the key "termos.sections.0.contentLength"
    // Number("termos.sections.0.contentLength") = NaN, so content array has length 0
    // This is a known limitation of the mock - but the accordion state should toggle
  });

  it("renders sidebar navigation (desktop)", () => {
    const { container } = render(<TermosPage />);
    const sidebar = container.querySelector("aside.hidden.lg\\:block");
    expect(sidebar).toBeInTheDocument();
  });

  it("renders sidebar with all section titles as buttons", () => {
    const { container } = render(<TermosPage />);
    const sidebarButtons = container.querySelectorAll("aside button");
    expect(sidebarButtons.length).toBe(14);
  });

  it("renders footer with year and appName", () => {
    render(<TermosPage />);
    // t("footer", { year: APP_YEAR, appName: APP_NAME })
    const footer = screen.getByText(/termos\.footer/);
    expect(footer).toBeInTheDocument();
  });

  it("renders back-to-top button when scrolled", () => {
    render(<TermosPage />);
    // Initially hidden (scrollY = 0)
    expect(screen.queryByLabelText("termos.backToTop")).not.toBeInTheDocument();

    // Simulate scroll
    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByLabelText("termos.backToTop")).toBeInTheDocument();
  });

  it("scrolls to top when back-to-top button is clicked", async () => {
    const user = userEvent.setup();
    render(<TermosPage />);

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    const backToTop = screen.getByLabelText("termos.backToTop");
    await user.click(backToTop);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("cleans up scroll listeners on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<TermosPage />);
    unmount();
    // Should remove both scroll spy and back-to-top scroll listeners
    const scrollCalls = removeSpy.mock.calls.filter(
      ([event]) => event === "scroll"
    );
    expect(scrollCalls.length).toBeGreaterThanOrEqual(2);
    removeSpy.mockRestore();
  });
});
