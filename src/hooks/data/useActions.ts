import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { actionsAPI } from "@/lib/data/supabaseAPI";
import { Action, StackFilters } from "@/types/database";

// 🔑 Query keys
const QUERY_KEYS = {
  actions: (stackId: number) => ["actions", stackId] as const,
  action: (id: number) => ["action", id] as const,
};

// ===============================================================
// MAIN ACTIONS HOOK
// ===============================================================

function useActions(stackId: number) {
  // Create query client instance
  const queryClient = useQueryClient();

  // 📡 Get all actions for stack
  const {
    data: actions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.actions(stackId),
    queryFn: () => actionsAPI.getByStackId(stackId),
    enabled: !!stackId,
    staleTime: 2 * 60 * 1000,
  });

  // 1️⃣ The "Engine": Handles the raw API call and state management.

  // ⚡️ Add action
  const createActionMutation = useMutation({
    mutationFn: actionsAPI.create,
    onSuccess: (newAction) => {
      queryClient.setQueryData(QUERY_KEYS.actions(stackId), (old = []) => [
        ...old,
        newAction,
      ]);
    },
  });

  // ⚡️ Update action
  const updateActionMutation = useMutation({
    mutationFn: ({ id, updates }) => actionsAPI.update(id, updates),
    onSuccess: (updatedAction) => {
      queryClient.setQueryData(QUERY_KEYS.actions(stackId), (old = []) =>
        old.map((action) =>
          action.id === updatedAction.id ? updatedAction : action
        )
      );
      queryClient.setQueryData(
        QUERY_KEYS.action(updatedAction.id),
        updatedAction
      );
    },
  });

  // ⚡️ Remove action
  const deleteActionMutation = useMutation({
    mutationFn: actionsAPI.remove,
    onSuccess: (_, deletedActionId) => {
      queryClient.setQueryData(QUERY_KEYS.actions(stackId), (old = []) =>
        old.filter((action) => action.id !== deletedActionId)
      );
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.action(deletedActionId),
      });
    },
  });

  // ⚡️ Toggle complete with optimistic update
  const toggleCompleteMutation = useMutation({
    mutationFn: actionsAPI.toggleComplete,
    onMutate: async (actionId) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.actions(stackId),
      });
      const previousActions = queryClient.getQueryData(
        QUERY_KEYS.actions(stackId)
      );

      queryClient.setQueryData(QUERY_KEYS.actions(stackId), (old = []) =>
        old.map((action) =>
          action.id === actionId
            ? { ...action, completed: !action.completed }
            : action
        )
      );

      return { previousActions };
    },
    onError: (error, actionId, context) => {
      if (context?.previousActions) {
        queryClient.setQueryData(
          QUERY_KEYS.actions(stackId),
          context.previousActions
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.actions(stackId) });
    },
  });

  return {
    // Data and state
    actions,
    isLoading,
    error,

    // Action operations
    createAction: createActionMutation.mutate,
    updateAction: (id, updates) => updateActionMutation.mutate({ id, updates }),
    toggleComplete: toggleCompleteMutation.mutate,
    deleteAction: deleteActionMutation.mutate,

    // Status flags
    isCreating: createActionMutation.isPending,
    isUpdating: updateActionMutation.isPending,
    isToggling: toggleCompleteMutation.isPending,
    isDeleting: deleteActionMutation.isPending,

    // Manual refetch if needed
    refetch,
  };
}

export default useActions;

// ===============================================================
// ACTION UTILITIES - Helper functions for working with actions
// ===============================================================

export function getStackActionStats(stackId: number, actions: Action[]) {
  const stackActions = actions.filter((action) => action.stack_id === stackId);
  const totalActions = stackActions.length;
  const completedActions = stackActions.filter(
    (action) => action.completed
  ).length;
  const remainingActions = totalActions - completedActions;

  return { totalActions, completedActions, remainingActions };
}
