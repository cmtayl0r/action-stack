import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Sidebar from "./Sidebar";
import ModalHost from "../ui/modal/ModalHost";
import ToastHost from "../ui/toast/ToastHost";

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
