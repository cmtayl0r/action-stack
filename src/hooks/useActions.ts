/*
  ROLE: React-focused logic that manages component state, side effects, handles reactivity
  Abstract over the API layer to perform CRUD operations on stacks.
*/

import { useState, useEffect, useCallback } from "react";
import { makeStorageAPI } from "../api/localStorageAPI";

// Pass key name to the API to manipulate it in localStorage
const actionAPI = makeStorageAPI("todoApp:actions");

function useActions() {
  const [actions, setActions] = useState([]);

  // 1️⃣ Load actions
  const loadActions = useCallback(async () => {
    try {
      const data = await actionAPI.getAll();
      setActions(data);
    } catch (error) {
      console.error("Failed to load actions:", error);
    }
  }, []);

  // 2️⃣ Load all actions on component mount
  useEffect(() => {
    loadActions();
  }, [loadActions]);

  // 3️⃣ Add a new action
  const addAction = useCallback(
    async ({ title, priority = "medium", stackId }) => {
      // Create a new action object
      const newAction = await actionAPI.create(
        { title, priority, stackId }, // User-provided data
        { completed: false } // Default value for completed
      );
      // Update the state with the new action
      setActions((prev) => [...prev, newAction]);
    },
    [setActions]
  );

  // 4️⃣ Remove an action
  const removeAction = useCallback(
    async (actionId) => {
      await actionAPI.remove(actionId);
      // Update the state by filtering out the removed action
      setActions((prev) => prev.filter((a) => a.id !== actionId));
    },
    [setActions]
  );

  // 5️⃣ Update an action
  const updateAction = useCallback(
    async (actionId, updatedData) => {
      const updated = await actionAPI.update(actionId, updatedData);
      // Update the state with the modified action
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
    },
    [setActions]
  );

  // 6️⃣ Toggle action completion
  const toggleComplete = useCallback(
    async (actionId) => {
      const action = actions.find((a) => a.id === actionId);
      if (action) {
        await updateAction(actionId, { completed: !action.completed });
      }
    },
    [actions, updateAction]
  );

  // * Get action by ID
  // * Move action to a different stack
  // * Get the count of actions in a stack

  // const bulkRemoveCompleted = async () => {
  //   await actionAPI.removeMany((a) => a.stackId === stackId && a.completed);
  //   loadActions();
  // };
  // const filterByPriority = (level) =>
  //   actions.filter((a) => a.priority === level);

  return {
    actions,
    addAction,
    updateAction,
    removeAction,
    toggleComplete,
    reload: loadActions,
  };
}

export default useActions;
