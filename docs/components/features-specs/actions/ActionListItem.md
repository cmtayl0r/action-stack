# Component Spec: ActionListItem

This document specifies the component for rendering a single "action" (todo item).

## 1. Vision

The `ActionListItem` is the core representation of a task. It must clearly display the task's text and provide an accessible way to mark it as complete. It should be designed to work as a standalone item within an `ActionList`.

## 2. Props Interface

```typescript
interface ActionListItemProps {
  action: Action; // The action object from the database
  onToggleComplete: (actionId: string, currentState: boolean) => void;
}
```

## 3. Component Structure & Features

The component will consist of a checkbox and a label.

```tsx
function ActionListItem({ action, onToggleComplete }: ActionListItemProps) {
  const checkboxId = `action-${action.id}`;

  return (
    <li className="action-list-item">
      <input
        type="checkbox"
        id={checkboxId}
        checked={action.completed}
        onChange={() => onToggleComplete(action.id, action.completed)}
      />
      <label htmlFor={checkboxId}>{action.text}</label>
    </li>
  );
}
```

## 4. Accessibility Requirements

- **Semantic HTML:** The component should be rendered as an `<li>` element, as it will live inside an `ActionList` (`<ul>`).
- **Checkbox and Label:** A native `<input type="checkbox">` is highly recommended for its built-in accessibility. The `<label>` must be correctly associated with the checkbox using the `htmlFor` and `id` attributes. This ensures that clicking the label toggles the checkbox.
- **State Indication:** When an action is completed, a visual change (like a strikethrough on the label text) should be applied, but this should not be the _only_ indication. The `checked` state of the checkbox is the primary semantic indicator.
- **Focus Order:** The tab order should flow naturally from the checkbox to the next interactive element.

## 5. Styling

- The component should have a clear `hover` state to indicate interactivity.
- The layout should be a flex container to ensure the checkbox and label are properly aligned.
