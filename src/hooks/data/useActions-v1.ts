// ===============================================================
// ACTIONS HOOK - Action Management with React Query
// ===============================================================
// Custom hook for CRUD operations on actions using React Query
// Provides caching, background updates, and optimistic updates
//
// Design Philosophy:
// - Pure data operations only (no toasts/navigation)
// - Stack-specific action fetching with proper cache keys
// - Optimistic updates for instant UI feedback
// - Comprehensive action utilities and helpers

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { actionsAPI } from "@/lib/data/supabaseAPI";
import { TEST_USER_ID } from "@/types/database";
import type { Action, CreateActionData } from "@/types/database";
import { queryKeys } from "@/lib/query-keys";

// ===============================================================
// 🪝 MAIN ACTIONS HOOK
// ===============================================================

function useActions(stackId?: number) {
  // Create query client instance
  const queryClient = useQueryClient();

  // 📡 Get all actions for stack
  const {
    data: actions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.actions.byStack(stackId!),
    queryFn: () => actionsAPI.getByStackId(stackId!),
    enabled: !!stackId, // Only run query if stackId exists
    // select: (data) => data.slice(0, 100), // Limit to 100 items for performance
  });

  // 🔄 MUTATIONS - Data modifications with optimistic updates

  // ⚡️ Add action
  const createActionMutation = useMutation({
    mutationFn: actionsAPI.create,
    onMutate: async (newActionData) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.actions.byStack(stackId),
      });
      // Snapshot previous actions
      const previousActions = queryClient.getQueryData(
        queryKeys.actions.byStack(stackId)
      );
      // Optimistically add new action to cache
      const tempAction = {
        id: Date.now(), // Temporary ID
        ...newActionData,
        user_id: TEST_USER_ID,
        completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      // Add to the top of the list for visibility
      queryClient.setQueryData(
        queryKeys.actions.byStack(stackId),
        (old = []) => [tempAction, ...old]
      );
      // Return context with previous actions for rollback on error
      return { previousActions };
    },
    onError: (error, variables, context) => {
      if (context?.previousActions) {
        queryClient.setQueryData(
          queryKeys.actions.byStack(stackId),
          context.previousActions
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to sync with server
      queryClient.invalidateQueries({
        queryKey: queryKeys.actions.byStack(stackId),
      });
    },
  });

  // ⚡️ Update action
  const updateActionMutation = useMutation({
    mutationFn: ({ id, updates }) => actionsAPI.update(id, updates),
    onSuccess: (updatedAction) => {
      queryClient.setQueryData(queryKeys.actions.byStack(stackId), (old = []) =>
        old.map((action) =>
          action.id === updatedAction.id ? updatedAction : action
        )
      );
      queryClient.setQueryData(
        queryKeys.actions.byStack(updatedAction.id),
        updatedAction
      );
    },
  });

  // ⚡️ Remove action
  const deleteActionMutation = useMutation({
    mutationFn: actionsAPI.remove,
    onSuccess: (_, deletedActionId) => {
      queryClient.setQueryData(queryKeys.actions.byStack(stackId), (old = []) =>
        old.filter((action) => action.id !== deletedActionId)
      );
      queryClient.removeQueries({
        queryKey: queryKeys.actions.byStack(deletedActionId),
      });
    },
  });

  // ⚡️ Toggle complete with optimistic update
  const toggleCompleteMutation = useMutation({
    mutationFn: actionsAPI.toggleComplete,
    onMutate: async (actionId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.actions.byStack(stackId),
      });
      const previousActions = queryClient.getQueryData(
        queryKeys.actions.byStack(stackId)
      );

      queryClient.setQueryData(queryKeys.actions.byStack(stackId), (old = []) =>
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
          queryKeys.actions.byStack(stackId),
          context.previousActions
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.actions.byStack(stackId),
      });
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
