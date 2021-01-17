const { Reader } = require('../models');

exports.create = (req, res) => {
    Reader.create(req.body).then(reader => res.status(201).json(reader));
};

exports.list = (req, res) => {
    Reader.findAll().then(readers => {
        res.status(200).json(readers);
    });
};

exports.getReaderById = (req, res) => {
    const { readerId } = req.params;
    Reader.findByPk(readerId).then(reader => {
        if(!reader) {
            res.status(404).json({ error: 'The reader could not be found.' });
        } else {
            res.status(200).json(reader);
        }
    });
};

exports.update = (req, res) => {
    const { id } = req.params;
    Reader.update(req.body, { where: { id } }).then(([rowsUpdated]) => {
        if(!rowsUpdated) {
            res.status(404).json({ error: 'The reader could not be found.' });
        } else {
            res.status(200).json([rowsUpdated]);
        }
    });
};

exports.deleteReader = (req, res) => {
    const { readerId } = req.params;
    Reader.destroy({ where: { id: readerId } }).then((rowsUpdated) => {
        if(!rowsUpdated) {
            res.status(404).json({ error: 'The reader could not be found.'}) 
        } else {
            res.status(204).json(rowsUpdated)
        }
    });
};