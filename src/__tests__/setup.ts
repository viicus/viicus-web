import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// ──────────────────────────────────────────────────────
// Mock next-intl
// ──────────────────────────────────────────────────────
// Returns "namespace.key" so tests can assert exact keys.
// Supports params: t("foo", { appName: "X" }) => "namespace.foo" with {appName} replaced.
// Also exposes t.raw(key) for components that need it.
const createTranslator = (namespace: string) => {
  const t = (key: string, params?: Record<string, string | number>) => {
    const fullKey = `${namespace}.${key}`;
    if (params) {
      let result = fullKey;
      for (const [k, v] of Object.entries(params)) {
        result = result.replace(`{${k}}`, String(v));
      }
      return result;
    }
    return fullKey;
  };
  t.raw = (key: string) => `${namespace}.${key}`;
  t.rich = t;
  t.markup = t;
  t.has = () => true;
  return t;
};

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => createTranslator(namespace),
  useLocale: () => "pt",
  useMessages: () => ({}),
  useNow: () => new Date(),
  useTimeZone: () => "America/Sao_Paulo",
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ──────────────────────────────────────────────────────
// Mock next-intl/navigation
// ──────────────────────────────────────────────────────
const mockRouterReplace = vi.fn();
const mockRouterPush = vi.fn();
const mockRouterBack = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => {
    const React = require("react");
    return React.createElement("a", { href, ...props }, children);
  },
  useRouter: () => ({
    push: mockRouterPush,
    replace: mockRouterReplace,
    back: mockRouterBack,
  }),
  usePathname: () => "/",
  redirect: vi.fn(),
}));

// Export for tests to assert on
export { mockRouterReplace, mockRouterPush, mockRouterBack };

// ──────────────────────────────────────────────────────
// Mock framer-motion
// ──────────────────────────────────────────────────────
vi.mock("framer-motion", () => {
  const React = require("react");

  // Track animation props for test assertions
  const motion = new Proxy(
    {},
    {
      get: (_target, prop: string) => {
        return React.forwardRef((props: Record<string, unknown>, ref: unknown) => {
          const filteredProps: Record<string, unknown> = {};
          const dataProps: Record<string, string> = {};

          for (const [key, value] of Object.entries(props)) {
            if (
              !key.startsWith("while") &&
              !key.startsWith("animate") &&
              !key.startsWith("initial") &&
              !key.startsWith("exit") &&
              !key.startsWith("transition") &&
              !key.startsWith("viewport") &&
              key !== "variants" &&
              key !== "layout" &&
              key !== "layoutId"
            ) {
              filteredProps[key] = value;
            }
            // Expose animation props as data attributes for testing
            if (key === "whileInView" || key === "initial") {
              try {
                dataProps[`data-motion-${key.toLowerCase()}`] = JSON.stringify(value);
              } catch {
                // skip non-serializable
              }
            }
          }
          return React.createElement(prop, { ...filteredProps, ...dataProps, ref });
        });
      },
    }
  );

  // MotionValue mock that tracks current value and allows updates
  class MockMotionValue {
    private _value: number;
    constructor(v: number = 0) {
      this._value = v;
    }
    get() { return this._value; }
    set(v: number) { this._value = v; }
    on() { return () => {}; }
    onChange() { return () => {}; }
    destroy() {}
  }

  return {
    motion,
    AnimatePresence: ({ children, mode }: { children: React.ReactNode; mode?: string }) => {
      // When mode="wait", only the first non-null child should render.
      // Our mock doesn't simulate exit animations, but at least renders children correctly.
      return children;
    },
    useScroll: () => ({
      scrollYProgress: new MockMotionValue(0),
      scrollY: new MockMotionValue(0),
      scrollX: new MockMotionValue(0),
      scrollXProgress: new MockMotionValue(0),
    }),
    useTransform: (
      _value: unknown,
      inputRange?: number[],
      outputRange?: number[]
    ) => {
      // Return a MotionValue that defaults to the first output value
      // This gives scroll-at-0 behavior which is realistic
      const initial = outputRange?.[0] ?? 0;
      return new MockMotionValue(initial);
    },
    useMotionValue: (v: number) => new MockMotionValue(v),
    useInView: () => true,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
  };
});

// ──────────────────────────────────────────────────────
// Mock IntersectionObserver
// ──────────────────────────────────────────────────────
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

// ──────────────────────────────────────────────────────
// Mock requestAnimationFrame (for canvas animation loops)
// ──────────────────────────────────────────────────────
let rafId = 0;
vi.stubGlobal("requestAnimationFrame", vi.fn((cb: FrameRequestCallback) => {
  rafId += 1;
  return rafId;
}));
vi.stubGlobal("cancelAnimationFrame", vi.fn());

// ──────────────────────────────────────────────────────
// Mock getComputedStyle (for canvas theme reading)
// ──────────────────────────────────────────────────────
const originalGetComputedStyle = window.getComputedStyle;
vi.stubGlobal("getComputedStyle", vi.fn((el: Element) => {
  const real = originalGetComputedStyle(el);
  return new Proxy(real, {
    get(target, prop) {
      if (prop === "getPropertyValue") {
        return (v: string) => {
          // Return sensible defaults for CSS variables used by canvas
          const defaults: Record<string, string> = {
            "--person-rgb": "5,150,105",
            "--person-color": "#059669",
            "--grid-color": "rgba(0,0,0,0.05)",
            "--text-rgb": "26,26,26",
            "--card-bg-rgb": "255,255,255",
            "--popup-bg-rgb": "255,255,255",
            "--shadow-alpha": "0.1",
            "--highlight-rgb": "0,0,0",
            "--accent-rgb": "5,150,105",
          };
          return defaults[v] || "";
        };
      }
      return Reflect.get(target, prop);
    },
  });
}));

// ──────────────────────────────────────────────────────
// Mock canvas — track all drawing calls
// ──────────────────────────────────────────────────────
const createMockContext = () => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  fillText: vi.fn(),
  strokeText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 50, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2 }),
  roundRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  setTransform: vi.fn(),
  resetTransform: vi.fn(),
  drawImage: vi.fn(),
  createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
  createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
  getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
  putImageData: vi.fn(),
  canvas: { width: 800, height: 600 },
  globalAlpha: 1,
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  lineCap: "butt",
  lineJoin: "miter",
  font: "",
  textAlign: "start",
  textBaseline: "alphabetic",
  globalCompositeOperation: "source-over",
  shadowColor: "",
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  imageSmoothingEnabled: true,
});

// Store the mock context so tests can access it
export const mockCanvasContext = createMockContext();

HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCanvasContext);

// Mock canvas dimensions
Object.defineProperty(HTMLCanvasElement.prototype, "width", {
  get() { return 800; },
  set() {},
});
Object.defineProperty(HTMLCanvasElement.prototype, "height", {
  get() { return 600; },
  set() {},
});

// ──────────────────────────────────────────────────────
// Mock window.scrollTo & Element.scrollIntoView
// ──────────────────────────────────────────────────────
window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// ──────────────────────────────────────────────────────
// Mock ResizeObserver (used by some layout components)
// ──────────────────────────────────────────────────────
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal("ResizeObserver", MockResizeObserver);

// ──────────────────────────────────────────────────────
// Mock matchMedia
// ──────────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
