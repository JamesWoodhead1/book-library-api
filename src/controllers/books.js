const { Book } = require('../models');

exports.create = (req, res) => {
    Book.create(req.body).then(book => res.status(201).json(book));
};