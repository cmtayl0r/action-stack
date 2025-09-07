import { Outlet } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { ToastHost, ModalHost } from "@/components";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const { state } = useAppContext();

  return (
    <div className={styles["app-layout"]}>
      {state.sidebarOpen && <Sidebar />}
      <Outlet />
      <ToastHost />
      <ModalHost />
    </div>
  );
}

export default AppLayout;
