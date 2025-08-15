# Component Spec: ActionList

This document specifies the component for rendering a list of "actions" (todo items).

## 1. Vision

The `ActionList` is a container that fetches and displays a list of `ActionListItem` components. It's responsible for orchestrating the display of the list, handling loading and empty states, and serving as the semantic container for the items.

## 2. Props Interface

```typescript
interface ActionListProps {
  stackId?: string; // Optional: If provided, fetches actions for a specific stack.
}
```

## 3. Component Structure & Features

The component will use the `useActions` hook to fetch data and will then map over the results to render the list.

```tsx
function ActionList({ stackId }: ActionListProps) {
  const { actions, isLoading, error, updateAction } = useActions({ stackId });

  if (isLoading) {
    return <p>Loading actions...</p>; // Or a loading spinner
  }

  if (error) {
    return <p>Error loading actions.</p>; // Or an error component
  }

  if (!actions || actions.length === 0) {
    return <p>No actions yet. Add one to get started!</p>;
  }

  const handleToggleComplete = (actionId: string, currentState: boolean) => {
    updateAction(actionId, { completed: !currentState });
  };

  return (
    <ul aria-labelledby="action-list-title">
      {/* The title should be provided by the parent component, e.g., StackView's title */}
      {actions.map((action) => (
        <ActionListItem
          key={action.id}
          action={action}
          onToggleComplete={handleToggleComplete}
        />
      ))}
    </ul>
  );
}
```

## 4. Accessibility Requirements

- **Semantic HTML:** The list must be rendered within a `<ul>` (unordered list) element.
- **List Label:** The `<ul>` element should have an `aria-labelledby` attribute that points to the ID of the visible heading for that list (e.g., the name of the stack). This provides context to screen reader users about what list they are navigating.
- **Loading State:** A loading state should be communicated to screen reader users, for instance, by using an ARIA live region to announce that content is loading.
- **Empty State:** A clear message should be displayed when there are no actions to show.

## 5. Data Flow

- The `ActionList` component will be responsible for fetching its own data via the `useActions` hook.
- It will pass down the necessary data and callback functions (`onToggleComplete`) to the `ActionListItem` components.
