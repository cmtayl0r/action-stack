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
    onSuccess: (newAction: Action) => {
      // 🔄 Add to the stack's actions cache
      if (stackId) {
        queryClient.setQueryData<Action[]>(
          queryKeys.actions.byStack(stackId),
          (old = []) => [...old, newAction]
        );
      }

      // 🎯 Set individual action cache for potential detail views
      queryClient.setQueryData(
        queryKeys.actions.detail(newAction.id),
        newAction
      );
      console.log("✅ Action created successfully:", newAction.name);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to create action:", error.message);
    },
  });

  // ⚡️ Update action
  const updateActionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Action> }) =>
      actionsAPI.update(id, updates),
    onSuccess: (updatedAction: Action) => {
      // 🔄 Update action in the stack's cache
      if (stackId) {
        queryClient.setQueryData<Action[]>(
          queryKeys.actions.byStack(stackId),
          (old = []) =>
            old.map((action) =>
              action.id === updatedAction.id ? updatedAction : action
            )
        );
      }
      // 🎯 Update individual action cache
      queryClient.setQueryData(
        queryKeys.actions.detail(updatedAction.id),
        updatedAction
      );
      console.log("✅ Action updated successfully:", updatedAction.name);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to update action:", error.message);
    },
  });

  // ⚡️ Remove action
  const deleteActionMutation = useMutation({
    mutationFn: actionsAPI.remove,
    onSuccess: (_, deletedActionId: number) => {
      // 🔄 Remove action from the stack's cache
      if (stackId) {
        queryClient.setQueryData<Action[]>(
          queryKeys.actions.byStack(stackId),
          (old = []) => old.filter((action) => action.id !== deletedActionId)
        );
      }
      // 🧹 Remove individual action cache
      queryClient.removeQueries({
        queryKey: queryKeys.actions.detail(deletedActionId),
      });
      console.log("✅ Action deleted successfully, ID:", deletedActionId);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to delete action:", error.message);
    },
  });

  // ⚡️ Toggle complete with optimistic update
  const toggleCompleteMutation = useMutation({
    mutationFn: actionsAPI.toggleComplete,
    onSuccess: (updatedAction: Action) => {
      // 🔄 Update action in the stack's cache
      if (stackId) {
        queryClient.setQueryData<Action[]>(
          queryKeys.actions.byStack(stackId),
          (old = []) =>
            old.map((action) =>
              action.id === updatedAction.id ? updatedAction : action
            )
        );
      }
      // 🎯 Update individual action cache
      queryClient.setQueryData(
        queryKeys.actions.detail(updatedAction.id),
        updatedAction
      );
      const status = updatedAction.completed ? "completed" : "reopened";
      console.log(`✅ Action ${status}:`, updatedAction.name);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to toggle action completion:", error.message);
    },
  });

  return {
    // 📊 Data and loading states
    actions,
    isLoading,
    error,
    stackId, // Include for reference

    // 🔧 Operations - Async versions (return promises)
    createAction: createActionMutation.mutateAsync,
    updateAction: (id: number, updates: Partial<Action>) =>
      updateActionMutation.mutateAsync({ id, updates }),
    toggleComplete: toggleCompleteMutation.mutateAsync,
    deleteAction: deleteActionMutation.mutateAsync,

    // 🔧 Operations - Sync versions (fire and forget)
    createActionSync: createActionMutation.mutate,
    updateActionSync: (id: number, updates: Partial<Action>) =>
      updateActionMutation.mutate({ id, updates }),
    toggleCompleteSync: toggleCompleteMutation.mutate,
    deleteActionSync: deleteActionMutation.mutate,

    // 🎯 Mutation states for UI feedback
    isCreating: createActionMutation.isPending,
    isUpdating: updateActionMutation.isPending,
    isToggling: toggleCompleteMutation.isPending,
    isDeleting: deleteActionMutation.isPending,

    // 🔄 Manual operations
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

/**
 * Filter actions by completion status
 * @param actions - Array of actions to filter
 * @param completed - Filter by completion status
 * @returns Filtered array of actions
 */
export function filterActionsByStatus(
  actions: Action[],
  completed: boolean
): Action[] {
  return actions.filter((action) => action.completed === completed);
}

/**
 * Filter actions by priority level
 * @param actions - Array of actions to filter
 * @param priority - Priority level to filter by
 * @returns Filtered array of actions
 */
export function filterActionsByPriority(
  actions: Action[],
  priority: 0 | 1 | 2 | 3
): Action[] {
  return actions.filter((action) => action.priority === priority);
}

/**
 * Search actions by name and description
 * @param actions - Array of actions to search through
 * @param query - Search query string
 * @returns Filtered array of matching actions
 */
export function searchActions(actions: Action[], query: string): Action[] {
  if (!query.trim()) return actions;

  const searchTerm = query.toLowerCase().trim();
  return actions.filter(
    (action) =>
      action.name.toLowerCase().includes(searchTerm) ||
      action.description?.toLowerCase().includes(searchTerm) ||
      action.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * Sort actions by various criteria
 * @param actions - Array of actions to sort
 * @param sortBy - Sort criteria
 * @returns Sorted array of actions
 */
export function sortActions(
  actions: Action[],
  sortBy: "name" | "priority" | "created" | "updated" | "due" = "created"
): Action[] {
  return [...actions].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "priority":
        return b.priority - a.priority; // High to low priority
      case "created":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "updated":
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      case "due":
        // Handle null due dates (put them at the end)
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      default:
        return 0;
    }
  });
}

