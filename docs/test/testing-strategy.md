# Testing Strategy

This document defines the comprehensive testing strategy for the Action Stack application, covering unit, integration, and accessibility testing.

## 1. Guiding Principles

- **Confidence & Reliability:** Every feature should be tested to ensure it works as expected.
- **Accessibility First:** Accessibility is a core part of our quality standard and must be tested at every level.
- **Automation:** We will automate as much testing as possible to ensure consistency and speed.

## 2. Tools

- **Test Runner & Assertion:** [Vitest](https://vitest.dev/)
- **Component Testing:** [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Accessibility Testing:** [axe-core](https://github.com/dequelabs/axe-core) via [`@axe-core/react`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react)
- **Manual Accessibility Testing:** NVDA and VoiceOver screen readers.

## 3. Testing Pyramid

### Level 1: Unit Tests

- **Focus:** Test individual, isolated functions or hooks in detail.
- **Examples:**
  - Testing a utility function that formats dates.
  - Testing a custom hook's internal logic with mock inputs.
  - Testing a reducer's state transitions.
- **Location:** Colocated with the source file (e.g., `myFunction.test.ts`).

### Level 2: Integration Tests

- **Focus:** Test how multiple components work together. This is where we'll spend most of our effort.
- **Examples:**
  - Rendering a form, filling it out, submitting it, and asserting that the correct mutation was called.
  - Testing that clicking a "Delete" button correctly opens a confirmation modal.
  - Verifying that the `ActionList` component correctly renders items fetched by the `useActions` hook.
- **Location:** In a `__tests__` directory within the feature folder (e.g., `src/components/features/actions/__tests__/ActionList.test.tsx`).

### Level 3: End-to-End (E2E) Tests (Future)

- **Focus:** Test full user flows in a real browser.
- **Strategy:** While not part of the MVP, the foundation will be ready for E2E tests using a tool like Playwright or Cypress in the future.

## 4. Accessibility Testing

Accessibility testing is not a separate step but is integrated into our component and integration tests.

**Automated (`axe-core`):**
Every major component test will include an automated `axe` check to catch common WCAG violations.

```tsx
// Example test case
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

it("should have no accessibility violations", async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

**Manual:**

- **Keyboard Navigation:** Before a feature is considered "done," it must be fully navigable and operable using only the keyboard.
- **Screen Reader Testing:** Key user flows (adding an action, completing an action, navigating stacks) will be manually tested with NVDA and/or VoiceOver to ensure a seamless experience.

This integrated approach ensures that we build a high-quality, accessible product from the ground up.
