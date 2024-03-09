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

// -----------------------------------------------------------------------------
// DEMO
// -----------------------------------------------------------------------------

export const testFnc = function () {
    console.log('bookBlock nextSibling is:', bookBlock.nextSibling);
    console.log('bookBlock nextSibling is:', bookBlock.nextElementSibling);
};

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
        const newBook = formInput.value;
        bookList.insertAdjacentHTML('beforeend', markup(newBook));
        console.log(newBook);
        // Clear input text
        // formInput.value = '';
    });
};

export const deleteBook = function () {};
