# Component Spec: BottomSheet

This document specifies a `BottomSheet` component, a mobile-optimized alternative to a standard modal.

## 1. Vision

A bottom sheet is a container that slides up from the bottom of the screen to reveal content. It's a common pattern in native mobile apps and provides an ergonomic user experience for actions on touch devices. It will serve as a container for forms like "Add Action" or "Filter" options on mobile viewports.

## 2. Props Interface

The props are similar to the `Modal` component.

```typescript
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ariaLabelledBy: string; // ID of the title element within the sheet
}
```

## 3. Component Structure & Features

The component will use a library like `react-spring` or `framer-motion` to handle the slide-up and slide-down animations for a smooth, native-like feel.

```tsx
function BottomSheet({
  isOpen,
  onClose,
  children,
  ariaLabelledBy,
}: BottomSheetProps) {
  // Logic to handle animation based on `isOpen` state.
  // The component will render a backdrop and a content container.

  return (
    // Portal to render at the top level
    <>
      {/* Backdrop to cover the page content */}
      <div className="backdrop" onClick={onClose} />

      {/* The animated sheet itself */}
      <div
        className="bottom-sheet-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </>
  );
}
```

## 4. Accessibility Requirements

All accessibility requirements from the `Modal` specification apply here, as a bottom sheet is functionally a type of modal.

- **Focus Trapping:** `useFocusTrap` must be used to contain focus within the sheet when it's open.
- **Keyboard Interaction:** The `Escape` key must close the sheet.
- **ARIA Attributes:** `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` are mandatory.

## 5. Implementation Strategy

- This component should only be rendered on mobile viewports. A custom hook like `useIsMobile()` could be created to check the screen width.
- On desktop, we would render the standard `Modal` component instead. A wrapper component or logic within the feature itself can decide whether to render a `Modal` or a `BottomSheet`.

**Example Decision Logic:**

```tsx
const isMobile = useIsMobile();
const [isAddActionOpen, setIsAddActionOpen] = useState(false);

// ... in the JSX
{
  isMobile ? (
    <BottomSheet
      isOpen={isAddActionOpen}
      onClose={() => setIsAddActionOpen(false)}
    >
      <AddActionForm />
    </BottomSheet>
  ) : (
    <Modal isOpen={isAddActionOpen} onClose={() => setIsAddActionOpen(false)}>
      <AddActionForm />
    </Modal>
  );
}
```
