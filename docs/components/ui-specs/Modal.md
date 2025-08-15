# Component Spec: Modal

This document specifies the requirements for a highly accessible `Modal` component, which is crucial for overlaying content and forms.

## 1. Vision

The `Modal` component should provide a robust, accessible foundation for displaying content in an overlay. It must handle focus trapping, keyboard interactions, and be dismissible in an intuitive manner, all while being screen-reader-friendly.

## 2. Props Interface

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledBy: string; // ID of the modal title element
  ariaDescribedBy?: string; // ID of an element describing the modal's content
}
```

## 3. Accessibility Requirements

- **Focus Trapping:** When the modal is open, focus must be trapped within it. Users should not be able to tab to elements in the underlying page.
- **Initial Focus:** When the modal opens, focus should be moved to the first focusable element inside the modal, or to the modal container itself.
- **Keyboard Interaction:**
  - The `Escape` key must close the modal.
  - `Tab` and `Shift+Tab` should cycle through focusable elements _within_ the modal.
- **Screen Reader Support:**
  - The modal dialog should have `role="dialog"`.
  - It must have `aria-modal="true"`.
  - It must be labelled via `aria-labelledby` (pointing to the modal's title) and optionally described by `aria-describedby`.
- **Closing:** The `onClose` function should be triggered by the `Escape` key, clicking an explicit close button, or clicking on an overlay/backdrop.

## 4. Structural and Styling guidance

- The component should use a React Portal to render the modal at the top level of the DOM (e.g., appended to `document.body`). This helps avoid z-index issues.
- It should consist of a backdrop/overlay element and the modal container itself.
- The `isOpen` prop will control the visibility of the modal. CSS transitions can be used for smooth entry and exit animations.
- A custom hook, `useFocusTrap`, is recommended to handle the complex focus management logic.

## 5. Example Usage

```tsx
function MyFeature() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ariaLabelledBy="my-modal-title"
      >
        <h2 id="my-modal-title">My Modal Title</h2>
        <p>This is the content of the modal.</p>
        <Button onClick={() => setIsModalOpen(false)}>Close</Button>
      </Modal>
    </>
  );
}
```
