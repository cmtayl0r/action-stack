# Component Spec: Sidebar

This document details the specification for the `Sidebar` component, which is the primary navigation area of the application.

## 1. Vision

The `Sidebar` provides users with access to their main views and list of "stacks" (task lists). It must be navigable using a keyboard and provide clear context to screen reader users about the application's structure.

## 2. Props Interface

```typescript
interface SidebarProps {
  isOpenOnMobile?: boolean;
}
```

## 3. Component Structure & Features

The `Sidebar` will contain:

- A main navigation section for primary views like "Inbox", "Today", and "This Week".
- A list of user-created stacks. This list will be dynamic and fetched from the server.
- A button to create a new stack, which would likely trigger a modal.

```tsx
function Sidebar({ isOpenOnMobile }: SidebarProps) {
  return (
    <aside className={`app-sidebar ${isOpenOnMobile ? "is-open" : ""}`}>
      <nav aria-label="Main navigation">
        <ul>
          <li>
            <NavLink to="/inbox">Inbox</NavLink>
          </li>
          <li>
            <NavLink to="/today">Today</NavLink>
          </li>
        </ul>
      </nav>
      <nav aria-label="Your stacks">
        <h2>Your Stacks</h2>
        <ul>
          {/* Dynamically render user's stacks here */}
          {stacks.map((stack) => (
            <li key={stack.id}>
              <NavLink to={`/stack/${stack.id}`}>{stack.name}</NavLink>
            </li>
          ))}
        </ul>
        <Button onClick={openAddStackModal}>+ New Stack</Button>
      </nav>
    </aside>
  );
}
```

## 4. Accessibility Requirements

- **Landmark:** The component should use an `<aside>` element as its main container. Within the aside, two distinct `<nav>` elements should be used, one for main navigation and one for the user's stacks. Each `<nav>` must have a unique and descriptive `aria-label`.
- **Navigation Links:** Use a routing library's `NavLink` component (or similar) to automatically apply an `aria-current="page"` attribute to the link corresponding to the currently active page.
- **Headings:** The "Your Stacks" title should be a heading (e.g., `<h2>`) to provide structure within the navigation landmark.

## 5. Responsiveness

- **Desktop:** The sidebar is persistently visible on the left side of the screen.
- **Mobile:** The sidebar is hidden off-screen by default and slides into view when toggled. Its visibility is controlled by the `isOpenOnMobile` prop. When open on mobile, it may cover the main content area.
