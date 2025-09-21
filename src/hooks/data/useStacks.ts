// ===============================================================
// STACKS HOOK - Stack Management with React Query
// ===============================================================
// Custom hook for CRUD operations on stacks using React Query
// Provides caching, background updates, and optimistic updates
//
// Design Philosophy:
// - Pure data operations only (no toasts/navigation)
// - Exposes both sync and async mutation methods
// - Optimistic updates for better UX
// - Comprehensive error handling and logging

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stacksAPI } from "@/lib/data/supabaseAPI";
import type { Stack, CreateStackData, UpdateStackData } from "@/types/database";
import { queryKeys } from "@/lib/query-keys";

// ===============================================================
// 🪝 MAIN STACKS HOOK
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
    queryKey: queryKeys.stacks.all,
    queryFn: stacksAPI.getAll,
  });

  // 🔄 MUTATIONS - Data modifications with optimistic updates

  // ⚡️ Create new stack mutation
  const createStackMutation = useMutation({
    mutationFn: stacksAPI.create,
    onSuccess: (newStack: Stack) => {
      // 🔄 Optimistically update the cache with new stack
      queryClient.setQueryData<Stack[]>(queryKeys.stacks.all, (old = []) => [
        ...old,
        newStack,
      ]);
      // 🎯 Also set individual stack cache for potential detail views
      queryClient.setQueryData(queryKeys.stacks.detail(newStack.id), newStack);
      console.log("✅ Stack created successfully:", newStack.name);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to create stack:", error.message);
      // Don't throw here - let components handle UI feedback
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
    onSuccess: (updatedStack: Stack) => {
      // 🔄 Update stack in the list cache
      queryClient.setQueryData<Stack[]>(queryKeys.stacks.all, (old = []) =>
        old.map((stack) =>
          stack.id === updatedStack.id ? updatedStack : stack
        )
      );
      // 🎯 Update individual stack cache if it exists
      queryClient.setQueryData(
        queryKeys.stacks.detail(updatedStack.id),
        updatedStack
      );
      console.log("✅ Stack updated successfully:", updatedStack.name);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to update stack:", error.message);
    },
  });

  // ⚡️ Delete (archive) stack mutation
  const deleteStackMutation = useMutation({
    mutationFn: stacksAPI.remove,
    onSuccess: (_, deletedStackId: number) => {
      // 🔄 Remove stack from cache (it's archived, so hide from UI)
      queryClient.setQueryData<Stack[]>(queryKeys.stacks.all, (old = []) =>
        old.filter((stack) => stack.id !== deletedStackId)
      );
      // 🧹 Remove individual stack cache
      queryClient.removeQueries({
        queryKey: queryKeys.stacks.detail(deletedStackId),
      });
      console.log("✅ Stack archived successfully, ID:", deletedStackId);
    },
    onError: (error: Error) => {
      console.error("❌ Failed to archive stack:", error.message);
    },
  });

  return {
    // 📊 Data and loading states
    stacks,
    isLoading,
    error,

    // 🔧 Operations - Async versions (return promises)
    createStack: createStackMutation.mutateAsync,
    updateStack: (id: number, updates: Partial<UpdateStackData>) =>
      updateStackMutation.mutateAsync({ id, updates }),
    deleteStack: deleteStackMutation.mutateAsync,

    // 🔧 Operations - Sync versions (fire and forget)
    createStackSync: createStackMutation.mutate,
    updateStackSync: (id: number, updates: Partial<UpdateStackData>) =>
      updateStackMutation.mutate({ id, updates }),
    deleteStackSync: deleteStackMutation.mutate,

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
// 🛠️ STACK UTILITIES - Helper functions for working with stacks
// ===============================================================

/**
 * Find the user's inbox stack from the stacks list
 * @param stacks - Array of stacks to search through
 * @returns The inbox stack or undefined if not found
 */
export function findInboxStack(stacks: Stack[]): Stack | undefined {
  return stacks.find((stack) => stack.is_inbox);
}

/**
 * Find the user's default stack from the stacks list
 * @param stacks - Array of stacks to search through
 * @returns The default stack or undefined if not found
 */
export function findDefaultStack(stacks: Stack[]): Stack | undefined {
  return stacks.find((stack) => stack.is_default);
}

/**
 * Get stack display color with fallback for missing colors
 * @param stack - Stack object to get color from
 * @returns Hex color string
 */
export function getStackColor(stack: Stack): string {
  return stack.color || "#6366f1"; // Default to indigo if no color set
}

/**
 * Search stacks by name and description
 * @param stacks - Array of stacks to search through
 * @param query - Search query string
 * @returns Filtered array of matching stacks
 */
export function searchStacks(stacks: Stack[], query: string): Stack[] {
  if (!query.trim()) return stacks;

  const searchTerm = query.toLowerCase().trim();
  return stacks.filter(
    (stack) =>
      stack.name.toLowerCase().includes(searchTerm) ||
      stack.description?.toLowerCase().includes(searchTerm)
  );
}

/**
 * Sort stacks by various criteria
 * @param stacks - Array of stacks to sort
 * @param sortBy - Sort criteria
 * @returns Sorted array of stacks
 */
export function sortStacks(
  stacks: Stack[],
  sortBy: "name" | "created" | "updated" = "name"
): Stack[] {
  return [...stacks].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "created":
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "updated":
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      default:
        return 0;
    }
  });
}

/**
 * Get stacks grouped by category (system vs user)
 * @param stacks - Array of stacks to group
 * @returns Object with system and user stack arrays
 */
export function groupStacksByType(stacks: Stack[]) {
  return stacks.reduce(
    (groups, stack) => {
      if (stack.is_inbox || stack.is_default) {
        groups.system.push(stack);
      } else {
        groups.user.push(stack);
      }
      return groups;
    },
    { system: [] as Stack[], user: [] as Stack[] }
  );
}

/*
🔥 USAGE EXAMPLES:

// Basic usage in a component:
const { stacks, createStack, isCreating } = useStacks();

// Create a stack with async/await:
try {
  const newStack = await createStack({
    name: "My New Stack",
    description: "A great stack for organizing",
    color: "#ff6b6b",
    icon: "🚀"
  });
  console.log("Created:", newStack);
} catch (error) {
  console.error("Failed to create stack:", error);
}

// Use utility functions:
const inboxStack = findInboxStack(stacks);
const sortedStacks = sortStacks(stacks, "created");
const searchResults = searchStacks(stacks, "work");
*/
