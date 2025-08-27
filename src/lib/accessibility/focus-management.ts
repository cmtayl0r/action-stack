// hooks/useFocusManagement.ts
import { useRef, useCallback } from "react";

/**
 * Manages focus for compound components (modals, drawers, sheets)
 * Handles focus trapping and restoration for accessibility compliance
 * Component-specific focus management:
 * Modal/Dialog - Focus trap and restoration
 * Dropdown Menu - Focus first item on open
 * Sidebar/Drawer - Focus management on slide-in
 * Toast Notifications - Focus for screen reader users
 * Multi-Step Forms - Focus next/previous steps
 * Accordion - Focus expanded content
 *
 * @example
 * const { containerRef, saveFocus, restoreFocus, trapFocus } = useFocusManagement();
 *
 * // In your Modal.Root
 * useEffect(() => {
 *   if (open) {
 *     saveFocus();
 *     trapFocus(true);
 *   } else {
 *     restoreFocus();
 *     trapFocus(false);
 *   }
 * }, [open]);
 */

// TODO: Focus on non-input element? like Error Summary etc.

// =============================================================================
// FOCUS MANAGEMENT UTILITIES
// =============================================================================

// Get focusable elements within a container
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "button:not([disabled])",
    "[href]:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  ].join(", ");

  return Array.from(container.querySelectorAll(selector));
}

// Get input elements specifically (for modal focus)
function getInputElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
  ].join(", ");

  return Array.from(container.querySelectorAll(selector));
}

// =============================================================================
// FOCUS MANAGEMENT HOOK
// =============================================================================

// Generic type makes the hook reusable for different container types
// Why?: To allow the hook to be used with different types of containers (e.g., div, section, etc.) without losing type safety.

export function useFocusManagement<T extends HTMLElement = HTMLElement>() {
  // Refs for managing focus of trigger, container, and focus trap elements
  const containerRef = useRef<T>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const focusTrapListenerRef = useRef<((e: KeyboardEvent) => void) | null>(
    null
  );

  // 🛠️ Save current focus before opening modal/dialog
  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  // 🛠️ Restore focus when modal closes
  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      setTimeout(() => {
        previousFocusRef.current?.focus();
        previousFocusRef.current = null;
      }, 10);
    }
  }, []);

  // 🛠️ Focus first input field in modal (better UX than close button)
  const focusFirstInput = useCallback(() => {
    if (!containerRef.current) return;

    const inputElements = getInputElements(containerRef.current);
    if (inputElements.length > 0) {
      inputElements[0].focus();
      return;
    }

    // 🛠️ Fallback to first focusable element if no inputs
    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  // 🛠️ Focus first focusable element
  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, []);

  // 🛠️ Create/remove focus trap within container
  const trapFocus = useCallback((isActive: boolean) => {
    // Get the current container from the ref
    const container = containerRef.current;
    // Guard clause: if no container, do nothing
    if (!container) return;

    // Remove existing listener
    if (focusTrapListenerRef.current) {
      container.removeEventListener("keydown", focusTrapListenerRef.current);
      focusTrapListenerRef.current = null;
    }

    // If focus trap is active
    if (isActive) {
      // Create new focus trap listener
      const handleKeyDown = (e: KeyboardEvent) => {
        // If not Tab key, do nothing
        if (e.key !== "Tab") return;
        // Get all focusable elements in the container
        const focusableElements = getFocusableElements(container);
        if (focusableElements.length === 0) return;
        // Get the first and last focusable elements
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        // If shift key is pressed
        if (e.shiftKey) {
          // Shift + Tab: going backwards
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: going forwards
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      // Store listener reference and attach to container
      focusTrapListenerRef.current = handleKeyDown;
      container.addEventListener("keydown", handleKeyDown);
    }
  }, []); // no dependencies because the focus trap is created/queried dynamically

  return {
    containerRef, // Attach to your Modal.Content, Sheet.Content, etc.
    saveFocus, // Call in Modal.Root when opening
    restoreFocus, // Call in Modal.Root when closing
    trapFocus, // Enable/disable focus trap
    focusFirst, // Focus first focusable element
    focusFirstInput, // Focus first input element
  };
}
