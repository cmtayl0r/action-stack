// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------

// const wrapper = document.querySelector('#wrapper');
// const banner = document.querySelector('#page-banner');
// const wmf = document.querySelector('#book-list li:nth-child(2) .name');

// Book list
const books = document.querySelectorAll('#book-list li .name');
const bookList = document.querySelector('#book-list ul');
const bookBlock = document.querySelector('#book-list');

// Add form
const addForm = document.forms['add-book'];
const addFormInput = document.querySelector('#add-book input');
const addFormBtn = document.querySelector('#add-book button');

// Filter
const filterForm = document.forms['filter-books'].querySelector('input');

// Hide
const hideBox = document.querySelector('#hide');

// Delete

// -----------------------------------------------------------------------------
// DEMO
// -----------------------------------------------------------------------------

export const logFnc = function () {
    console.log(addForm);
};

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

// Create list item
const createListItem = function (name) {
    // Create elements
    const li = document.createElement('li');
    const bookName = document.createElement('span');
    const deleteBtn = document.createElement('span');

    // Add content
    bookName.textContent = name;
    deleteBtn.textContent = 'delete';

    // Add classes
    bookName.classList.add('name');
    deleteBtn.classList.add('delete');
    deleteBtn.setAttribute('aria-label', `Delete ${name}`);

    // Append to DOM
    li.appendChild(bookName);
    li.appendChild(deleteBtn);

    return li;
};

// Add book
const addBookToList = function () {
    // Get input value
    const value = addForm.querySelector('input[type="text"]').value;

    // If submit has no input value
    if (value.trim() === '') {
        alert(`💥 Please enter a name`);
        return;
    }

    // Create list item function
    bookList.appendChild(createListItem(value));

    // Clear input text
    addForm.querySelector('input[type="text"]').value = '';

    // Maintain focus on input for better usability
    addFormInput.focus();
};

// -----------------------------------------------

// Debounce function to limit how often the filter function is called
const debounceFilterInput = function (func, wait) {
    // Declare a variable to hold the timeout ID,
    // allowing us to cancel the timeout later if necessary
    let timeout;
    // Return a new function that encapsulates the debouncing logic
    return function executedFunction(...args) {
        const later = () => {
            // Define a function (later) that will be executed after the wait period.
            // It clears the timeout and calls the passed-in function with all its arguments.
            clearTimeout(timeout);
            func(...args);
        };
        // Clear any existing timeout,
        // effectively resetting the timer every time the returned function is called.
        clearTimeout(timeout);
        // Set a new timeout that calls the 'later' function after the specified wait period.
        timeout = setTimeout(later, wait);
    };
};

// Filter books
const filterBooksByTerm = function (evt) {
    // Convert user input to lowercase
    const term = evt.target.value.toLowerCase();

    // Retrieve all list items (books) within the bookList ul
    const books = bookList.getElementsByTagName('li');

    // Convert the HTMLCollection of books into an array (to use array methods)
    Array.from(books).forEach(book => {
        // Grab the first child of each book (li) element,
        // which is assumed to be a <span> with the class 'name'
        const title = book.firstElementChild.textContent;
        // Check if the book title includes the search term.
        // If it does, display the book; otherwise, hide it.
        book.style.display = title.toLowerCase().includes(term)
            ? 'list-item' // block causes marker issues
            : 'none';
    });
};

// -----------------------------------------------------------------------------
// ACTION FUNCTIONS
// -----------------------------------------------------------------------------

// ADD
export const addBook = function () {
    addForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        addBookToList();
    });
    addForm.addEventListener('keydown', function (evt) {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            addBookToList();
        }
    });
};

// DELETE
export const deleteBook = function () {
    bookList.addEventListener('click', function (evt) {
        // Event Delegation + Bubbling
        /*
        By adding an event listener to the parent element (bookList) rather than each delete button individually, the code leverages the concept of event bubbling. Event bubbling is a mechanism where an event triggered on a DOM element propagates up (bubbles) to its ancestors. This approach is more efficient than attaching an event listener to each delete button because it reduces the number of event listeners needed.
        */
        if (evt.target.className === 'delete') {
            // Target the li containing the delete button
            const liItem = evt.target.parentElement;
            bookList.removeChild(liItem);
        }
    });
};

// HIDE
export const hideBooks = function () {
    hideBox.addEventListener('change', evt => {
        bookList.classList.toggle('is-hidden', hideBox.checked);
    });
};

// FILTER
export const filterBooks = function () {
    filterForm.addEventListener(
        'keyup',
        debounceFilterInput(filterBooksByTerm, 300)
    );
};
