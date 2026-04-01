import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContatoPage from "@/app/[locale]/contact/page";

describe("ContatoPage", () => {
  it("renders main with noise-overlay", () => {
    const { container } = render(<ContatoPage />);
    expect(container.querySelector("main.noise-overlay")).toBeInTheDocument();
  });

  it("renders page title and subtitle", () => {
    render(<ContatoPage />);
    expect(screen.getByText("contato.title")).toBeInTheDocument();
    expect(screen.getByText("contato.subtitle")).toBeInTheDocument();
  });

  it("renders section label", () => {
    render(<ContatoPage />);
    expect(screen.getByText("contato.sectionLabel")).toBeInTheDocument();
  });

  it("renders breadcrumbs with home link", () => {
    render(<ContatoPage />);
    const homeLink = screen.getByText("contato.breadcrumbHome");
    expect(homeLink.closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("contato.breadcrumbCurrent")).toBeInTheDocument();
  });

  it("renders 5 contact channel cards with title, value, description, response", () => {
    render(<ContatoPage />);
    for (let i = 0; i < 5; i++) {
      expect(screen.getByText(`contato.channels.${i}.title`)).toBeInTheDocument();
      expect(screen.getByText(`contato.channels.${i}.value`)).toBeInTheDocument();
      expect(screen.getByText(`contato.channels.${i}.description`)).toBeInTheDocument();
      expect(screen.getByText(`contato.channels.${i}.response`)).toBeInTheDocument();
    }
  });

  it("renders channel cards as mailto links", () => {
    const { container } = render(<ContatoPage />);
    const mailtoLinks = container.querySelectorAll('a[href^="mailto:"]');
    expect(mailtoLinks.length).toBe(5);
  });

  it("renders contact form with all fields", () => {
    render(<ContatoPage />);
    expect(screen.getByText("contato.formTitle")).toBeInTheDocument();
    expect(screen.getByText("contato.formSubtitle")).toBeInTheDocument();
    expect(screen.getByLabelText("contato.subjectLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("contato.nameLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("contato.emailLabel")).toBeInTheDocument();
    expect(screen.getByLabelText("contato.messageLabel")).toBeInTheDocument();
  });

  it("renders subject select with placeholder and 6 options", () => {
    render(<ContatoPage />);
    const select = screen.getByLabelText("contato.subjectLabel") as HTMLSelectElement;
    // 1 placeholder (disabled) + 6 subject options = 7
    expect(select.options.length).toBe(7);
    expect(select.options[0].disabled).toBe(true);
  });

  it("renders form fields as required", () => {
    render(<ContatoPage />);
    expect(screen.getByLabelText("contato.subjectLabel")).toBeRequired();
    expect(screen.getByLabelText("contato.nameLabel")).toBeRequired();
    expect(screen.getByLabelText("contato.emailLabel")).toBeRequired();
    expect(screen.getByLabelText("contato.messageLabel")).toBeRequired();
  });

  it("renders email field with type=email", () => {
    render(<ContatoPage />);
    const emailInput = screen.getByLabelText("contato.emailLabel");
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders submit button", () => {
    render(<ContatoPage />);
    const btn = screen.getByText("contato.submitButton");
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("shows success message after form submit", () => {
    render(<ContatoPage />);
    const form = screen.getByText("contato.submitButton").closest("form")!;
    fireEvent.submit(form);

    expect(screen.getByText("contato.successTitle")).toBeInTheDocument();
    expect(screen.getByText("contato.successMessage")).toBeInTheDocument();
  });

  it("hides form after successful submit", () => {
    render(<ContatoPage />);
    const form = screen.getByText("contato.submitButton").closest("form")!;
    fireEvent.submit(form);

    // Form should no longer be present
    expect(screen.queryByLabelText("contato.nameLabel")).not.toBeInTheDocument();
  });

  it("renders success state with checkmark icon", () => {
    const { container } = render(<ContatoPage />);
    fireEvent.submit(screen.getByText("contato.submitButton").closest("form")!);

    // Success div should have the checkmark SVG
    const checkmark = container.querySelector('path[d="M20 6 9 17l-5-5"]');
    expect(checkmark).toBeInTheDocument();
  });

  it("renders emergency section with title and body", () => {
    render(<ContatoPage />);
    expect(screen.getByText("contato.emergencyTitle")).toBeInTheDocument();
    // emergencyBody uses appName param
    const body = screen.getByText(/contato\.emergencyBody/);
    expect(body).toBeInTheDocument();
  });

  it("renders all 4 emergency numbers", () => {
    render(<ContatoPage />);
    expect(screen.getByText("190")).toBeInTheDocument();
    expect(screen.getByText("192")).toBeInTheDocument();
    expect(screen.getByText("193")).toBeInTheDocument();
    expect(screen.getByText("180")).toBeInTheDocument();

    expect(screen.getByText("contato.emergency190")).toBeInTheDocument();
    expect(screen.getByText("contato.emergency192")).toBeInTheDocument();
    expect(screen.getByText("contato.emergency193")).toBeInTheDocument();
    expect(screen.getByText("contato.emergency180")).toBeInTheDocument();
  });

  it("renders address section with appName", () => {
    render(<ContatoPage />);
    expect(screen.getByText("contato.addressTitle")).toBeInTheDocument();
  });

  it("renders footer links to termos and privacidade", () => {
    render(<ContatoPage />);
    const terms = screen.getByText("contato.linkTerms");
    const privacy = screen.getByText("contato.linkPrivacy");
    expect(terms.closest("a")).toHaveAttribute("href", "/terms");
    expect(privacy.closest("a")).toHaveAttribute("href", "/privacy");
  });

  it("renders back-to-top button after scroll", () => {
    render(<ContatoPage />);
    expect(screen.queryByLabelText("contato.backToTop")).not.toBeInTheDocument();

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    expect(screen.getByLabelText("contato.backToTop")).toBeInTheDocument();
  });

  it("scrolls to top on back-to-top click", async () => {
    const user = userEvent.setup();
    render(<ContatoPage />);

    Object.defineProperty(window, "scrollY", { value: 500, writable: true });
    fireEvent.scroll(window);

    await user.click(screen.getByLabelText("contato.backToTop"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("updates form state on input changes", () => {
    render(<ContatoPage />);

    const nome = screen.getByLabelText("contato.nameLabel") as HTMLInputElement;
    fireEvent.change(nome, { target: { value: "João" } });
    expect(nome.value).toBe("João");

    const email = screen.getByLabelText("contato.emailLabel") as HTMLInputElement;
    fireEvent.change(email, { target: { value: "joao@teste.com" } });
    expect(email.value).toBe("joao@teste.com");

    const msg = screen.getByLabelText("contato.messageLabel") as HTMLTextAreaElement;
    fireEvent.change(msg, { target: { value: "Mensagem de teste" } });
    expect(msg.value).toBe("Mensagem de teste");
  });
});
