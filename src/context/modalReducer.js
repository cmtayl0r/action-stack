export const initialModalState = {
  modalId: null, // The name of the current modal
  modalProps: {}, // The props to pass to the modal
  registry: {}, // Registry of modals for lazy loading
};

export const modalReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        modalId: action.payload.id,
        modalProps: action.payload.props,
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        modalId: null, // Reset the current modal
        modalProps: {}, // Reset the props
      };

    case "REGISTER_MODAL":
      return {
        ...state,
        registry: {
          ...state.registry,
          [action.payload.id]: action.payload.component,
        },
      };

    default:
      return state;
  }
};
