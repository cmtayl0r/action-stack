import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/toasts/ToastContext";
import { useStacksContext } from "@/context/stacks/StacksContext";
import { useActionsContext } from "@/context/actions/ActionsContext";
import { BaseModal, Button } from "@/components/ui";
import { Action } from "@/types";
import { useModal } from "@/context/modals/ModalContext";
import { MODAL_IDS } from "@/components/ui/modal/ModalHost";

/**
 * MODAL SYSTEM: Feature Modal
 *
 * Purpose: Specific modal for adding actions - uses Modal compound components
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
// TYPES
// =============================================================================

interface AddActionModalProps {
  stackId?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

function AddActionModal({ stackId = "inbox" }: AddActionModalProps) {
  // 🎯 Connect to modal system
  const { closeModal } = useModal();

  // 🔗 Connect to stacks, actions, and toast contexts
  const { stacks } = useStacksContext();
  const { addAction } = useActionsContext();
  const { success, error } = useToast();

  // Navigation
  const navigate = useNavigate();

  // 🎛️ Form State
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState<Action["priority"]>("medium");
  const [selectedStackId, setSelectedStackId] = useState(stackId);

  // 🔧 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission
    e.preventDefault();

    // Trim whitespace from title
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    // Set isSubmitting to true so we can show a loading indicator
    setIsSubmitting(true);

    try {
      // Call the addAction function from the useActionsContext
      await addAction(trimmedTitle, priority, selectedStackId);

      // Success feedback
      const successMessage = `${trimmedTitle} added to ${selectedStackId}`;
      success(successMessage); // Trigger toast notification

      // Navigate and close
      navigate(`/stack/${selectedStackId}`);
      closeModal();

      // Reset form state
      setTitle("");
      setPriority("medium");
      setSelectedStackId(stackId);
    } catch (err) {
      const errorMessage = "Failed to add action. Please try again.";
      error(errorMessage); // Trigger toast notification
      console.error("Error adding action:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal modalId={MODAL_IDS.ADD_ACTION} title="Add New Action" size="md">
      <form onSubmit={handleSubmit} className="stack">
        {/* <Modal.Header>Add New Action</Modal.Header> */}
        <div className="stack">
          <label htmlFor="action-title">Action Title</label>
          <input
            id="action-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            placeholder="e.g., Write shopping list"
          />
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Action["priority"])}
            disabled={isSubmitting}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <label htmlFor="stack-select">Stack</label>
          <select
            id="stack-select"
            value={selectedStackId}
            onChange={(e) => setSelectedStackId(e.target.value)}
            disabled={isSubmitting}
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
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isPending={isSubmitting}
              isDisabled={!title.trim()}
            >
              {isSubmitting ? "Adding..." : "Add Action"}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default AddActionModal;
