import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/toasts/ToastContext";
import useStacks from "@/hooks/data/useStacks";
import useActions from "@/hooks/data/useActions";
import { CreateActionData } from "@/types";
import { BaseModal, Button } from "@/components/ui";
import { useModal } from "@/context/modals/ModalContext";
import { MODAL_IDS } from "@/components/ui/modal/ModalHost";

/**
 * FEATURE MODAL: Add Action Modal
 *
 * Purpose: Specific modal for adding actions
 *
 * Flow:
 * 1. Receives isOpen/onClose from ModalHost
 * 2. Receives custom props (like stackId) from showModal() call
 * 3. Uses Modal.Root/Dialog/Header/Body/Footer to build UI
 * 4. Handles its own form logic and API calls
 *
 * Pattern: All feature modals follow this structure for consistency
 * Usage: Called automatically by ModalHost - don't render directly
 */

// =============================================================================
// COMPONENT
// =============================================================================

function AddActionModal() {
  // 🪝 Connect to modal system
  const { closeModal, modalProps } = useModal();
  // Custom prop passed when opening modal
  const { stackId } = modalProps;

  // 🪝 Connect to stacks, actions
  const { stacks } = useStacks();
  const { createAction, isCreating } = useActions(stackId);

  // 🪝 Connect to Toasts hook
  const toast = useToast();

  // 🧭 Navigation
  const navigate = useNavigate();

  // 📦 Form State
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<0 | 1 | 2 | 3>(0);
  const [selectedStackId, setSelectedStackId] = useState(stackId);

  // ⚡️ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    // Early validation
    if (!trimmedName) {
      toast.error("Action name is required");
      return;
    }

    try {
      const actionData: CreateActionData = {
        name: trimmedName,
        priority,
        stack_id: selectedStackId,
      };
      // 🚀 Use the async version from useActions hook
      const savedAction = await createAction(actionData);
      // 🎉 Success feedback
      const stackName =
        stacks.find((s) => s.id === selectedStackId)?.name || "stack";
      toast.success(`"${trimmedName}" added to ${stackName}`);
      // 🧭 Navigate to the new actions stack view
      navigate(`/stack/${selectedStackId}`);
      // 👁️ Close the modal;
      closeModal();
      // Reset form state
      setName("");
      setPriority(0);
      setSelectedStackId(stackId);
    } catch (err) {
      toast.error("Failed to add action. Please try again.");
      console.error("Error adding action:", err);
    }
  };

  return (
    <BaseModal id={MODAL_IDS.ADD_ACTION} title="Add New Action" size="md">
      <form onSubmit={handleSubmit} className="stack">
        {/* <Modal.Header>Add New Action</Modal.Header> */}
        <div className="stack">
          <label htmlFor="action-name">Action Name</label>
          <input
            id="action-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Write shopping list"
            autoFocus
            required
            disabled={isCreating}
          />
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) =>
              setPriority(Number(e.target.value) as 0 | 1 | 2 | 3)
            }
            disabled={isCreating}
          >
            <option value="0">None</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
          </select>
          <label htmlFor="stack-select">Stack</label>
          <select
            id="stack-select"
            value={selectedStackId}
            onChange={(e) => setSelectedStackId(Number(e.target.value))}
            disabled={isCreating}
          >
            {stacks.map((stack) => (
              <option key={stack.id} value={stack.id}>
                {stack.name}
              </option>
            ))}
          </select>
          <div className="cluster">
            <Button
              onPress={closeModal}
              variant="outline"
              isDisabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isPending={isCreating}
              isDisabled={!name.trim()}
            >
              {isCreating ? "Creating.." : "Add Action"}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default AddActionModal;
