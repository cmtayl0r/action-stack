import { useActionsContext } from "@/context/actions/ActionsContext";
import { Modal } from "@/components";
import { useMemo, useState } from "react";

import { ComponentMountProps } from "@/components/ui/modal/modal.types";

// SearchActionsModalProps now extends ComponentMountProps specific to "search"
type SearchActionsModalProps = ComponentMountProps<"search">;

function SearchActionsModal({ isOpen, onClose }: SearchActionsModalProps) {
  const { actions } = useActionsContext();
  const [query, setQuery] = useState("");

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
