# Utility Spec: Screen Reader Announcer

This document specifies a utility for making announcements to screen readers. This is typically implemented as a React Context and hook (`useScreenReader`) to provide a global way to send messages to an ARIA Live Region.

## 1. Vision

To provide a simple, robust mechanism for announcing important, non-interactive information to screen reader users. This is essential for notifying users of events that happen dynamically, such as content loading, errors appearing, or actions completing successfully.

## 2. ARIA Live Region Component

A component, let's call it `ScreenReaderAnnouncer`, needs to be rendered at the top level of the application (e.g., in `AppLayout`). This component will contain the ARIA Live Region.

```tsx
function ScreenReaderAnnouncer() {
  const { announcement } = useScreenReader(); // Gets the message from context

  return (
    <div
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        margin: "-1px",
        padding: "0",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        border: "0",
      }}
    >
      {announcement}
    </div>
  );
}
```

- `aria-live="assertive"`: This tells the screen reader to interrupt whatever it's currently saying to announce the new content immediately. Use `polite` for less urgent announcements.
- `aria-atomic="true"`: Ensures the entire region is announced, even if only part of the content changes.
- The inline styles are a common pattern for creating a "visually-hidden" element that is still accessible to screen readers.

## 3. Context and Hook

A React Context will hold the announcement message and a function to update it.

```typescript
// ScreenReaderContext.tsx
interface ScreenReaderContextType {
  announcement: string;
  announce: (message: string) => void;
}

const ScreenReaderContext = createContext<ScreenReaderContextType | undefined>(
  undefined
);

// The provider will manage the state for the announcement message.

// useScreenReader.ts (the hook)
function useScreenReader() {
  const context = useContext(ScreenReaderContext);
  if (!context) {
    throw new Error(
      "useScreenReader must be used within a ScreenReaderProvider"
    );
  }
  return context;
}
```

## 4. Example Usage

```tsx
// In a component that performs an async action
function AddActionButton() {
  const { announce } = useScreenReader();
  const mutation = useMutation(createAction, {
    onSuccess: () => {
      announce("Action created successfully.");
    },
    onError: () => {
      announce("Error: Could not create action.");
    },
  });

  return (
    <Button onClick={() => mutation.mutate("New Task")}>Add Action</Button>
  );
}
```
