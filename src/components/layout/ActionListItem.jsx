import { useRef, useState } from "react";
import { useActionsContext } from "../../context/ActionsContext";
import { Pencil, Save, Trash2 } from "lucide-react";

function ActionListItem({ id, title, completed }) {
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const { removeAction, updateAction, toggleComplete } = useActionsContext(); // Get e
  const titleRef = useRef(); // Create a ref for the input field

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    const newTitle = titleRef.current.value.trim(); // Ensure the value is trimmed and a string
    if (newTitle === "") return; // Don't allow empty titles
    console.log("Updating action:", id, newTitle);
    updateAction(id, { title: newTitle }); // Update action title
    setIsEditing(false); // Exit edit mode
  };

  return (
    <li key={id}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            defaultValue={title}
            ref={titleRef} // Ref allows us to focus the input field
            autoFocus
          />
          <button>
            <Save />
          </button>
        </form>
      ) : (
        <>
          <input
            type="checkbox"
            checked={completed}
            onChange={() => toggleComplete(id)}
          />
          <span>{title}</span>
          <button onClick={() => removeAction(id)}>
            <Trash2 />
          </button>
          <button onClick={() => setIsEditing((prev) => !prev)}>
            <Pencil />
          </button>
        </>
      )}
    </li>
  );
}

export default ActionListItem;
