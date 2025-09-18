import { AppProvider } from "./context/app/AppContext";
import { ModalProvider } from "./context/modals/ModalContext";
import { ToastProvider } from "./context/toasts/ToastContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

// React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/data/QueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ToastProvider>
          <ModalProvider>
            <RouterProvider router={router} />
            {/* Dev tools for React Query - remove in production */}
            <ReactQueryDevtools initialIsOpen={false} />
          </ModalProvider>
        </ToastProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
