import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "@/context/toasts/ToastContext";
import { useStacksContext } from "@/context/stacks/StacksContext";
import { useActionsContext } from "@/context/actions/ActionsContext";
import { Modal } from "@/components/ui";
import { Action } from "@/types";

type AddActionModalProps = {
  closeModal: () => void;
  stackId?: string;
};

function AddActionModal({
  closeModal,
  stackId: initialStackId = "inbox",
}: AddActionModalProps) {
  const { stacks } = useStacksContext();
  const { addAction } = useActionsContext();
  const { success } = useToastContext();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Action["priority"]>("medium");
  const [stackId, setStackId] = useState(initialStackId);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    await addAction(trimmedTitle, priority, stackId);
    navigate(`/stack/${stackId}`);
    success(`${trimmedTitle} saved successfully!`);
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
              onChange={(e) =>
                setPriority(e.target.value as Action["priority"])
              }
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
