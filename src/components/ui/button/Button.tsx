import { forwardRef } from "react";
import styles from "./Button.module.css";
import clsx from "clsx";
import {
  Button as AriaButton,
  ButtonRenderProps,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import LoadingSpinner from "@/components/ui/loading-spinner/LoadingSpinner";
import type { LucideIcon } from "lucide-react";

// =============================================================================
// 📝 INTERFACE - What props our Button accepts
// =============================================================================

interface ButtonProps extends AriaButtonProps {
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
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  isIconOnly?: boolean;

  // Pass a function as a child to dynamically change the button's content based on its state, like whether it's pressed or hovered.
  children?: React.ReactNode | ((states: ButtonRenderProps) => React.ReactNode);

  // 📝 All other React Aria Props already included
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
      // 🎯 Icon props
      icon: Icon,
      iconPosition = "left",
      // 📝 React Aria Content props
      children,
      className,
      // 🔄 React Aria State props
      isPending,
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
      if (!Icon || isPending) return null;
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
      // { [styles.loading]: isLoading },
      // Interactive state modifiers (from global CSS)
      { "interactive--disabled": isDisabled },
      // Custom class names
      className
    );

    return (
      <AriaButton
        ref={ref}
        className={buttonClasses}
        isDisabled={isDisabled}
        isPending={isPending}
        // 🔗 Pass through all other props (onClick, onPress, etc.)
        {...props}
      >
        {/* 1. React Aria provides the interaction states here */}
        {(renderProps) => (
          <>
            {/* 2. Your component's internal logic takes priority (e.g., showing a spinner) */}
            {isPending ? (
              <LoadingSpinner />
            ) : // 3. Now, handle the children. If it's a function, call it with the states.
            typeof children === "function" ? (
              children(renderProps)
            ) : (
              // 4. Otherwise, render your standard content.
              renderContent() // Usually just children
            )}
          </>
        )}
      </AriaButton>
    );
  }
);

Button.displayName = "Button";
export default Button;
export type { ButtonProps };
