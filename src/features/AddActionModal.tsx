import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Context
import { useToastContext } from "../context/toasts/ToastContext";
import { useStacksContext } from "../context/stacks/StacksContext";
import { useActionsContext } from "../context/actions/ActionsContext";

// Components
import { Modal } from "@/components";

function AddActionModal({ closeModal, stackId: initialStackId = "inbox" }) {
  const { stacks } = useStacksContext(); // Get available stacks
  const { addAction, reload } = useActionsContext(); // Get action management functions
  const { success } = useToastContext(); // Get toast context for notifications
  const [title, setTitle] = useState(""); // Track action title
  const [priority, setPriority] = useState("medium"); // Track selected priority
  const [stackId, setStackId] = useState(initialStackId); // Track selected stack
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    // 1. Validate the form
    // TODO: Replace with actual error handling
    // 2. Create the new task object
    // Only send user-entered values here
    const newAction = {
      title: title.trim(),
      priority,
      stackId,
    };
    // 3. Add the action to the database
    await addAction(newAction);
    // 4. Navigate to the stack page
    navigate(`/stack/${newAction.stackId}`);
    // 5. Force a reload of actions data
    await reload();
    // 6. Show success toast
    success(`${newAction.title} saved successfully!`);
    // 7. Close the modal
    closeModal();
  };

  return (
    <Modal title="Add Action" onClose={closeModal}>
      <Modal.Dialog>
        <Modal.Heading>Add New Action</Modal.Heading>
        <form onSubmit={handleSubmit}>
          <Modal.Content>
            <label htmlFor="action-title">Action Title</label>
            <input
              id="action-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              placeholder="Enter action title"
            />

            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <label htmlFor="stack">Stack</label>
            <select
              id="stack"
              value={stackId}
              onChange={(e) => setStackId(e.target.value)}
            >
              {stacks.map((stack) => (
                <option key={stack.id} value={stack.id}>
                  {stack.name}
                </option>
              ))}
            </select>
          </Modal.Content>
          <Modal.Footer>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit">Add Action</button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </Modal>
  );
}

export default AddActionModal;
