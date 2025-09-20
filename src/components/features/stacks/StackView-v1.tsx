import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import useActions from "@/hooks/data/useActions";
import useStacks from "@/hooks/data/useStacks";
import Header from "@/components/layout/header/Header";
import ActionsFilter from "../actions/ActionsFilter";
import ActionsList from "../actions/ActionsList";
import styles from "./stacks.module.css";

function StackView() {
  // 🌐 App context
  const { state, toggleSidebar } = useAppContext();

  // 🧭 Get the stack ID from the URL
  const { stackId } = useParams();

  // 🪝 Get data via React Query / Custom hooks
  const {
    stacks,
    loading: stacksLoading,
    error: stacksError,
    addStack,
  } = useStacks();
  const {
    actions,
    loading: actionsLoading,
    error: actionsError,
    getActionsByStack,
  } = useActions();

  // ? WHY DO I NEED THIS? LOCAL STATE FOR FILTERS?
  // ? AND IF SO WHY ONLY THESE 2 PROPS?
  // ? AND SHOULD THIS BE IN ActionsFilter?
  // 📦 Local state for filters
  const [filter, setFilter] = useState({
    name: "",
    showCompleted: true,
  });

  // 🔍 Find current stack or handle inbox
  const currentStack = useMemo(() => {
    if (stackId === "inbox") {
      return stacks.find((s) => s.is_inbox) || null;
    }
    return stacks.find((s) => s.id === parseInt(stackId || "0", 10)) || null;
  }, [stacks, stackId]);

  // 🏗️ Create inbox if needed (much cleaner than complex loader)
  useEffect(() => {
    if (stackId === "inbox" && stacks.length > 0 && !currentStack) {
      // No inbox exists, create one
      addStack({
        name: "Inbox",
        description: "Your default inbox for new tasks",
        color: "#6366f1",
        icon: "📥",
        is_inbox: true,
        is_default: true,
        is_archived: false,
        sort_order: 0,
        sort_by: "created_at",
        sort_direction: "desc",
      });
    }
  }, [stackId, stacks.length, currentStack, addStack]);

  // 🛠️ Filter actions for current stack
  const filteredActions = useMemo(() => {
    if (!currentStack) return [];

    const stackActions = actions.filter(
      (action) => action.stack_id === currentStack.id
    );

    const filtered = stackActions
      .filter((action) => (filter.showCompleted ? true : !action.completed))
      .filter((action) =>
        action.name.toLowerCase().includes(filter.name.toLowerCase())
      );

    return filtered.sort((a, b) => {
      const direction = currentStack.sort_direction === "asc" ? 1 : -1;

      switch (currentStack.sort_by) {
        case "priority":
          return (a.priority - b.priority) * direction;
        case "name":
          return a.name.localeCompare(b.name) * direction;
        case "due_date":
          const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
          const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
          return (dateA - dateB) * direction;
        case "created_at":
        default:
          return (
            (new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()) *
            direction
          );
      }
    });
  }, [currentStack, actions, filter]);

  // ⚡️ Handle filter changes
  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <main className={styles["stack-view"]}>
      {/* 🔄 Loading states */}
      {(stacksLoading || actionsLoading) && <div>Loading actions...</div>}
      {/* ❗ Error states */}
      {actionsError && <div>Error loading actions: {actionsError}</div>}
      {stacksError && <div>Error loading stacks: {stacksError}</div>}
      {!actionsLoading && !actionsError && (
        <>
          {/* //! FIX this issue with "name" */}
          {/* <Header
            appState={state}
            toggleSidebar={toggleSidebar}
            stackName={currentStack.name || null}
          /> */}
          <ActionsFilter
            filter={filter}
            onFilterChange={handleFilterChange}
            stack={currentStack}
          />
          <ActionsList actions={filteredActions} />
        </>
      )}
    </main>
  );
}

export default StackView;
