/**
 * Centralized theme configuration — single source of truth for the color system.
 *
 * Two layers:
 *   1. Primitives  — fixed values, never referenced directly in UI code
 *   2. Semantics   — theme-aware tokens consumed by CSS variables in globals.css
 *
 * The CSS variables in globals.css mirror these tokens. If you change a value
 * here, update globals.css to match (or vice-versa). Canvas/Three.js code that
 * can't read CSS vars should import from this file instead.
 */

// ─── Primitives ─────────────────────────────────────────────────────────────

export const primitives = {
  yellow: {
    50: "#FFF8CC",
    100: "#FFEE80",
    200: "#FFE14D",
    400: "#FFDE21",
    600: "#E0BC00",
    800: "#A08800",
    900: "#60520A",
  },
  gray: {
    0: "#FFFFFF",
    50: "#F5F4F0",
    200: "#D6D4CB",
    400: "#9E9C93",
    600: "#5F5E5A",
    800: "#2C2C2A",
    900: "#0F0F0E",
  },
  functional: {
    accentWarm: "#FFB800",
    mutedYellow: "#FFF1A3",
    warning: "#FF6B21",
    success: "#1D9E75",
    danger: "#E24B4A",
  },
} as const;

// ─── Semantic tokens ────────────────────────────────────────────────────────

export const semantic = {
  light: {
    background: {
      primary: "#FFFFFF",
      secondary: "#F5F4F0",
      tertiary: "#D6D4CB",
      accent: "#FFDE21",
    },
    text: {
      primary: "#0F0F0E",
      secondary: "#5F5E5A",
      tertiary: "#9E9C93",
      onAccent: "#0F0F0E",
      accent: "#A08800", // readable yellow on white
    },
    border: {
      subtle: "#D6D4CB",
      default: "#9E9C93",
      strong: "#5F5E5A",
      accent: "#E0BC00",
    },
    surface: {
      card: "#FFFFFF",
      overlay: "#F5F4F0",
      input: "#F5F4F0",
    },
    status: {
      warningBg: "#FFF1A3",
      warningText: "#60520A",
      successBg: "#d4f0e7",
      successText: "#085041",
      dangerBg: "#fde8e8",
      dangerText: "#A32D2D",
    },
  },
  dark: {
    background: {
      primary: "#0F0F0E",
      secondary: "#2C2C2A",
      tertiary: "#5F5E5A",
      accent: "#FFDE21",
    },
    text: {
      primary: "#F5F4F0",
      secondary: "#9E9C93",
      tertiary: "#5F5E5A",
      onAccent: "#0F0F0E",
      accent: "#FFDE21", // yellow pops on dark backgrounds
    },
    border: {
      subtle: "#2C2C2A",
      default: "#5F5E5A",
      strong: "#9E9C93",
      accent: "#FFDE21",
    },
    surface: {
      card: "#2C2C2A",
      overlay: "#1a1a19",
      input: "#2C2C2A",
    },
    status: {
      warningBg: "#60520A",
      warningText: "#FFE14D",
      successBg: "#085041",
      successText: "#5DCAA5",
      dangerBg: "#501313",
      dangerText: "#F09595",
    },
  },
} as const;

// ─── RGB helpers (for Canvas / inline rgba usage) ───────────────────────────

/** Convert "#RRGGBB" → "R,G,B" */
function hexToRgb(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export const rgb = {
  accent: hexToRgb(primitives.yellow[400]),       // "255,222,33"
  accentWarm: hexToRgb(primitives.functional.accentWarm),
  light: {
    textPrimary: hexToRgb(semantic.light.text.primary),   // "15,15,14"
    bgPrimary: hexToRgb(semantic.light.background.primary),
    bgSecondary: hexToRgb(semantic.light.background.secondary),
    card: hexToRgb(semantic.light.surface.card),
  },
  dark: {
    textPrimary: hexToRgb(semantic.dark.text.primary),
    bgPrimary: hexToRgb(semantic.dark.background.primary),
    bgSecondary: hexToRgb(semantic.dark.background.secondary),
    card: hexToRgb(semantic.dark.surface.card),
  },
} as const;

// ─── Canvas-specific palette ────────────────────────────────────────────────

/** Colors used by NetworkCanvas (Three.js / 2D canvas) */
export const canvasColors = {
  cardTypes: [
    primitives.functional.warning,   // "#FF6B21" — orange (alert)
    primitives.functional.danger,    // "#E24B4A" — red   (urgent)
    primitives.functional.accentWarm, // "#FFB800" — gold  (info)
  ],
  cardTypesRgba: [
    `rgba(255,107,33,`,   // warning
    `rgba(226,75,74,`,    // danger
    `rgba(255,184,0,`,    // accentWarm
  ],
  confirmed: primitives.functional.success,          // "#1D9E75"
  confirmedRgba: "rgba(29,158,117,",
  dismissed: primitives.gray[400],                   // "#9E9C93"
  dismissedRgba: "rgba(158,156,147,",
} as const;
