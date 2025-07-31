import { describe, it, expect, vi } from "vitest";
import { customRender, axeTest } from "../../../test/test-utils";
import Modal from "./Modal";

describe("Modal - Accessibility", () => {
  it("meets WCAG accessibility standards", async () => {
    const { container } = customRender(
      <Modal title="Test Modal" onClose={() => {}}>
        <Modal.Dialog>
          <Modal.Heading>Test Modal Heading</Modal.Heading>
          <Modal.Content>
            <p>Modal content goes here</p>
          </Modal.Content>
          <Modal.Footer>
            <button>Cancel</button>
            <button>Confirm</button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );

    // Test for accessibility violations
    await axeTest(container);
  });

  it("has proper ARIA attributes", async () => {
    const { getByRole } = customRender(
      <Modal title="Test Modal" onClose={() => {}}>
        <Modal.Dialog>
          <Modal.Heading>Test Modal Heading</Modal.Heading>
          <Modal.Content>
            <p>Modal content goes here</p>
          </Modal.Content>
        </Modal.Dialog>
      </Modal>
    );

    // Wait for modal to be rendered
    const dialog = await getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
  });

  it("supports keyboard navigation", async () => {
    const mockClose = vi.fn();
    const { user, getByRole } = customRender(
      <Modal title="Test Modal" onClose={mockClose}>
        <Modal.Dialog>
          <Modal.Heading>Test Modal</Modal.Heading>
          <Modal.Content>
            <button>First Button</button>
            <button>Second Button</button>
          </Modal.Content>
          <Modal.Footer>
            <Modal.CloseButton>Cancel</Modal.CloseButton>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    );

    // Test Escape key closes modal
    await user.keyboard("{Escape}");
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("traps focus within modal", async () => {
    const { user, getByText } = customRender(
      <Modal title="Test Modal" onClose={() => {}}>
        <Modal.Dialog>
          <Modal.Content>
            <button>First Button</button>
            <button>Second Button</button>
          </Modal.Content>
        </Modal.Dialog>
      </Modal>
    );

    const firstButton = getByText("First Button");
    const secondButton = getByText("Second Button");

    // Focus should cycle through modal elements only
    await user.tab();
    expect(document.activeElement).toBe(firstButton);

    await user.tab();
    expect(document.activeElement).toBe(secondButton);
  });
});
