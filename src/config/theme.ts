/**
 * Centralized theme configuration — single source of truth for the color system.
 *
 * Two layers:
 *   1. Primitives — fixed values, never referenced directly in UI code
 *   2. Semantics  — theme-aware tokens consumed by CSS variables in globals.css
 *
 * Palette: off-white canvas, ink type, and a vivid accent stack
 * (hot-pink primary · electric-yellow · mint-cyan · deep-violet).
 * Mirrors the mobile (iOS/Android) auth design system.
 */

// ─── Primitives ─────────────────────────────────────────────────────────────

export const primitives = {
  canvas: {
    0: "#FFFFFF",
    50: "#FBFAF6", // off-white
    100: "#F3F2EC",
    200: "#E4E4E8",
    400: "#8A8A95",
    600: "#5A5A63",
    800: "#22222A",
    900: "#0A0A0F", // ink
  },
  vivid: {
    pink:   "#FF2D75", // hot pink — primary accent
    yellow: "#FFD60A", // electric yellow
    mint:   "#00E5C4", // mint cyan
    violet: "#6B3FFF", // deep violet
  },
  functional: {
    success: "#00A884",
    warning: "#FF8A00",
    danger:  "#D14343",
  },
} as const;

// ─── Semantic tokens ────────────────────────────────────────────────────────

export const semantic = {
  light: {
    background: {
      primary:   "#FBFAF6",
      secondary: "#FFFFFF",
      tertiary:  "#F3F2EC",
      accent:    "#FF2D75",
    },
    text: {
      primary:   "#0A0A0F",
      secondary: "#5A5A63",
      tertiary:  "#8A8A95",
      onAccent:  "#FFFFFF",
      accent:    "#0A0A0F", // editorial — accents go on chips/dots, not prose
    },
    border: {
      subtle:  "rgba(10,10,15,0.10)",
      default: "rgba(10,10,15,0.18)",
      strong:  "rgba(10,10,15,0.32)",
      accent:  "#FF2D75",
    },
    surface: {
      card:    "#FFFFFF",
      overlay: "#FBFAF6",
      input:   "#F3F2EC",
    },
    status: {
      warningBg:   "#FFF1A3",
      warningText: "#604100",
      successBg:   "#D4F0E7",
      successText: "#085041",
      dangerBg:    "#FDE8E8",
      dangerText:  "#A32D2D",
    },
  },
  dark: {
    background: {
      primary:   "#0A0A0F",
      secondary: "#16161C",
      tertiary:  "#22222A",
      accent:    "#FF2D75",
    },
    text: {
      primary:   "#FBFAF6",
      secondary: "#8A8A95",
      tertiary:  "#5A5A63",
      onAccent:  "#FFFFFF",
      accent:    "#FBFAF6",
    },
    border: {
      subtle:  "rgba(251,250,246,0.10)",
      default: "rgba(251,250,246,0.18)",
      strong:  "rgba(251,250,246,0.32)",
      accent:  "#FF2D75",
    },
    surface: {
      card:    "#16161C",
      overlay: "#0E0E14",
      input:   "#22222A",
    },
    status: {
      warningBg:   "#604100",
      warningText: "#FFE14D",
      successBg:   "#085041",
      successText: "#5DCAA5",
      dangerBg:    "#501313",
      dangerText:  "#F09595",
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
  accent:     hexToRgb(primitives.vivid.pink),   // "255,45,117"
  accentWarm: hexToRgb(primitives.vivid.yellow),
  vividPink:  hexToRgb(primitives.vivid.pink),
  vividYellow: hexToRgb(primitives.vivid.yellow),
  vividMint:  hexToRgb(primitives.vivid.mint),
  vividViolet: hexToRgb(primitives.vivid.violet),
  light: {
    textPrimary: hexToRgb(semantic.light.text.primary),
    bgPrimary:   hexToRgb(semantic.light.background.primary),
    bgSecondary: hexToRgb(semantic.light.background.secondary),
    card:        hexToRgb(semantic.light.surface.card),
  },
  dark: {
    textPrimary: hexToRgb(semantic.dark.text.primary),
    bgPrimary:   hexToRgb(semantic.dark.background.primary),
    bgSecondary: hexToRgb(semantic.dark.background.secondary),
    card:        hexToRgb(semantic.dark.surface.card),
  },
} as const;

// ─── Canvas-specific palette ────────────────────────────────────────────────

/**
 * Colours used by NetworkCanvas (2D canvas over WebGL). Each "card type"
 * gets one of the vivid accents so the floating reports feel like little
 * editorial chips.
 */
export const canvasColors = {
  cardTypes: [
    primitives.vivid.pink,   // alert — hot pink
    primitives.vivid.violet, // urgent — deep violet
    primitives.vivid.yellow, // info  — electric yellow
  ],
  cardTypesRgba: [
    `rgba(255,45,117,`,   // pink
    `rgba(107,63,255,`,   // violet
    `rgba(255,214,10,`,   // yellow
  ],
  confirmed:      primitives.vivid.mint,
  confirmedRgba:  "rgba(0,229,196,",
  dismissed:      primitives.canvas[400],
  dismissedRgba:  "rgba(138,138,149,",
} as const;
