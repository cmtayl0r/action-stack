import styles from "./LoadingSpinner.module.css";
import type { BaseHTMLProps } from "@/types";
import clsx from "clsx";

// =============================================================================
// INTERFACE
// =============================================================================

interface LoadingSpinnerProps extends BaseHTMLProps {
  size?: "xs" | "sm" | "md" | "lg";
  label?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

const LoadingSpinner = ({
  size = "md",
  label = "Loading",
  className,
}: LoadingSpinnerProps) => {
  const spinnerClasses = clsx(
    styles["loading-spinner"],
    styles[`loading-spinner--${size}`],
    className
  );
  return (
    <div className={spinnerClasses} role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
