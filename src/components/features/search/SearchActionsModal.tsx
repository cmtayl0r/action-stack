import { useActionsContext } from "@/context/actions/ActionsContext";
import { Modal, type ModalProps } from "@/components/ui";
import { useMemo, useState } from "react";

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
