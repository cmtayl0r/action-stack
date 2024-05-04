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

    getLists() {
        // Return the lists array
        return this.lists;
    }

    findList(listId) {
        // Find the list by its id and return it
        return this.lists.find(list => list.id === listId);
    }

    addList(list) {
        // Add the list to the lists array
        this.lists.push(list);
        // Save and render the lists
        this.save();
    }

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
