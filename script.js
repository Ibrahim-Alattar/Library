const createNewBook = document.getElementById("createBook")
const addBook = document.getElementById("addBook")
const form = document.getElementById("form")
createNewBook.addEventListener("click", function () {
  form.classList.toggle("closed")
})
addBook.addEventListener("click", function () {
  form.classList.toggle("closed")
})





const myLibrary = [];
function Book(author, title, numberOfPages, readStatus) {
  this.id = crypto.randomUUID();
  this.author = author;
  this.title = title;
  this.numberOfPages = numberOfPages;
  this.readStatus = readStatus;

}

function addBookToLibrary(author, title, numberOfPages, readStatus) {
  const book = new Book(author, title, numberOfPages, readStatus)
  myLibrary.push(book)
}