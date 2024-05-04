// -----------------------------------------------------------------------------
// MODEL
// -----------------------------------------------------------------------------
// Handles the data and state of the application
export class Model {
    constructor() {
        // task.lists is the key for the lists array in local storage
        this.LOCAL_STORAGE_LIST_KEY = 'task.lists';
        // task.selectedListId is the key for the selected list id in local storage
        this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId';
        this.lists =
            JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_LIST_KEY)) || [];
        this.selectedListId = localStorage.getItem(
            this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY
        );
    }

    // 1 - Get list from model
    getLists() {
        // Return the lists array
        return this.lists;
    }

    // 2 - Find list from model
    findList(listId) {
        // Find the list by its id and return it
        return this.lists.find(list => list.id === listId);
    }

    // 3 - Add list to model
    addList(list) {
        // Add the list to the lists array
        this.lists.push(list);
        // Save and render the lists
        this.save();
    }

    // 4 - Add task to a list, in the model
    addTask(listId, task) {
        // Find the list by its id
        const list = this.findList(listId);
        // If the list doesn't exist, return
        if (!list) return;
        // Add the task to the list tasks array
        list.tasks.push(task);
        // Save and render the lists
        this.save();
    }

    // 5 - Update list in the model
    save() {
        // Save the lists array to local storage
        localStorage.setItem(
            this.LOCAL_STORAGE_LIST_KEY,
            JSON.stringify(this.lists)
        );
        // Save the selected list id to local storage
        localStorage.setItem(
            this.LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
            this.selectedListId
        );
    }
}
