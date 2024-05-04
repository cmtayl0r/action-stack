// TODO: Understand selectedList

// -----------------------------------------------------------------------------
// MODEL
// -----------------------------------------------------------------------------

const LOCAL_STORAGE_LIST_KEY = 'task.lists';
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';

// Get the lists from local storage or create an empty array if there are none
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

// Get the selected list id from local storage or set it to null
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);

// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------

const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');

const listDisplayContainer = document.querySelector(
    '[data-list-display-container]'
);
const listTitle = document.querySelector('[data-list-title]');
const listCount = document.querySelector('[data-list-count]');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');

const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');

const clearCompleteTasksButton = document.querySelector(
    '[data-clear-complete-tasks-button]'
);

// -----------------------------------------------------------------------------
// VIEW [LISTS]
// -----------------------------------------------------------------------------

listsContainer.addEventListener('click', e => {
    // Check if the clicked element is an li element
    // If so, set the selected list id to the id of the clicked list
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        saveAndRender();
    }
});

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(
            task => task.id === e.target.id
        );
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);
    }
});

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
});

deleteListButton.addEventListener('click', e => {
    // Give me all the lists that are not the selected list
    lists = lists.filter(list => list.id !== selectedListId);
    // Set the selected list id to null after deleting a list
    selectedListId = null;
    // Save and render the lists
    saveAndRender();
});

// Event listener for the form submission to create a new list
newListForm.addEventListener('submit', e => {
    e.preventDefault();
    const listName = newListInput.value;
    if (listName == null || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener('submit', e => {
    e.preventDefault(); // Prevent the default form submission
    const taskName = newTaskInput.value; // Get the value of the input field
    if (taskName === null || taskName === '') return; // Don't create empty lists
    const task = createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});

// Function to create a new list
function createList(name) {
    // Add list to model / array
    return {
        id: Date.now().toString(),
        name: name,
        tasks: [],
    };
}

function createTask(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false,
    };
}

function saveAndRender() {
    save();
    render();
}

// Function to save list to Model
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

// Function to render the lists
function render() {
    clearElement(listsContainer); // Clear the lists container before rendering
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none';
    } else {
        listDisplayContainer.style.display = '';
        listTitle.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        // Clone the task template content
        const taskElement = document.importNode(
            taskTemplate.content, // Clone the content of the template
            true // Deep clone the content
        );
        const checkbox = taskElement.querySelector('input'); // Get the checkbox input element
        checkbox.id = task.id; // Set the id of the checkbox to the task id
        checkbox.checked = task.complete; // Check the checkbox if the task is complete
        const label = taskElement.querySelector('label'); // Get the label element
        label.htmlFor = task.id; // Set the htmlFor attribute of the label to the task id
        label.append(task.name); // Set the text of the label to the task name
        tasksContainer.appendChild(taskElement); // Append the task element to the tasks container
    });
}

// function taskTemplate(task) {
//     return `
//     <li class="task">
//         <input id="1" type="checkbox" class="task-checkbox">
//         <label for="1" class="task-label
//         ">Test Task 1</label>
//     </li>
//     `;
// }

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(
        task => !task.complete
    ).length;
    const taskString = incompleteTaskCount === 1 ? 'task' : 'tasks';
    listCount.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id; // Custom data attribute to store the list id
        listElement.classList.add('list-name');
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
        listsContainer.appendChild(listElement);
    });
}

// Function to remove all child nodes from an element
// Used to clear the lists container before rendering the lists
function clearElement(element) {
    // Remove all child nodes from an element (equivalent to element.innerHTML = '')
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();
