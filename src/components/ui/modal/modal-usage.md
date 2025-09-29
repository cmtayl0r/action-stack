# 🚀 Modal System - Quick Reference

## 📦 Core Files (3 files only)

```
context/modals/ModalContext.tsx    → Context + useModal hook
components/ui/modal/BaseModal.tsx  → Reusable modal foundation
components/ui/modal/ModalHost.tsx  → Registry + MODAL_IDS
```

---

## 🎯 Setup (One-Time)

### 1. Wrap app with ModalProvider

```tsx
// app/main.tsx
import { ModalProvider } from "@/context/modals/ModalContext";

<ModalProvider>
  <App />
</ModalProvider>;
```

### 2. Add ModalHost to layout

```tsx
// components/layout/AppLayout.tsx
import { ModalHost } from "@/components/ui/modal";

<div>
  <Sidebar />
  <Outlet />
  <ModalHost /> {/* ← Add here */}
</div>;
```

---

## ✅ TypeScript Interfaces (Copy-Paste)

```typescript
// ModalContext.tsx
interface ModalContextValue {
  activeModalId: string | null;
  modalProps: Record<string, any>;
  openModal: (modalId: string, props?: Record<string, any>) => void;
  closeModal: () => void;
  isModalOpen: (modalId: string) => boolean;
}

// BaseModal.tsx
interface BaseModalProps {
  id: string;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}
```

---

## 🆕 Adding a New Modal (4 Steps)

### Step 1: Add ID to registry

```typescript
// ModalHost.tsx
export const MODAL_IDS = {
  ADD_ACTION: "addAction",
  MY_NEW_MODAL: "myNewModal", // ← Add here
} as const;
```

### Step 2: Create modal component

```tsx
// features/MyNewModal.tsx
import { BaseModal } from "@/components/ui/modal";
import { useModal } from "@/context/modals/ModalContext";
import { MODAL_IDS } from "@/components/ui/modal/ModalHost";

function MyNewModal() {
  const { closeModal, modalProps } = useModal();
  const { customProp } = modalProps;

  return (
    <BaseModal id={MODAL_IDS.MY_NEW_MODAL} title="My Modal" size="md">
      <p>{customProp}</p>
      <button onClick={closeModal}>Close</button>
    </BaseModal>
  );
}

export default MyNewModal;
```

### Step 3: Register in ModalHost

```tsx
// ModalHost.tsx
import MyNewModal from "@/features/MyNewModal";

const MODAL_COMPONENTS: Record<string, React.ComponentType> = {
  [MODAL_IDS.ADD_ACTION]: AddActionModal,
  [MODAL_IDS.MY_NEW_MODAL]: MyNewModal, // ← Register here
};
```

### Step 4: Use anywhere

```tsx
import { useModal } from "@/context/modals/ModalContext";
import { MODAL_IDS } from "@/components/ui/modal/ModalHost";

const { openModal } = useModal();

<button onClick={() => openModal(MODAL_IDS.MY_NEW_MODAL, { customProp: "hi" })}>
  Open
</button>;
```

---

## 💡 Common Patterns

### Pattern 1: Delete Confirmation

```tsx
openModal(MODAL_IDS.DELETE_CONFIRM, {
  itemName: "Project Alpha",
  onConfirm: () => deleteItem(id),
});
```

### Pattern 2: Add/Edit Forms

```tsx
openModal(MODAL_IDS.ADD_ACTION, {
  stackId: currentStackId,
});
```

### Pattern 3: Keyboard Shortcuts

```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openModal(MODAL_IDS.SEARCH);
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, [openModal]);
```

### Pattern 4: From API Response

```tsx
try {
  await saveData();
  openModal(MODAL_IDS.SUCCESS, { message: "Saved!" });
} catch (error) {
  openModal(MODAL_IDS.ERROR, { error: error.message });
}
```

---

## 🎨 BaseModal Sizes

```tsx
<BaseModal size="sm">   {/* 448px - confirmations */}
<BaseModal size="md">   {/* 672px - forms (default) */}
<BaseModal size="lg">   {/* 896px - complex content */}
```

---

## 🪝 useModal() API

```typescript
const {
  activeModalId, // string | null - currently open modal
  modalProps, // Record<string, any> - props for modal
  openModal, // (id, props?) => void - open a modal
  closeModal, // () => void - close active modal
  isModalOpen, // (id) => boolean - check if modal open
} = useModal();
```

---

## 🔧 React Aria Components Used

```tsx
import {
  Modal, // Main modal container
  ModalOverlay, // Backdrop + centering
  Dialog, // Content wrapper with ARIA
  Heading, // Accessible heading
  Button, // Accessible button
} from "react-aria-components";
```

---

## ✅ TypeScript Benefits

### Autocomplete for Modal IDs

```tsx
openModal(MODAL_IDS.  // ← Shows all modal IDs
```

### Type-Safe Function Calls

```tsx
const { openModal } = useModal();
//       ^^^^^^^^^ TypeScript knows signature
```

### Component Props Validation

```tsx
<BaseModal
  size="xl" // ❌ Error: must be 'sm' | 'md' | 'lg'
/>
```

---

## 🐛 Troubleshooting

**Modal doesn't open:**

- Check modal ID matches MODAL_IDS
- Verify modal registered in ModalHost
- Ensure ModalProvider wraps app

