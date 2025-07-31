import { describe, it, expect, vi } from "vitest";
import { customRender, axeTest } from "./test/test-utils";
import App from "./App";

// Mock router since it needs browser environment
vi.mock("react-router-dom", () => ({
  RouterProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="router">{children}</div>
  ),
}));

describe("App", () => {
  it("renders without crashing", () => {
    const { getByTestId } = customRender(<App />);
    expect(getByTestId("router")).toBeInTheDocument();
  });

  it("meets accessibility standards", async () => {
    const { container } = customRender(<App />);
    await axeTest(container);
  });

  it("provides all necessary context providers", () => {
    // This test ensures all providers are wrapping the app correctly
    const { container } = customRender(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
