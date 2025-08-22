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
      <nav>
        <button aria-label="Open search" onClick={modalHandlers.search}>
          <LucideSearch size={16} /> Search
        </button>

        <button aria-label="Add new action" onClick={modalHandlers.addAction}>
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
        <button aria-label="Add new stack" onClick={modalHandlers.addStack}>
          <Layers2 size={16} /> Add Stack
        </button>

        <hr />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          <LoadingSpinner />
          {/* Basic variants - uses .interactive classes */}
          <Button variant="primary" icon={Moon}>
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="outline">Outline</Button>

          {/* Semantic variants */}
          <Button variant="error">Delete</Button>
          <Button variant="success">Save</Button>

          {/* Sizes */}
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>

          {/* States - uses .interactive state classes */}
          <Button isLoading>Loading...</Button>
          <Button disabled>Disabled</Button>

          {/* Layout variants */}
          <Button isFullWidth>Full Width</Button>
          <Button iconOnly icon={Moon} aria-label="Close" size="lg" />
        </div>
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
