export class ViewTasks {
    constructor(controller) {
        // Reference to the controller, because the view needs to communicate with the controller
        this.controller = controller;
        // Tasks container
        this.tasksContainer = document.querySelector('[data-tasks]');
        // List attributes
        this.listTitle = document.querySelector('[data-list-title]');
        this.listCount = document.querySelector('[data-list-count]');
        // New task form
        this.newTaskForm = document.querySelector('[data-new-task-form]');
        this.newTaskInput = document.querySelector('[data-new-task-input]');
        // Auxillary action buttons
        this.actionsContainer = document.querySelector('[data-tasks-actions]');
        this.clearCompleteTasksButton = document.querySelector(
            '[data-clear-complete-tasks-button]'
        );
        // Task template
        this.taskTemplate = document.getElementById('task-template');
        // Add/Bind event listeners
        this.addEventListeners();
    }

    // Add event listeners
    addEventListeners() {
        // Event listener on new task form
        this.newTaskForm.addEventListener('submit', event => {
            event.preventDefault();
            const taskName = this.newTaskInput.value.trim();
            if (taskName) {
                this.controller.addTask(taskName);
                this.newTaskInput.value = '';
            }
        });
        // Event listener on tasks container to toggle task completion
        this.tasksContainer.addEventListener('click', event => {
            if (event.target.tagName.toLowerCase() === 'input') {
                console.log(event.target);
                this.controller.toggleTaskCompletion(
                    event.target.dataset.listId,
                    event.target.id,
                    event.target.checked
                );
            }
        });
        // Event listener on clear complete tasks button
        this.clearCompleteTasksButton.addEventListener('click', () => {
            this.controller.clearCompletedTasks();
        });
    }

    // METHODS

    // 01 - Render tasks
    renderTasks(selectedList) {
        // Check if a list is selected
        if (!selectedList) {
            // If no list is selected, display a message in the tasks container
            this.tasksContainer.innerHTML = '<p>No list selected</p>';
            this.listTitle.textContent = '';
            this.listCount.textContent = '';
            return;
        }

        // Display the selected list title
        this.listTitle.textContent = selectedList.name;
        // Filter the tasks in the selected list that are not complete and display the count
        this.listCount.textContent = `${
            selectedList.tasks.filter(task => !task.complete).length
        } tasks remaining`;

        // Clear the tasks container before rendering
        this.tasksContainer.innerHTML = '';
        // Loop through each task in the selected list and create a task element
        selectedList.tasks.forEach(task => {
            // Create a new task element from the task template
            const taskElement = document.importNode(
                this.taskTemplate.content,
                true
            );
            const checkbox = taskElement.querySelector('input');
            // Set the list ID as a data attribute on the checkbox
            // So we can access it later when toggling the task completion status
            // event listener needs to know the list ID (event.target.dataset.listId)
            checkbox.dataset.listId = selectedList.id;
            // Set the list ID as a data attribute on the checkbox
            checkbox.id = task.id;
            // Set the checked status of the checkbox based on the task completion status
            checkbox.checked = task.complete;
            const label = taskElement.querySelector('label');
            // Set the htmlFor attribute of the label to the task ID
            label.htmlFor = task.id;
            // Set the text content of the label to the task name
            label.append(task.name);
            // Append the task element to the tasks container
            this.tasksContainer.appendChild(taskElement);
        });
    }
}
