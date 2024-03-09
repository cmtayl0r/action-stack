// -----------------------------------------------------------------------------
// IMPORTS
// -----------------------------------------------------------------------------

import { testFnc, addBook, deleteBook } from './modules/net-ninja';
// import * as NetNinja from './modules/net-ninja';

// -----------------------------------------------------------------------------
// INITIALIZATION
// -----------------------------------------------------------------------------

const init = function () {
    // Imported function to start app
    testFnc();
    addBook();
    deleteBook();
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is fully loaded and parsed!');
    // Initialize the app
    init();
});
