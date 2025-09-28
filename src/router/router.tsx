import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { INBOX_STACK_ID } from "@/types/database";

// LAYOUTS
import AppLayout from "@/components/layout/app-layout/AppLayout";
import ErrorView from "@/components/layout/error-view/ErrorView";
import StackView from "@/components/layout/stack-view/StackView";

// COMPONENTS
import { LoadingSpinner } from "@/components";

// TODO: Fix the Inbox as default stack issue

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StackView />
          </Suspense>
        ),
      },
      {
        path: "stack/:stackId",
        // loader: stackLoader,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StackView />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to={`/stack/${INBOX_STACK_ID}`} replace />,
        // 🚫 Catch-all route for 404s - redirect to inbox
      },
    ],
  },
]);

// ===============================================================
// ROUTE UTILITIES - Helper functions for navigation
// ===============================================================

// 🛠️ Helper function to generate stack URLs
export function getStackUrl(stackId: number): string {
  return `/stack/${stackId}`;
}

// 🛠️ Extract stackId from current URL params (use in components)
export function getCurrentStackId(params: { stackId?: string }): number {
  const stackId = params.stackId
    ? parseInt(params.stackId, 10)
    : INBOX_STACK_ID;

  // 🛡️ Validate that stackId is a valid number
  if (isNaN(stackId)) {
    console.warn(`Invalid stackId: ${params.stackId}, falling back to inbox`);
    return INBOX_STACK_ID;
  }

  return stackId;
}
