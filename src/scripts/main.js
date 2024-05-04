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
    e.preventDefault(); // Prevent the default form submission
    const listName = newListInput.value; // Get the value of the input field
    if (listName === null || listName === '') return; // Don't create empty lists
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

// Function to create a new list
function createList(name) {
    // Add list to model / array
    return {
        id: Date.now().toString(),
        name: name,
        tasks: [
            {
                id: 1,
                name: 'dsadsapdsapkdas',
                complete: false,
            },
        ],
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
        // renderTaskCount(selectedList)
        // clearElement(tasksContainer)
        // renderTasks(selectedList)
    }
}

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
