const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Async function to simulate fetching books
const getBooks = async () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books available");
    }
  });
};

// Get the list of all books
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const getBookByISBN = async (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
};

// Route: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBN(isbn);
    res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Async function to get books by author
const getBooksByAuthor = async (author) => {
  return new Promise((resolve, reject) => {
    let matchingBooks = [];
    let keys = Object.keys(books);
    for (let i = 0; i < keys.length; i++) {
      let book = books[keys[i]];
      if (book.author === author) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for this author");
    }
  });
};

// Route: Get books by author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

const getBooksByTitle = async (title) => {
  return new Promise((resolve, reject) => {
    let matchingBooks = [];
    let keys = Object.keys(books);
    for (let i = 0; i < keys.length; i++) {
      let book = books[keys[i]];
      if (book.title === title) {
        matchingBooks.push(book);
      }
    }

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title");
    }
  });
};

// Route: Get books by title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const booksByTitle = await getBooksByTitle(title);
    res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add new user
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let books = require("./booksdb.js");   
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; // get ISBN from URL
  let books = require("./booksdb.js"); 

  if (books[isbn]) {
    return res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   let author = req.params.author;
//   let matchingBooks = [];

//   let keys = Object.keys(books);
//   for (let i = 0; i < keys.length; i++) {
//     let book = books[keys[i]];
//     if (book.author === author) {
//       matchingBooks.push(book);
//     }
//   }

//   if (matchingBooks.length > 0) {
//     return res.status(200).json(matchingBooks);
//   } else {
//     return res.status(404).json({ message: "No books found for this author" });
//   }
// });

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   let title = req.params.title;
//   let matchingBooks = [];

//   // Get all keys of the books object
//   let keys = Object.keys(books);

//   // Search for books with matching title
//   for (let i = 0; i < keys.length; i++) {
//     let book = books[keys[i]];
//     if (book.title === title) {
//       matchingBooks.push(book);
//     }
//   }

//   if (matchingBooks.length > 0) {
//     return res.status(200).json(matchingBooks);
//   } else {
//     return res.status(404).json({ message: "No books found with this title" });
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
 const isbn = req.params.isbn;

  // Check if book exists
  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }  
});

module.exports.general = public_users;
