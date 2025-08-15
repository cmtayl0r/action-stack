# Component Spec: Header

This document outlines the specification for the `Header` component, which sits at the top of the application.

## 1. Vision

The `Header` provides top-level navigation, branding, and access to primary actions like search or user settings. It must be responsive and use the `<header>` landmark element.

## 2. Props Interface

```typescript
interface HeaderProps {
  // On mobile, this function will toggle the visibility of the Sidebar.
  onToggleSidebar?: () => void;
}
```

## 3. Component Structure & Features

The `Header` will contain:

- A button to toggle the `Sidebar` on mobile viewports. This button should only be visible on smaller screens.
- The application logo or title, which serves as a link to the homepage.
- A primary action button, which could be used to open a "Quick Add" modal or a search modal.
- A user menu or avatar that provides access to settings and logout functionality.

```tsx
function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="left-section">
        <button
          className="sidebar-toggle" // Hidden on desktop
          onClick={onToggleSidebar}
          aria-label="Open navigation menu"
        >
          {/* Hamburger Icon */}
        </button>
        <a href="/" aria-label="Action Stack - Home">
          {/* Logo or App Title */}
        </a>
      </div>
      <div className="right-section">
        {/* Search Button or other primary action */}
        {/* User Profile/Menu Button */}
      </div>
    </header>
  );
}
```

## 4. Accessibility Requirements

- **Landmark:** The component must be wrapped in a `<header>` element.
- **Logo Link:** The logo or app title should be an `<a>` tag pointing to the root (`/`) and have a descriptive `aria-label` like "Action Stack - Home".
- **Mobile Toggle:** The sidebar toggle button must have a clear `aria-label`, such as "Open navigation menu", and `aria-expanded` should be used to indicate the state of the sidebar.

## 5. Responsiveness

- **Desktop:** All elements are visible in a row. The sidebar toggle is hidden.
- **Mobile:** The sidebar toggle is visible. Some elements might be simplified or represented by icons to save space.
