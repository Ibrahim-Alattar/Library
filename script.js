// ======================================================
// DOM References
// Grab every element we need from the HTML once,
// and store them in variables so we can reuse them.
// ======================================================

const authorInput = document.querySelector("#author");
const titleInput = document.querySelector("#title");
const pagesInput = document.querySelector("#pagesNumber");
const coverInput = document.querySelector("#bookCover");
const fileInput = document.querySelector("#bookFile");
const statusInput = document.querySelector("#readStatus"); // This is now a checkbox (true/false)

const message = document.querySelector("#message");
const cardsContainer = document.querySelector(".books-container");
const overlay = document.querySelector(".overlay");

const createNewBook = document.getElementById("createBook");
const addBook = document.getElementById("addBook");
const form = document.getElementById("form");

// ======================================================
// The Library Array
// This is our single source of truth.
// Every book object lives here.
// The UI is always rebuilt from this array.
// ======================================================

const myLibrary = [];

// ======================================================
// Message Function
// Shows a validation message below the form inputs.
// ======================================================

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

// ======================================================
// Validate Inputs
// Checks that all required text/file fields are filled.
// Returns true if everything is fine, false if not.
// Note: we do NOT validate the checkbox — unchecked
// is a valid state (it means "Not Read").
// ======================================================

function validateInputs() {
  if (
    authorInput.value.trim() === "" ||
    titleInput.value.trim() === "" ||
    pagesInput.value.trim() === ""
  ) {
    showMessage("Please fill in all fields.", "red");
    return false;
  }

  if (coverInput.files.length === 0) {
    showMessage("Please upload a book cover.", "red");
    return false;
  }

  if (fileInput.files.length === 0) {
    showMessage("Please upload a book file.", "red");
    return false;
  }

  return true;
}

// ======================================================
// Book Constructor
// A blueprint for creating book objects.
// Every book gets a unique id, and stores all its data.
// readStatus is a boolean: true = Read, false = Not Read.
// ======================================================

function Book(author, title, numberOfPages, readStatus, cover, file) {
  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.readStatus = readStatus; // boolean
  this.cover = cover;      // object URL (temporary, lives as long as the page is open)
  this.file = file;       // object URL
}

// ======================================================
// toggleReadStatus — Book Prototype Method
// This function lives on Book.prototype, which means
// every book object automatically has access to it.
// It flips readStatus between true and false.
//
// Usage: someBook.toggleReadStatus()
// ======================================================

Book.prototype.toggleReadStatus = function () {
  this.readStatus = !this.readStatus;
};

// ======================================================
// addBookToLibrary
// Creates a new Book object from the given arguments
// and pushes it into the myLibrary array.
// ======================================================

function addBookToLibrary(author, title, numberOfPages, readStatus, cover, file) {
  const book = new Book(author, title, numberOfPages, readStatus, cover, file);
  myLibrary.push(book);
}

// ======================================================
// displayBooks
// Clears the cards container and re-renders every book
// in myLibrary from scratch.
//
// This is the only place that touches the DOM for books.
// It reads from the array — never from the inputs.
// ======================================================

function displayBooks() {
  // Wipe whatever is currently on screen
  cardsContainer.innerHTML = "";

  // Loop through every book object in the array
  myLibrary.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");

    // Store the book's unique id on the card element.
    // This is how we'll find the right book later
    // when delete or toggle buttons are clicked.
    bookCard.dataset.id = book.id;

    bookCard.innerHTML = `
      <div class="close">X</div>

      <div class="book-cover">
        <img src="${book.cover}" alt="Book Cover">
      </div>

      <div class="book-details">
        <h2>${book.title}</h2>

        <p><strong>Author:</strong> ${book.author}</p>

        <p><strong>Pages:</strong> ${book.numberOfPages}</p>

        <p><strong>Status:</strong> ${book.readStatus ? "Read" : "Not Read"}</p>

        <div class="book-file">
          <strong>Book File:</strong>
          <a href="${book.file}" target="_blank">View / Download</a>
        </div>

        <button class="toggle-status">
          Mark as ${book.readStatus ? "Not Read" : "Read"}
        </button>
      </div>
    `;

    cardsContainer.append(bookCard);
  });
}

statusInput.addEventListener("change", function () {
  document.getElementById("statusLabel").textContent = statusInput.checked ? "Read" : "Not Read";
});

// ======================================================
// Card Click Handler (Event Delegation)
// Instead of adding a listener to every card,
// we add ONE listener to the container.
// When something inside is clicked, we check what it was.
//
// This works because clicks "bubble up" from the target
// through its parent elements — so the container sees
// every click that happens inside it.
// ======================================================

cardsContainer.addEventListener("click", function (e) {

  // ── Delete ──────────────────────────────────────────
  if (e.target.classList.contains("close")) {

    // Find the card element that contains the X button
    const bookCard = e.target.closest(".book-card");

    // Read the id we stored on the card earlier
    const id = bookCard.dataset.id;

    // Find the index of the matching book in the array
    const bookIndex = myLibrary.findIndex((book) => book.id === id);

    // Remove it from the array (splice modifies the array in place)
    if (bookIndex !== -1) {
      myLibrary.splice(bookIndex, 1);
    }

    // Re-render — the deleted book is gone from the array,
    // so it won't appear in the new render
    displayBooks();
  }

  // ── Toggle Read Status ───────────────────────────────
  if (e.target.classList.contains("toggle-status")) {

    // Same pattern as delete: find the card, get the id
    const bookCard = e.target.closest(".book-card");
    const id = bookCard.dataset.id;

    // Find the actual book object in the array
    const book = myLibrary.find((book) => book.id === id);

    // Call the prototype method on the book object.
    // This flips book.readStatus from true to false or vice versa.
    if (book) {
      book.toggleReadStatus();
    }

    // Re-render — the book's readStatus has changed,
    // so the new render will reflect it
    displayBooks();
  }
});

// ======================================================
// Open / Close Form
// Toggles the form and overlay visibility.
// Clicking "Add New Book" or clicking the overlay
// both trigger the same toggle.
// ======================================================

createNewBook.addEventListener("click", function () {
  form.classList.toggle("closed");
  overlay.classList.toggle("opened");
});

overlay.addEventListener("click", function () {
  form.classList.toggle("closed");
  overlay.classList.toggle("opened");
});

// ======================================================
// Add Book Button
// Runs when the user clicks "Add Book" inside the form.
// Validates inputs, creates object URLs for the files,
// adds the book to the library, re-renders, and resets.
// ======================================================

addBook.addEventListener("click", function () {
  if (validateInputs()) {

    // createObjectURL creates a temporary local URL
    // pointing to the uploaded file in memory.
    // We generate it here and store it on the book object
    // so displayBooks can use it later.
    const coverURL = URL.createObjectURL(coverInput.files[0]);
    const fileURL = URL.createObjectURL(fileInput.files[0]);

    addBookToLibrary(
      authorInput.value,
      titleInput.value,
      pagesInput.value,
      statusInput.checked, // checkbox: true if checked, false if not
      coverURL,
      fileURL,
    );

    displayBooks();
    reset();

    form.classList.toggle("closed");
    overlay.classList.toggle("opened");
  }
});

// ======================================================
// Reset Inputs
// Clears all form fields after a book is added.
// ======================================================

function reset() {
  authorInput.value = "";
  titleInput.value = "";
  pagesInput.value = "";
  document.getElementById("statusLabel").textContent = "Not Read";
  coverInput.value = "";
  fileInput.value = "";
}