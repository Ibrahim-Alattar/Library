const authorInput = document.querySelector("#author");
const titleInput = document.querySelector("#title");
const pagesInput = document.querySelector("#pagesNumber");
const statusInput = document.querySelector("#readStatus");
const coverInput = document.querySelector("#bookCover");
const fileInput = document.querySelector("#bookFile");
const message = document.querySelector("#message");
const cardsContainer = document.querySelector(".books-container");
const deleteElement = document.getElementById("close")
const overlay = document.querySelector(".overlay")
const myLibrary = [];

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
}

function validateInputs() {
  // Validate text/number inputs
  if (
    authorInput.value.trim() === "" ||
    titleInput.value.trim() === "" ||
    pagesInput.value.trim() === "" ||
    statusInput.value.trim() === ""
  ) {
    showMessage("Please fill in all fields.", "red");
    return false;
  }

  // Validate cover upload
  if (coverInput.files.length === 0) {
    showMessage("Please upload a book cover.", "red");
    return false;
  }

  // Validate book file upload
  if (fileInput.files.length === 0) {
    showMessage("Please upload the book file.", "red");
    return false;
  }
  return true;
}

function displayContent() {
  const bookCard = document.createElement("div");
  bookCard.className = "book-card";

  const coverURL = URL.createObjectURL(coverInput.files[0]);
  const fileURL = URL.createObjectURL(fileInput.files[0]);

  bookCard.innerHTML = `
  <div class="close">X</div>
  <div class="book-cover">
    <img src="${coverURL}" alt="Book Cover">
  </div>

  <div class="book-details">
    <h2>${titleInput.value}</h2>
    <p><strong>Author:</strong> ${authorInput.value}</p>
    <p><strong>Pages:</strong> ${pagesInput.value}</p>
    <p><strong>Status:</strong> ${statusInput.value}</p>

    <div class="book-file">
      <strong>Book File:</strong>
      <a href="${fileURL}" target="_blank">View / Download</a>
    </div>
  </div>
`;

  cardsContainer.append(bookCard);
}

cardsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("close")) {
    e.target.closest(".book-card").remove();
  }
});

// ______________________________________________________
const createNewBook = document.getElementById("createBook");
const addBook = document.getElementById("addBook");
const form = document.getElementById("form");

createNewBook.addEventListener("click", function () {
  form.classList.toggle("closed");
  overlay.classList.toggle("opened")
});

overlay.addEventListener("click", function () {
  form.classList.toggle("closed");
  overlay.classList.toggle("opened")
})

addBook.addEventListener("click", function () {
  if (validateInputs()) {
    addBookToLibrary(
      authorInput.value,
      titleInput.value,
      pagesInput.value,
      statusInput.value,
      coverInput.value,
      fileInput.value,
    );
    displayContent();
    form.classList.toggle("closed");
  }
});

function Book(author, title, numberOfPages, readStatus, cover, file) {
  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.readStatus = readStatus;
  this.cover = cover;
  this.file = file;
}

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




