import { Outlet } from "react-router-dom";
import { useAppContext } from "@/context/app/AppContext";
import { Sidebar } from "@/components";
import { ModalHost } from "@/components";
import { ToastContainer } from "@/components";
import styles from "./AppLayout.module.css";

function AppLayout() {
  const { state } = useAppContext();

  return (
    <div className={styles["app-layout"]}>
      {state.sidebarOpen && <Sidebar />}
      <Outlet />
      {/* <ToastHost /> */}
      <ToastContainer />
      <ModalHost />
    </div>
  );
}

export default AppLayout;
