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
public_users.get('/',function (req, res) {
 res.send(JSON.stringify(books,null,4));
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
 const authorparam = req.params.author;
 const bookkeys = Object.keys(books);
 const booksbyauthor=[];
 bookkeys.forEach((key) => {
    if (books[key].author.toLowerCase() === authorparam.toLowerCase()) {
        booksbyauthor.push(books[key]);
    }
})
 if(booksbyauthor.length>0){
    res.status(200).json(booksbyauthor);
 }
 else{
    res.status(404).json("Unable to find author");
 }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 const titleparam = req.params.title;
 const bookkeys = Object.keys(books);
 const booksbytitle=[];
 bookkeys.forEach((key) => {
    if (books[key].title.toLowerCase() === titleparam.toLowerCase()) {
        booksbytitle.push(books[key]);
    }
})
 if(booksbytitle.length>0){
    res.status(200).json(booksbytitle);
 }
 else{
    res.status(404).json("Unable to find title");
 }
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  res.json(book['reviews']);
});

module.exports.general = public_users;
