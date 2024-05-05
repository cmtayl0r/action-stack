// -----------------------------------------------------------------------------
// MODEL
// -----------------------------------------------------------------------------
// Handles the data and state of the application

/*
    Schema in localStorage:
    task.lists: [
        {
            id: '[Unique ID created from the current time]',
            name: 'List name',
            tasks: [
                {
                    id: '[Unique ID created from the current time]',
                    name: 'Task name',
                    complete: false
                }
            ]
        }
    ]
    task.selectedListId: '[ID of the currently selected list]'
*/

export class Model {
    constructor() {
        // Key for accessing the list data in local storage
        this.LOCAL_STORAGE_LIST_KEY = 'task.lists';
        // Key for accessing the currently selected list ID in local storage
        this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
        // Initialize lists and selectedListId from local storage
        // or an empty array and null if no data is found
        this.lists =
            JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_LIST_KEY)) || [];
        this.selectedListId = localStorage.getItem(
            this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY
        );
    }

    // 01 - Fetches all lists
    // Used in the controller to get all lists
    getLists() {
        // return all lists from the model
        return this.lists;
    }

    // 02 - Finds a specific list by ID
    // Used in the controller to get a specific list
    findListById(listId) {
        // Return the list from the model that matches the provided ID
        return this.lists.find(list => list.id === listId);
    }

    // 03 - Updates the currently selected list ID
    // Used in the controller to set the selected list
    setSelectedListId(listId) {
        // Set the selected list ID in the model to the provided ID
        this.selectedListId = listId;
        // Save the updated selected list ID to local storage
        this.save();
    }

    // 04 - Adds a new list
    // Used in the controller to add a new list
    addList(name) {
        // Create a new list object
        const newList = {
            id: Date.now().toString(), // Unique ID created from the current time
            name: name,
            tasks: [],
        };
        // Add the new list to the model
        this.lists.push(newList);
        // Save the updated list data to local storage
        this.save();
    }

    // 05 - Removes a list by ID
    // Used in the controller to delete a list
    deleteList(listId) {
        // Filter out the list (model.lists) that matches the provided ID (listId)
        this.lists = this.lists.filter(list => list.id !== listId);
        // If the deleted list was the selected list, set the selected list ID to null
        // This will hide the list display container in the view
        this.selectedListId = null;
        // Save the updated list data and selected list ID to local storage
        this.save();
    }

    // 06 - Adds a task to a list
    // Used in the controller to add a new task to a list
    addTaskToList(listId, taskName) {
        // Find the list in the model that matches the provided ID
        const list = this.findListById(listId);
        // Create a new task object
        const newTask = {
            id: Date.now().toString(), // Unique ID created from the current time
            name: taskName,
            complete: false,
        };
        // Add the new task to the list
        list.tasks.push(newTask);
        // Save the updated list data to local storage
        this.save();
    }

    // 07 - Toggles the completion status of a task
    // Used in the controller to toggle the completion status of a task
    toggleTaskComplete(listId, taskId, isComplete) {
        // Find the list in the model that matches the provided ID
        const list = this.findListById(listId);
        // Find the task in the list that matches the provided ID for the task
        const task = list.tasks.find(task => task.id === taskId);
        // Set the completion status of the task to the provided value
        task.complete = isComplete;
        // Save the updated list data to local storage
        this.save();
    }

    // 08 - Clears all completed tasks from a list
    // Used in the controller to clear all completed tasks from a list
    // FIXME: Automatically hide a task when it is completed, instead of clearing all completed tasks
    clearCompletedTasks(listId) {
        // Find the list in the model that matches the provided ID
        const list = this.findListById(listId);
        // Filter out the tasks in the list that are not complete
        list.tasks = list.tasks.filter(task => !task.complete);
        // Save the updated list data to local storage
        this.save();
    }

    // 09 - Saves all data to localStorage
    // Used to save the current state of the model to local storage
    // Useful for persisting data between page reloads
    save() {
        // Save the lists and selected list ID to local storage
        localStorage.setItem(
            this.LOCAL_STORAGE_LIST_KEY,
            JSON.stringify(this.lists)
        );
        localStorage.setItem(
            this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
            this.selectedListId
        );
    }
}
