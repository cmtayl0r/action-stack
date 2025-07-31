export const initialState = {
  theme: "dark",
  sidebarOpen: true,
  toast: null, // { message: '', type: 'success' | 'error' }
  currentStackId: "inbox",
};

export function appReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "SET_THEME":
      return { ...state, theme: action.payload };

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
