<a name="top"></a>

# Action Stack

## Build plan

### MVP

- [x] Responsive sidebar housing key app-wide navigation and controls
- [x] Render Inbox list as default list view
- [x] Add multiple stacks (action lists)
- [ ] Add correct loading states (in views)
- [ ] Add action to a stack (inline within list)
- [x] Add action to a stack (Global action)
- [ ] Edit Action inline (on click, reveal text input)
- [x] Mark action as done
- [ ] Dropdown on each action to reveal contextual actions
- [ ] Dropdown option: Delete action
- [ ] Dropdown option: Edit action name
- [ ] Dropdown option: Set priority
- [ ] Global search modal with debounce (Search all todos by name)
- [ ] Stack options: Filter todos by completed and not completed
- [ ] Stack options: Sort todos by date created
- [x] Global add stack modal
- [x] Display all stacks in sidebar
- [ ] Review and separate UI "Display" Components
- [x] Address Modals open performance delay/lag on first usage

### Later ...

- [ ] Using Framer Motion throughout
- [ ] Add tags to todos
- [ ] Add due date to actions

[Back to top](#top)

## Learning

### Dealing with global UI components

- Utilise "Flux Architecture Pattern" for Global UI (Modals and Toasts)
- Separate actions, reducer and context to provide state and dispatches to components in a scalable manner
- Data flows in one direction (dispatch action → reducer → state update → UI)
- ModalContext.jsx works as a 'Modal Manager"
- Serve particular modal component based on name via Context provider to the App. Those modals lazy loaded into the context.
- Use 'Compound Component Pattern' to build flexible Toasts and Modals
- Toast context has "convenience methods" in order to directly access "success" or "error" styled Toasts easily via its context throughout the app.

### API Layer vs Hooks

- API layer (localStorageAPI.js) 🧱 Low-level data handling (CRUD), raw operations on localStorage
  - I made these generic CRUD operations that the hook wrapped around
- Context provider (ActionsContext, StacksContext) 🌎 provide data slices (via the hooks) that can be supplied globably across the app
  - This helped me with with some annoying React Router loader issues, where component refreshes was not happening
- Hook layer (useStacks, useActions) ⚛️ React logic: manages state, subscriptions, batching, UI triggers
- Component 📦 UI logic (form, input, render data, call hooks)

### Modal System logic

##### Registry pattern

- UI components (e.g. Sidebar) call openModal("modal-name", props) to open a specific modal.
- The modal system uses a registry pattern:
  - All modals are registered centrally in a modalRegistry.js file.
  - Each modal is mapped by a unique id to its React component.
  - This avoids switch statements and makes the system easy to extend.
- ModalContext manages:
  - The active modal (modalId)
  - Props to pass to the modal (modalProps)
  - State updates via a reducer
- ModalHost renders the correct modal based on the modalId from context.
- 🤔 Removing a lazy load registry in "ModalHost.jsx" removed the first time usage lag, but I wasn't keen on using the useEffect in the ModalContext provider. Feels hacky.

##### 💬 Modal Interaction Pattern

- Modals receive callback functions (e.g. onSubmit) via modalProps.
- The component that opens the modal (like Sidebar) passes a handler to receive data created or updated in the modal.
- When the modal action completes (e.g. on form submit), it:
  - Calls the provided callback with result data
  - Calls closeModal() to dismiss itself
- The close action is also triggered by:
  - Clicking the ❌ close button
  - Clicking a cancel button (which calls closeModal())

[Back to top](#top)

## Versions

### Version 1 (April 2025)

- Using localStorage as data structure as temporary measure.

[Back to top](#top)
