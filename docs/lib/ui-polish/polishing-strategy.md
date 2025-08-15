# UI Polishing Strategy

This document outlines the strategy for implementing UI polishing tasks that enhance the user experience, including animations, empty states, and loading indicators.

## 1. Guiding Principles

- **Purposeful, Not Distracting:** All animations and transitions should have a clear purpose, such as guiding the user's attention or providing feedback. They should not be purely decorative.
- **Performant:** Animations must be smooth and not cause jank or layout shifts. We will prioritize CSS transitions and animations on the `transform` and `opacity` properties.
- **Accessible:** All polishing features must respect user preferences, particularly `prefers-reduced-motion`.

## 2. System-Wide Polishing Tasks

### Loading Indicators

- **Strategy:** When data is being fetched (e.g., the initial load of actions), a clear loading indicator should be displayed.
- **Implementation:** We will create a generic `LoadingSpinner` component. This component will be displayed conditionally based on the `isLoading` state returned from our React Query hooks. For accessibility, the loading state should be announced to screen readers (e.g., "Loading actions...").

### Empty States

- **Strategy:** When a list is empty (e.g., no actions in a stack), we must display a helpful empty state message instead of a blank space.
- **Implementation:** The empty state should include a friendly message and, if applicable, a call-to-action button. For example: "No actions yet. Why not add one?" followed by an "Add Action" button.

### Skeletal Loading (Advanced)

- For future releases, we can implement skeletal loading screens (shimmering placeholders) for a more refined loading experience, but for the MVP, simple spinners are sufficient.

## 3. Animations & Transitions

### `prefers-reduced-motion`

- **Strategy:** This is non-negotiable. All animations must be disabled if the user has `prefers-reduced-motion` enabled in their system settings.
- **Implementation:** We will use a media query in our global CSS.

  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```

### Specific Transitions

- **Component Entry/Exit:** Lists of items (e.g., `ActionList`) can have a subtle fade-in and slide-up animation when new items are added. Libraries like `Framer Motion` can be used to manage these animations on an item-by-item basis.
- **Modal/BottomSheet:** The opening and closing of modals and bottom sheets should be animated (e.g., a fade-in for the backdrop and a scale-up or slide-up for the content) to feel less jarring.

By following this strategy, we can ensure a polished, professional, and accessible user experience.
