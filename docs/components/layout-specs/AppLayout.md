# Component Spec: AppLayout

This document outlines the specification for the main `AppLayout` component, which serves as the primary container for the application's interface.

## 1. Vision

The `AppLayout` component is responsible for the overall page structure. It will orchestrate the `Header` and `Sidebar` components and provide a main content area for the different application views. It must be responsive and use proper HTML5 landmark elements for accessibility.

## 2. Component Structure

The layout will be a standard two-column layout on larger screens and will adapt to a single-column layout on mobile.

```tsx
function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main id="main-content">
          {/* React Router's <Outlet /> will render the current route's component here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

## 3. Accessibility Requirements

- **Landmark Roles:** The component must use semantic HTML5 elements to define landmark regions:
  - `<header>` for the `Header` component.
  - `<nav>` within the `Sidebar` for the main navigation.
  - `<main>` for the primary content area.
- **Skip Navigation Link:** A "Skip to main content" link should be the very first focusable element on the page. This link will be visually hidden until focused and will allow keyboard and screen reader users to bypass the header and navigation to get directly to the main content. Its `href` should point to the `id` of the `<main>` element (e.g., `#main-content`).

## 4. Responsiveness

- **Desktop (e.g., > 768px):** A two-column layout with the `Sidebar` visible on the left and the `main` content area on the right.
- **Mobile (e.g., <= 768px):** The `Sidebar` may be hidden by default and revealed by a button in the `Header`. The main content area will take up the full width.

## 5. Example Usage

The `AppLayout` will be used as a top-level component in the router configuration.

```tsx
// In the router setup
createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <TodayView />,
      },
      // ... other routes
    ],
  },
]);
```
