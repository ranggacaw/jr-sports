# Design System Strategy: The Kinetic Professional

This design system is a high-end, editorial approach to corporate sports management. It rejects the "utility-first" aesthetic of standard admin dashboards in favor of a dynamic, layered experience that captures the energy of movement and the precision of professional competition. 

## 1. Overview & Creative North Star
**Creative North Star: "Precision Momentum"**
The design system focuses on the intersection of corporate stability and athletic dynamism. We achieve this through "Organic Structuralism"—a layout philosophy that uses rigid, high-readiness typography set against fluid, layered surfaces. 

By utilizing intentional asymmetry—such as shifting a headline off-center or allowing an image to bleed across container boundaries—we break the "template" feel. The interface shouldn't feel like a spreadsheet; it should feel like a premium sports magazine that has come to life.

---

## 2. Colors & Surface Philosophy
The palette balances the deep, authoritative `primary` blues with the electric, high-visibility `secondary` action greens. 

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders are prohibited for sectioning.** Structural boundaries must be defined through:
- **Tonal Shifts:** Placing a `surface_container_low` section atop a `surface` background.
- **Negative Space:** Using the spacing scale to create clear air between functional groups.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
1. **Base Level:** `surface` (#faf8ff) is your canvas.
2. **Structural Sections:** Use `surface_container` for the main content areas.
3. **Interactive Layers:** Use `surface_container_lowest` (#ffffff) for cards and interactive modules to create a "lifted" effect.

### The "Glass & Gradient" Rule
For floating elements, such as navigation bars or active participant overlays, use a Glassmorphism effect:
- **Background:** `surface_variant` at 60% opacity.
- **Effect:** `backdrop-filter: blur(12px)`.
- **Accent:** Apply a subtle linear gradient from `primary` (#0040a1) to `primary_container` (#0056d2) on main CTAs to give them "visual soul" and three-dimensional depth.

---

## 3. Typography: The Editorial Voice
We use a dual-sans-serif pairing to distinguish between "Action" and "Information."

*   **Display & Headlines (Lexend):** A geometric sans-serif chosen for its athletic, forward-leaning energy. Use `display-lg` for hero event titles to create a high-impact, prestigious feel.
*   **Body & Labels (Manrope):** A modern, functional sans-serif with high legibility. Manrope’s open counters ensure that participant lists and admin forms remain readable even at small scales.

**Hierarchy Note:** Use `headline-sm` in `primary` for section headers, and `label-md` in `on_surface_variant` for metadata. This contrast in weight and color ensures the user's eye follows a clear path of importance.

---

## 4. Elevation & Depth
Depth is a tool for focus, not just decoration.

*   **The Layering Principle:** Avoid shadows where possible. Instead, stack `surface_container_low` on `surface` to create depth through color math.
*   **Ambient Shadows:** If an element must float (e.g., a modal or a floating action button), use a shadow tinted with `on_surface`. 
    *   *Shadow:* `0px 12px 32px rgba(25, 27, 35, 0.06)`.
*   **The "Ghost Border":** For form fields or cards that require high definition on white backgrounds, use the `outline_variant` token at 15% opacity. Never use 100% black or grey borders.

---

## 5. Components

### Event Cards
Forbid divider lines. Use `surface_container_lowest` for the card body. 
- **Header:** Use `title-md` for the event name.
- **Status:** Place a status badge (see below) in the top right corner using 1.5rem padding.
- **Depth:** Transition the card to `surface_container_high` on hover to provide tactile feedback.

### Status Badges (Open/Closed)
- **Open:** Background: `secondary_container` (#6bfe9c). Text: `on_secondary_container` (#00743a). Use `label-md` in all caps for an "official" sporting look.
- **Closed:** Background: `error_container`. Text: `on_error_container`. 
- **Shape:** Use `roundedness.full` to create a pill shape that contrasts against the `md` corners of cards.

### Participant Lists
Forbid the use of horizontal rules. Separate participants by alternating backgrounds between `surface` and `surface_container_low`, or simply use generous `1rem` vertical spacing. Use `body-md` for names and `label-sm` for department or rank.

### Buttons
- **Primary:** `primary` background with `on_primary` text. Apply a `0.5rem` (`DEFAULT`) corner radius.
- **Secondary:** Use the `secondary_fixed` background. This "Action Green" is your primary conversion tool for "Join Event" or "Register."
- **Tertiary:** No background. Use `primary` text with a `label-md` weight.

### Form Fields (Admin)
- **Container:** `surface_container_highest` with a `Ghost Border`.
- **Focus State:** Transition the border to `primary` (#0040a1) at 100% opacity with a 2px stroke.
- **Label:** Always use `label-md` floating above the input to maintain a clean vertical rhythm.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins (e.g., 80px left, 40px right) on hero sections to create visual momentum.
*   **Do** use `secondary_fixed` (Action Green) sparingly for high-priority interactions only.
*   **Do** utilize `9999px` (full) roundedness for buttons and badges to make them feel "organic" and touchable.

### Don't
*   **Don't** use 1px solid lines to separate content. It breaks the "premium editorial" feel.
*   **Don't** use pure black for text. Use `on_surface` (#191b23) to keep the contrast high but the feel sophisticated.
*   **Don't** use standard "drop shadows." If it doesn't look like ambient light, it doesn't belong in this system.