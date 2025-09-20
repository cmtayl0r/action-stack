import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import {
  LucidePlus,
  LucideSearch,
  LucideInbox,
  Layers2,
  Moon,
  Sun,
} from "lucide-react";

import useStacks from "@/hooks/data/useStacks";
import { useModal } from "@/context/modals/ModalContext";
import { MODAL_IDS } from "@/components/ui/modal/ModalHost";
import { Button } from "@/components";
import { getCurrentStackId } from "@/router/router";
import styles from "./Sidebar.module.css";

function Sidebar() {
  // 🎯 Connect to modal system
  const { openModal } = useModal();

  // 🪝 Connect to stacks hook
  const { stacks } = useStacks();

  // 🌐 Connect to app context for theme and stacks
  const { state, toggleTheme } = useAppContext();

  // 🗺️ Get current stack from URL for highlighting active stack
  const params = useParams();
  const currentStackId = getCurrentStackId(params);

  // 📊 Sort stacks: Inbox first
  const sortedStacks = useMemo(() => {
    return [...stacks].sort((a, b) => {
      // Inbox stacks come first
      if (a.is_inbox && !b.is_inbox) return -1;
      if (!a.is_inbox && b.is_inbox) return 1;
      // Otherwise maintain original order
      return 0;
    });
  }, [stacks]);

  // 🔧 Modal trigger handlers, IDs from ModalHost
  const handleAddAction = () => {
    openModal(MODAL_IDS.ADD_ACTION, { currentStackId });
  };

  const handleSearch = () => {
    openModal(MODAL_IDS.SEARCH);
  };

  const handleAddStack = () => {
    openModal(MODAL_IDS.ADD_STACK);
  };

  return (
    <aside
      className={`stack stack--between p-sm ${styles["sidebar"]}`}
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
          {sortedStacks.map((stack: Stack) => (
            <li key={stack.id}>
              <NavLink
                to={`/stack/${stack.id}`}
                className={`cluster touch-target-md`}
                aria-label={`${stack.name} list`}
              >
                {stack.is_inbox ? (
                  <LucideInbox size={16} />
                ) : (
                  <Layers2 size={16} />
                )}
                {stack.name}{" "}
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
