# Component Spec: AddActionModal

This document specifies the modal component for creating a new "action".

## 1. Vision

This component provides the UI for the "Instant Capture" workflow (US-001). It will be a streamlined modal form for quickly adding a new action. It can be invoked from a global "add" button and should allow the user to optionally select a stack for the new action.

## 2. Props Interface

```typescript
interface AddActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional: If the modal is opened from a specific StackView,
  // the stackId can be pre-selected.
  initialStackId?: string;
}
```

## 3. Component Structure & Features

The modal will contain a form with an input for the action's text and a select menu to choose a stack.

```tsx
import { useActions } from "src/hooks/data/useActions";
import { useStacks } from "src/hooks/data/useStacks";

function AddActionModal({
  isOpen,
  onClose,
  initialStackId,
}: AddActionModalProps) {
  const [text, setText] = useState("");
  const [selectedStackId, setSelectedStackId] = useState(initialStackId || "");
  const { createAction, isLoading } = useActions({ stackId: selectedStackId });
  const { stacks } = useStacks();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;

    try {
      await createAction({ text, stack_id: selectedStackId || null });
      onClose();
    } catch (error) {
      // Error is handled by the useActions hook
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabelledBy="add-action-title">
      <form onSubmit={handleSubmit}>
        <h2 id="add-action-title">Add a New Action</h2>
        <Input
          label="Action"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Follow up with the design team"
          autoFocus
        />
        <label htmlFor="stack-select">Add to Stack (optional)</label>
        <select
          id="stack-select"
          value={selectedStackId}
          onChange={(e) => setSelectedStackId(e.target.value)}
        >
          <option value="">Inbox</option>
          {stacks?.map((stack) => (
            <option key={stack.id} value={stack.id}>
              {stack.name}
            </option>
          ))}
        </select>
        <Button type="submit" loading={isLoading}>
          Add Action
        </Button>
      </form>
    </Modal>
  );
}
```

## 4. Accessibility Requirements

- **Modal and Form:** All accessibility requirements from the `Modal` and form specs apply.
- **Select Menu:** The `<select>` element must have an associated `<label>`.
- **Initial Focus:** The main text input should be focused automatically when the modal opens.

## 5. Data Flow

- On mount, the component uses the `useStacks` hook to populate the stack selection dropdown.
- The user enters text for the new action and optionally selects a stack.
- On submit, the `createAction` function from the `useActions` hook is called.
- The hook handles the optimistic update, API call, and any necessary cache invalidation.
- The modal closes on success.
