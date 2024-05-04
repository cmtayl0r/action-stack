// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------

import {
    logFnc,
    addBook,
    deleteBook,
    filterBooks,
    hideBooks,
    tabContent,
} from './modules/net-ninja';
// import * as NetNinja from './modules/net-ninja';

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

const init = function () {
    // Imported function to start app
    logFnc();
    addBook();
    deleteBook();
    filterBooks();
    hideBooks();
    tabContent();
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is fully loaded and parsed!');
    // Initialize the app
    init();
});
