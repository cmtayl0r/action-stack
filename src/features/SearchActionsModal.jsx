import { useActionsContext } from "../context/ActionsContext";
// Components
import Modal from "../components/ui/modal/Modal";

function SearchActionsModal({ closeModal }) {
  const { actions } = useActionsContext();

  return (
    <Modal title="Search Actions" onClose={closeModal}>
      <Modal.Dialog>
        <Modal.Content>
          <input type="text" name="" id="" placeholder="Search all actions" />
          <ul>
            {actions.map((action) => (
              <li key={action.id}>{action.title}</li>
            ))}
          </ul>
        </Modal.Content>
      </Modal.Dialog>
    </Modal>
  );
}

export default SearchActionsModal;
