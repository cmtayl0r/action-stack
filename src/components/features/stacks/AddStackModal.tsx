import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "@/context/toasts/ToastContext";
import { useStacksContext } from "@/context/stacks/StacksContext";
import { BaseModal, Button } from "@/components/ui";
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
// COMPONENT
// =============================================================================

function AddStackModal() {
  // 🎯 Connect to modal system
  const { closeModal } = useModal();

  // 🔗 Connect to stacks, actions, and toast contexts
  const { addStack } = useStacksContext();
  const { success, error } = useToastContext();

  // Navigation
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
      closeModal();
    } catch (err) {
      error("Failed to add stack. Please try again.");
      console.error("Error adding stack:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal modalId={MODAL_IDS.ADD_STACK} title="Add New Stack" size="md">
      <form onSubmit={handleSubmit} className="stack">
        <div className="stack">
          <label htmlFor="stack-name">Stack Name</label>
          <input
            id="stack-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Travel Ideas"
          />
          <div className="cluster">
            <Button
              onPress={closeModal}
              variant="outline"
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isPending={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Stack"}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default AddStackModal;
