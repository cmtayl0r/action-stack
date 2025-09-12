import { useState, useEffect, useCallback } from "react";
import { makeStorageAPI } from "@/api/localStorageAPI";
import { Action } from "@/types";
import { useToast } from "@/context/toasts/ToastContext";

const actionAPI = makeStorageAPI("todoApp:actions");

function useActions() {
  const [actions, setActions] = useState<Action[]>([]);
  const { success, error } = useToast();

  const loadActions = useCallback(async () => {
    try {
      const data = await actionAPI.getAll();
      setActions(data);
    } catch (error) {
      console.error("Failed to load actions:", error);
    }
  }, []);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  const addAction = useCallback(
    async (
      title: string,
      priority: "low" | "medium" | "high",
      stackId: string
    ) => {
      const newAction = await actionAPI.create(
        { title, priority, stackId },
        { completed: false }
      );
      setActions((prev) => [...prev, newAction]);
    },
    [setActions]
  );

  const removeAction = useCallback(
    async (actionId: string) => {
      await actionAPI.remove(actionId);
      setActions((prev) => prev.filter((a) => a.id !== actionId));
      success("Action deleted");
    },
    [setActions]
  );

  const updateAction = useCallback(
    async (actionId: string, updatedData: Partial<Action>) => {
      const updated = await actionAPI.update(actionId, updatedData);
      setActions((prev) => prev.map((a) => (a.id === actionId ? updated : a)));
      success("Action updated");
    },
    [setActions]
  );

  const toggleComplete = useCallback(
    async (actionId: string) => {
      const action = actions.find((a) => a.id === actionId);
      if (action) {
        await updateAction(actionId, { completed: !action.completed });
      }
    },
    [actions, updateAction]
  );

  const getCompletedCount = () => {
    return actions.filter((a) => a.completed).length;
  };

  const getIncompleteCount = () => {
    return actions.filter((a) => !a.completed).length;
  };

  return {
    actions,
    addAction,
    updateAction,
    removeAction,
    toggleComplete,
    reload: loadActions,
    getCompletedCount,
    getIncompleteCount,
  };
}

export default useActions;
