import { Outlet } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import Sidebar from "./sidebar/Sidebar";
import { ToastHost, ModalHost } from "@/components";

function AppLayout() {
  const { state } = useAppContext();

  return (
    <div className="app-layout">
      {state.sidebarOpen && <Sidebar />}
      <Outlet />
      <ToastHost />
      <ModalHost />
    </div>
  );
}

export default AppLayout;
