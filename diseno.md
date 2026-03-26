```markdown
# Design System Strategy: The Luminous Merchant

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Radiant Curator."**

We are moving away from the cold, clinical "grid-of-boxes" that plagues modern e-commerce. Instead, we are building a digital flagship store that feels alive, warm, and hyper-tactile. The system leverages high-energy orange tones and bold editorial typography to create a sense of urgency and excitement, while the "glass" surfaces and warm off-white backgrounds provide a premium, sophisticated anchor.

By utilizing intentional asymmetry—such as overlapping product imagery and massive display type that bleeds off the container—we break the "template" look to create an experience that feels custom-tailored and high-end.

---

## 2. Colors & Surface Philosophy
The palette is a high-contrast dialogue between energetic oranges and a soft, breathable foundation.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be established exclusively through background color shifts. For example, a `surface-container-low` (#f1f1f0) section should sit directly against the `background` (#f7f6f5).

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials.
- **Level 0 (Base):** `background` (#f7f6f5) - The expansive floor of the experience.
- **Level 1 (Sections):** `surface-container-low` (#f1f1f0) - Used for large content blocks.
- **Level 2 (Cards/Modules):** `surface-container-lowest` (#ffffff) - Used to make products pop with a crisp, clean lift.
- **Level 3 (Interactive):** `primary-container` (#ff7856) - For active states or highlighted callouts.

### The "Glass & Gradient" Rule
To achieve "The Radiant Curator" look, use Glassmorphism for floating navigation and modal overlays.
* **Glass Specs:** `surface` color at 70% opacity with a `24px` backdrop-blur.
* **Signature Textures:** Main CTAs and Hero sections must use a linear gradient from `primary` (#af2700) to `primary-container` (#ff7856) at a 135-degree angle. This adds "soul" and prevents the vibrant orange from feeling flat or "cheap."

---

## 3. Typography: The Editorial Voice
We use typography as a structural element, not just for legibility.

* **Display & Headline (Epilogue):** Chosen for its geometric weight. Use `display-lg` (3.5rem) for hero statements. Don't be afraid to use tight letter-spacing (-0.02em) on headlines to create a "blocky," authoritative retail feel.
* **Title & Body (Plus Jakarta Sans):** A friendly, modern humanist face. It provides high legibility for product descriptions and specs.
* **Hierarchy as Brand:** Use a massive scale contrast. Pair a `display-md` headline with a `body-sm` caption nearby. This "Big & Small" tension is what creates the high-end editorial aesthetic.

---

## 4. Elevation & Depth
Depth in this system is atmospheric, not structural.

* **Tonal Layering:** Avoid shadows for static components. A `surface-container-highest` (#dcdddc) button on a `surface` (#f7f6f5) background provides enough contrast to be interactive without adding visual "noise."
* **Ambient Shadows:** For floating elements (like a "Quick Add" cart), use "Glowing Shadows." Instead of gray, use the `on-surface` color at 6% opacity with a blur of `40px` and a Y-offset of `12px`.
* **The Ghost Border Fallback:** If accessibility requires a stroke, use `outline-variant` (#adadac) at **15% opacity**. It should be felt, not seen.
* **Corner Logic:** Everything uses the `lg` (2rem / 32px) or `md` (1.5rem / 24px) tokens. This extreme roundness conveys friendliness and removes the "sharpness" often associated with aggressive sales platforms.

---

## 5. Components

### Buttons
* **Primary:** Vibrant Orange Gradient (`primary` to `primary-container`). `full` (9999px) roundedness.
* **Secondary:** Glassmorphic. `surface-container-lowest` at 40% opacity with backdrop-blur. No border.
* **Tertiary:** Bold `primary` text with an underline that only appears on hover.

### Cards & Lists (The Divider-Free Zone)
* **Cards:** Use `surface-container-lowest` (#ffffff) with the `lg` (2rem) corner radius.
* **Content Separation:** Forbid 1px dividers. Separate list items using the `Spacing 6` (2rem) token. Let the negative space do the work. Use a subtle background shift to `surface-container-low` on hover to indicate interactivity.

### Input Fields
* **Styling:** Large `md` (1.5rem) rounded corners. Background set to `surface-container-highest`.
* **Focus State:** A 2px "Ghost Border" using `primary-fixed-dim` at 40% opacity. No harsh black outlines.

### Signature Component: The "Floating Action Tray"
An e-commerce specific component. A glassmorphic bar that sits at the bottom of the viewport containing the price and "Add to Cart" button. It uses the `surface` token at 80% opacity with a heavy backdrop-blur and a subtle `on-secondary-container` glow shadow.

---

## 6. Do’s and Don'ts

### Do
* **Do** overlap elements. Let a product image break the bounds of its container and bleed into the background.
* **Do** use the `24px` (md) and `32px` (lg) radii consistently to maintain the "friendly" brand promise.
* **Do** use high-contrast type scales (e.g., placing `label-sm` metadata immediately under a `headline-lg` price).

### Don't
* **Don't** use pure black (#000000) for text. Always use `on-surface` (#2e2f2f) to maintain the warmth of the off-white background.
* **Don't** use standard "Drop Shadows." If a card needs lift, use a tonal background shift or an ambient, tinted glow.
* **Don't** use hard lines. If you feel the urge to draw a line, use a `1.4rem` (Spacing 4) gap instead.

---
**Director's Final Note:** This design system is about the *energy of the find*. Every interaction should feel like a soft, glowing invitation. If the layout feels too "neat" or "boxed in," break a grid line. Push the typography harder. Let the orange breathe.```