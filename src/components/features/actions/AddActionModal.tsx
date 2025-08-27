import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "@/context/toasts/ToastContext";
import { useStacksContext } from "@/context/stacks/StacksContext";
import { useActionsContext } from "@/context/actions/ActionsContext";
import { Modal, Button, type ModalProps } from "@/components/ui";
import { Action } from "@/types";

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

// Simple interface extending base modal props
interface AddActionModalProps extends ModalProps {
  stackId?: string; // Optional prop passed from context
}

// =============================================================================
// COMPONENT
// =============================================================================

function AddActionModal({
  isOpen,
  onClose,
  stackId = "inbox", // stackId is now part of ComponentMountProps<"addAction">
}: AddActionModalProps) {
  const { stacks } = useStacksContext();
  const { addAction } = useActionsContext();
  const { success, error } = useToastContext();
  const navigate = useNavigate();

  // 🎛️ Form State
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Action["priority"]>("medium");
  const [selectedStackId, setSelectedStackId] = useState(stackId);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      onClose();

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
    <Modal.Root isOpen={isOpen} onClose={onClose}>
      <Modal.Dialog size="md">
        <form onSubmit={handleSubmit} className="stack">
          <Modal.Header>Add New Action</Modal.Header>
          <Modal.Body className="stack">
            <label htmlFor="action-title">Action Title</label>
            <input
              id="action-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter action title"
            />
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as Action["priority"])
              }
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
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close disabled={isSubmitting}>Cancel</Modal.Close>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={!title.trim()}
            >
              {isSubmitting ? "Adding..." : "Add Action"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </Modal.Root>
  );
}

export default AddActionModal;
