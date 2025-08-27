import { AppState, AppAction } from "@/types";

export const initialState: AppState = {
  theme: "dark",
  sidebarOpen: true,
  toast: null,
  currentStackId: "inbox",
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === "dark" ? "light" : "dark",
      };

    // case "SHOW_TOAST":
    //   return { ...state, toast: action.payload };

    // case "CLEAR_TOAST":
    //   return { ...state, toast: null };

    case "SET_CURRENT_STACK_ID":
      return { ...state, currentStackId: action.payload };

    default:
      return state;
  }
}
