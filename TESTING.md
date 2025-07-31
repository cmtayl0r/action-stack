# Testing Setup

This project is fully configured for Vitest and accessibility testing.

## What's Included

### Testing Framework

- **Vitest 3.2.4** - Fast unit test runner
- **@vitest/ui** - Web-based test interface
- **jsdom** - DOM environment for testing

### Testing Libraries

- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - DOM assertion matchers
- **@testing-library/user-event** - User interaction simulation

### Accessibility Testing

- **jest-axe** - Automated accessibility testing
- **@axe-core/react** - Runtime accessibility monitoring

## Available Scripts

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Open web-based test interface
npm run test:coverage # Run tests with coverage report
npm run test:watch    # Run tests in watch mode (alias for test)
npm run test:a11y     # Run accessibility-focused tests
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts          # Global test setup
│   └── test-utils.tsx    # Custom testing utilities
└── components/
    └── **/*.test.tsx     # Component tests
```

## Example Test

```typescript
import { describe, it, expect } from "vitest";
import { customRender, axeTest } from "../../../test/test-utils";
import YourComponent from "./YourComponent";

describe("YourComponent", () => {
  it("meets accessibility standards", async () => {
    const { container } = customRender(<YourComponent />);
    await axeTest(container);
  });

  it("renders correctly", () => {
    const { getByText } = customRender(<YourComponent />);
    expect(getByText("Expected Text")).toBeInTheDocument();
  });
});
```

## Accessibility Testing

Every component test should include accessibility checks:

```typescript
// Basic accessibility test
await axeTest(container);

// Test keyboard navigation
await user.tab();
expect(document.activeElement).toBe(expectedElement);

// Test ARIA attributes
expect(element).toHaveAttribute("aria-label", "Expected Label");
```

## Configuration

- **vitest.config.ts** - Vitest configuration
- **src/test/setup.ts** - Global test setup and mocks
- **src/test/test-utils.tsx** - Reusable testing utilities
