// ⛹️‍♀️ Action creator functions (optional but clean and scalable)
// pure functions returning objects that have no side effects or expensive logic

// --- Theme ---
export const setTheme = (theme) => ({ type: "SET_THEME", payload: theme });

// --- Sidebar ---
export const toggleSidebar = () => ({ type: "TOGGLE_SIDEBAR" });

// --- Stacks (lists) ---
export const setCurrentStackId = (stackId) => ({
  type: "SET_CURRENT_STACK_ID",
  payload: stackId,
});
