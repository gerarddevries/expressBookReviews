const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (!username) {
        return res.status(404).json({message: "Username missing."});
    }
    if (!password) {
        return res.status(404).json({message: "Password missing"});
    }

    // Check if the user does not already exist
    if (!isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        // asynchronously wait for the JSON stringification
        const booksJSON = await new Promise((resolve, reject) => {
            resolve(JSON.stringify(books,null,4));
        });

        // asynchronously send JSON response with formatted books data
        res.send(booksJSON);
    } catch (err) {
        res.status(500).send("An error occurred while fetching the book list.");
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding books details
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    // Filter the books array for any book with specified author
    const foundBooks = Object.entries(books)
    .filter(([_, book]) => book.author === author);
    res.send(foundBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    // Filter the books array for any book with specified title
    const foundBooks = Object.entries(books)
    .filter(([_, book]) => book.title === title);
    res.send(foundBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Retrieve the isbn parameter from the request URL and send the corresponding books details
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
