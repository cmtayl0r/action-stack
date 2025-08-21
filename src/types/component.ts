import type {
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";

// =============================================================================
// GLOBAL BASE INTERFACES
// =============================================================================

// OPTION 1: Base for custom components that don't wrap HTML elements
export interface BaseComponentProps {
  className?: string; // Custom styling support
  children?: ReactNode; // Content support
  testId?: string; // Testing automation support

  // Accessibility basics for custom components
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// OPTION 2: Base for components that wrap HTML elements (MOST COMMON)
export interface BaseHTMLProps<T = HTMLElement> extends HTMLAttributes<T> {
  testId?: string; // Add testId to all HTML element props

  // Inherited from HTMLAttributes<T>:
  // - className?: string
  // - id?: string
  // - style?: CSSProperties
  // - title?: string
  // - role?: string
  // - hidden?: boolean
  // - tabIndex?: number
  // - lang?: string
  // - dir?: "ltr" | "rtl" | "auto"
  // - children?: ReactNode
  // - Event handlers: onClick, onFocus, onBlur, onKeyDown, onKeyUp, onMouseEnter, onMouseLeave, etc.
  // - All ARIA attributes: aria-label, aria-labelledby, aria-describedby, aria-expanded, aria-pressed, etc.
  // - Data attributes: data-*
  // - Microdata attributes: itemID, itemProp, itemRef, itemScope, itemType
}

// =============================================================================
// ELEMENT-SPECIFIC BASE INTERFACES
// =============================================================================
// Element-specific base interfaces for common patterns

// 🧩 buttons, icon buttons, toggle buttons share loading/variant patterns
export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean; // Universal button state
  variant?: string; // Nearly all button components need variants
  testId?: string;

  // Inherited from ButtonHTMLAttributes<HTMLButtonElement>:
  // - All HTMLAttributes props:
  //      - className, id, style, title, role, hidden, tabIndex
  //      - children
  //      - event handlers: onClick, onChange, onFocus, onBlur, onKeyDown, onMouseEnter, etc.
  //      - aria- attributes (aria-label, aria-describedby, etc.
  // - disabled?: boolean
  // - type?: "button" | "submit" | "reset"
  // - form?: string
  // - formAction?: string
  // - formEncType?: string
  // - formMethod?: string
  // - formNoValidate?: boolean
  // - formTarget?: string
  // - autoFocus?: boolean
  // - value?: string | ReadonlyArray<string> | number
}

// 🧩 text inputs, selects, textareas share error/label patterns
export interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string; // Universal input validation state
  label?: string; // Accessibility requirement for form fields
  testId?: string;

  // Inherited from InputHTMLAttributes<HTMLInputElement>:
  // - All HTMLAttributes props (className, onFocus, aria-*, etc.)
  // - value?: string | ReadonlyArray<string> | number
  // - onChange?: ChangeEventHandler<HTMLInputElement>
  // - type?: "text" | "email" | "password" | "number" | "search" | etc.
  // - placeholder?: string
  // - disabled?: boolean
  // - required?: boolean
  // - readOnly?: boolean
  // - autoComplete?: string
  // - autoFocus?: boolean
  // - name?: string
  // - id?: string
  // - min?: string | number
  // - max?: string | number
  // - step?: string | number
  // - pattern?: string
  // - maxLength?: number
  // - minLength?: number
}

// 🧩 links, nav items share variant/external patterns
export interface BaseLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: string; // Link styling variants (button-like, text, etc.)
  external?: boolean; // External link handling (opens in new tab, security attributes)
  testId?: string;

  // Inherited from AnchorHTMLAttributes<HTMLAnchorElement>:
  // - All HTMLAttributes props (className, onClick, aria-*, etc.)
  // - href?: string
  // - target?: string
  // - rel?: string
  // - download?: any
  // - ping?: string
  // - hrefLang?: string
  // - media?: string
  // - referrerPolicy?: ReferrerPolicy
  // - type?: string
}

// 🧩 forms share loading/validation patterns
export interface BaseFormProps extends FormHTMLAttributes<HTMLFormElement> {
  loading?: boolean; // Form submission state
  testId?: string;

  // Inherited from FormHTMLAttributes<HTMLFormElement>:
  // - All HTMLAttributes props (className, aria-*, etc.)
  // - onSubmit?: FormEventHandler<HTMLFormElement>
  // - action?: string
  // - method?: string
  // - target?: string
  // - encType?: string
  // - acceptCharset?: string
  // - autoComplete?: string
  // - noValidate?: boolean
  // - name?: string
}
