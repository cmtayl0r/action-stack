# Real-Time Synchronization Strategy

This document outlines the strategy for implementing real-time data synchronization for the Action Stack application using Supabase and React Query.

## 1. Vision

The application must reflect data changes from other clients in real time. When a user creates, updates, or deletes an action on one device, the change should appear on all their other open devices nearly instantly. This is achieved by combining Supabase's real-time broadcasts with React Query's client-side cache management.

## 2. Core Implementation

A custom hook, `useRealtimeSync`, will be created to encapsulate the logic for subscribing to Supabase's real-time channels. This hook should be called once at a high level in the application, for instance, within the `AppLayout` component.

**File:** `src/hooks/data/useRealtimeSync.ts`

```typescript
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase/client";
import { useScreenReader } from "../hooks/accessibility/useScreenReaderAnnouncer";

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { announce } = useScreenReader();

  useEffect(() => {
    // Listen to inserts, updates, and deletes on the 'actions' table
    const channel = supabase
      .channel("public:actions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "actions" },
        (payload) => {
          // Announce the change to screen readers for accessibility
          if (payload.eventType === "INSERT") {
            announce("A new action was added from another device.");
          }

          // Invalidate the relevant queries to trigger a refetch.
          // This is a simple but effective strategy.
          queryClient.invalidateQueries(["actions"]);

          // Also invalidate the specific stack query if the action belongs to one
          if (payload.new?.stack_id) {
            queryClient.invalidateQueries(["actions", payload.new.stack_id]);
          }
        }
      )
      .subscribe();

    // Do the same for the 'stacks' table...
    // const stacksChannel = supabase.channel(...).subscribe();

    return () => {
      supabase.removeChannel(channel);
      // supabase.removeChannel(stacksChannel);
    };
  }, [queryClient, announce]);
}
```

## 3. Optimistic Updates vs. Real-Time Refetching

It's important to understand the two complementary patterns at play:

- **Optimistic Updates (Handled in `useActions`/`useStacks`):** When the _current user_ makes a change (e.g., adds an action), we don't wait for the database. We immediately update the UI with the expected new state. This makes the app feel instantaneous. If the server call fails, we roll back the change and show an error.

- **Real-Time Refetching (Handled in `useRealtimeSync`):** When a change is made by _another client_, Supabase broadcasts that event. Our `useRealtimeSync` hook catches it and invalidates the relevant React Query key. React Query then automatically refetches the data, ensuring the UI is up-to-date with the server.

This combination provides the best of both worlds: a snappy, responsive UI for the active user, and eventual consistency with all other clients.

## 4. Accessibility Consideration

A key part of the real-time strategy is to announce changes to screen reader users via the `useScreenReader` hook. This prevents a situation where the UI changes silently, which would be confusing for users who cannot see the screen. The announcements should be clear and concise (e.g., "New action synced.").
