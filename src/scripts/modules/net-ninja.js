// -----------------------------------------------------------------------------
// DOM ELEMENTS
// -----------------------------------------------------------------------------

const wrapper = document.querySelector('#wrapper');
const banner = document.querySelector('#page-banner');
const wmf = document.querySelector('#book-list li:nth-child(2) .name');

// Book list
const books = document.querySelectorAll('#book-list li .name');
const bookList = document.querySelector('#book-list ul');
const bookBlock = document.querySelector('#book-list');

// Add form
const form = document.querySelector('#add-book');
const formInput = document.querySelector('#add-book input');
const formBtn = document.querySelector('#add-book button');

// Search
const search = document.querySelector('#search-books');

// Delete
const deleteBtns = document.querySelectorAll('#book-list li .delete');

// -----------------------------------------------------------------------------
// DEMO
// -----------------------------------------------------------------------------

export const logFnc = function () {};

// -----------------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------------

const markup = function (name) {
    return `
    <li>
        <span class="name">${name}</span>
        <span class="delete">delete</span>
    </li>
    `;
};

export const addBook = function () {
    form.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // Logs
        console.log(evt.target);
        console.log(evt);
        // Get input value
        const newBook = formInput.value;
        bookList.insertAdjacentHTML('beforeend', markup(newBook));
        console.log(newBook);
        // Clear input text
        // formInput.value = '';
    });
};

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

export const searchBooks = function () {
    searchBooks.addEventListener('click', function () {});
};
