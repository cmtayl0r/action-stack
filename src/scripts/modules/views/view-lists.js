export class ViewLists {
    constructor(controller) {
        // Reference to the controller, because the view needs to communicate with the controller
        this.controller = controller;
        // Lists container
        this.listsContainer = document.querySelector('[data-lists]');
        // New list form
        this.newListForm = document.querySelector('[data-new-list-form]');
        this.newListInput = document.querySelector('[data-new-list-input]');
        this.deleteListButton = document.querySelector(
            '[data-delete-list-button]'
        );
        // Add/Bind event listeners
        this.addEventListeners();
    }

    // Add event listeners
    addEventListeners() {
        // Event listener on lists container
        this.listsContainer.addEventListener('click', event => {
            // Check if the clicked element is an li element
            if (event.target.tagName.toLowerCase() === 'li') {
                // Call the handleListSelection method in the controller
                // Pass the list ID of the clicked list
                this.controller.handleListSelection(
                    event.target.dataset.listId
                );
            }
        });

        // Event listener on new list form
        this.newListForm.addEventListener('submit', event => {
            event.preventDefault();
            // Get the list name from the input field
            const listName = this.newListInput.value.trim();
            // Check if the list name is not empty
            if (listName) {
                // Call the addList method in the controller
                this.controller.addList(listName);
                // Clear the input field
                this.newListInput.value = '';
            }
        });

        // Event listener on delete list button
        this.deleteListButton.addEventListener('click', () => {
            // Call the deleteSelectedList method in the controller
            this.controller.deleteSelectedList();
        });
    }

    // METHODS

    // 01 - Render lists
    // Used to display the lists in the view
    // Referenced from renderAll() in the controller
    renderLists(lists, selectedListId) {
        // Clear the lists container before rendering
        this.listsContainer.innerHTML = '';
        // Loop through each list and create a list element
        lists.forEach(list => {
            // Create a new list element
            const listElement = document.createElement('li');
            // Set the list ID as a data attribute on the list element
            listElement.dataset.listId = list.id;
            // Set the text content of the list element to the list name
            listElement.textContent = list.name;
            // If the list ID matches the selected list ID, add the active-list class
            if (list.id === selectedListId) {
                listElement.classList.add('active-list');
            }
            // Append the list element to the lists container
            this.listsContainer.appendChild(listElement);
        });
    }
}
