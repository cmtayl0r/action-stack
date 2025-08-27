import { useActionsContext } from "@/context/actions/ActionsContext";
import { Modal, type ModalProps } from "@/components/ui";
import { useMemo, useState } from "react";

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

function SearchActionsModal({ isOpen, onClose }: ModalProps) {
  const { actions } = useActionsContext();

  // 🎛️ Form State
  const [query, setQuery] = useState("");

  // 🔧 Handle filtered actions
  const filteredActions = useMemo(() => {
    return actions.filter((action) =>
      action.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [actions, query]);

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose}>
      <Modal.Dialog showCloseButton={false}>
        <Modal.Body className="stack">
          {/* F-004.1: Proper labeling for accessibility */}
          <label htmlFor="search-actions-input" className="sr-only">
            Search all actions
          </label>
          <input
            id="search-actions-input" // Connect label to input
            type="text"
            placeholder="Search all actions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <ul>
            {filteredActions.length > 0 ? (
              filteredActions.map((action) => (
                <li key={action.id}>{action.title}</li>
              ))
            ) : (
              <li>No matching actions found.</li>
            )}
          </ul>
        </Modal.Body>
      </Modal.Dialog>
    </Modal.Root>
  );
}

export default SearchActionsModal;
