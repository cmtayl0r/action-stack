# Button Component Improvement Plan

This document outlines the plan to refactor and enhance the `Button` component, focusing on styling, icon integration, accessibility, and overall code quality.

## 1. Styling Overhaul & Token Integration

The current styling has a good foundation but can be significantly improved by fully leveraging the design token system and simplifying the CSS structure.

### Issues:

- **Token-Color Mismatch**: The button variants (`primary`, `destructive`, etc.) in `Button.tsx` do not align with the semantic color tokens available (e.g., `--surface-primary`, `--surface-error`). This leads to style inconsistencies.
- **CSS Over-complication**: The separation between `Button.module.css` and `interactive-states.css` is causing style overlaps and specificity issues (e.g., disabled states are defined in both files).
- **Inconsistent Naming**: The CSS class naming for icons (`btn__icon`) could be more consistent with BEM naming conventions.

### Plan:

1.  **Align Variants with Tokens**: Update the `variant` prop in `ButtonProps` to match the available semantic tokens (`primary`, `secondary`, `accent`, `error`, `success`, etc.).
2.  **Consolidate Styles**: Merge the relevant styles from `interactive-states.css` directly into `Button.module.css` to create a single source of truth for the button component. This will reduce complexity and make the component more self-contained.
3.  **Refactor CSS**: Rewrite the CSS in `Button.module.css` to use the semantic color tokens from `color-semantics.css` for `background-color`, `color`, and `border-color` for all button variants and states (hover, active, disabled).
4.  **Simplify Disabled State**: Use a single `.btn:disabled` selector instead of chaining every variant with `:disabled`. The `[aria-disabled="true"]` attribute selector can also be used for better accessibility.

## 2. Icon System Implementation

The current icon implementation is functional but not very flexible. The goal is to create a generic system that can accommodate any icon library, like `lucide-react`, while maintaining proper styling and accessibility.

### Issues:

- ** inflexible `icon` Prop**: The `icon` prop accepts a `ReactNode`, which is good, but doesn't provide a way to pass props to the icon component (like `size`).
- **Styling gaps**: The icon-related CSS classes are mostly empty.
- **Accessibility**: For icon-only buttons, an `aria-label` is crucial but not enforced. The `children` prop should be used as the `aria-label` in this case.

### Plan:

1.  **Improve Icon Prop**: Change the `icon` prop to accept a component type, for example `icon: React.ElementType`. This will allow passing the icon component itself (e.g., `icon={IconName}`) and let the `Button` render it with the correct props.
2.  **Pass Icon Props**: Pass down props like `size` and `className` to the icon component dynamically. This allows the button's `size` prop to control the icon's size.
3.  **Complete Icon CSS**: Add styles for icon sizing and spacing within `Button.module.css`. Use CSS variables derived from the size variant to control the icon's dimensions.
4.  **Enforce Accessibility for Icon-Only Buttons**:
    - When `iconOnly` is true, the `children` prop should be treated as the accessible name for the button.
    - Programmatically add `aria-label={children}` to the button element.
    - Visually hide the `children` text using an `sr-only` class.
    - Throw a development-time error if `iconOnly` is true but `children` (for the `aria-label`) is not provided.

## 3. Critical Issues & Other Improvements

Several other issues need to be addressed to make the component more robust and maintainable.

### Issues:

- **Accessibility Gaps**:
  - The `announceAction` prop is a good idea but isn't implemented. A utility hook for screen reader announcements would be beneficial.
  - There is no visual focus indicator defined; the default browser outline is likely being reset.
- **`clsx` usage**: The `clsx` library is used, but some conditional classes are applied with `&&`, which is less clean.
- **Loading State**: The loading state needs a proper spinner component instead of placeholder text.

### Plan:

1.  **Implement Screen Reader Announcements**: Create a `useScreenReaderAnnouncer` hook to handle dynamic announcements for actions like loading states or async operations.
2.  **Add Clear Focus States**: Implement a non-obtrusive but clearly visible focus ring using `box-shadow` and the `--border-focus` token. This is a critical accessibility requirement.
3.  **Refine `clsx` Usage**: Consistently use the object syntax in `clsx` for all conditional classes to improve readability.
4.  **Integrate Loading Spinner**: Replace the placeholder `<span>` in the loading state with an actual `LoadingSpinner` component. Ensure the spinner's color adapts to the button's variant for good contrast.
5.  **Add `aria-live` for Loading**: When `isLoading` is true, add an `aria-live="polite"` region to announce the loading state to screen readers.
6.  **Add `outline` variant styles**: The `outline` variant is defined in the props, but has no corresponding styles. This should be implemented.

By executing this plan, the `Button` component will become a core, reliable, and highly reusable part of the application's design system.
