const { Book } = require('../models');
const book = require('../models/book');

exports.create = (req, res) => {
    Book.create(req.body).then(book => res.status(201).json(book));
};

exports.list = (req, res) => {
    Book.findAll().then(books => {
        res.status(200).json(books);
    });
};

exports.getByTitle = (req, res) => {
    const { bookTitle } = req.params;
    console.log(bookTitle);
    Book.findByPk(bookTitle).then(book => {
        if(!book) {
            res.status(404).json({ error: 'The book does not exist.' });
        } else {
            res.status(200).json(book);
        }
    });
};

exports.getByISBN = (req, res) => {
    const { bookISBN } = req.params;
    console.log(bookISBN);
    Book.findByPk(bookISBN).then(book => {
        if(!book) {
            res.status(404).json({ error: 'The book does not exist.' });
        } else {
            res.status(200).json(book);
        }
    });
};