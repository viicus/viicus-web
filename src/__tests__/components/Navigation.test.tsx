import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navigation from "@/components/Navigation";
import { mockRouterReplace } from "../setup";

describe("Navigation", () => {
  it("renders the app name from config", () => {
    render(<Navigation />);
    expect(screen.getByText("Viicus")).toBeInTheDocument();
  });

  it("renders download CTA button (desktop + mobile)", () => {
    render(<Navigation />);
    const buttons = screen.getAllByText("nav.download");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders mobile hamburger with accessible label", () => {
    render(<Navigation />);
    const toggle = screen.getByLabelText("Toggle menu");
    expect(toggle).toBeInTheDocument();
    expect(toggle.tagName).toBe("BUTTON");
  });

  // Language selector temporarily hidden for launch
  it.skip("shows current locale label PT-BR", () => {
    render(<Navigation />);
    // PT-BR should appear at least in the desktop dropdown trigger
    expect(screen.getByText("PT-BR")).toBeInTheDocument();
  });

  it.skip("renders all 6 locale options in mobile menu", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByLabelText("Toggle menu"));

    const locales = ["PT-BR", "EN", "ES", "PT-PT", "DE", "FR"];
    for (const loc of locales) {
      // Each locale should appear as a button in mobile menu
      const elements = screen.getAllByText(loc);
      expect(elements.length).toBeGreaterThanOrEqual(1);
    }
  });

  it.skip("renders language section label in mobile menu", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByLabelText("Toggle menu"));
    expect(screen.getByText("nav.language")).toBeInTheDocument();
  });

  it.skip("calls router.replace with correct locale on language switch", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    // Open mobile menu
    await user.click(screen.getByLabelText("Toggle menu"));

    // Click EN locale button in mobile menu
    const enButtons = screen.getAllByText("EN");
    // Find the one inside the mobile menu (button element)
    const mobileEnBtn = enButtons.find(el => el.tagName === "BUTTON");
    expect(mobileEnBtn).toBeDefined();
    await user.click(mobileEnBtn!);

    expect(mockRouterReplace).toHaveBeenCalledWith("/", { locale: "en" });
  });

  it("registers scroll event listener for hide/show behavior", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    render(<Navigation />);
    const scrollCalls = addSpy.mock.calls.filter(([event]) => event === "scroll");
    expect(scrollCalls.length).toBeGreaterThanOrEqual(1);
    // Check passive option
    expect(scrollCalls[0][2]).toEqual({ passive: true });
    addSpy.mockRestore();
  });

  it.skip("opens mobile menu and shows language options", () => {
    render(<Navigation />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));
    expect(screen.getByText("nav.language")).toBeInTheDocument();
  });

  it.skip("closes language dropdown on outside click", async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    // Open desktop language dropdown
    await user.click(screen.getByText("PT-BR"));

    // Full locale names should appear in dropdown
    expect(screen.getByText("English")).toBeInTheDocument();

    // Click outside
    await user.click(document.body);

    // Dropdown should close
    expect(screen.queryByText("English")).not.toBeInTheDocument();
  });

  it.skip("shows checkmark next to current locale in dropdown", async () => {
    const user = userEvent.setup();
    const { container } = render(<Navigation />);

    await user.click(screen.getByText("PT-BR"));

    // Current locale (pt) button should have the checkmark SVG
    const ptButton = screen.getByText("Português (BR)");
    const svgInButton = ptButton.closest("button")?.querySelector("svg polyline");
    expect(svgInButton).toBeInTheDocument();

    // Non-current locale should NOT have checkmark
    const enButton = screen.getByText("English");
    const enSvg = enButton.closest("button")?.querySelector("svg polyline");
    expect(enSvg).not.toBeInTheDocument();
  });

  it("cleans up scroll listener on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<Navigation />);
    expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });

    unmount();
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
