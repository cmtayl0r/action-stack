import { useActionsContext } from "../context/actions/ActionsContext";
// Components
import Modal from "../components/ui/modal/Modal";
import { useMemo, useState } from "react";

function SearchActionsModal({ closeModal }) {
  const { actions } = useActionsContext();
  const [query, setQuery] = useState("");

  const filteredActions = useMemo(() => {
    return actions.filter((action) =>
      action.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [actions, query]);

  return (
    <Modal title="Search Actions" onClose={closeModal}>
      <Modal.Dialog showCloseButton={false}>
        <Modal.Content>
          <input
            type="text"
            placeholder="Search all actions"
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
        </Modal.Content>
      </Modal.Dialog>
    </Modal>
  );
}

export default SearchActionsModal;
