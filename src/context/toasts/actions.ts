import type { ToastAction, Toast } from "./types";

// =============================================================================
// 🎯 ACTION CREATORS - Pure functions that return action objects
// =============================================================================
// pure functions returning objects that have no side effects or expensive logic

/**
 * Creates an action to show a new toast notification
 * @param message - The toast message to display
 * @param type - The type of toast (info, success, error, warning)
 * @param duration - How long to show the toast in milliseconds
 */
export const showToast = (
  message: string,
  type: Toast["type"] = "info",
  duration = 3000
): ToastAction => ({
  type: "SHOW_TOAST",
  payload: { message, type, duration },
});

/**
 * Creates an action to hide a specific toast by ID
 * @param id - The unique ID of the toast to hide
 */
export const hideToast = (id: string): ToastAction => ({
  type: "HIDE_TOAST",
  payload: id,
});

/**
 * Creates an action to clear all toasts at once
 */
export const clearAllToasts = (): ToastAction => ({
  type: "CLEAR_ALL_TOASTS",
});
