import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { ReactElement, ReactNode } from "react";
import { expect } from "vitest";

// Extend Vitest matchers
expect.extend(toHaveNoViolations);

// Custom render function that includes providers if needed
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  wrapper?: React.ComponentType<{ children: ReactNode }>;
}

export function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult & { user: ReturnType<typeof userEvent.setup> } {
  const user = userEvent.setup();

  const result = render(ui, {
    // Add any global providers here
    wrapper: options?.wrapper,
    ...options,
  });

  return {
    ...result,
    user,
  };
}

// Accessibility testing helper
export async function axeTest(container: Element) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

// Helper to test keyboard navigation
export async function testKeyboardNavigation(
  user: ReturnType<typeof userEvent.setup>,
  expectedElements: Element[]
) {
  for (const element of expectedElements) {
    await user.tab();
    expect(document.activeElement).toBe(element);
  }
}

// Helper to test screen reader announcements
export function getByRole(container: Element, role: string, options?: any) {
  return container.querySelector(
    `[role="${role}"]${options?.name ? `[aria-label="${options.name}"]` : ""}`
  );
}

// Re-export everything from testing library
export * from "@testing-library/react";
export { userEvent };
export { axe, toHaveNoViolations };
