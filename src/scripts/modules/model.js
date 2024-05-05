// -----------------------------------------------------------------------------
// MODEL
// -----------------------------------------------------------------------------
// Handles the data and state of the application
export class Model {
    constructor() {
        this.LOCAL_STORAGE_LIST_KEY = 'task.lists';
        this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
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
        return this.lists.find(list => list.id === listId);
    }

    // Updates the currently selected list ID
    setSelectedListId(listId) {
        this.selectedListId = listId;
        this.save();
    }

    // Adds a new list to the array and saves to localStorage
    addList(name) {
        const newList = {
            id: Date.now().toString(),
            name: name,
            tasks: [],
        };
        this.lists.push(newList);
        this.save();
    }

    // Removes a list by ID
    deleteList(listId) {
        this.lists = this.lists.filter(list => list.id !== listId);
        this.selectedListId = null;
        this.save();
    }

    // Adds a task to a list
    addTaskToList(listId, taskName) {
        const list = this.findListById(listId);
        const newTask = {
            id: Date.now().toString(),
            name: taskName,
            complete: false,
        };
        list.tasks.push(newTask);
        this.save();
    }

    // Toggles the completion status of a task
    toggleTaskComplete(listId, taskId, isComplete) {
        const list = this.findListById(listId);
        const task = list.tasks.find(task => task.id === taskId);
        task.complete = isComplete;
        this.save();
    }

    // Clears all completed tasks from a list
    clearCompletedTasks(listId) {
        const list = this.findListById(listId);
        list.tasks = list.tasks.filter(task => !task.complete);
        this.save();
    }

    // Saves all data to localStorage
    save() {
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
