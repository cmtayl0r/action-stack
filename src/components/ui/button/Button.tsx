import type { ReactNode } from "react";
import type { BaseButtonProps } from "@/types";
import styles from "./Button.module.css";
import clsx from "clsx";

// =============================================================================
// INTERFACE
// =============================================================================

// Extends HTML button attributes for native DOM support
interface ButtonProps extends BaseButtonProps {
  // Visual variants
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "xs" | "sm" | "md" | "lg";
  isFullWidth?: boolean;

  // Custom functionality (not in HTML)
  announceAction?: boolean; // Custom screen reader behavior
  isLoading?: boolean; // Custom loading state

  // Icon System
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
  iconSize?: "sm" | "md" | "lg";
  // ? Add Lucide Icon as prop?
}

// =============================================================================
// COMPONENT
// =============================================================================

const Button = ({
  // Custom Props
  variant = "primary",
  size = "md",
  isFullWidth = false,
  announceAction = false,
  isLoading = false,
  icon,
  iconPosition = "left",
  iconOnly = false,
  iconSize = "md",

  // HTML Props from BaseButtonProps
  children,
  disabled,
  onClick,
  onKeyDown,
  type,
  className,

  // Spread remaining props
  ...props
}: ButtonProps) => {
  // TODO: Async actions
  // TODO: Screen reader announcement helper
  // TODO: Get button label for screen readers

  // Render Icon
  const renderIcon = () => {
    // Guard against missing icon or loading state
    if (!icon || isLoading) return null;

    return (
      <span
        className={`
        btn__icon btn__icon--${iconSize} btn__icon--${iconPosition}
        `}
        aria-hidden="true"
        data-position={iconPosition}
        data-size={iconSize}
      >
        {icon}
      </span>
    );
  };

  // Render loading (and other) states
  const renderState = () => {
    if (isLoading) {
      return (
        <span className={styles.loader} aria-hidden="true">
          {/* Replace with loading spinner */}
          <span className={styles["visually-hidden"]}>Loading...</span>
        </span>
      );
    }
  };

  // Build CSS Classes
  const buttonClasses = clsx(
    // Base Classes
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    // Conditional Classes using && syntax
    isFullWidth && styles["btn--full-width"],
    iconOnly && styles["btn__icon-only"],
    isLoading && styles["btn--loading"],
    disabled && styles["btn--disabled"],

    // Custom classname for props
    className
  );

  // Build conditional props
  const conditionalProps = {
    ...(isLoading && { "aria-busy": true }),
    ...(disabled && { "aria-disabled": true }),
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={buttonClasses}
      onClick={onClick}
      {...conditionalProps}
      {...props}
    >
      {/* Render icon on left */}
      {iconPosition === "left" && renderIcon()}
      {/* Render loading state */}
      {renderState()}
      {!iconOnly && <span className={styles.btn__label}>{children}</span>}
      {/* Render icon on right */}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};

export default Button;
