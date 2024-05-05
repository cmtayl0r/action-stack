export class ViewLists {
    constructor(controller) {
        this.controller = controller;
        // Lists container
        this.listsContainer = document.querySelector('[data-lists]');
        // New list form
        this.newListForm = document.querySelector('[data-new-list-form]');
        this.newListInput = document.querySelector('[data-new-list-input]');
        this.deleteListButton = document.querySelector(
            '[data-delete-list-button]'
        );

        this.addEventListeners();
    }

    addEventListeners() {
        this.listsContainer.addEventListener('click', event => {
            if (event.target.tagName.toLowerCase() === 'li') {
                this.controller.handleListSelection(
                    event.target.dataset.listId
                );
            }
        });

        this.newListForm.addEventListener('submit', event => {
            event.preventDefault();
            const listName = this.newListInput.value.trim();
            if (listName) {
                this.controller.addList(listName);
                this.newListInput.value = '';
            }
        });

        this.deleteListButton.addEventListener('click', () => {
            this.controller.deleteSelectedList();
        });
    }

    renderLists(lists, selectedListId) {
        this.listsContainer.innerHTML = '';
        lists.forEach(list => {
            const listElement = document.createElement('li');
            listElement.dataset.listId = list.id;
            listElement.textContent = list.name;
            if (list.id === selectedListId) {
                listElement.classList.add('active-list');
            }
            this.listsContainer.appendChild(listElement);
        });
    }
}
