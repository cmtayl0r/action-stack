// ⛹️‍♀️ Action creator functions (optional but clean and scalable)
// pure functions returning objects that have no side effects or expensive logic

export const showToast = (message, type = "info", duration = 3000) => ({
  type: "SHOW_TOAST",
  payload: { message, type, duration },
});

export const hideToast = (id) => ({
  type: "HIDE_TOAST",
  payload: id,
});

export const clearAllToasts = () => ({
  type: "CLEAR_ALL_TOASTS",
});
