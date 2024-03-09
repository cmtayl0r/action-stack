// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------

import { logFnc, addBook, deleteBook, searchBooks } from './modules/net-ninja';
// import * as NetNinja from './modules/net-ninja';

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

const init = function () {
    // Imported function to start app
    logFnc();
    addBook();
    deleteBook();
    searchBooks();
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is fully loaded and parsed!');
    // Initialize the app
    init();
});
