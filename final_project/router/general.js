const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const listOfBooks = async() =>{

  const keys = Object.keys(books);

  const books_list = [];

  keys.forEach(element => {
    books_list[element]= books[element]
  });
  return books_list
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  if (!username){
    return res.status(401).json({ message: "No username provided" });
  }

  if (!password){
    return res.status(401).json({ message: "No password provided" });
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let list = {}

  let listReq = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books);
    },6000)});
  
  listReq.then((asyncList)=> {
    list = asyncList;
    return res.status(200).json({message: "Here's the list", list});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  let bookReq = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books[req.params.isbn]);
    },6000)})

  bookReq.then((book) =>{
    if(book){
      return res.status(200).json({message: "One book find for the ISBN "+req.params.isbn+"", book});
    }
    return res.status(404).json({message: "No book find"});
  })
  
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  let bookReq = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(listOfBooks());
    },6000)})
  
  bookReq.then((books_list) =>{
    const books_author = books_list.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
    if(books_author){
      return res.status(200).json({message: "Books found for "+req.params.author+"", books_author});
    }
    //Write your code here
    return res.status(404).json({message: "No book found for this author: "+req.params.author+""});
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  let bookReq = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(listOfBooks());
    },6000)})
    
  bookReq.then((books_list) =>{
    const books_title = books_list.filter(b => b.title.toLowerCase() === req.params.title.toLowerCase());
    if(books_title){
      return res.status(200).json({message: "Books found for the title  '"+req.params.title+"'", books_title});
    }
    //Write your code here
    return res.status(404).json({message: "No book found for this title: "+req.params.title+""});
  })
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];

  if(book){
    return res.status(200).json({
      message: "Review for the ISBN "+req.params.isbn+"", 
      title: book.title,
      review: book.reviews});
  }
  return res.status(404).json({message: "No review found"});
});

module.exports.general = public_users;
