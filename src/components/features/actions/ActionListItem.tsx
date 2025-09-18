import { useRef, useState } from "react";
import useActions from "@/hooks/data/useActions";
import { Flag, Pencil, Save, Trash2 } from "lucide-react";
import styles from "./actions.module.css";
import { Action } from "@/types";

type ActionListItemProps = {
  action: Action;
};

function ActionListItem({ action }: ActionListItemProps) {
  const { id, name, completed, priority, createdAt } = action;
  const [isEditing, setIsEditing] = useState(false);
  const { removeAction, updateAction, toggleComplete } = useActions();
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nameRef.current || nameRef.current.value.trim() === "") return;
    updateAction(id, { name: nameRef.current.value });
    setIsEditing(false);
  };

  const date = new Date(createdAt);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <li key={id} className={styles["action-list__item"]}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input type="text" defaultValue={name} ref={nameRef} autoFocus />
          <button type="submit">
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
          <span className={styles["action-list__name"]}>{name}</span>
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
