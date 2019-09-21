// Book class: represent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI class: Handle UI tasks.
class UI {
  static displayBook() {
    const books = Store.getBook();
    // iterate over all books
    books.forEach(book => {
      UI.addBookToList(book);
    });
  }
  static addBookToList(book) {
    // get acces to tbody where we want to append rows.
    const list = document.querySelector("#book-list");
    // create table tr 
    const row = document.createElement("tr");
    row.innerHTML = `
  <td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="btn btn-danger btn-sm del" data-btn-del>X</a></td>
  `;

    list.appendChild(row);

  }

  static clearFields() {
    document.querySelector("#title").value = '';
    document.querySelector("#author").value = '';
    document.querySelector("#isbn").value = '';
  }

  static deleteBook(et) {
    if (et.classList.contains("del")) {
      // remove respetive parent
      et.parentElement.parentElement.remove();

    }
  }

  // show alerts
  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}
// store class: handles storage
class Store {
  static getBook() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    let books = Store.getBook();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));

  }

  static removeBook(isbn) {
    const books = Store.getBook();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Evnt: display book on dom load
document.addEventListener("DOMContentLoaded", UI.displayBook());


// Event: add a book on form submit
const bookForm = document.querySelector("#book-form");
bookForm.addEventListener('submit', (e) => {
  // prevent default submit action
  e.preventDefault();
  // get input values.
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  // validaTE.
  if (title === '' && author === '' && isbn === '') {
    UI.showAlert("PLease enter all fields", "danger");
  } else {
    // instatiate Book with above input values.
    const book = new Book(title, author, isbn);
    // Add book to UI
    UI.addBookToList(book);

    // also add to local storage.
    Store.addBook(book);
    // show success mesage
    UI.showAlert("Book added successfully.", "success")

    // clear fields
    UI.clearFields();
  }

});

// Remove a book.
// Set click event on row so that you get access row to delete it.
document.querySelector("#book-list").addEventListener("click", (e) => {
  // delete book fro UI.
  UI.deleteBook(e.target);
  // delete frm store
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
  // show alert
  UI.showAlert("Book deleted.", "info")
});