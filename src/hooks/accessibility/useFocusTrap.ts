import { useEffect, useRef, useCallback } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * A custom hook to trap focus within a designated container element.
 * This is essential for accessibility compliance in components like modals and dialogs.
 *
 * @param {boolean} isActive - Determines whether the focus trap should be active.
 * @returns {React.RefObject<T>} A ref to be attached to the container element that should trap focus.
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
  const containerRef = useRef<T>(null);

  const handleFocus = useCallback(
    (event: KeyboardEvent) => {
      if (!isActive || !containerRef.current) return;

      if (event.key === "Tab") {
        const focusableElements = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTORS
          )
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // If shift + tab is pressed on the first focusable element, loop to the last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // If tab is pressed on the last focusable element, loop to the first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isActive]
  );

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!isActive || !currentContainer) return;

    // Focus the first focusable element when the trap becomes active
    const firstFocusableElement =
      currentContainer.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    firstFocusableElement?.focus();

    document.addEventListener("keydown", handleFocus);

    return () => {
      document.removeEventListener("keydown", handleFocus);
    };
  }, [isActive, handleFocus]);

  return containerRef;
}
