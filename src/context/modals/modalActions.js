// ⛹️‍♀️ Action creator functions (optional but clean and scalable)
// pure functions returning objects that have no side effects or expensive logic

export const openModal = (id, props = {}) => ({
  type: "OPEN_MODAL",
  payload: { id, props },
});

export const closeModal = () => ({ type: "CLOSE_MODAL" });

export const registerModal = (id, component) => ({
  type: "REGISTER_MODAL",
  payload: { id, component },
});
