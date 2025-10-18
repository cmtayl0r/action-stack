// Reusable factory pattern for typing react-query keys
// Why? Because react-query keys are arrays of strings and/or numbers
// and we want to have type safety and autocompletion when using them.

export const queryKeys = {
  stacks: {
    all: ["stacks"] as const,
    detail: (id: number) => ["stacks", id] as const,
  },
  actions: {
    all: ["actions"] as const,
    byStack: (stackId: number) => ["actions", "stack", stackId] as const,
    detail: (id: number) => ["actions", id] as const,
  },
} as const;
