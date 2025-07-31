import { useRef, useState } from "react";
import { useActionsContext } from "../../context/actions/ActionsContext";
import { Flag, Pencil, Save, Trash2 } from "lucide-react";
import styles from "./ActionsList.module.css";

function ActionListItem({ id, title, completed, priority, createdAt }) {
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const { removeAction, updateAction, toggleComplete } = useActionsContext(); // Get e
  const nameRef = useRef(); // Create a ref for the input field

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    if (nameRef.current.value.trim() === "") return; // Don't allow empty titles
    console.log("Updating action:", id, nameRef.current.value);
    updateAction(id, nameRef.current.value); // Update action title
    setIsEditing(false); // Exit edit mode
  };

  const date = new Date(createdAt);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short", // Jan, Feb, etc.
    day: "numeric", // 1, 2, ..., 31
  });

  return (
    <li key={id} className={styles["action-list__item"]}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            defaultValue={title}
            ref={nameRef} // Ref allows us to focus the input field
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
          <span className={styles["action-list__title"]}>{title}</span>
          <small>{formatted}</small>
          <Flag className={styles[`label-priority--${priority}`]} />
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
