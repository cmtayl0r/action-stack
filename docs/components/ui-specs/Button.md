# Component Spec: Button

This document outlines the specifications for a base `Button` component, designed with accessibility and reusability in mind.

## 1. Vision

The `Button` component is a foundational interactive element. It must be fully accessible, support different visual styles and sizes, and handle asynchronous operations gracefully (e.g., loading states).

## 2. Props Interface

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}
```

## 3. Accessibility Requirements

- **Focus Management:** The button must have a clear, visible focus state that meets WCAG 2.2 contrast requirements.
- **Keyboard Interaction:** The button must be activatable via both `Enter` and `Space` keys.
- **Disabled State:** When `disabled` or `loading` is true, the button must have `aria-disabled="true"` and styles that clearly indicate it's non-interactive.
- **Loading State:** When `loading` is true, the button should display a loading indicator (e.g., a spinner). The button's text content should still be accessible to screen readers, or an `aria-label` should be used to describe the ongoing action (e.g., "Saving...").

## 4. Structural and Styling guidance

- The component should be a wrapper around the native `<button>` element.
- It should use a utility like `cva` (class-variance-authority) or a similar method to handle variants and sizes.
- **Base styles** should ensure it's a flex container to easily align icons and text.
- **Size styles** must enforce a minimum height to meet the 44px touch-target requirement (`md` and `lg` sizes).
- **Loading spinner** should be `aria-hidden="true"` to prevent screen readers from announcing it as a separate element.

## 5. Example Usage

```tsx
<Button variant="primary" size="md" onClick={() => console.log('Clicked!')}>
  Primary Button
</Button>

<Button variant="secondary" loading>
  Saving
</Button>

<Button variant="danger" disabled>
  Delete
</Button>
```
