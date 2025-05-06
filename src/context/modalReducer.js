export const initialModalState = {
  current: null, // The name of the current modal
  props: {}, // The props to pass to the modal
};

export const modalReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        current: action.payload.name,
        props: action.payload.props || {},
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        current: null, // Reset the current modal
        props: {}, // Reset the props
      };

    default:
      return state;
  }
};
