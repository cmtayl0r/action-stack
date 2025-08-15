import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/app/AppContext";
import Sidebar from "./Sidebar";
import { ModalHost, ToastHost } from "@/components";

function AppLayout() {
  const { state } = useAppContext();

  return (
    <div className="app-layout">
      {state.sidebarOpen && <Sidebar />}
      <Outlet />
      <ModalHost />
      <ToastHost />
    </div>
  );
}

export default AppLayout;
