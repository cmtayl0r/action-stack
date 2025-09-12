import type { ToastState, ToastAction } from "./types";

// =============================================================================
// 🎯 INITIAL STATE
// =============================================================================

export const initialToastState: ToastState = {
  toasts: [], // Start with an empty array of toasts
};

// =============================================================================
// 🆔 UTILITY FUNCTIONS
// =============================================================================

/**
 * Generates a unique ID for each toast
 * Combines timestamp + random string to prevent collisions
 */
const generateToastId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

// =============================================================================
// 🏗️ TOAST REDUCER - Pure state management logic
// =============================================================================

export const toastReducer = (
  state: ToastState,
  action: ToastAction
): ToastState => {
  switch (action.type) {
    case "SHOW_TOAST": {
      const { message, type, duration } = action.payload;
      // Create new toast with validated properties
      const newToast = {
        id: generateToastId(),
        message: message.trim(), // Clean up whitespace
        type,
        duration,
      };

      return {
        ...state,
        toasts: [...state.toasts, newToast],
      };
    }
    case "HIDE_TOAST": {
      const toastId = action.payload;
      // Filter out the toast with matching ID
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== toastId),
      };
    }
    case "CLEAR_ALL_TOASTS": {
      // Reset to empty state
      return {
        ...state,
        toasts: [],
      };
    }
    default: {
      // Return current state for unknown actions (defensive programming)
      return state;
    }
  }
};
