export class ViewTasks {
    // TODO: Understand controller in constructor

    constructor(controller) {
        this.controller = controller;

        this.tasksContainer = document.querySelector('[data-tasks]');
        this.taskTemplate = document.getElementById('task-template');
        this.listTitle = document.querySelector('[data-list-title]');
        this.listCount = document.querySelector('[data-list-count]');
        this.newTaskForm = document.querySelector('[data-new-task-form]');
        this.newTaskInput = document.querySelector('[data-new-task-input]');
        this.clearCompleteTasksButton = document.querySelector(
            '[data-clear-complete-tasks-button]'
        );

        this.addEventListeners();
    }

    addEventListeners() {
        this.newTaskForm.addEventListener('submit', event => {
            event.preventDefault();
            const taskName = this.newTaskInput.value.trim();
            if (taskName) {
                this.controller.addTask(taskName);
                this.newTaskInput.value = '';
            }
        });

        this.tasksContainer.addEventListener('click', event => {
            if (event.target.tagName.toLowerCase() === 'input') {
                this.controller.toggleTaskCompletion(
                    event.target.dataset.listId,
                    event.target.id,
                    event.target.checked
                );
            }
        });

        this.clearCompleteTasksButton.addEventListener('click', () => {
            this.controller.clearCompletedTasks();
        });
    }

    renderTasks(selectedList) {
        if (!selectedList) {
            this.tasksContainer.innerHTML = '<p>No list selected</p>';
            this.listTitle.textContent = '';
            this.listCount.textContent = '';
            return;
        }

        this.listTitle.textContent = selectedList.name;
        this.listCount.textContent = `${
            selectedList.tasks.filter(task => !task.complete).length
        } tasks remaining`;

        this.tasksContainer.innerHTML = '';
        selectedList.tasks.forEach(task => {
            const taskElement = document.importNode(
                this.taskTemplate.content,
                true
            );
            const checkbox = taskElement.querySelector('input');
            checkbox.id = task.id;
            checkbox.checked = task.complete;
            const label = taskElement.querySelector('label');
            label.htmlFor = task.id;
            label.append(task.name);
            this.tasksContainer.appendChild(taskElement);
        });
    }
}
