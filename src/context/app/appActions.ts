// ⛹️‍♀️ Action creator functions (optional but clean and scalable)
// pure functions returning objects that have no side effects or expensive logic

// --- Theme ---
export const setTheme = (theme: "light" | "dark") => ({ type: "SET_THEME", payload: theme });
export const toggleTheme = () => ({ type: "TOGGLE_THEME" });

// --- Sidebar ---
export const toggleSidebar = () => ({ type: "TOGGLE_SIDEBAR" });

// --- Stacks (lists) ---
export const setCurrentStackId = (stackId: string) => ({
  type: "SET_CURRENT_STACK_ID",
  payload: stackId,
});
