import { AppProvider } from "./context/AppContext";
import { ModalProvider } from "./context/ModalContext";
import { ToastProvider } from "./context/ToastContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import ToastHost from "./components/ui/toast/ToastHost";
import { StacksProvider } from "./context/StacksContext";
import { ActionsProvider } from "./context/ActionsContext";

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
