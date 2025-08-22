import { NavLink, useParams } from "react-router-dom";
import { useModalContext } from "@/context/modals/ModalContext";
import { useStacksContext } from "@/context/stacks/StacksContext";
import { useAppContext } from "@/context/app/AppContext";
import {
  LucidePlus,
  LucideSearch,
  LucideInbox,
  Layers2,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui";
import { LoadingSpinner } from "@/components/ui";
import styles from "./Sidebar.module.css";
import { L } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

function Sidebar() {
  const { state, toggleTheme } = useAppContext();
  const { stacks } = useStacksContext();
  const { openModal } = useModalContext();
  const { stackId = "inbox" } = useParams(); // get current stack in view

  // Show all stacks except "inbox"
  // const visibleStacks = stacks.filter((s) => s.id !== "inbox");

  const modalHandlers = {
    addAction: () => openModal("add-action", { stackId }),
    addStack: () => openModal("add-stack"),
    search: () => openModal("search-actions"),
  };

  return (
    <aside className={styles["sidebar"]} aria-label="Sidebar">
      <nav className="stack">
        <Button
          onClick={modalHandlers.search}
          icon={LucideSearch}
          variant="outline"
          isFullWidth
        >
          Search
        </Button>
        <Button onClick={modalHandlers.addAction} icon={LucidePlus} isFullWidth>
          Add Action
        </Button>

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

        <Button
          onClick={modalHandlers.addStack}
          icon={Layers2}
          variant="outline"
          isFullWidth
        >
          Add Stack
        </Button>
      </nav>

      {/* Theme switch */}
      <div className="cluster">
        <Button
          onClick={toggleTheme}
          icon={state.theme === "dark" ? Moon : Sun}
          aria-label="Toggle theme"
          iconOnly
        />
        <small>Theme is {state.theme}</small>
      </div>
    </aside>
  );
}

export default Sidebar;
