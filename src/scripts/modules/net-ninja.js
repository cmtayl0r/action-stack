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

// Debounce function to limit how often the filter function is called
const debounceFilterInput = function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
// Filter books
const filterBooksByTerm = function (evt) {
    // Convert user input to lowercase
    const term = evt.target.value.toLowerCase();

    const books = bookList.getElementsByTagName('li');

    Array.from(books).forEach(book => {
        // Grab span of li called name
        const title = book.firstElementChild.textContent;

        book.style.display = title.toLowerCase().includes(term)
            ? 'block'
            : 'none';
    });
    console.log('Key released:', evt.key);
};

// -----------------------------------------------------------------------------
// ACTION FUNCTIONS
// -----------------------------------------------------------------------------

// ADD
export const addBook = function () {
    addForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
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
