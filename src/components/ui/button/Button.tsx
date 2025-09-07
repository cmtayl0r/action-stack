import { forwardRef } from "react";
import styles from "./Button.module.css";
import clsx from "clsx";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import LoadingSpinner from "@/components/ui/loading-spinner/LoadingSpinner";

// =============================================================================
// 📝 INTERFACE - What props our Button accepts
// =============================================================================

interface ButtonProps extends Omit<AriaButtonProps, "className"> {
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

  // 🎯 Icon support - Works with Lucide React icons
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconPosition?: "left" | "right";
  isIconOnly?: boolean;

  // State
  isLoading?: boolean;

  // 📝 Content and styling
  children?: React.ReactNode;
  className?: string;
}

// =============================================================================
// 🧱 COMPONENT - Our Button implementation
// =============================================================================

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      // 🎨 Visual props with defaults
      variant = "primary",
      size = "md",
      // 📐 Layout props with defaults
      isFullWidth = false,
      isIconOnly = false,
      // 🔄 State props with defaults
      isLoading = false,
      // 🎯 Icon props
      icon: Icon,
      iconPosition = "left",
      // 📝 Content props
      children,
      className,
      isDisabled,
      // 🔗 All other props pass through to React Aria Button
      ...props
    },
    ref
  ) => {
    // Dev warning for icon-only buttons without proper labeling
    if (process.env.NODE_ENV === "development") {
      if (isIconOnly && !props["aria-label"] && !props["aria-labelledby"]) {
        console.warn(
          "Button: Icon-only buttons must have an accessible name. " +
            "Provide aria-label or aria-labelledby prop."
        );
      }
    }

    /**
     * 🎯 Renders the icon component
     * Icons are hidden from screen readers (aria-hidden) since button text describes the action
     */
    const renderIcon = () => {
      if (!Icon || isLoading) return null;
      return (
        <span className={clsx(styles.btn__icon)} aria-hidden="true">
          <Icon className={styles.icon} />
        </span>
      );
    };

    /**
     * 📝 Renders the button content based on state and props
     * Handles three scenarios: icon-only, loading, and standard content
     */
    const renderContent = () => {
      // ⭕ Icon-only: Just show the icon
      if (isIconOnly) return renderIcon();
      // ⏳ Loading: Show spinner instead of content
      if (isLoading) return <LoadingSpinner />;
      // 📝 Standard: Show text with optional icons
      return (
        <>
          {iconPosition === "left" && renderIcon()}
          {children}
          {iconPosition === "right" && renderIcon()}
        </>
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
      { [styles.iconOnly]: isIconOnly },
      // Loading state handling
      { [styles.loading]: isLoading },
      // Interactive state modifiers (from global CSS)
      { "interactive--disabled": isDisabled },
      // Custom class names
      className
    );

    return (
      <AriaButton
        ref={ref}
        className={buttonClasses}
        // 🚫 Disable button if explicitly disabled OR loading
        isDisabled={Boolean(isDisabled || isLoading)}
        // ♿ Loading accessibility attributes
        {...(isLoading && {
          "aria-busy": true, // Tell screen readers we're busy
          "aria-live": "polite", // Announce loading state changes
        })}
        // 🔗 Pass through all other props (onClick, onPress, etc.)
        {...props}
      >
        {renderContent()}
      </AriaButton>
    );
  }
);

Button.displayName = "Button";
export default Button;
export type { ButtonProps };
