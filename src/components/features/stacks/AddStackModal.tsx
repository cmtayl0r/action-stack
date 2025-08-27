import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "@/context/toasts/ToastContext";
import { useStacksContext } from "@/context/stacks/StacksContext";
import { Modal, Button, type ModalProps } from "@/components/ui";

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
// COMPONENT
// =============================================================================

function AddStackModal({ isOpen, onClose }: ModalProps) {
  const { addStack } = useStacksContext();
  const { success, error } = useToastContext();
  const navigate = useNavigate();

  // 🎛️ Form State
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔧 Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Set isSubmitting to true so we can show a loading indicator
    setIsSubmitting(true);

    try {
      const savedStack = await addStack({ name: trimmedName });
      success(`${savedStack.name} saved successfully!`);
      navigate(`/stack/${savedStack.id}`);
      onClose();
    } catch (err) {
      error("Failed to add stack. Please try again.");
      console.error("Error adding stack:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose}>
      <Modal.Dialog>
        <form onSubmit={handleSubmit} className="stack">
          <Modal.Header>Add New Stack</Modal.Header>
          <Modal.Body className="stack">
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
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>Cancel</Modal.Close>
            <Button type="submit">Add Stack</Button>
          </Modal.Footer>
        </form>
      </Modal.Dialog>
    </Modal.Root>
  );
}

export default AddStackModal;
