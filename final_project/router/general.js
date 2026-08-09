const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!isValid(username)){
        users.push({"username":username,"password":password});
        res.status(200).json({message:"User is registered"})

    }
    else{
        res.status(404).json({message:"User already exists"})
    }

  }
  else{
    res.status(404).json({message:" username or/and passwprd is not provided"}) 
 }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    // 1. Create a promise that instantly resolves with the books data
    Promise.resolve(books)
      .then((booksData) => {
        // 2. This runs when the promise resolves successfully
        return res.status(200).json(booksData);
      })
      .catch((error) => {
        // 3. This catches any unexpected formatting or server errors
        console.error("Error processing books:", error.message);
        return res.status(500).json({ message: "Server error retrieving books" });
      });
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const ISBN = req.params.isbn;
    const book = books[ISBN];
    Promise.resolve(book)
      .then((booksData) => {
        // 2. This runs when the promise resolves successfully
        return res.status(200).json(booksData);
      })
      .catch((error) => {
        // 3. This catches any unexpected formatting or server errors
        console.error("Error processing books:", error.message);
        return res.status(500).json({ message: "Server error retrieving book" });
      });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
 const authorparam = req.params.author;
 const bookkeys = Object.keys(books);
 const booksbyauthor=[];
 bookkeys.forEach((key) => {
    if (books[key].author.toLowerCase() === authorparam.toLowerCase()) {
        booksbyauthor.push(books[key]);
    }
});
 Promise.resolve(booksbyauthor)
   .then((bookData)=>{
     res.status(200).json(bookData)
   })
   .catch((error)=>{
        console.error("Error processing books:", error.message);
        return res.status(500).json({ message: "Server error retrieving book" });
   });
 
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
 const titleparam = req.params.title;
 const bookkeys = Object.keys(books);
 const booksbytitle=[];
 bookkeys.forEach((key) => {
    if (books[key].title.toLowerCase() === titleparam.toLowerCase()) {
        booksbytitle.push(books[key]);
    }
});
 Promise.resolve(booksbytitle)
  .then((bookData)=>{
    res.status(200).json(bookData)
  })
  .catch((error)=>{
        console.error("Error processing books:", error.message);
        return res.status(500).json({ message: "Server error retrieving book" });
  })
 
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  res.json(book['reviews']);
});

module.exports.general = public_users;
