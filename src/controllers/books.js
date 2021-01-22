const { Book } = require('../models');

exports.create = (req, res) => {
    Book.create(req.body).then(book => res.status(201).json(book));
};

exports.list = (req, res) => {
    Book.findAll().then(books => {
        res.status(200).json(books);
    });
};

exports.getBookById = (req, res) => {
    const { id } = req.params;
    Book.findByPk(id).then(book => {
        if(!book) {
            res.status(404).json({ error: 'The book does not exist.' });
        } else {
            res.status(200).json(book);
        }
    });
};

