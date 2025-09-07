import { Ellipsis, SquareChevronLeft, SquareChevronRight } from "lucide-react";
import Button from "@/components/ui/button/Button";
import styles from "./Header.module.css";

function Header({ appState, stackName, toggleSidebar }) {
  return (
    <header className={`cluster cluster--space space-sm p ${styles["header"]}`}>
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        isIconOnly
        icon={appState.sidebarOpen ? SquareChevronLeft : SquareChevronRight}
      />
      {/* <small>Sidebar {appState.sidebarOpen ? "is open" : "is closed"}</small> */}
      <h5 className={styles["stack__title"]}>{stackName}</h5>
      <Button variant="ghost" isIconOnly icon={Ellipsis} />
    </header>
  );
  s;
}

export default Header;
