<a name="top"></a>

# Action Stack

"Todo list" style web app where a user can create several lists ("Stacks") and populate them with "actions" that have several criteria applied to them.

## Build plan

### MVP

- [x] Responsive sidebar housing key app-wide navigation and controls
- [x] Render Inbox list as default list view
- [x] Add multiple stacks (action lists)
- [ ] Add correct loading states (in views)
- [ ] Add action to a stack, global absolute button
- [x] Add action to a stack (Global action)
- [x] Edit Action inline (on click, reveal text input)
- [x] Mark action as done
- [ ] Dropdown for each stack
  - [ ] Delete stack
  - [ ] Rename stack
- [ ] Global search modal with debounce (Search all actions by name)
- [x] Stack filters: Filter actions by completed and not completed
- [ ] Stack filters: Sort actions by date created
- [ ] Stack filters: Sort actions by priority
- [ ] Separate List components (UI Display components/consumers)
- [ ] Full action page (or modal?) in React router with editing
  - [ ] Delete action
  - [ ] Update options (priority etc)
- [x] Global add stack modal
- [x] Display all stacks in sidebar
- [x] Address Modals open performance delay/lag on first usage
- [ ] Implement theme switching via context

### Later ...

- [ ] Implement Hazel UI components (Buttons, dropdowns, inputs etc)
- [ ] Using Framer Motion throughout
- [ ] Add tags to actions
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

### Component Architecture & Filtering

- Adopted Hook → Container → Presentation pattern for clean separation of concerns:
  - useActionsContext handles shared state and CRUD logic (Hook layer)
  - StackView manages app state, filters, and orchestrates component flow (Container layer)
  - ActionsFilter, ActionsList, and ActionListItem are fully controlled, dumb UI components (Presentation layer)
- Centralized filter state in StackView:
  - Filters include name, completed, priority, and sortDirection
  - All logic for filtering and sorting is colocated with the stack context
- Created a single handleFilterChange(key, value) function:
  - Enables consistent and scalable updates to filter state
  - Cleanly passed to presentational components like ActionsFilter
- Refactored ActionsFilter into a reusable presentational component:
  - Receives a filter object and a single onFilterChange handler
  - No internal state — pure UI, easy to test and extend
- Used useMemo() in StackView for performant filtered + sorted actions list:
  - Keeps render fast even as the action list grows
  - Encapsulates filter/sort logic in a declarative, readable way
- Improved prop naming and consistency across components:
  - Clear, meaningful prop names (filter, onFilterChange, filteredActions, etc.)
  - Aligned prop shape with component responsibility

[Back to top](#top)

## Versions

### Version 1 (April 2025)

- Using localStorage as data structure as temporary measure.

[Back to top](#top)
