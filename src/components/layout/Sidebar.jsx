import { NavLink, useParams } from "react-router-dom";
import { useModalContext } from "../../context/ModalContext";
import { useStacksContext } from "../../context/StacksContext";
import { useAppContext } from "../../context/AppContext";
import {
  LucidePlus,
  LucideSearch,
  LucideInbox,
  Layers2,
  Moon,
  Sun,
} from "lucide-react";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const { state, toggleTheme } = useAppContext();
  const { stacks } = useStacksContext();
  const { openModal } = useModalContext();
  const { stackId = "inbox" } = useParams(); // get current stack in view

  // Show all stacks except "inbox"
  // const visibleStacks = stacks.filter((s) => s.id !== "inbox");

  const handleAddAction = () => {
    openModal("add-action", {
      stackId,
      // onActionAdded: addAction,
    });
  };

  const handleAddStack = () => {
    openModal("add-stack");
  };

  const handleSearchActions = () => {
    openModal("search-actions");
  };

  return (
    <aside className={styles["sidebar"]} aria-label="Sidebar">
      <nav>
        <button aria-label="Open search" onClick={handleSearchActions}>
          <LucideSearch size={16} /> Search
        </button>

        <button aria-label="Add new action" onClick={handleAddAction}>
          <LucidePlus size={16} /> Add Action
        </button>

        <p>Action Stacks</p>
        <ul className={styles["sidebar__stacks"]}>
          {stacks.map((stack) => (
            <li key={stack.id}>
              <NavLink
                to={`/stack/${stack.id}`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                aria-label={`${stack.name} list`}
              >
                {stack.id === "inbox" ? (
                  <LucideInbox size={16} />
                ) : (
                  <Layers2 size={16} />
                )}
                {stack.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <button aria-label="Add new stack" onClick={handleAddStack}>
          <Layers2 size={16} /> Add Stack
        </button>
      </nav>

      {/* Theme switch */}
      <div>
        <button onClick={toggleTheme}>
          {state.theme === "dark" ? <Moon /> : <Sun />}
        </button>
        <small>Theme is {state.theme}</small>
      </div>
    </aside>
  );
}

export default Sidebar;
