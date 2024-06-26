// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------
// Model
import { Model } from './modules/model.js';
// View imports
import { ViewLists } from './modules/views/view-lists.js';
import { ViewTasks } from './modules/views/view-task.js';
// Component imports
import { Toast } from './modules/components/toast.js';

// -----------------------------------------------------------------------------
// CONTROLLER
// -----------------------------------------------------------------------------
// Controller coordinates the Model and View

class Controller {
    constructor() {
        this.model = new Model();
        this.listView = new ViewLists(this);
        this.taskView = new ViewTasks(this);
        this.toast = new Toast(this);
        this.init();
    }

    // Initial setup and render
    init() {
        // Render the initial view
        this.renderAll();
    }

    // Re-renders both the list and task views
    renderAll() {
        // use getLists() to get the lists and selectedListId
        const { lists, selectedListId } = this.getLists();
        this.listView.renderLists(lists, selectedListId);
        this.taskView.renderTasks(this.getSelectedList());
        // Add all render methods here
    }

    // LISTS

    // 01 - Fetches necessary data for rendering
    getLists() {
        // Return the lists and the selected list ID from the model as an object
        return {
            lists: this.model.getLists(), // Get all lists
            selectedListId: this.model.selectedListId, // Get the selected list ID
        };
    }

    // 02 - Fetches the selected list
    getSelectedList() {
        // Return the selected list from the model
        // Pass the selected list ID to the findListById method
        return this.model.findListById(this.model.selectedListId);
    }

    // 03 - Handles user actions to select a list
    // This is used in the view to handle list selection
    handleListSelection(listId) {
        // Set the selected list ID in the model
        this.model.setSelectedListId(listId);
        // Re-render the view
        this.renderAll();
    }

    // 04 - Adds a new list through the model and updates the view
    addList(name) {
        // Pass the list name to the addList method in the model
        this.model.addList(name);
        // Re-render the view
        this.renderAll();
        // Display a toast message
        this.displayToast(`👍 List created`);
    }

    // 05 - Deletes the selected list and updates the view
    deleteSelectedList() {
        // Check if a list is selected
        if (this.model.selectedListId) {
            // Pass the selected list ID to the deleteList method in the model
            this.model.deleteList(this.model.selectedListId);
            // Re-render the view
            this.renderAll();
            // Display a toast message
            this.displayToast(`🗑️ List deleted`);
        }
    }

    // TASKS

    // 01 - Adds a new task to the selected list and updates the view
    // Used in the view to add a new task
    addTask(taskName) {
        // Check if a list is selected
        if (this.model.selectedListId) {
            // Pass the task name to the addTaskToList method in the model
            this.model.addTaskToList(this.model.selectedListId, taskName);
            // Re-render the view
            this.renderAll();
            // Display a toast message
            this.displayToast(`👍 Task added`);
        }
    }

    // 02 - Toggles the completion status of a task and updates the view
    toggleTaskCompletion(listId, taskId, isComplete) {
        // Pass the list ID, task ID, and completion status to the toggleTaskComplete method in the model
        this.model.toggleTaskComplete(listId, taskId, isComplete);
        // Re-render the view
        this.renderAll();
    }

    // 03 - Clears all completed tasks from the selected list and updates the view
    clearCompletedTasks() {
        // Check if a list is selected
        if (this.model.selectedListId) {
            // Pass the selected list ID to the clearCompletedTasks method in the model
            this.model.clearCompletedTasks(this.model.selectedListId);
            // Re-render the view
            this.renderAll();
        }
    }

    // Toasts
    displayToast(message) {
        this.toast.show(message);
    }
}

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const app = new Controller();
    app.init();
});
