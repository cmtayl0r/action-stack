<a name="top"></a>

# Action Stack

## Build plan

### MVP

[x] Responsive sidebar housing key app-wide navigation and controls
[x] Render Inbox list as default list view
[x] Add multiple stacks (action lists)
[ ] Add correct loading states (in views)
[ ] Add action to a stack (inline within list)
[x] Add action to a stack (Global action)
[ ] Edit Action inline (on click, reveal text input)
[x] Mark action as done
[ ] Dropdown on each action to reveal contextual actions
[ ] Dropdown option: Delete action
[ ] Dropdown option: Edit action name
[ ] Dropdown option: Set priority
[ ] Global search modal with debounce (Search all todos by name)
[ ] Stack options: Filter todos by completed and not completed
[ ] Stack options: Sort todos by date created
[x] Global add stack modal
[x] Display all stacks in sidebar
[ ] Review and separate UI "Display" Components
[ ] Address Modals open performance delay/lag on first usage

### Later ...

[ ] Using Framer Motion throughout
[ ] Add tags to todos
[ ] Add due date to actions

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

- When a user clicks a button (i.e. in the Sidebar), it calls openModal("modal-name", {props}) in order to open a modal.
- ModalContext manages updating state by the reducer, tracks which modal is currently active, tracks any props needed to pass to the modal.
- ModalContext then conditionally renders the specific Modal based on name given by a prop
- When a user interacts with the Modal:
  - Each modal utilises the "callback props" pattern
  - When opening a modal you provide a callback function, this is evident in the sidebar (add action, add stack etc)
  - This callback gets passed to the modal as a prop, along with a name of the modal
  - When the modal completes its action (does something, submit etc), it calls this callback with the new data define in a handler function
  - This allows the component that opened the modal (i.e. Sidebar) to receive and use the data that was created in the modal.
  - closeModal function is given to the x and "cancel" buttons defined in the pattern

[Back to top](#top)

## Versions

### Version 1 (April 2025)

- Using localStorage as data structure as temporary measure

[Back to top](#top)
