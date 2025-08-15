# Data Access Layer & Hooks Specification

This document outlines the architecture for connecting to Supabase and managing data fetching and mutations via React Query hooks.

## 1. Supabase Client

A singleton instance of the Supabase client should be created and exported from a central file.

**File:** `src/lib/supabase/client.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in environment variables."
  );
}

// It's crucial to use the generated types for type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

**Note:** The `Database` type should be generated from your Supabase schema to provide full type safety across the application.

## 2. Data Fetching Hooks (`useStacks` and `useActions`)

We will use custom hooks to encapsulate all React Query logic for interacting with our database tables. This keeps our components clean and centralizes data management.

### `useStacks` Hook

**File:** `src/hooks/data/useStacks.ts`

**Vision:** This hook will manage fetching all stacks for the current user and creating new stacks.

**Hook Signature & Logic:**

```typescript
interface UseStacksResult {
  stacks?: Stack[];
  isLoading: boolean;
  error?: Error;
  createStack: (name: string) => Promise<Stack>;
}

function useStacks(): UseStacksResult {
  // 1. Fetching logic (useQuery)
  const {
    data: stacks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stacks"],
    queryFn: async () => {
      /* Supabase query to select all stacks for the current user */
    },
  });

  // 2. Creation logic (useMutation)
  const { mutateAsync: createStack } = useMutation({
    mutationFn: async (name: string) => {
      /* Supabase query to insert a new stack */
    },
    onSuccess: () => {
      // Invalidate the 'stacks' query to refetch and show the new stack
      queryClient.invalidateQueries(["stacks"]);
      // Announce success to screen readers
      announce("New stack created.");
    },
  });

  return { stacks, isLoading, error, createStack };
}
```

### `useActions` Hook

**File:** `src/hooks/data/useActions.ts`

**Vision:** This hook manages all actions, either globally or scoped to a specific stack. It will handle fetching, creating, and updating actions.

**Hook Signature & Logic:**

```typescript
interface UseActionsProps {
  stackId?: string; // Optional: to fetch actions for a specific stack
}

interface UseActionsResult {
  actions?: Action[];
  // ... fetching state
  createAction: (text: string) => Promise<Action>;
  updateAction: (actionId: string, updates: Partial<Action>) => Promise<Action>;
}

function useActions({ stackId }: UseActionsProps): UseActionsResult {
  const queryKey = stackId ? ["actions", stackId] : ["actions"];

  // 1. Fetching logic (useQuery)
  // ... fetches actions based on queryKey (all actions or for a specific stack)

  // 2. Creation logic (useMutation with Optimistic Update)
  const { mutateAsync: createAction } = useMutation({
    mutationFn: async (text: string) => {
      /* ... */
    },
    onMutate: async (newActionText) => {
      // Optimistic update logic as defined in the Memory Bank
      // ...
      return { previousActions };
    },
    onError: (err, newAction, context) => {
      // Rollback logic
    },
    onSettled: () => {
      // Refetch after mutation is complete
      queryClient.invalidateQueries(queryKey);
    },
  });

  // 3. Update logic (useMutation for toggling 'completed' status, etc.)
  // ... similar to createAction, with optimistic updates.

  return {
    /* ... */
  };
}
```
