# Error Handling Strategy

This document outlines the strategy for handling errors gracefully within the Action Stack application.

## 1. Guiding Principles

- **No White Screens:** The user should never see a blank white screen. A critical error should result in a user-friendly message with a way to recover (e.g., by refreshing the page).
- **Informative, Not Alarming:** API errors (e.g., failing to save an action) should be communicated clearly without disrupting the entire user experience.
- **Accessible Feedback:** All error feedback must be accessible to users of assistive technology.

## 2. Two-Level Strategy

### Level 1: React Error Boundaries (for Critical Errors)

- **Purpose:** To catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the crashed component tree.
- **Implementation:** We will create a generic `ErrorBoundary` component.
  - This component will use the `getDerivedStateFromError` and `componentDidCatch` lifecycle methods.
  - The fallback UI will be a simple, centered message like: "Something went wrong. Please try refreshing the page." It will include a refresh button.
- **Usage:**
  - A primary `ErrorBoundary` will wrap the entire `AppLayout` in our main `App.tsx` file to catch unexpected application-wide errors.
  - Additional, more granular `ErrorBoundary` components could be wrapped around specific complex features if needed.

### Level 2: Toast Notifications (for Non-Critical Errors)

- **Purpose:** To provide unobtrusive feedback for recoverable errors, typically those that occur during asynchronous operations (e.g., API calls).
- **Implementation:**
  - We will create a `Toast` component and a `ToastHost` component that will manage and display a list of toasts (typically in a corner of the screen).
  - A `useToasts` hook will provide a global function (e.g., `addToast`) that can be called from anywhere in the app to display a new notification.
- **Usage:**
  - The `onError` callbacks in our React Query mutations (`useActions`, `useStacks`) are the perfect place to call `addToast`.
  - When `createAction` fails, instead of crashing, the optimistic update is rolled back, and a toast appears saying, "Failed to create action. Please try again."
- **Accessibility:**
  - The `ToastHost` container will be an ARIA live region (`aria-live="assertive"`) so that toasts are automatically announced by screen readers.
  - Toasts should have a close button and should disappear automatically after a reasonable timeout (e.g., 5-7 seconds).

This two-level approach ensures that we can handle both unexpected crashes and predictable API failures in a way that is robust, user-friendly, and accessible.
