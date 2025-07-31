import { describe, it, expect } from "vitest";
import { customRender, axeTest } from "../../../test/test-utils";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with correct accessibility attributes", async () => {
    const { container, getByRole } = customRender(
      <LoadingSpinner label="Loading content" />
    );

    // Test accessibility
    await axeTest(container);

    // Test ARIA attributes
    const spinner = getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-live", "polite");
    expect(spinner).toHaveAttribute("aria-label", "Loading content");
  });

  it("has different sizes", () => {
    const { container } = customRender(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector('[data-size="sm"]');
    expect(spinner).toBeInTheDocument();
  });

  it("displays custom label text", () => {
    const customLabel = "Please wait while we process your request";
    const { getByText } = customRender(<LoadingSpinner label={customLabel} />);
    expect(getByText(customLabel)).toBeInTheDocument();
  });
});
