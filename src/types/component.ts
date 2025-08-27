import type {
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
  AnchorHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import type { LucideIcon } from "lucide-react";

// =============================================================================
// CORE UTILITY TYPES
// =============================================================================

// Common Sizes
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

// Loading states for interactive components
export type LoadingState = boolean | "pending" | "submitting";

// =============================================================================
// GLOBAL BASE INTERFACES
// =============================================================================

// ============== OPTION 1
// Base for custom components (no HTML element wrapping)
export interface BaseComponentProps {
  className?: string; // Custom styling support
  children?: ReactNode; // Content support
  testId?: string; // Testing automation support
  // Accessibility basics for custom components
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// ============== OPTION 2
// Base for components that wrap HTML elements (MOST COMMON)
export interface BaseHTMLProps<T = HTMLElement> extends HTMLAttributes<T> {
  testId?: string; // Add testId to all HTML element props
  // All other props inherited from HTMLAttributes<T>:
  // className, id, style, children, onClick, aria-*, data-*, etc.
}

// =============================================================================
// ELEMENT-SPECIFIC BASE INTERFACES
// =============================================================================
// Element-specific base interfaces for common patterns

// 🔘 Button Components (Button, IconButton, ToggleButton)
export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean; // Universal button state
  variant?: string; // Nearly all button components need variants
  testId?: string;
  // Inherited: value, onChange, placeholder, disabled, required, etc.
}

// 📝 Input Components (TextInput, NumberInput, SearchInput)
export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string; // Universal input validation state
  label?: string; // Accessibility requirement for form fields
  helperText?: string; // Additional context for form fields
  testId?: string;
  // Inherited: value, onChange, placeholder, disabled, required, etc.
}

// 📄 Textarea Components
export interface BaseTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  testId?: string;
  // Inherited: value, onChange, placeholder, rows, cols, etc.
}

// 🔽 Select Components (Select, ComboBox, Autocomplete)
export interface BaseSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  testId?: string;
  // Inherited: value, onChange, disabled, required, multiple, etc.
}

// 🔗 Link Components (Link, NavLink, ButtonLink)
export interface BaseLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean; // External link handling
  testId?: string;
  // Inherited: href, target, rel, onClick, className, etc.
}

// 📋 Form Components (Form, FormSection)
export interface BaseFormProps extends FormHTMLAttributes<HTMLFormElement> {
  loading?: LoadingState;
  testId?: string;
  // Inherited: onSubmit, action, method, noValidate, etc.
}

// =============================================================================
// SPECIALIZED PATTERN INTERFACES
// =============================================================================

// For components with icon support (buttons, inputs, links)
export interface WithIconProps {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  iconOnly?: boolean; // For accessibility labeling
}

// For components with controlled/uncontrolled patterns
// Controlled usage (parent manages state)
// Uncontrolled usage (component manages own state)
export interface WithControlProps<T = string> {
  value?: T; // Controlled mode
  defaultValue?: T; // Uncontrolled mode with initial value
  onChange?: (value: T) => void; // Change handler
}

// Components that perform asynchronous operations (API calls, etc.)
export interface WithAsyncProps {
  loading?: LoadingState; // Loading state indicator
  onAsync?: () => Promise<void>; // Async action handler
  loadingText?: string; // Custom loading message
}

// =============================================================================
// EXPORTS FOR EASY CONSUMPTION
// =============================================================================

// Re-export commonly used React types
export type {
  ReactNode,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  FormEvent,
  FocusEvent,
} from "react";
