# Component Spec: StackList

This document specifies the component for rendering the list of "stacks" (task lists) in the application's sidebar.

## 1. Vision

The `StackList` component provides the user with navigation to their various task lists. It's responsible for fetching and displaying the list of stacks and indicating which stack is currently active.

## 2. Props Interface

This component may not require any props, as it will manage its own data fetching.

```typescript
interface StackListProps {}
```

## 3. Component Structure & Features

The component will use the `useStacks` hook to get the list of stacks and render them as navigation links.

```tsx
function StackList(props: StackListProps) {
  const { stacks, isLoading, error } = useStacks();
  // We'll also need a way to open the "Add Stack" modal

  if (isLoading) {
    return <p>Loading stacks...</p>;
  }

  if (error) {
    return <p>Error.</p>;
  }

  return (
    <nav aria-label="Your stacks">
      <h2>Your Stacks</h2>
      <ul>
        {stacks?.map((stack) => (
          <li key={stack.id}>
            <NavLink to={`/stack/${stack.id}`}>{stack.name}</NavLink>
          </li>
        ))}
      </ul>
      <Button onClick={openAddStackModal}>+ New Stack</Button>
    </nav>
  );
}
```

## 4. Accessibility Requirements

- **Landmark:** As specified in the `Sidebar` spec, this component will be wrapped in a `<nav>` element with a descriptive `aria-label` like "Your stacks".
- **Heading:** The list should be preceded by a heading (e.g., `<h2>`) to give it a proper structure that screen readers can parse.
- **Active Link:** `NavLink` (from `react-router-dom`) should be used for the links to ensure the currently active link receives `aria-current="page"`, clearly indicating the user's current location.

## 5. Data Flow

- The `StackList` component fetches its own data using the `useStacks` hook.
- It renders `NavLink` components that will trigger a route change when clicked, causing the `StackView` component to be rendered in the main content area.
