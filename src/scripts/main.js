// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------
import { Model } from './modules/model.js';
import { ViewLists } from './modules/views/view-lists.js';
import { ViewTasks } from './modules/views/view-task.js';

// -----------------------------------------------------------------------------
// CONTROLLER
// -----------------------------------------------------------------------------
// Controller coordinates the Model and View

class Controller {
    constructor() {
        this.model = new Model();
        this.listView = new ViewLists(this);
        this.taskView = new ViewTasks(this);
        this.init();
    }

    // Initial setup and render
    init() {
        this.renderAll();
    }

    // Fetches necessary data for rendering
    getLists() {
        return {
            lists: this.model.getLists(),
            selectedListId: this.model.selectedListId,
        };
    }

    // Fetches the selected list
    getSelectedList() {
        return this.model.findListById(this.model.selectedListId);
    }

    // Handles user actions to select a list
    handleListSelection(listId) {
        this.model.setSelectedListId(listId);
        this.renderAll();
    }

    // Adds a new list through the model and updates the view
    addList(name) {
        this.model.addList(name);
        this.renderAll();
    }

    // Deletes the selected list and updates the view
    deleteSelectedList() {
        if (this.model.selectedListId) {
            this.model.deleteList(this.model.selectedListId);
            this.renderAll();
        }
    }

    // Adds a new task to the selected list and updates the view
    addTask(taskName) {
        if (this.model.selectedListId) {
            this.model.addTaskToList(this.model.selectedListId, taskName);
            this.renderAll();
        }
    }

    // Toggles the completion status of a task and updates the view
    toggleTaskCompletion(listId, taskId, isComplete) {
        this.model.toggleTaskComplete(listId, taskId, isComplete);
        this.renderAll();
    }

    // Clears all completed tasks from the selected list and updates the view
    clearCompletedTasks() {
        if (this.model.selectedListId) {
            this.model.clearCompletedTasks(this.model.selectedListId);
            this.renderAll();
        }
    }

    // Re-renders both the list and task views
    renderAll() {
        const { lists, selectedListId } = this.getLists();
        this.listView.renderLists(lists, selectedListId);
        this.taskView.renderTasks(this.getSelectedList());
    }
}

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const app = new Controller();
    app.init();
});
