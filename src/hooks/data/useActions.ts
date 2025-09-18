import { useState, useEffect, useCallback, useMemo } from "react";
import { makeSupabaseAPI } from "@/lib/data/supabaseAPI";
import { Action } from "@/types/database";
import { useToast } from "@/context/toasts/ToastContext";

const actionAPI = makeSupabaseAPI("actions");

function useActions() {
  // 📦 State for actions, loading, and error
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🪝 Toast notifications
  const { success, error: showError } = useToast();

  // 📡 Async function to load actions
  const loadActions = useCallback(async () => {
    try {
      setLoading(true); // Start loading
      setError(null); // Reset error state before loading
      const data = await actionAPI.getAll();
      setActions(data);
    } catch (error) {
      console.error("Failed to load actions:", error);
      setError("Failed to load actions");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔄 Load actions on mount
  useEffect(() => {
    loadActions();
  }, [loadActions]);

  // 📡 Add a new action
  const addAction = useCallback(
    async (name: string, priority: number, stack_id: string | number) => {
      try {
        const newAction = await actionAPI.create(
          { name, priority, stack_id },
          { completed: false }
        );
        setActions((prev) => [...prev, newAction]);
        success("Action added successfully");
        return newAction;
      } catch (err) {
        console.error("Failed to add action:", err);
        showError("Failed to add action");
        throw err; // Re-throw to let caller handle if needed
      }
    },
    [showError, success]
  );

  // 📡 Remove an action by ID
  const removeAction = useCallback(
    async (actionId: string | number) => {
      try {
        await actionAPI.remove(actionId);
        setActions((prev) => prev.filter((a) => a.id !== actionId));
        success("Action deleted");
      } catch (err) {
        console.error("Failed to delete action:", err);
        showError("Failed to delete action");
        throw err;
      }
    },
    [success, showError]
  );

  // 📡 Update an action by ID
  const updateAction = useCallback(
    async (actionId: string | number, updatedData: Partial<Action>) => {
      try {
        const updated = await actionAPI.update(actionId, updatedData);
        setActions((prev) =>
          prev.map((a) => (a.id === actionId ? updated : a))
        );
        success("Action updated");
      } catch (err) {
        console.error("Failed to update action:", err);
        showError("Failed to update action");
        throw err;
      }
    },
    [showError, success]
  );

  // 📡 Toggle completion status of an action
  const toggleComplete = useCallback(
    async (actionId: string | number) => {
      const action = actions.find((a) => a.id === actionId);
      if (action) {
        await updateAction(actionId, { completed: !action.completed });
      }
    },
    [actions, updateAction]
  );

  // 📡 Get counts of completed and incomplete actions
  const getCompletedCount = useMemo(() => {
    return actions.filter((a) => a.completed).length;
  }, [actions]);

  const getIncompleteCount = useMemo(() => {
    return actions.filter((a) => !a.completed).length;
  }, [actions]);

  return {
    actions,
    loading,
    error,
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
