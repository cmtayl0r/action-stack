import { QueryClient } from "@tanstack/react-query";

// 2025 best practices: 5min stale time, 3 retries, optimistic updates
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 30, // 30 minutes - cache cleanup
      retry: 3, // Auto retry failed requests 3x
      refetchOnWindowFocus: true, // Sync when user returns to app
      refetchOnReconnect: true, // Sync when internet reconnects
    },
    mutations: {
      retry: 1, // Retry mutations once if they fail
    },
  },
});
