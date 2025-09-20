import { useRef, useState } from "react";
import { Flag, Pencil, Save, Trash2 } from "lucide-react";
import styles from "./actions.module.css";
import useActions from "@/hooks/data/useActions";
import type { Action } from "@/types/database";

// TODO: Create Edit action modal for better UX

type ActionListItemProps = {
  action: Action;
  stackId: number;
};

function ActionListItem({ action, stackId }: ActionListItemProps) {
  // 🪝 Use the actions hook directly for all mutations
  const { updateAction, deleteAction, toggleComplete } = useActions(stackId);

  // 📦 Local editing state
  const [isEditing, setIsEditing] = useState(false);

  // 📌 Ref for action name input during editing
  const nameRef = useRef<HTMLInputElement>(null);

  // ⚡️ Handles submitted edits
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newName = nameRef.current?.value?.trim();
    if (!newName) return;
    try {
      await updateAction(action.id, { name: newName });
      setIsEditing(false);
      // Optionally, show a success message or toast here
    } catch (error) {
      console.error("Failed to update action:", error);
      // Optionally, show an error message or toast here
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <li className={styles["action-list__item"]}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            defaultValue={action.name}
            ref={nameRef}
            autoFocus
            aria-label={`Edit action: ${action.name}`}
          />
          <button type="submit" aria-label="Save changes">
            <Save />
          </button>
        </form>
      ) : (
        <>
          <input
            type="checkbox"
            checked={action.completed}
            onChange={() => toggleComplete(action.id)}
            aria-label={`Mark ${action.name} as ${
              action.completed ? "incomplete" : "complete"
            }`}
          />
          <span className={styles["action-list__name"]}>{action.name}</span>
          <small>{formatDate(action.created_at)}</small>
          <Flag
            className={styles[`label-priority--${action.priority}`]}
            aria-label={`Priority: ${action.priority}`}
          />
          <button
            onClick={() => deleteAction(action.id)}
            aria-label={`Delete ${action.name}`}
          >
            <Trash2 />
          </button>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            aria-label={`Edit ${action.name}`}
          >
            <Pencil />
          </button>
        </>
      )}
    </li>
  );
}

export default ActionListItem;
