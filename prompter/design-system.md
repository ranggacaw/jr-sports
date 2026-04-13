# Design System Specification: Kinetic Precision

## 1. Overview
### The Elite Performance Lab
This design system establishes an intentional, high-performance environment designed to feel like a premium sports laboratory. The visual language, **Kinetic Precision**, feels fast and energetic yet remains deeply authoritative and professional.

**Core Principles:**
- **Intentional Asymmetry:** Reject rigid, boxy layouts to imply motion.
- **Chromatic Separation:** Boundaries defined through tonal shifts rather than solid borders (1px solid borders are strictly prohibited).
- **Tonal Layering:** Attain lift through light and material density (contrast), eschewing artificial drop shadows where possible.
- **Generous Whitespace:** Allow high-end editorial design to breathe.

---

## 2. Colors

### Brand & Interface Tokens
- **primary-container:** <span style="background:#01457d;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#01457d` — The foundational anchor for the pro-league aesthetic. Used as flood-fill background for high-impact zones.
- **primary:** <span style="background:#002f57;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#002f57` — For deep emphasis and gradient starts.
- **tertiary:** <span style="background:#4e2000;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#4e2000` — "High-voltage" accent metric highlights (e.g., stat card vertical bars).
- **tertiary-container:** <span style="background:#703201;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#703201` — Used for active indicators like momentum meters.

### Surface Hierarchy
Think of the UI as physical layers of performance fabric.
- **surface:** <span style="background:#f9f9fe;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#f9f9fe` — Base layer.
- **surface-container-low:** <span style="background:#f3f3f9;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#f3f3f9` — Section separation layer.
- **surface-container-lowest:** <span style="background:#ffffff;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#ffffff` — Floating cards.
- **surface-container-high:** <span style="background:#e7e8ed;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#e7e8ed` — Elevated elements (utility bars or sidebars).
- **surface-container-highest:** <span style="background:#e2e2e7;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#e2e2e7` — Backing for lowest elements to provide contrast.
- **surface-bright:** <span style="background:rgba(255,255,255,0.8);width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle;border:1px solid #ccc"></span> `#ffffff` (at 80% opacity) — For glassmorphism.

### Foreground & Utility
- **on-primary:** <span style="background:#ffffff;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle;border:1px solid #ccc"></span> `#ffffff` — Text on primary-container blocks.
- **on-surface:** <span style="background:#191c20;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#191c20` — Primarily used at 6% opacity for ambient "Sport-Shadows".
- **outline-variant:** <span style="background:#c2c6d1;width:24px;height:24px;display:inline-block;border-radius:4px;vertical-align:middle"></span> `#c2c6d1` — Used sparingly as a fallback "Ghost Border" at 15-20% opacity.

---

## 3. Typography

**Font Family:** Lexend (Built for "Scan-and-Sprint" reading)

| Scale Name | Size (rem) | Weight/Style | Letter-Spacing | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **display-lg** | 3.5rem | Bold | -0.02em | Hero headlines ("shout" moments). Bleeds off edges. |
| **headline-sm** | 1.5rem | Medium | normal | Section headers maintaining editorial tone. |
| **body-lg** | 1.0rem | Regular | normal | Long-form content reading. |
| **label-md** | *variable* | Bold, All-Caps | +0.05em | Buttons, metadata, and crucial "stats" (jersey typo). |

---

## 4. Visual Styles

