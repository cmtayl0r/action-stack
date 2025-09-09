# Modal System Refactoring Plan

This document outlines the identified issues within the current modal system implementation and proposes a refactoring plan to improve its architecture, type safety, accessibility, and overall maintainability.

## 1. Overview of Current Modal System Files

- [`src/components/ui/modal/Modal.tsx`](src/components/ui/modal/Modal.tsx): Defines the compound modal components (`Modal.Root`, `Modal.Dialog`, `Modal.Header`, `Modal.Body`, `Modal.Footer`, `Modal.Close`). It leverages `react-aria` for accessibility.
- [`src/components/ui/modal/ModalHost.tsx`](src/components/ui/modal/ModalHost.tsx): Acts as the renderer for modals. It uses a simple registry (`MODAL_COMPONENTS`) to map modal IDs to their respective components and renders the currently active modal from `ModalContext`.
- [`src/components/features/actions/AddActionModal.tsx`](src/components/features/actions/AddActionModal.tsx): An example of a "feature modal" that composes the `Modal` UI components with business logic (form handling, API calls).
- [`src/context/modals/ModalContext.tsx`](src/context/modals/ModalContext.tsx): Manages the global state of which modal is open, its props, and handles focus restoration to the trigger element.

## 2. Identified Issues and Why They Need Refactoring

### Issue 2.1: Tight Coupling between `Modal.tsx` and `ModalContext.tsx`

- **Problem:** The `Modal.Dialog` component in `Modal.tsx` directly accesses `useModalContext()` to get `onClose` and `dialogRef`. While `Modal.Root` also provides a `ModalContext.Provider`, there are effectively two separate contexts for modals which leads to confusion. Furthermore, `Modal.Dialog` attempts to directly modify the `titleProps` in the `ModalContext` obtained from `useModalContext()`, which is an anti-pattern for context usage as it modifies an object that should ideally be stable or updated through its provider.
- **Why it's an issue:** This creates an unclear data flow, makes it harder to reason about modal state, and could lead to unexpected behavior if components try to use different modal contexts. The direct modification of `titleProps` is a mutation that bypasses React's declarative update cycle.

### Issue 2.2: Redundant `DismissButton` in `Modal.tsx`

- **Problem:** `Modal.Dialog` renders `DismissButton` twice (lines 136 and 146).
- **Why it's an issue:** Redundant and unnecessary. It might cause accessibility issues for screen readers.

### Issue 2.3: `Modal.Root` is not correctly integrated with `react-aria`'s `useOverlay`

- **Problem:** `Modal.Root` wraps the children with `ModalContext.Provider` and conditionally renders `children` based on `isOpen`. However, `useOverlay` is called within `ModalDialog`, but `Modal.Root` doesn't pass the `isOpen` state or provide the necessary `overlayProps` or `underlayProps` to its children directly. The modal portal logic is also within `ModalDialog`, which should ideally be handled at a higher level (e.g., in `Modal.Root` or `ModalContext`) to fully encapsulate the overlay behavior.
  - **Specifically:** `Modal.Root` provides `isOpen` and `onClose`, but `Modal.Dialog` still relies on `isOpen: true` within `useOverlay`, leading to an inconsistent state management approach between the component's internal state and the global `ModalContext`.
- **Why it's an issue:** This means `Modal.Root` isn't fully controlling or orchestrating the modal's presence and overlay behavior as a true compound component root should. It forces `Modal.Dialog` to duplicate some logic (`isOpen: true` for `useOverlay`) and the portal logic, which complicates the mental model and the interaction with `react-aria`.

### Issue 2.4: Type Safety Issues and Lack of Union Types in `ModalContext.tsx` and `ModalHost.tsx`

- **Problem:**
  - `ModalContextValue['props']` is typed as `Record<string, any>`, which is too broad and loses type information for specific modal props.
  - `ModalState['id']` is `string | null`, and `MODAL_COMPONENTS[currentModal.id as keyof typeof MODAL_COMPONENTS]` uses `as keyof typeof MODAL_COMPONENTS` for type assertion, which is unsafe.
- **Why it's an issue:** This leads to a lack of type safety when passing props to specific modals. Developers have to remember what props each modal expects, instead of TypeScript guiding them, leading to potential runtime errors. The type assertion in `ModalHost.tsx` can mask legitimate type errors.

### Issue 2.5: Direct Focus Management in `ModalContext.tsx`

- **Problem:** `ModalProvider` manually saves `document.activeElement` and restores focus using a `setTimeout`.
- **Why it's an issue:** While this works, `react-aria`'s `useOverlay` and `useModal` hooks already handle focus management, including focus trapping and restoration, robustly and adhering to accessibility standards. Manually managing it duplicates effort and might conflict with `react-aria`'s internal handling, potentially causing accessibility bugs.

### Issue 2.6: Unused Import in `Modal.tsx`

- **Problem:** `import { title } from "process";` on line 16 of `Modal.tsx` is not used.
- **Why it's an issue:** Clutters the file and can lead to confusion.

### Issue 2.7: Missing `aria-labelledby` from `Modal.Dialog` and `role="dialog"`

