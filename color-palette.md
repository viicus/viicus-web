# Paleta de Cores — Rede Social

Estrutura em duas camadas: **primitivos** (valores fixos) e **semânticos** (trocam por tema).

---

## Camada 1 — Primitivos

Nunca use esses tokens diretamente no código de UI. Eles são a fonte da verdade.

```json
{
  "primitive": {
    "yellow": {
      "50":  "#FFF8CC",
      "100": "#FFEE80",
      "200": "#FFE14D",
      "400": "#FFDE21",
      "600": "#E0BC00",
      "800": "#A08800",
      "900": "#60520A"
    },
    "gray": {
      "0":   "#FFFFFF",
      "50":  "#F5F4F0",
      "200": "#D6D4CB",
      "400": "#9E9C93",
      "600": "#5F5E5A",
      "800": "#2C2C2A",
      "900": "#0F0F0E"
    },
    "functional": {
      "accent-warm":  "#FFB800",
      "muted-yellow": "#FFF1A3",
      "warning":      "#FF6B21",
      "success":      "#1D9E75",
      "danger":       "#E24B4A"
    }
  }
}
```

---

## Camada 2 — Semânticos

Esses são os tokens que o código de UI consome. Cada um tem um valor para light e um para dark.

```json
{
  "semantic": {
    "background": {
      "primary":   { "light": "#FFFFFF",  "dark": "#0F0F0E" },
      "secondary": { "light": "#F5F4F0",  "dark": "#2C2C2A" },
      "tertiary":  { "light": "#D6D4CB",  "dark": "#5F5E5A" },
      "accent":    { "light": "#FFDE21",  "dark": "#FFDE21" }
    },
    "text": {
      "primary":   { "light": "#0F0F0E",  "dark": "#F5F4F0" },
      "secondary": { "light": "#5F5E5A",  "dark": "#9E9C93" },
      "tertiary":  { "light": "#9E9C93",  "dark": "#5F5E5A" },
      "on-accent": { "light": "#0F0F0E",  "dark": "#0F0F0E" },
      "accent":    { "light": "#A08800",  "dark": "#FFDE21" }
    },
    "border": {
      "subtle":  { "light": "#D6D4CB",  "dark": "#2C2C2A" },
      "default": { "light": "#9E9C93",  "dark": "#5F5E5A" },
      "strong":  { "light": "#5F5E5A",  "dark": "#9E9C93" },
      "accent":  { "light": "#E0BC00",  "dark": "#FFDE21" }
    },
    "surface": {
      "card":    { "light": "#FFFFFF",  "dark": "#2C2C2A" },
      "overlay": { "light": "#F5F4F0",  "dark": "#1a1a19" },
      "input":   { "light": "#F5F4F0",  "dark": "#2C2C2A" }
    },
    "status": {
      "warning-bg":   { "light": "#FFF1A3",  "dark": "#60520A" },
      "warning-text": { "light": "#60520A",  "dark": "#FFE14D" },
      "success-bg":   { "light": "#d4f0e7",  "dark": "#085041" },
      "success-text": { "light": "#085041",  "dark": "#5DCAA5" },
      "danger-bg":    { "light": "#fde8e8",  "dark": "#501313" },
      "danger-text":  { "light": "#A32D2D",  "dark": "#F09595" }
    }
  }
}
```

---

## Mapeamento visual

### Backgrounds

| Token | Light | Dark |
|-------|-------|------|
| `background.primary` | `#FFFFFF` | `#0F0F0E` |
| `background.secondary` | `#F5F4F0` | `#2C2C2A` |
| `background.tertiary` | `#D6D4CB` | `#5F5E5A` |
| `background.accent` | `#FFDE21` | `#FFDE21` |

### Textos

| Token | Light | Dark |
|-------|-------|------|
| `text.primary` | `#0F0F0E` | `#F5F4F0` |
| `text.secondary` | `#5F5E5A` | `#9E9C93` |
| `text.tertiary` | `#9E9C93` | `#5F5E5A` |
| `text.on-accent` | `#0F0F0E` | `#0F0F0E` |
| `text.accent` | `#A08800` | `#FFDE21` |

### Borders

| Token | Light | Dark |
|-------|-------|------|
| `border.subtle` | `#D6D4CB` | `#2C2C2A` |
| `border.default` | `#9E9C93` | `#5F5E5A` |
| `border.strong` | `#5F5E5A` | `#9E9C93` |
| `border.accent` | `#E0BC00` | `#FFDE21` |

---

## Regras de contraste

| Combinação | Ratio | AA | AAA |
|------------|-------|----|-----|
| `text.on-accent` sobre `background.accent` | 15.7:1 | ✅ | ✅ |
| `text.primary` light sobre `background.primary` light | ~19:1 | ✅ | ✅ |
| `text.primary` dark sobre `background.primary` dark | ~18:1 | ✅ | ✅ |
| Amarelo sobre branco (proibido) | 1.34:1 | ❌ | ❌ |

> **Regras de ouro:**
> - `text.on-accent` é sempre `#0F0F0E` nos dois temas — o amarelo é claro o suficiente
> - No dark mode, `text.accent` usa `yellow-400` diretamente — funciona sobre fundos escuros
> - No light mode, `text.accent` usa `yellow-800` — garante contraste sobre fundo branco
> - Nunca use amarelo como cor de texto sobre fundos claros

---

## Como usar (CSS Variables)

```css
:root {
  --bg-primary:      #FFFFFF;
  --bg-secondary:    #F5F4F0;
  --bg-accent:       #FFDE21;
  --text-primary:    #0F0F0E;
  --text-secondary:  #5F5E5A;
  --text-on-accent:  #0F0F0E;
  --text-accent:     #A08800;
  --border-default:  #9E9C93;
  --border-accent:   #E0BC00;
  --surface-card:    #FFFFFF;
}

[data-theme="dark"] {
  --bg-primary:      #0F0F0E;
  --bg-secondary:    #2C2C2A;
  --bg-accent:       #FFDE21;
  --text-primary:    #F5F4F0;
  --text-secondary:  #9E9C93;
  --text-on-accent:  #0F0F0E;
  --text-accent:     #FFDE21;
  --border-default:  #5F5E5A;
  --border-accent:   #FFDE21;
  --surface-card:    #2C2C2A;
}
```
