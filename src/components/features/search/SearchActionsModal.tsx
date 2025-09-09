import { useMemo, useState } from "react";
import { useActionsContext } from "@/context/actions/ActionsContext";
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

function SearchActionsModal() {
  // 🎯 Connect to modal system
  const { closeModal } = useModal();

  // 🔗 Connect to actions context
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
    <BaseModal modalId={MODAL_IDS.SEARCH} title="Search Actions" size="lg">
      <div className="stack">
        {/* F-004.1: Proper labeling for accessibility */}
        <label htmlFor="search-actions-input" className="sr-only">
          Search actions
        </label>
        <input
          id="search-actions-input" // Connect label to input
          type="text"
          placeholder="Type to search your actions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        <div className="cluster">
          <Button onPress={closeModal} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </BaseModal>
  );
}

export default SearchActionsModal;
