import { AppProvider } from "./context/app/AppContext";
import { ModalProvider } from "./context/modals/ModalContext";
import { ToastProvider } from "./context/toasts/ToastContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { StacksProvider } from "./context/stacks/StacksContext";
import { ActionsProvider } from "./context/actions/ActionsContext";

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <ModalProvider>
          <StacksProvider>
            <ActionsProvider>
              <RouterProvider router={router} />
            </ActionsProvider>
          </StacksProvider>
        </ModalProvider>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
