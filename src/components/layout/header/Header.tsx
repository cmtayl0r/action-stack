import { Ellipsis, SquareChevronLeft, SquareChevronRight } from "lucide-react";
import styles from "./Header.module.css";

function Header({ appState, stackName, toggleSidebar }) {
  return (
    <header className={styles["header"]}>
      <button onClick={toggleSidebar}>
        {appState.sidebarOpen ? <SquareChevronLeft /> : <SquareChevronRight />}
      </button>
      {/* <small>Sidebar {appState.sidebarOpen ? "is open" : "is closed"}</small> */}
      <h5 className={styles["stack__title"]}>{stackName}</h5>
      <button>
        <Ellipsis />
      </button>
    </header>
  );
}

export default Header;
