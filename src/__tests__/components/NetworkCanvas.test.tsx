import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import NetworkCanvas, { type CanvasTranslations } from "@/components/network/NetworkCanvas";

// Access the shared mock context
const getCtx = () => {
  const calls = (HTMLCanvasElement.prototype.getContext as ReturnType<typeof vi.fn>).mock;
  return calls.results[calls.results.length - 1]?.value;
};

const mockTranslations: CanvasTranslations = {
  typeLabels: ["Infraestrutura", "Convivência", "Segurança"],
  titles: Array.from({ length: 3 }, () =>
    Array.from({ length: 8 }, (_, i) => `Title ${i}`)
  ),
  actions: Array.from({ length: 3 }, () =>
    Array.from({ length: 8 }, (_, i) => [`Action ${i}`, `Detail ${i}`] as [string, string])
  ),
  dismissReasons: Array.from({ length: 3 }, () =>
    Array.from({ length: 8 }, (_, i) => [`Reason ${i}`, `Detail ${i}`] as [string, string])
  ),
  recentlyReported: "Reportado recentemente",
  confirmed: "Confirmado",
  dismissed: "Descartado",
  votes: "votos",
  communityNotified: "Comunidade notificada",
  authoritiesNotified: "Autoridades notificadas",
  eventDismissed: "Evento descartado",
  infoNotVerified: "Info não verificada",
  paused: "Pausado",
  collecting: "Coletando",
};

describe("NetworkCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a canvas element", () => {
    const { container } = render(
      <NetworkCanvas translations={mockTranslations} />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas?.tagName).toBe("CANVAS");
  });

  it("requests 2D context from canvas", () => {
    render(<NetworkCanvas translations={mockTranslations} />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d");
  });

  it("starts animation loop with requestAnimationFrame", () => {
    render(<NetworkCanvas translations={mockTranslations} />);
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it("cancels animation frame on unmount", () => {
    const { unmount } = render(
      <NetworkCanvas translations={mockTranslations} />
    );
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("accepts personCount prop", () => {
    // Should not throw with different person counts
    const { container: c1 } = render(
      <NetworkCanvas personCount={10} translations={mockTranslations} />
    );
    expect(c1.querySelector("canvas")).toBeInTheDocument();
  });

  it("sets up mouse/touch event listeners on canvas", () => {
    const { container } = render(
      <NetworkCanvas translations={mockTranslations} />
    );
    const canvas = container.querySelector("canvas")!;
    // Fire mouse events to verify no errors
    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseLeave(canvas);
  });

  it("exports CanvasTranslations with correct shape", () => {
    const t: CanvasTranslations = mockTranslations;
    expect(t.typeLabels).toHaveLength(3);
    expect(t.titles).toHaveLength(3);
    expect(t.titles[0]).toHaveLength(8);
    expect(t.actions).toHaveLength(3);
    expect(t.actions[0]).toHaveLength(8);
    expect(t.actions[0][0]).toHaveLength(2);
    expect(t.dismissReasons).toHaveLength(3);
    expect(typeof t.recentlyReported).toBe("string");
    expect(typeof t.confirmed).toBe("string");
    expect(typeof t.dismissed).toBe("string");
    expect(typeof t.votes).toBe("string");
    expect(typeof t.communityNotified).toBe("string");
    expect(typeof t.authoritiesNotified).toBe("string");
    expect(typeof t.paused).toBe("string");
    expect(typeof t.collecting).toBe("string");
  });
});
