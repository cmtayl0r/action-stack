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
        this.viewTask = new ViewTask(this);
    }

    addList(name) {
        const list = { id: Date.now().toString(), name, tasks: [] };
        this.model.addList(list);
        this.viewTask.renderLists();
    }

    selectList(listId) {
        this.model.selectedListId = listId;
        this.model.save();
        this.viewTask.renderLists(
            this.model.getLists(),
            this.model.selectedListId
        );
    }

    init() {
        this.viewTask.renderLists(
            this.model.getLists(),
            this.model.selectedListId
        );
    }
}

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const app = new Controller();
    app.init();
});