**Props not received:**

- Destructure from modalProps: `const { prop } = modalProps`
- Check props passed to openModal()

**TypeScript errors:**

- Ensure all interfaces are defined
- Check React Aria Components import
- Verify MODAL_IDS uses `as const`

**Multiple modals open:**

- Only one modal open at a time (by design)
- Use closeModal() before opening new one

---

## 📚 Key Concepts

### Why Registry Pattern?

- **Single source of truth** for all modals
- **Central management** - easy to audit
- **Trigger from anywhere** in the app
- **Keyboard shortcuts** support
- **Lazy loading** ready

### Why Context?

- **Global access** to openModal/closeModal
- **Props passing** to any modal
- **State management** for active modal
- **No prop drilling** needed

### Why React Aria Components?

- **Accessibility** built-in (WCAG 2.2 AA)
- **Focus management** automatic
- **Keyboard navigation** included
- **Screen reader** compatible
- **Less code** than hooks

---

## 🎯 Checklist for Each Modal

- [ ] Added to MODAL_IDS
- [ ] Component created in features/
- [ ] Registered in ModalHost
- [ ] Uses BaseModal wrapper
- [ ] Destructures props from modalProps
- [ ] Has closeModal functionality
- [ ] Tested keyboard navigation
- [ ] Tested screen reader

```jsx
// ==============================================================
// USAGE EXAMPLES
// ==============================================================

/*
// ========== Example 1: Opening modals from any component ==========

import { useModal } from '@/context/modals/ModalContext';
import { MODAL_IDS } from '@/components/ui/modal/ModalHost';

function MyComponent() {
  const { openModal } = useModal();

  return (
    <button onClick={() => openModal(MODAL_IDS.ADD_ACTION, { stackId: 1 })}>
      Add Action
    </button>
  );
}

// ========== Example 2: Delete confirmation ==========

function ActionsList({ actions }) {
  const { openModal } = useModal();

  const handleDelete = (actionId: number) => {
    console.log('Deleting:', actionId);
  };

  return (
    <div>
      {actions.map(action => (
        <div key={action.id}>
          <span>{action.name}</span>
          <button
            onClick={() => openModal(MODAL_IDS.DELETE_CONFIRM, {
              itemName: action.name,
              onConfirm: () => handleDelete(action.id)
            })}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// ========== Example 3: Programmatic modal opening ==========

function DataFetcher() {
  const { openModal } = useModal();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed');

      // Success - could open a success modal
      console.log('Data fetched successfully');
    } catch (error) {
      // Error - open error modal
      openModal(MODAL_IDS.ERROR, {
        message: error.message
      });
    }
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}

// ========== Example 4: URL-based modal opening ==========

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function PageWithUrlModal() {
  const [searchParams] = useSearchParams();
  const { openModal } = useModal();

  useEffect(() => {
    // Open modal if URL has ?modal=add-action
    const modalParam = searchParams.get('modal');
    if (modalParam === 'add-action') {
      openModal(MODAL_IDS.ADD_ACTION, { stackId: 1 });
    }
  }, [searchParams, openModal]);

  return <div>Page content</div>;
}
*/

// ==============================================================
// ADDING NEW MODALS - Step-by-Step Guide
// ==============================================================

/*
Step 1: Add modal ID to registry
================================
File: components/ui/modal/ModalHost.tsx

export const MODAL_IDS = {
  ADD_ACTION: 'addAction',
  SEARCH: 'search',
  DELETE_CONFIRM: 'deleteConfirm',
  MY_NEW_MODAL: 'myNewModal',  // ← Add here
} as const;


Step 2: Create modal component
================================
File: components/features/myfeature/MyNewModal.tsx

import { useState } from 'react';
import { BaseModal } from '@/components/ui/modal';
import { useModal } from '@/context/modals/ModalContext';
import { MODAL_IDS } from '@/components/ui/modal/ModalHost';

function MyNewModal() {
  const { closeModal, modalProps } = useModal();
  const { customProp } = modalProps;

  return (
    <BaseModal id={MODAL_IDS.MY_NEW_MODAL} title="My New Modal" size="md">
      <div>
        <p>Custom prop: {customProp}</p>
        <button onClick={closeModal}>Close</button>
      </div>
    </BaseModal>
  );
}

export default MyNewModal;


Step 3: Register in ModalHost
================================
File: components/ui/modal/ModalHost.tsx

import MyNewModal from '@/components/features/myfeature/MyNewModal';

const MODAL_COMPONENTS: Record<string, React.ComponentType> = {
  [MODAL_IDS.ADD_ACTION]: AddActionModal,
  [MODAL_IDS.SEARCH]: SearchModal,
  [MODAL_IDS.DELETE_CONFIRM]: DeleteConfirmModal,
  [MODAL_IDS.MY_NEW_MODAL]: MyNewModal,  // ← Register here
};


Step 4: Use anywhere in your app
================================
import { useModal } from '@/context/modals/ModalContext';
import { MODAL_IDS } from '@/components/ui/modal/ModalHost';

function AnyComponent() {
  const { openModal } = useModal();

  return (
    <button onClick={() => openModal(MODAL_IDS.MY_NEW_MODAL, { customProp: 'value' })}>
      Open Modal
    </button>
  );
}
*/
```
