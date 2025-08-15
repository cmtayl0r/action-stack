# Component Spec: Input

This document specifies the requirements for a foundational, accessible `Input` component.

## 1. Vision

The `Input` component is the primary mechanism for text entry. It must be fully accessible, providing clear labels and instructions, and elegantly handle validation states and error messages.

## 2. Props Interface

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string; // The label is non-optional for accessibility.
  labelClassName?: string;
  error?: string;
  helpText?: string;
}
```

## 3. Accessibility Requirements

- **Label:** Every input must have a corresponding `<label>` element, connected via the `htmlFor` and `id` attributes. The `label` prop is mandatory.
- **Error Messages:** When an `error` is present, it must be displayed in a container with `role="alert"` and linked to the input via `aria-describedby`. The input itself should have `aria-invalid="true"`.
- **Help Text:** `helpText` should also be linked to the input via `aria-describedby`. This provides users with context or instructions.
- **Focus Style:** The input must have a clear, visible focus state. If an error is present, the focus style should reflect the invalid state (e.g., a red ring).

## 4. Structural and Styling guidance

- The component should generate a wrapper `<div>` containing the `<label>` and the `<input>`. The `error` and `helpText` elements should follow the input.
- A unique `id` should be generated for the input if one is not provided, to ensure the `htmlFor` connection is robust.
- The input should have a minimum height to meet the 44px touch-target requirement.
- The border color should change to indicate an error state, providing a visual cue in addition to the error message.

## 5. Example Usage

```tsx
<Input
  label="Your Name"
  helpText="Please enter your full name."
  placeholder="John Doe"
/>

<Input
  label="Email Address"
  error="Please enter a valid email address."
  defaultValue="invalid-email"
  type="email"
/>
```
