import { useCallback, KeyboardEvent } from "react";

/**
 * Handles keyboard navigation patterns for interactive components
 * Essential for custom selects, menus, tabs, and complex widgets
 *
 * @example
 * // For a custom Select component
 * const { handleKeyDown, moveFocusWithinContainer } = useKeyboardNavigation({
 *   onEscape: () => setOpen(false),
 *   onArrowDown: () => selectNext(),
 *   onEnter: () => confirmSelection()
 * });
 *
 * // For tab navigation
 * const { handleKeyDown } = useKeyboardNavigation({
 *   onArrowLeft: () => selectPreviousTab(),
 *   onArrowRight: () => selectNextTab()
 * });
 */

// =============================================================================
// KEYBOARD NAVIGATION TYPES
// =============================================================================

// Programmatic focus movement directions
export type FocusDirection = "next" | "previous" | "first" | "last";

// Keyboard event handlers for common navigation patterns
export interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onSpace?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
}

// Return Type Interface, used for the hook's return value
export interface KeyboardNavigationReturn {
  handleKeyDown: (e: KeyboardEvent) => void;
  moveFocusWithinContainer: (
    container: HTMLElement,
    direction: FocusDirection
  ) => void;
}

// =============================================================================
// KEYBOARD NAVIGATION HOOK
// =============================================================================

export function useKeyboardNavigation(
  options: KeyboardNavigationOptions = {}
): KeyboardNavigationReturn {
  const {
    onEscape,
    onEnter,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onSpace,
    onHome,
    onEnd,
  } = options;

  // Main keyboard event handler - attach to your interactive elements
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Switch to determine the action based on the key pressed
      switch (e.key) {
        case "Escape":
          if (onEscape) {
            e.preventDefault();
            onEscape();
          }
          break;

        case "Enter":
          if (onEnter) {
            e.preventDefault();
            onEnter();
          }
          break;

        case "ArrowUp":
          if (onArrowUp) {
            e.preventDefault();
            onArrowUp();
          }
          break;

        case "ArrowDown":
          if (onArrowDown) {
            e.preventDefault();
            onArrowDown();
          }
          break;

        case "ArrowLeft":
          if (onArrowLeft) {
            e.preventDefault();
            onArrowLeft();
          }
          break;

        case "ArrowRight":
          if (onArrowRight) {
            e.preventDefault();
            onArrowRight();
          }
          break;

        case " ": // Space bar
          if (onSpace) {
            e.preventDefault();
            onSpace();
          }
          break;

        case "Home":
          if (onHome) {
            e.preventDefault();
            onHome();
          }
          break;

        case "End":
          if (onEnd) {
            e.preventDefault();
            onEnd();
          }
          break;
      }
    },
    [
      onEscape,
      onEnter,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onSpace,
      onHome,
      onEnd,
    ]
  );

  // Helper for programmatic focus movement within containers
  const moveFocusWithinContainer = useCallback(
    (container: HTMLElement, direction: FocusDirection) => {
      const focusableElements = container.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (focusableElements.length === 0) return;

      const currentIndex = Array.from(focusableElements).indexOf(
        document.activeElement as HTMLElement
      );

      let targetIndex = 0;

      switch (direction) {
        case "next":
          targetIndex =
            currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          break;
        case "previous":
          targetIndex =
            currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          break;
        case "first":
          targetIndex = 0;
          break;
        case "last":
          targetIndex = focusableElements.length - 1;
          break;
      }

      focusableElements[targetIndex].focus();
    },
    []
  );

  return {
    handleKeyDown, // Main keyboard event handler
    moveFocusWithinContainer, // Helper for programmatic focus management
  };
}