- **Problem:** `Modal.Dialog` explicitly comments out `role="dialog"` and `aria-modal="true"`. While `useDialog` from `react-aria` applies these, the `aria-labelledby` prop (which should link to the modal's title) is not explicitly established or linked from `Modal.Header` and its `h2`.
- **Why it's an issue:** The `aria-labelledby` attribute is crucial for screen readers to announce the modal's purpose. Without it, the modal is less accessible. Relying solely on `react-aria` without explicitly linking the title can make it harder to debug or ensure correct behavior.

## 3. Refactoring Steps

### Step 3.1: Consolidate Modal Context and Ensure Proper `react-aria` Integration

**Goal:** Streamline context usage and centralize `react-aria` related hooks for better control and adherence to `react-aria`'s lifecycle.

1.  **Remove `ModalContext` from `Modal.tsx`:** The internal `ModalContext` within `Modal.tsx` is redundant. The global `ModalContext.tsx` should be the single source of truth for `onClose`, `isOpen`, and other general modal controls.
2.  **Move `createPortal` to `ModalRoot`:** The `createPortal` logic, `useOverlay`, `useModal`, and `DismissButton` should be handled by `ModalRoot` (or a dedicated `ModalOverlay` component within `Modal.Root`). This will allow `ModalRoot` to fully manage the overlay, focus trap, and portal.
3.  **Refactor `ModalRoot`:**
    - It should receive `isOpen` and `onClose` directly from the global `ModalContext` (via `ModalHost`).
    - It will render the overlay and handle the portal.
    - It will use `useOverlay` and `useModal` from `react-aria`.
    - It will provide the `dialogProps` and `titleProps` from `useDialog` (once integrated) down to its children via the (refactored) internal `ModalContext`.
    - It should render the single `DismissButton`.
4.  **Refactor `ModalDialog`:**
    - It should receive `dialogProps` and `titleProps` from the internal `ModalContext` (provided by `ModalRoot`).
    - It will no longer call `useOverlay`, `useModal`, or `DismissButton` directly.
    - Remove redundant `role="dialog"` and `aria-modal="true"` comments as `react-aria` handles these.
    - Ensure `aria-labelledby` from `Modal.Header`'s `h2` is correctly linked to the `Modal.Dialog`.

### Step 3.2: Enhance Type Safety for Modal Props

**Goal:** Introduce strict type checking for modal-specific props to prevent runtime errors and improve developer experience.

1.  **Define a Union Type for Modal IDs:** In `ModalContext.tsx`, create a union type (`ModalId`) from `keyof typeof MODAL_COMPONENTS` to ensure `showModal` only accepts valid modal IDs.
2.  **Create a Map for Modal Props:** Define an interface (e.g., `ModalComponentPropsMap`) that maps each `ModalId` to its expected props interface.
    ```typescript
    interface ModalComponentPropsMap {
      addAction: AddActionModalProps;
      addStack: AddStackModalProps;
      search: SearchActionsModalProps;
    }
    ```
3.  **Refactor `showModal`:** Update `showModal` in `ModalContext.tsx` to use generics and the `ModalComponentPropsMap` to provide type-safe props.
    ```typescript
    showModal<T extends ModalId>(id: T, props?: ModalComponentPropsMap[T]): void;
    ```
4.  **Update `ModalHost.tsx`:** Ensure that the `ModalComponent` is rendered with the correctly typed `currentModal.props`. This will eliminate the unsafe `as keyof typeof MODAL_COMPONENTS` assertion.

### Step 3.3: Remove Manual Focus Management

**Goal:** Rely entirely on `react-aria` for focus management.

1.  **Remove manual `triggerRef` and `setTimeout`:** In `ModalContext.tsx`, remove `triggerRef`, `document.activeElement` saving, and the `setTimeout` for focus restoration. `react-aria` handles this automatically with `useOverlay` and `useModal`.

### Step 3.4: Cleanup `Modal.tsx`

**Goal:** Remove unused imports and redundant elements.

1.  **Remove `import { title } from "process";`** from `Modal.tsx`.
2.  **Remove the second `DismissButton`** from `Modal.Dialog` in `Modal.tsx`.

### Step 3.5: Implement `aria-labelledby` for `Modal.Dialog`

**Goal:** Explicitly link the modal title for improved accessibility.

1.  **Pass `titleProps` through context:** Ensure `titleProps` generated by `useDialog` in `ModalRoot` is passed down through the internal `ModalContext` to `ModalHeader`.
2.  **Associate `h2` with `dialog`:** Use the `id` from `titleProps` on the `h2` in `ModalHeader` and link it to `dialogProps['aria-labelledby']` in `Modal.Dialog`. This might involve accessing `dialogProps` and `titleProps` from a single `ModalContext` or ensuring `Modal.Dialog` can receive the `aria-labelledby` directly from `ModalRoot` after the `useDialog` hook is moved.

### Step 3.6: Review Feature Modals (`AddActionModal.tsx`)

**Goal:** Ensure feature modals still function correctly and leverage the refactored architecture.

1.  **Verify `AddActionModal.tsx`:** After structural changes, ensure `AddActionModal.tsx` correctly receives its props (`isOpen`, `onClose`, `stackId`) and continues to work as expected without direct `useModalContext` calls unrelated to its own specific context. `Modal.Root` `Modal.Dialog` is properly composed.

This refactoring plan aims to create a more robust, accessible, and maintainable modal system.
