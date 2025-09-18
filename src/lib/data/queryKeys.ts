// Centralized query keys for React Query cache management
// Why?: To avoid hardcoding query keys throughout the app,
// making it easier to manage and refactor them in one place.
export const queryKeys = {
  // Stacks queries
  stacks: ["stacks"] as const,
  stacksAll: () => [...queryKeys.stacks, "all"] as const,
  stacksById: (id: number) => [...queryKeys.stacks, id] as const,

  // Actions queries
  actions: ["actions"] as const,
  actionsAll: () => [...queryKeys.actions, "all"] as const,
  actionsByStack: (stackId: number) =>
    [...queryKeys.actions, "by-stack", stackId] as const,
  actionsById: (id: number) => [...queryKeys.actions, id] as const,
} as const;
