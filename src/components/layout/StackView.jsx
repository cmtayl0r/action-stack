import { useAppContext } from "../../context/AppContext";
import { useLoaderData } from "react-router-dom";

// Context
import { useActionsContext } from "../../context/ActionsContext";

//  Components
import Header from "./Header";
import ActionsList from "./ActionsList";

function StackView() {
  const { state, toggleSidebar } = useAppContext();
  // 1️⃣ Initial load from router loader
  const { stack } = useLoaderData();
  // 🔄 live action state updates from context
  const { actions, addAction, removeAction, toggleComplete } =
    useActionsContext();

  // Filter actions for this stack
  const stackActions = actions.filter((action) => action.stackId === stack.id);

  return (
    <main className="stack-view">
      <Header
        appState={state}
        stackName={stack.name}
        toggleSidebar={toggleSidebar}
      />
      <ActionsList
        stackId={stack.id}
        actions={stackActions}
        onAddAction={addAction}
        onRemoveAction={removeAction}
        onToggleComplete={toggleComplete}
      />
    </main>
  );
}

export default StackView;
