import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/toasts/ToastContext";
import useStacks from "@/hooks/data/useStacks";
import { BaseModal, Button } from "@/components/ui";
import { useModal } from "@/context/modals/ModalContext";
import { MODAL_IDS } from "@/components/ui/modal/ModalHost";
import type { CreateStackData } from "@/types/database";

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

  // 🪝 Connect to Stacks hook
  const { createStack, isCreating } = useStacks();

  // 🪝 Connect to Toasts hook
  const toast = useToast();

  // 🧭 Navigation
  const navigate = useNavigate();

  // 📦 Form State
  const [name, setName] = useState("");

  // ⚡️ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    // Early validation
    if (!trimmedName) {
      toast.error("Stack name is required");
      return;
    }

    try {
      // 🎯 Create stack data matching the CreateStackData interface
      const stackData: CreateStackData = {
        name: trimmedName,
        description: "", // Empty description by default
        color: "#0066cc", // Default blue color
        icon: "📋", // Default icon
      };
      // 🚀 Use the async version from useStacks hook
      const savedStack = await createStack(stackData);
      // 🎉 Success feedback
      const successMessage = `${trimmedName} stack created successfully!`;
      toast.success(successMessage);
      // 🧭 Navigate to the new stack's page
      navigate(`/stack/${savedStack.id}`);
      // 👁️ Close the modal;
      closeModal();
    } catch (err) {
      toast.error("Failed to add stack. Please try again.");
      console.error("Error adding stack:", err);
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
            autoFocus
            required
            disabled={isCreating}
          />
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
              {isCreating ? "Creating..." : "Add Stack"}
            </Button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

export default AddStackModal;
