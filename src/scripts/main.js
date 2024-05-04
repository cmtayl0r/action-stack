// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------
import { Model } from './modules/model.js';
import { ViewTask } from './modules/views/view-task.js';

// -----------------------------------------------------------------------------
// CONTROLLER
// -----------------------------------------------------------------------------

class Controller {
    constructor() {
        this.model = new Model();
        this.viewTask = new ViewTask(this);
    }
}

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const app = new Controller();
    // app.init();
});
