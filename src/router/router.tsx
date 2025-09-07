import { createBrowserRouter } from "react-router-dom";
import { Suspense } from "react";

// LAYOUTS
import AppLayout from "@/components/layout/app-layout/AppLayout";
import ErrorView from "@/components/layout/error-view/ErrorView";
import StackView from "@/components/features/stacks/StackView";

// LOADERS
import { stackLoader, indexLoader } from "./loaders";

// COMPONENTS
import { LoadingSpinner } from "@/components";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        loader: indexLoader,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StackView />
          </Suspense>
        ),
      },
      {
        path: "stack/:stackId",
        loader: stackLoader,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StackView />
          </Suspense>
        ),
      },
    ],
  },
]);