### The "Glass & Gradient" Rule
- **Kinetic Gradients:** Subtle 135° linear gradient transitioning from `primary` (#002f57) to `primary-container` (#01457d) for primary CTAs and hero headers.
- **Glassmorphism:** `surface-bright` (#ffffff) at 80% opacity with a `24px` backdrop-blur for floating overlays or sticky navigation.

### Elevation & Shadows
- **The Layering Principle:** Place `surface-container-highest` (#e2e2e7) behind `surface-container-lowest` (#ffffff) to provide lift via contrast.
- **Ambient Sport-Shadow:** `blur: 40px`, `spread: -5px`, `color: #191c20 at 6% opacity`.
- **Ghost Border Fallback:** Use `outline-variant` (#c2c6d1) at 15% opacity if an accessibility stroke is required.

### Border Radii
- **Subtle (Base):** `1` corner radius (typically 4px) for most standard structural elements.
- **Full (Pill):** `full` (9999px) for highly interactive pills or performance chips.

---

## 5. Components

### 5.1 Buttons (Kinetic Triggers)
- **Primary:** Flood-fill with the `primary` to `primary-container` gradient. Subtle (1) roundness. Text is `label-md` bold.
- **Secondary:** Transparent background with a ghost border (`outline-variant` at 20%). On hover, fill with `primary-fixed-dim`.
- **Tertiary:** No background, no border. Primary text color. Used for low-emphasis actions.

### 5.2 Cards & Lists
- **The Divider Ban:** Never use a horizontal line to separate items. Separate via vertical whitespace or alternating `surface` and `surface-container-low` backgrounds.
- **Stat Cards:** Use `surface-container-lowest` background with a 2px vertical accent bar on the left using the `tertiary` color (#4e2000).

### 5.3 Input Fields
- Avoid "box" inputs. Use a subtle `surface-container-highest` background with a bottom-only 2px "active" stroke in `primary` that animates from the center outward upon focus.

### 5.4 Sports-Specific Components
- **Momentum Meter:** Linear progress bar with `tertiary-container` (#703201) mapping live energy/fatigue.
- **Performance Chips:** Fully rounded (9999px) pills. Use `secondary-container` for neutral stats and `primary-container` for highlight/winning stats.
# Design System: Kinetic Precision

## 1. Design Principles & North Star
**Theme:** "The Elite Performance Lab"
**Core Concepts:** Kinetic Precision, Intentional Asymmetry, Chromatic Separation.
- **No-Line Rule:** Avoid 1px solid borders. Use tone/chromatic separation instead.
- **Asymmetry & Motion:** overlapping typography, bleeding hero images, clusters in motion.
- **Glass & Gradient:** Use gradients for primary elements and glassmorphism (80% opacity, 24px blur) for floating overlays.

---

## 2. Design Tokens

### Colors
**Primary**
- `primary`: `#002f57` <span style="background:#002f57;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>
- `primary-container`: `#01457d` <span style="background:#01457d;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>
- `on-primary`: `#ffffff` <span style="background:#ffffff;width:12px;height:12px;display:inline-block;border-radius:2px;border:1px solid #ccc;vertical-align:middle"></span>
- `primary-fixed-dim`: *(Hover states)*

**Tertiary (Accents)**
- `tertiary`: `#4e2000` <span style="background:#4e2000;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>
- `tertiary-container`: `#703201` <span style="background:#703201;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>

**Surfaces & Backgrounds**
- `surface`: `#f9f9fe` <span style="background:#f9f9fe;width:12px;height:12px;display:inline-block;border-radius:2px;border:1px solid #ccc;vertical-align:middle"></span>
- `surface-container-lowest`: `#ffffff` <span style="background:#ffffff;width:12px;height:12px;display:inline-block;border-radius:2px;border:1px solid #ccc;vertical-align:middle"></span>
- `surface-container-low`: `#f3f3f9` <span style="background:#f3f3f9;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>
- `surface-container-high`: `#e7e8ed` <span style="background:#e7e8ed;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>
- `surface-container-highest`: `#e2e2e7` <span style="background:#e2e2e7;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>
- `surface-bright`: *(Used with 80% opacity for glassmorphism)*

**Text & Borders**
- `on-surface`: `#191c20` <span style="background:#191c20;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>
- `outline-variant`: `#c2c6d1` <span style="background:#c2c6d1;width:12px;height:12px;display:inline-block;border-radius:2px;vertical-align:middle"></span>

---

### Typography
**Font Family:** Lexend (Editorial, geometric, hyper-legible)

| Token | Size | Tracking/Spacing | Weight | Usage |
|-------|------|------------------|--------|-------|
| `display-lg` | 3.5rem | -0.02em | Bold | Hero headlines (can bleed off edges) |
| `headline-sm`| 1.5rem | Normal | Bold/Semibold | Section headers |
| `body-lg` | 1rem | Normal | Regular | Long-form content |
| `label-md` | 1rem | +0.05em | Bold (All-Caps)| Metadata, stats, buttons |

---

### Elevation & Effects

- **Sport-Shadow:** For high-priority floating elements (FABs, Modals).
  - Blur: `40px`
  - Spread: `-5px`
  - Color: `rgba(25, 28, 32, 0.06)` *(on-surface at 6%)*
- **Tonal Elevating:** Place `surface-container-highest` behind `surface-container-lowest` to lift without shadows.
- **Ghost Border (Fallback):** `rgba(194, 198, 209, 0.15)` *(outline-variant at 15%)*
- **Kinetic Gradient:** Linear gradient 135° from `#002f57` to `#01457d`.
- **Glassmorphism:** `surface-bright` at 80% opacity + `24px` backdrop-blur.

---

### Radii / Borders
- **Subtle (1):** Used for most elements (default rounding).
- **Full:** `9999px` (Pills, chips).

---

## 3. Component Patterns

### Buttons (Kinetic Triggers)
- **Primary:** Background `Kinetic Gradient`, Subtle roundness, Text `label-md` bold.
- **Secondary:** Transparent background, `Ghost Border` (20% opacity). Hover: `primary-fixed-dim`.
- **Tertiary:** No background, no border. `primary` text color. Low-emphasis inline actions.

### Cards & Layouts ("Anti-Grid")
- **List Separation:** Generous vertical whitespace or alternating `surface` / `surface-container-low`. **No horizontal line dividers.**
- **Stat Cards:** Background `surface-container-lowest`, with a **2px vertical accent bar** on the left in `tertiary` (`#4e2000`).

### Form Inputs
- Background: `surface-container-highest`
- Stroke: Bottom-only 2px "active" stroke in `primary` (`#002f57`), animating from center outward on focus.
- Style: Avoid full box outlines.

### Sports-Specific Elements
- **Momentum Meter:** Linear progress bar in `tertiary-container` (`#703201`).
- **Performance Chips:** `full` (9999px) radius. Uses `secondary-container` for neutral stats, `primary-container` for highlights/winning stats.
