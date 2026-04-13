# Design System Specification: Kinetic Precision

## 1. Overview & Creative North Star
### The North Star: "The Elite Performance Lab"
This design system moves beyond the "blue-and-white business app." It is an intentional, high-performance environment designed to feel like a premium sports laboratory. Our goal is **Kinetic Precision**: a visual language that feels fast and energetic yet remains deeply authoritative and professional.

To break the "template" look, we reject rigid, boxy layouts. Instead, we embrace **Intentional Asymmetry**. Large-scale typography should overlap container boundaries; hero images should break the grid; and content should be grouped into clusters that feel like they are in motion. We are not just organizing data; we are orchestrating a high-speed narrative.

---

## 2. Colors & The Tonal Architecture
The palette is anchored by the depth of `#01457d` (Primary Container), providing a sophisticated, athletic foundation that feels more "pro-league" than "corporate."

### The "No-Line" Rule
**Explicit Instruction:** Use of 1px solid borders for sectioning or containment is strictly prohibited. We define boundaries through **Chromatic Separation**. 
- To separate a section, shift the background from `surface` (#f9f9fe) to `surface-container-low` (#f3f3f9).
- Use `primary-container` (#01457d) as a flood-fill background for high-impact zones, with `on-primary` (#ffffff) text to create a bold, "power-block" aesthetic.

### Surface Hierarchy & Nesting
Think of the UI as physical layers of performance fabric.
*   **Base:** `surface` (#f9f9fe)
*   **Sub-level:** `surface-container-lowest` (#ffffff) for floating cards.
*   **Elevated level:** `surface-container-high` (#e7e8ed) for utility bars or sidebars.
By nesting a `surface-container-lowest` card inside a `surface-container` area, we create depth through tone rather than artificial lines.

### The "Glass & Gradient" Rule
To inject "soul" into the kinetic theme:
- **Kinetic Gradients:** For primary CTAs and hero headers, use a subtle linear gradient (135°) transitioning from `primary` (#002f57) to `primary-container` (#01457d). This adds a sense of curvature and aerodynamic volume.
- **Glassmorphism:** For floating overlays or sticky navigation, use `surface-bright` at 80% opacity with a `24px` backdrop-blur. This keeps the user connected to the content "underneath" the interface.

---

## 3. Typography: Lexend Editorial
We utilize **Lexend** for its hyper-legibility and athletic, geometric character. The hierarchy is designed for "Scan-and-Sprint" reading.

- **Display Scales (LG/MD/SM):** These are your "shout" moments. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero headlines. Don't be afraid to let these bleed off the edge of a container to imply speed.
- **Headline & Title:** Used for secondary information. `headline-sm` (1.5rem) should be used for section headers to maintain a professional, editorial tone.
- **Body & Label:** Use `body-lg` (1rem) for long-form content. For metadata and "stats" (crucial in a sports context), use `label-md` in all-caps with increased letter-spacing (+0.05em) to mimic jersey typography.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "web 2.0" for this system. We achieve lift through light and material density.

- **The Layering Principle:** Instead of a shadow, place a `surface-container-highest` (#e2e2e7) element behind a `surface-container-lowest` (#ffffff) element. The contrast provides all the "lift" required.
- **Ambient Shadows:** For high-priority floating elements (like a FAB or a modal), use a "Sport-Shadow":
    - Blur: 40px
    - Spread: -5px
    - Color: `on-surface` (#191c20) at 6% opacity.
- **The "Ghost Border" Fallback:** If accessibility requires a border, use `outline-variant` (#c2c6d1) at 15% opacity. It should be felt, not seen.

---

## 5. Components: Built for Motion
All components adhere to the **Subtle Roundedness** scale, utilizing the `1` corner radius for most elements and `full` (9999px) for interactive pills.

### Buttons (Kinetic Triggers)
- **Primary:** Flood-fill with the `primary` to `primary-container` gradient. 1 (Subtle) roundness. Text is `label-md` bold.
- **Secondary:** Transparent background with a `ghost border` (#c2c6d1 at 20%). On hover, fill with `primary-fixed-dim`.
- **Tertiary:** No background, no border. Use `primary` text. Use for low-emphasis actions.

### Cards & Lists (The "Anti-Grid")
- **The Divider Ban:** Never use a horizontal line to separate list items. Use generous vertical whitespace or alternating backgrounds of `surface` and `surface-container-low`.
- **Stat Cards:** Use `surface-container-lowest` with a 2px vertical accent bar on the left using the `tertiary` (#4e2000) color to highlight critical performance metrics.

### Input Fields
- Avoid "box" inputs. Use a subtle `surface-container-highest` background with a bottom-only 2px "active" stroke in `primary` that animates from the center outward when focused.

### Sports-Specific Components
- **The Momentum Meter:** Use a linear progress bar with the `tertiary-container` (#703201) color to indicate live game energy or athlete fatigue.
- **Performance Chips:** Use `full` roundness (9999px). Use `secondary-container` for neutral stats and `primary-container` for "highlight" or "winning" stats.

---

## 6. Do's and Don'ts

### Do:
- **Do** overlap elements. Let an image of an athlete break out of its container and overlap a headline.
- **Do** use massive white space. High-end editorial design breathes. If in doubt, add 16px more padding.
- **Do** use `tertiary` colors sparingly as "high-voltage" accents for alerts or live-action indicators.

### Don't:
- **Don't** use 1px solid black or dark grey borders. This immediately cheapens the premium feel.
- **Don't** use default Lexend weights for everything. Contrast the bold display sizes with regular-weight body text to create hierarchy.
- **Don't** crowd the interface. If the screen feels busy, you are losing the "Kinetic" aspect. Speed requires a clear path.

---

**Director's Closing Note:** 
Remember, this system is about the *feel* of the sport—the tension before the sprint, the precision of the play. Use the `primary-container` (#01457d) as your anchor and the Lexend scale as your voice. Every pixel should feel like it was placed with intent.