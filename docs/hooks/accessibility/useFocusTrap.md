# Hook Spec: useFocusTrap

This document specifies a custom React hook, `useFocusTrap`, for managing focus within a contained element, such as a modal or off-canvas menu.

## 1. Vision

This hook will provide a simple, declarative way to ensure that keyboard focus is trapped within a specific DOM element. This is a critical accessibility feature to prevent users from accidentally interacting with the page content that is "behind" an active overlay.

## 2. Hook Signature

```typescript
function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  isActive: boolean
): void;
```

- `containerRef`: A React ref pointing to the DOM element that should contain the focus.
- `isActive`: A boolean that activates or deactivates the focus trap.

## 3. Core Logic

1.  **Find Focusable Elements:** When `isActive` is `true`, the hook should query the `containerRef` element to find all focusable elements (e.g., `a[href]`, `button`, `input`, `[tabindex]:not([tabindex="-1"])`).
2.  **Attach Event Listener:** It should attach a `keydown` event listener to the container.
3.  **Handle Tab Key:** Inside the event listener, it checks for the `Tab` key.
    - If `Shift + Tab` is pressed while the first focusable element is active, it prevents the default behavior and moves focus to the _last_ focusable element.
    - If `Tab` is pressed while the last focusable element is active, it prevents the default behavior and moves focus to the _first_ focusable element.
4.  **Cleanup:** When the component unmounts or `isActive` becomes `false`, the hook must remove the `keydown` event listener to prevent memory leaks.

## 4. Example Usage

```tsx
import { useRef, useEffect } from "react";
import { useFocusTrap } from "./useFocusTrap";

function MyModal({ isOpen, onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Activate the trap when the modal is open
  useFocusTrap(modalRef, isOpen);

  // Also handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} role="dialog">
      <button>First focusable</button>
      <input placeholder="An input" />
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```
