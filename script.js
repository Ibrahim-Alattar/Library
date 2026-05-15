const authorInput = document.querySelector("#author");
const titleInput = document.querySelector("#title");
const pagesInput = document.querySelector("#pagesNumber");
const statusInput = document.querySelector("#readStatus");
const coverInput = document.querySelector("#bookCover");
const fileInput = document.querySelector("#bookFile");

const message = document.querySelector("#message");
const cardsContainer = document.querySelector(".books-container");

const overlay = document.querySelector(".overlay");

const createNewBook = document.getElementById("createBook");
const addBook = document.getElementById("addBook");
const form = document.getElementById("form");

const myLibrary = [];

// ======================================================
// Message Function
// ======================================================

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

// ======================================================
// Validate Inputs
// ======================================================

function validateInputs() {
  if (
    authorInput.value.trim() === "" ||
    titleInput.value.trim() === "" ||
    pagesInput.value.trim() === "" ||
    statusInput.value.trim() === ""
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
// ======================================================

function Book(author, title, numberOfPages, readStatus, cover, file) {
  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.readStatus = readStatus;
  this.cover = cover;
  this.file = file;
}

// ======================================================
// Add Book To Library
// ======================================================

function addBookToLibrary(
  author,
  title,
  numberOfPages,
  readStatus,
  cover,
  file,
) {
  const book = new Book(author, title, numberOfPages, readStatus, cover, file);

  myLibrary.push(book);
}

// ======================================================
// Display Books
// ======================================================

function displayBooks() {
  cardsContainer.innerHTML = "";

  myLibrary.forEach((book) => {
    const bookCard = document.createElement("div");

    bookCard.classList.add("book-card");

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

        <p><strong>Status:</strong> ${book.readStatus}</p>

        <div class="book-file">
          <strong>Book File:</strong>
          <a href="${book.file}" target="_blank">
            View / Download
          </a>
        </div>
      </div>
    `;

    cardsContainer.append(bookCard);
  });
}

// ======================================================
// Delete Book
// ======================================================

cardsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("close")) {

    // Get the clicked card
    const bookCard = e.target.closest(".book-card");

    // Get the id from the HTML
    const id = bookCard.dataset.id;

    // Find the matching object index
    const bookIndex = myLibrary.findIndex(
      (book) => book.id === id
    );

    // Remove it from the array
    if (bookIndex !== -1) {
      myLibrary.splice(bookIndex, 1);
    }

    // Re-render books
    displayBooks();
  }
});

// ======================================================
// Open / Close Form
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
// ======================================================

addBook.addEventListener("click", function () {
  if (validateInputs()) {
    const coverURL = URL.createObjectURL(coverInput.files[0]);

    const fileURL = URL.createObjectURL(fileInput.files[0]);

    addBookToLibrary(
      authorInput.value,
      titleInput.value,
      pagesInput.value,
      statusInput.value,
      coverURL,
      fileURL,
    );

    displayBooks();
    reset()

    form.classList.toggle("closed");
    overlay.classList.toggle("opened");
  }
});


// ========================================================
// REST INPUTS
// ========================================================]

function reset() {
  authorInput.value = "";
  titleInput.value = "";
  pagesInput.value = "";
  statusInput.value = "";
  coverInput.value = "";
  fileInput.value = "";
}