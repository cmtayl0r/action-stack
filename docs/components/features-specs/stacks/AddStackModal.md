# Component Spec: AddStackModal

This document specifies the modal component for creating a new "stack".

## 1. Vision

This component provides the user interface for creating a new stack. It will appear as a modal dialog, containing a form with a single input for the stack's name. It must be fully accessible and provide clear feedback on submission.

## 2. Component Structure & Features

The component will be built using our base `Modal`, `Input`, and `Button` components. It will use the `useStacks` hook to access the `createStack` mutation.

```tsx
import { useStacks } from "src/hooks/data/useStacks";

function AddStackModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const { createStack, isLoading } = useStacks();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      await createStack(name);
      onClose(); // Close modal on success
    } catch (error) {
      // Error will be handled by the useStacks hook's onError callback
      // (e.g., a toast notification)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabelledBy="add-stack-title">
      <form onSubmit={handleSubmit}>
        <h2 id="add-stack-title">Create a New Stack</h2>
        <Input
          label="Stack Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Work Projects"
          autoFocus // Automatically focus the input when modal opens
        />
        <Button type="submit" loading={isLoading}>
          Create Stack
        </Button>
      </form>
    </Modal>
  );
}
```

## 3. Accessibility Requirements

- **Modal Accessibility:** All accessibility requirements from the `Modal` spec must be met (focus trap, Escape key, ARIA attributes).
- **Form Semantics:** The content should be wrapped in a `<form>` element with a clear submit button.
- **Initial Focus:** The `autoFocus` prop should be used on the `Input` component to ensure that when the modal opens, the user can immediately start typing the name of the new stack. This is a crucial usability and accessibility feature.

## 4. Data Flow

- The user enters a name for the new stack.
- On form submission, the `handleSubmit` function is called.
- `handleSubmit` calls the `createStack` function from the `useStacks` hook, passing the new name.
- `useStacks` handles the API call, optimistic updates, and server-side validation.
- Upon successful creation, the modal is closed.
