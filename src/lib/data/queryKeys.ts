import type { StackFilters } from "@/types/database";

// 🔑 Centralized query keys for React Query cache management
export const queryKeys = {
  // Stacks queries
  stacks: ["stacks"] as const,
  stacksAll: () => [...queryKeys.stacks, "all"] as const,
  stacksById: (id: number) => [...queryKeys.stacks, id] as const,

  // Actions queries
  actions: ["actions"] as const,
  actionsAll: () => [...queryKeys.actions, "all"] as const,
  actionsList: (filters: StackFilters) =>
    [...queryKeys.actions, "list", filters] as const,
  actionsByStack: (stackId: number) =>
    [...queryKeys.actions, "by-stack", stackId] as const,
  actionsById: (id: number) => [...queryKeys.actions, id] as const,
} as const;
