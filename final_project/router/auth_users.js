const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username,password)=>{ 
 let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (isValid(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const book = books[req.params.isbn];
  const username = req.session.authorization.username;

  if(!book || !req.body.review){
    return res.status(404).json({ message: "Error editing a review" });
  }

  book.reviews[username]=  {
    review: req.body.review,   
    username
  }

  //Write your code here
  return res.status(200).json({message: 'Review added', book});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const book = books[req.params.isbn];
  const username = req.session.authorization.username;

  delete book.reviews[username];

  return res.status(200).json({message: 'Review deleted', book});

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
