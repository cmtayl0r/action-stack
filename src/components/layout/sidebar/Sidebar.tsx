import { NavLink, useParams } from "react-router-dom";
import { useModal } from "@/context/modals/ModalContext";
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
import { Button } from "@/components";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const { showModal } = useModal();
  const { state, toggleTheme } = useAppContext();
  const { stacks } = useStacksContext();
  const { stackId = "inbox" } = useParams(); // get current stack in view

  // Show all stacks except "inbox"
  // const visibleStacks = stacks.filter((s) => s.id !== "inbox");

  return (
    <aside className={styles["sidebar"]} aria-label="Sidebar">
      <div className="stack">
        <Button
          onClick={() => showModal("search")}
          icon={LucideSearch}
          variant="outline"
          aria-label="Search all actions"
          aria-haspopup="dialog"
          isFullWidth
        >
          Search
        </Button>
        <Button
          onClick={() => showModal("addAction", { stackId })}
          icon={LucidePlus}
          aria-label="Add new action"
          aria-haspopup="dialog"
          isFullWidth
        >
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
          onClick={() => showModal("addStack")}
          icon={Layers2}
          variant="outline"
          aria-label="Add new stack"
          aria-haspopup="dialog"
          isFullWidth
        >
          Add Stack
        </Button>
      </div>

      {/* Theme switch */}
      <div className="cluster">
        <Button
          onClick={toggleTheme}
          icon={state.theme === "dark" ? Moon : Sun}
          aria-label="Toggle theme"
          isIconOnly
        />
        <small>Theme is {state.theme}</small>
      </div>
    </aside>
  );
}

export default Sidebar;
