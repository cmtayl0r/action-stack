import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Context
import { useToastContext } from "../context/toasts/ToastContext";
import { useStacksContext } from "../context/stacks/StacksContext";

// Components
import Modal from "../components/ui/modal/Modal";

function AddStackModal({ closeModal }) {
  const [name, setName] = useState("");
  const { addStack } = useStacksContext();
  const { success } = useToastContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    // TODO: Replace with actual error handling
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // * Only send user-entered values here
    const newStack = {
      name: trimmedName,
    };
    const savedStack = await addStack(newStack);
    success(`${savedStack.name} saved successfully!`);
    navigate(`/stack/${savedStack.id}`);
    closeModal();
  };

  return (
    <Modal title="Add Stack" onClose={closeModal}>
      <Modal.Dialog>
        <Modal.Heading>Add New Stack</Modal.Heading>
        <form onSubmit={handleSubmit}>
          <Modal.Content>
            <label htmlFor="stack-name">Stack Name</label>
            <input
              id="stack-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="Enter stack name"
            />
          </Modal.Content>
          <Modal.Footer>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit">Add Stack</button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </Modal>
  );
}

export default AddStackModal;
