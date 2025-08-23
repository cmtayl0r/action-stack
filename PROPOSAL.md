# CSS Layout & Token Refactor Proposal

## 1. Executive Summary: Brutally Honest Assessment

The current CSS layout and token system is a solid, modern foundation based on established patterns (Every Layout, CUBE CSS). However, it suffers from several critical inefficiencies, duplications, and inconsistencies that will lead to maintenance debt and hinder scalability.

**The Good:**

- **Modern CSS:** Correctly uses custom properties, `clamp()`, `oklch()`, and container queries.
- **Semantic Primitives:** The layout classes (`.stack`, `.cluster`, `.grid`, etc.) are well-named and conceptually sound.
- **Accessibility Foundation:** `prefers-` media queries and `oklch()` show a commitment to accessibility.

**The Bad:**

- **Token Overload & Duplication:** `spacing.css` and `layout.css` have significant overlap and competing concepts. There are far too many spacing tokens, leading to decision fatigue and inconsistent application.
- **Conflicting Logic:** The `.wrapper` component has its own responsive padding logic that fights with the global responsive padding defined in `layout.css`.
- **Redundant Variants:** Many layout components (`.cluster`, `.grid`, `.stack`) define their own gap/spacing variants, completely ignoring the perfectly good `spacing.css` tokens. This is a major violation of the DRY principle.
- **Inconsistent Naming:** Custom property naming is inconsistent (e.g., `--cluster-gap` vs. just using a generic `--gap` or directly applying a space token).
- **Overly Complex Selectors:** The `.switcher`'s `nth-last-child` selectors are clever but brittle and hard for new developers to understand. There are simpler, more modern CSS techniques to achieve the same result.
- **`sidebar.css` Complexity:** The `flex-grow: 999` trick is a classic hack, but modern CSS like `flex: 1` on the main content and `flex: 0 0 var(--sidebar-width)` on the sidebar is more explicit and maintainable.

**Overall Grade: C+**. A good start, but it feels like several different strategies were stitched together without a unifying, simplifying pass. We can make this an **A+** system by ruthlessly simplifying and enforcing consistency.

## 2. Core Refactoring Principles

1.  **Single Source of Truth:** Spacing, colors, and layout constraints must come from **one** place: the `tokens` directory. Layout primitives should **consume** tokens, not redefine them.
2.  **Radical Simplification:** Drastically reduce the number of tokens. A smaller, more logical set of options leads to more consistent design.
3.  **Logical Properties over Custom Properties:** Use native CSS logical properties (`margin-block-start`, `padding-inline`, etc.) wherever possible. Only create a custom property when it needs to be dynamically changed by a modifier class.
4.  **Utility-First Mindset:** The goal is a system where we can compose layouts with minimal custom CSS, using the provided layout primitives and utility classes.

## 3. Step-by-Step Implementation Plan

### Step 1: Consolidate &amp; Simplify Spacing Tokens

- **File:** [`src/styles/tokens/spacing.css`](src/styles/tokens/spacing.css)
- **Action:** Deprecate the overly granular `space-1` to `space-24` scale. The core scale (`--space-2xs` to `--space-4xl`) is sufficient. The semantic aliases are good and should be kept. This reduces the token count by over 50%.

### Step 2: Refactor Layout Primitives to Use Spacing Tokens

This is the most critical part of the refactor. We will modify each layout primitive to use the new, simplified spacing tokens directly for their `gap` property, eliminating redundant modifier classes.

- **Target Files:**

  - [`src/styles/layout/cluster.css`](src/styles/layout/cluster.css)
  - [`src/styles/layout/grid.css`](src/styles/layout/grid.css)
  - [`src/styles/layout/stack.css`](src/styles/layout/stack.css) (will switch from margin to `gap`)
  - [`src/styles/layout/sidebar.css`](src/styles/layout/sidebar.css)
  - [`src/styles/layout/switcher.css`](src/styles/layout/switcher.css)

- **Action:**

  1.  Remove all spacing/gap modifier classes from these files (e.g., `.cluster--2xs`, `.grid--gap-sm`, etc.).
  2.  Change the base class to use `gap: var(--space-md);` as a sensible default.
  3.  **Introduce a new utility-based approach.** We will create a `g-*` utility class system that can be applied to any of these layout primitives to control their gap.

  **Example: New `cluster.css`**

  ```css
  /* src/styles/layout/cluster.css */
  .cluster {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap, var(--space-md)); /* Default gap */
    align-items: center;
  }
  /* Justification variants remain */
  .cluster--space {
    justify-content: space-between;
  }
  /* ... etc. */

  /* All gap variants like .cluster--xs are DELETED */
  ```

  **Example: New `stack.css` (Modernized)**

  ```css
  /* src/styles/layout/stack.css */
  .stack {
    display: flex;
    flex-direction: column;
    gap: var(--gap, var(--space-md)); /* Use gap instead of owl selector */
  }
  /* We no longer need the .stack > * + * selector */

  /* All margin-based spacing variants are DELETED */
  ```

### Step 3: Create a Global Gap Utility System

- **New File:** `src/styles/utils/gaps.css` (and import it in `main.css`).
- **Action:** Create utility classes that set the `--gap` custom property. These can then be applied to _any_ layout component.

  **Example: `gaps.css`**

  ```css
  /* Sets the --gap property for any element */
  .g-2xs {
    --gap: var(--space-2xs);
  }
  .g-xs {
    --gap: var(--space-xs);
  }
  .g-sm {
    --gap: var(--space-sm);
  }
  .g-md {
    --gap: var(--space-md);
  }
  .g-lg {
    --gap: var(--space-lg);
  }
  .g-xl {
    --gap: var(--space-xl);
  }
  .g-2xl {
    --gap: var(--space-2xl);
  }
  .g-3xl {
    --gap: var(--space-3xl);
  }
  .g-none {
    --gap: 0;
  }
  ```

  **Usage in HTML:**

  ```html
  <div class="cluster g-sm">...</div>
  <div class="grid g-lg">...</div>
  ```

### Step 4: Simplify `.wrapper.css`

- **File:** [`src/styles/layout/wrapper.css`](src/styles/layout/wrapper.css)
- **Action:**
  1.  Remove the breakpoint-specific media queries for `.wrapper--responsive`. This is overly complicated.
  2.  The base `.wrapper` class already correctly uses `max-width` tokens and responsive `padding-inline`. The specific width variants (`.wrapper--xs`, `.wrapper--sm`, etc.) are sufficient for controlling max-width. The component should not be trying to be "smart" when simple, explicit variants are clearer.
  3.  Remove the mobile-first responsive padding overrides at the end of the file. The `clamp()` function on the base `.wrapper` should handle this gracefully.

### Step 5: Refactor `.sidebar.css` for Clarity

- **File:** [`src/styles/layout/sidebar.css`](src/styles/layout/sidebar.css)
- **Action:**
  1.  Replace the `flex-grow: 999` and `flex-basis: 0` hack.
  2.  Set the main content (`:last-child` by default) to `flex: 1 1 var(--content-min-width, 60%);`. This allows it to grow and shrink with a minimum size.
  3.  Set the sidebar (`:first-child` by default) to `flex: 0 0 var(--sidebar-width, 20rem);`. This gives it a fixed, non-growing, non-shrinking width.
  4.  The container query logic for stacking on small screens is good and should be kept.

## 4. Final Approval

This plan streamlines the entire layout system, making it more robust, easier to maintain, and more intuitive to use. It reduces CSS size, eliminates conflicting rules, and establishes a clear "single source of truth" for all spacing decisions.

Please review this proposal. I will await your approval before proceeding with any code changes.
