import { AppProvider } from "./context/app/AppContext";
import { ModalProvider } from "./context/modals/ModalContext";
import { ToastProvider } from "./context/toasts/ToastContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
