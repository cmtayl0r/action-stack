import { useMemo, useState } from "react";
import { useAppContext } from "../../context/app/AppContext";
import { useLoaderData } from "react-router-dom";

// Context
import { useActionsContext } from "../../context/actions/ActionsContext";

//  Components
import Header from "./Header";
import ActionsFilter from "./ActionsFilter";
import ActionsList from "./ActionsList";

function StackView() {
  const { state, toggleSidebar } = useAppContext();
  // 1️⃣ Initial load from router loader
  const { stack } = useLoaderData();
  // 🔄 live action state updates from context
  const { actions } = useActionsContext();

  const [filter, setFilter] = useState({
    title: "",
    completed: false,
    priority: "priority",
    dateCreated: "date",
    sortDirection: "asc",
  });

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filterActions = useMemo(() => {
    const priorityOrder = {
      high: 3,
      medium: 2,
      low: 1,
    };
    return actions
      .filter((a) => a.stackId === stack.id)
      .filter((a) => (filter.completed ? !a.completed : true))
      .filter((a) => a.title.toLowerCase().includes(filter.title.toLowerCase()))
      .sort((a, b) => {
        const direction = filter.sortDirection === "asc" ? 1 : -1;
        if (filter.priority === "priority") {
          // 🔢 Custom numeric priority sort
          const valA = priorityOrder[a.priority] || 0;
          const valB = priorityOrder[b.priority] || 0;
          return (valA - valB) * direction;
        } else {
          // 🕒 Fallback: sort by dateCreated
          const dateA = new Date(a.dateCreated);
          const dateB = new Date(b.dateCreated);
          return (dateA - dateB) * direction;
        }
      });
  }, [actions, filter, stack.id]);

  return (
    <main className="stack-view">
      <Header
        appState={state}
        stackName={stack.name}
        toggleSidebar={toggleSidebar}
      />
      <ActionsFilter filter={filter} onFilterChange={handleFilterChange} />
      <ActionsList stackId={stack.id} actions={filterActions} />
    </main>
  );
}

export default StackView;
