// ===============================================================
// STACKS HOOK - Stack Management with React Query
// ===============================================================
// Custom hook for CRUD operations on stacks using React Query
// Provides caching, background updates, and optimistic updates

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stacksAPI } from "@/lib/data/supabaseAPI";
import { Stack, CreateStackData, UpdateStackData } from "@/types/database";

// 🔑 Query keys for React Query caching
const QUERY_KEYS = {
  stacks: ["stacks"] as const,
  stack: (id: number) => ["stacks", id] as const,
};

// ===============================================================
// 🪝 MAIN STACKS HOOK - Complete stack management interface
// ===============================================================

function useStacks() {
  const queryClient = useQueryClient();

  // 📡 Get all stacks with caching and background updates
  const {
    data: stacks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.stacks,
    queryFn: stacksAPI.getAll,
  });

  // ⚡️ Create new stack mutation
  const createStackMutation = useMutation({
    mutationFn: stacksAPI.create,
    onSuccess: (newStack) => {
      // 🔄 Optimistically update the cache with new stack
      queryClient.setQueryData(QUERY_KEYS.stacks, (old = []) => [
        ...old,
        newStack,
      ]);

      // TODO: Show success toast notification
      console.log("Stack created successfully:", newStack.name);
    },
    onError: (error) => {
      // TODO: Show error toast notification
      console.error("Failed to create stack:", error);
    },
  });

  // ⚡️ Update stack mutation
  const updateStackMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<UpdateStackData>;
    }) => stacksAPI.update(id, updates),
    onSuccess: (updatedStack) => {
      // 🔄 Update stack in the list cache
      queryClient.setQueryData(QUERY_KEYS.stacks, (old = []) =>
        old.map((stack) =>
          stack.id === updatedStack.id ? updatedStack : stack
        )
      );

      // 🎯 Update individual stack cache if it exists
      queryClient.setQueryData(QUERY_KEYS.stack(updatedStack.id), updatedStack);

      // TODO: Show success toast
      console.log("Stack updated successfully:", updatedStack.name);
    },
    onError: (error) => {
      // TODO: Show error toast
      console.error("Failed to update stack:", error);
    },
  });

  // ⚡️ Delete (archive) stack mutation
  const deleteStackMutation = useMutation({
    mutationFn: stacksAPI.remove,
    onSuccess: (_, deletedStackId) => {
      // 🔄 Remove stack from cache (it's archived, so hide from UI)
      queryClient.setQueryData<Stack[]>(QUERY_KEYS.stacks, (old = []) =>
        old.filter((stack) => stack.id !== deletedStackId)
      );

      // 🧹 Remove individual stack cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.stack(deletedStackId) });

      // TODO: Show success toast
      console.log("Stack archived successfully");
    },
    onError: (error) => {
      // TODO: Show error toast
      console.error("Failed to archive stack:", error);
    },
  });

  return {
    // Data and state
    stacks,
    isLoading,
    error,

    // Operations
    createStack: createStackMutation.mutate,
    updateStack: (id: number, updates: Partial<UpdateStackData>) =>
      updateStackMutation.mutate({ id, updates }),
    deleteStack: deleteStackMutation.mutate,

    // Mutation states for UI feedback
    isCreating: createStackMutation.isPending,
    isUpdating: updateStackMutation.isPending,
    isDeleting: deleteStackMutation.isPending,

    // Manual refetch if needed
    refetch,
  };
}

export default useStacks;

// ===============================================================
// STACK UTILITIES - Helper functions for working with stacks
// ===============================================================

// 🏠 Find inbox stack from the stacks list
export function findInboxStack(stacks: Stack[]): Stack | undefined {
  return stacks.find((stack) => stack.is_inbox);
}

// 📊 Get stack statistics (total actions, completed percentage)
export function getStackStats(stack: Stack) {
  const completionRate =
    stack.total_actions > 0
      ? Math.round((stack.completed_actions / stack.total_actions) * 100)
      : 0;

  return {
    total: stack.total_actions,
    completed: stack.completed_actions,
    remaining: stack.total_actions - stack.completed_actions,
    completionRate,
  };
}

// 🎨 Get stack display color (fallback for missing colors)
export function getStackColor(stack: Stack): string {
  return stack.color || "#6366f1"; // Default to indigo if no color set
}

// 🔍 Search stacks by name
export function searchStacks(stacks: Stack[], query: string): Stack[] {
  if (!query.trim()) return stacks;

  const searchTerm = query.toLowerCase().trim();
  return stacks.filter(
    (stack) =>
      stack.name.toLowerCase().includes(searchTerm) ||
      stack.description?.toLowerCase().includes(searchTerm)
  );
}
