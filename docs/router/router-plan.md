# Router Plan

This document outlines the routing structure for the Action Stack application using `react-router-dom`.

## 1. Vision

The routing should be simple, intuitive, and leverage the `AppLayout` component to provide a consistent user experience. Nested routes will be used to render different views within the main content area.

## 2. Router Configuration

The following demonstrates how to configure the router using `createBrowserRouter`.

```tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import TodayView from "../components/features/stacks/TodayView"; // Example component
import StackView from "../components/features/stacks/StackView"; // Example component
import ErrorView from "../components/layout/ErrorView"; // Example component

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorView />, // Top-level error boundary
    children: [
      {
        // Default route, could be "Today" or "Inbox"
        index: true,
        element: <TodayView />,
      },
      {
        path: "today",
        element: <TodayView />,
      },
      {
        path: "inbox",
        element: <div />, // Placeholder for Inbox view
      },
      {
        // A dynamic route for individual stacks
        path: "stack/:stackId",
        element: <StackView />,
      },
    ],
  },
]);
```

## 3. Key Decisions

- **`createBrowserRouter`:** Chosen for its modern capabilities, including data loading and error handling.
- **`AppLayout` as parent route:** This is a standard and effective pattern for shared layouts. The `Outlet` component within `AppLayout` will render the child routes.
- **`errorElement`:** A top-level `errorElement` is specified to catch any rendering or data-loading errors and display a user-friendly message.
- **`index: true`:** This defines the default component to be rendered at the parent's path (`/`).
- **Dynamic Routes:** The `stack/:stackId` path shows how to create dynamic routes that can render content based on a URL parameter.

## 4. Loader Functions (Future)

For Release 2, `react-router` loader functions can be added to these routes to fetch data from Supabase before the component renders, providing a better loading experience. For MVP, data can be fetched within the components themselves using `react-query`.
