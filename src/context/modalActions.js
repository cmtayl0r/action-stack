// ⛹️‍♀️ Action creator functions (optional but clean and scalable)
// pure functions returning objects that have no side effects or expensive logic

export const openModal = (name, props = {}) => ({
  type: "OPEN_MODAL",
  payload: { name, props },
});

export const closeModal = () => ({ type: "CLOSE_MODAL" });