/**
 * Group actions by priority level
 * @param actions - Array of actions to group
 * @returns Object with priority levels as keys
 */
export function groupActionsByPriority(actions: Action[]) {
  return actions.reduce(
    (groups, action) => {
      const key = action.priority;
      groups[key].push(action);
      return groups;
    },
    { 0: [], 1: [], 2: [], 3: [] } as Record<0 | 1 | 2 | 3, Action[]>
  );
}

/**
 * Group actions by completion status
 * @param actions - Array of actions to group
 * @returns Object with completed and pending action arrays
 */
export function groupActionsByStatus(actions: Action[]) {
  return actions.reduce(
    (groups, action) => {
      if (action.completed) {
        groups.completed.push(action);
      } else {
        groups.pending.push(action);
      }
      return groups;
    },
    { completed: [] as Action[], pending: [] as Action[] }
  );
}

/**
 * Get actions that are due soon (within specified days)
 * @param actions - Array of actions to check
 * @param daysAhead - Number of days to look ahead (default: 7)
 * @returns Array of actions due soon
 */
export function getActionsDueSoon(
  actions: Action[],
  daysAhead: number = 7
): Action[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

  return actions.filter((action) => {
    if (!action.due_date || action.completed) return false;
    return new Date(action.due_date) <= cutoffDate;
  });
}

/**
 * Get overdue actions
 * @param actions - Array of actions to check
 * @returns Array of overdue actions
 */
export function getOverdueActions(actions: Action[]): Action[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  return actions.filter((action) => {
    if (!action.due_date || action.completed) return false;
    return new Date(action.due_date) < today;
  });
}

/**
 * Get priority label for display
 * @param priority - Priority number
 * @returns Human-readable priority label
 */
export function getPriorityLabel(priority: 0 | 1 | 2 | 3): string {
  const labels = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
  };
  return labels[priority];
}

/**
 * Get priority color for UI theming
 * @param priority - Priority number
 * @returns CSS color value
 */
export function getPriorityColor(priority: 0 | 1 | 2 | 3): string {
  const colors = {
    0: "#6b7280", // gray
    1: "#10b981", // green
    2: "#f59e0b", // yellow
    3: "#ef4444", // red
  };
  return colors[priority];
}

/*
🔥 USAGE EXAMPLES:

// Basic usage in a component:
const { actions, createAction, toggleComplete, isCreating } = useActions(stackId);

// Create an action with async/await:
try {
  const newAction = await createAction({
    name: "Complete project proposal",
    description: "Draft and review the Q4 project proposal",
    stack_id: 1,
    priority: 2,
    due_date: "2025-12-31",
    tags: ["work", "important"]
  });
  console.log("Created:", newAction);
} catch (error) {
  console.error("Failed to create action:", error);
}

// Toggle completion:
await toggleComplete(actionId);

// Use utility functions:
const pendingActions = filterActionsByStatus(actions, false);
const highPriorityActions = filterActionsByPriority(actions, 3);
const sortedActions = sortActions(actions, 'priority');
const dueSoon = getActionsDueSoon(actions, 3); // Next 3 days
const overdue = getOverdueActions(actions);
*/
