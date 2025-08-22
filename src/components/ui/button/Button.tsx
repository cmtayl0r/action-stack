import type { LucideIcon } from "lucide-react";
import type { BaseButtonProps } from "@/types";
import styles from "./Button.module.css";
import clsx from "clsx";
import LoadingSpinner from "@/components/ui/loading-spinner/LoadingSpinner";

// =============================================================================
// INTERFACE
// =============================================================================

// Extends HTML button attributes for native DOM support
interface ButtonProps extends BaseButtonProps {
  // Visual variants
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "outline"
    | "ghost"
    | "success"
    | "error";
  size?: "xs" | "sm" | "md" | "lg";
  isFullWidth?: boolean;

  // Custom functionality (not in HTML)
  isLoading?: boolean; // Custom loading state

  // Icon System
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconOnly?: boolean;
}

// =============================================================================
// COMPONENT
// =============================================================================

const Button = ({
  // Custom Props
  variant = "primary",
  size = "md",
  isFullWidth = false,
  isLoading = false,
  icon: Icon,
  iconPosition = "left",
  iconOnly = false,

  // HTML Props from BaseButtonProps
  onClick,
  type = "button",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  // Dev warning for icon-only buttons
  if (iconOnly && !props["aria-label"] && typeof children !== "string") {
    console.warn(
      `Warning: An icon-only button should have an accessible name.
      Provide an 'aria-label' prop or a string child.`
    );
  }

  // This will be used as the accessible name for the button
  // If the button has children, use them as the accessible name
  const accessibleName =
    typeof children === "string" ? children : props["aria-label"];

  // Render Icon
  const renderIcon = () => {
    if (!Icon || isLoading) return null;
    return (
      <span className={clsx(styles.btn__icon)} aria-hidden="true">
        <Icon className={styles.icon} />
      </span>
    );
  };

  // Build CSS Classes
  const buttonClasses = clsx(
    // Button-specific styles
    styles.btn,
    styles[size],
    `touch-target-${size}`,
    // Interactive base class (from global CSS)
    "interactive",
    `interactive--${variant}`,
    // Button layout modifiers
    { [styles.fullWidth]: isFullWidth },
    { [styles.iconOnly]: iconOnly },
    // Loading state handling
    { [styles.loading]: isLoading },
    // Interactive state modifiers (from global CSS)
    { "interactive--disabled": disabled },
    // Custom class names
    className
  );

  return (
    <button
      type={type !== "button" ? type : undefined}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled && !isLoading}
      {...(isLoading && { "aria-disabled": true })}
      aria-label={iconOnly ? accessibleName : undefined}
      {...(isLoading && { "aria-busy": true })}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {iconPosition === "left" && renderIcon()}
          {!iconOnly && children}
          {iconPosition === "right" && renderIcon()}
        </>
      )}
    </button>
  );
};

export default Button;
