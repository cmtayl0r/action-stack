# Component Spec: StackView

This document specifies the component for the main view of a single "stack" (task list).

## 1. Vision

The `StackView` is the primary content component for the `stack/:stackId` route. It's responsible for displaying the title of the stack and rendering the corresponding `ActionList` for that stack.

## 2. Props Interface

This component will not receive props directly, as it will get the `stackId` from the URL via React Router's hooks.

```typescript
interface StackViewProps {}
```

## 3. Component Structure & Features

The component will use the `useParams` hook from `react-router-dom` to get the `stackId` and then render the stack's title and the `ActionList`.

```tsx
import { useParams } from "react-router-dom";
import { useStacks } from "src/hooks/data/useStacks"; // To get the stack name
import ActionList from "../actions/ActionList";

function StackView(props: StackViewProps) {
  const { stackId } = useParams<{ stackId: string }>();
  const { stacks } = useStacks(); // Assumes useStacks fetches all stacks

  // Find the current stack to display its name
  const currentStack = stacks?.find((stack) => stack.id === stackId);

  if (!stackId) {
    return <p>Stack not found.</p>;
  }

  return (
    <div className="stack-view">
      <h1 id="action-list-title">{currentStack?.name || "Loading..."}</h1>
      <ActionList stackId={stackId} />
    </div>
  );
}
```

## 4. Accessibility Requirements

- **Heading:** The name of the stack must be the main heading (`<h1>`) for this view. This heading must have an `id` (e.g., `action-list-title`).
- **Connecting List to Heading:** The `ActionList` component's `<ul>` will use the `id` from the `<h1>` for its `aria-labelledby` attribute. This creates a semantic link, telling screen reader users that the list of actions belongs to this heading. This is a critical accessibility connection.

## 5. Data Flow

- `StackView` reads the `stackId` from the URL.
- It uses the `useStacks` hook (or another method) to find the name of the corresponding stack to render in the `<h1>`.
- It passes the `stackId` as a prop to the `ActionList` component.
- `ActionList` then takes over, using the `stackId` to fetch and render only the actions belonging to that stack.
