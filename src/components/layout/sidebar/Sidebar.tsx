import { NavLink, useParams } from "react-router-dom";
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
import { useModal } from "@/context/modals/ModalContext";
import { MODAL_IDS } from "@/components/ui/modal/ModalHost";
import { Button } from "@/components";
import styles from "./Sidebar.module.css";

function Sidebar() {
  // 🎯 Connect to modal system
  const { openModal } = useModal();

  // 🔗 Connect to app context for theme and stacks
  const { state, toggleTheme } = useAppContext();
  const { stacks } = useStacksContext();
  const { stackId = "inbox" } = useParams(); // get current stack in view

  // Show all stacks except "inbox"
  // const visibleStacks = stacks.filter((s) => s.id !== "inbox");

  // 🔧 Modal trigger handlers, IDs from ModalHost
  const handleAddAction = () => {
    openModal(MODAL_IDS.ADD_ACTION, { stackId });
  };

  const handleSearch = () => {
    openModal(MODAL_IDS.SEARCH);
  };

  const handleAddStack = () => {
    openModal(MODAL_IDS.ADD_STACK);
  };

  return (
    <aside
      className={`stack stack--between space-sm p ${styles["sidebar"]}`}
      aria-label="Sidebar"
    >
      <div className="stack">
        <Button
          onPress={handleSearch}
          icon={LucideSearch}
          variant="outline"
          aria-label="Search all actions"
          aria-haspopup="dialog"
          isFullWidth
        >
          Search
        </Button>
        <Button
          onPress={handleAddAction}
          icon={LucidePlus}
          aria-label="Add new action"
          aria-haspopup="dialog"
          isFullWidth
        >
          Add Action
        </Button>

        <p>Action Stacks</p>
        <ul className={`stack ${styles["sidebar__stacks"]}`}>
          {stacks.map((stack) => (
            <li key={stack.id}>
              <NavLink
                to={`/stack/${stack.id}`}
                className={`
                  cluster
                  touch-target-md
                  ${({ isActive }) => (isActive ? "active-link" : "")}
                `}
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
          onPress={handleAddStack}
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
