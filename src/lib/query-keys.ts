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
