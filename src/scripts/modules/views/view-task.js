export class ViewTasks {
    constructor(controller) {
        this.controller = controller;
        // Lists container
        this.listsContainer = document.querySelector('[data-lists]');
        // New list form
        this.newListForm = document.querySelector('[data-new-list-form]');
        this.newListInput = document.querySelector('[data-new-list-input]');
        // Todo list container
        this.listDisplayContainer = document.querySelector(
            '[data-list-display-container]'
        );
        this.listTitle = document.querySelector('[data-list-title]');
        this.listCount = document.querySelector('[data-list-count]');
        this.tasksContainer = document.querySelector('[data-tasks]');
        this.taskTemplate = document.getElementById('task-template');
        // New task form
        // this.newTaskForm = document.querySelector('[data-new-task-form]');
        // this.newTaskInput = document.querySelector('[data-new-task-input]');

        this.newListForm.addEventListener(
            'submit',
            this.handleAddList.bind(this)
        );
        this.listsContainer.addEventListener(
            'click',
            this.handleListClick.bind(this)
        );
    }

    handleAddList(event) {
        event.preventDefault();
        const listName = this.newListInput.value.trim();
        if (listName == null || listName === '') return;
        this.controller.addList(listName);
        this.newListInput.value = null;
    }

    handleListClick(event) {
        if (event.target.tagName.toLowerCase() === 'li') {
            const selectedListId = event.target.dataset.listId;
            this.controller.selectList(selectedListId);
        }
    }

    renderLists(lists, selectedListId) {
        this.listsContainer.innerHTML = '';
        lists.forEach(list => {
            const listElement = document.createElement('li');
            listElement.dataset.listId = list.id;
            listElement.classList.add('list-name');
            listElement.innerText = list.name;
            if (list.id === selectedListId) {
                listElement.classList.add('active-list');
            }
            this.listsContainer.appendChild(listElement);
        });

        // Optionally, handle empty states
        if (lists.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent =
                'No lists available. Create a new list to get started!';
            this.listsContainer.appendChild(emptyMessage);
        }
    }
}
