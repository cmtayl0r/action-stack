export const initialToastState = {
  toasts: [], // Array to allow multiple toasts
};

export const toastReducer = (state, action) => {
  switch (action.type) {
    case "SHOW_TOAST":
      return {
        ...state,
        toasts: [
          ...state.toasts,
          {
            id: Date.now(),
            message: action.payload.message,
            type: action.payload.type || "info",
            duration: action.payload.duration || 3000,
          },
        ],
      };

    case "HIDE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };

    case "CLEAR_ALL_TOASTS":
      return {
        ...state,
        toasts: [],
      };

    default:
      return state;
  }
};
