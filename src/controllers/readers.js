const { Reader } = require('../models');

const removePassword = (obj) => {
    if(obj.hasOwnProperty('password')) {
        delete obj.password;
    }
    return obj;
}

exports.create = (req, res) => {
    Reader.create(req.body)
        .then((reader) => {
            const readerWithoutPassword = removePassword(reader.dataValues);
            res.status(201).json(readerWithoutPassword);
        })
        .catch((violationError) => {
            const formattedErrors = violationError.errors.map((currentError) => currentError.message);
            res.status(422).json(formattedErrors);
        });
};

exports.list = (req, res) => {
    Reader.findAll().then(readers => {
        const readersWithoutPassword = readers.map(reader => removePassword(reader.dataValues));
        res.status(200).json(readersWithoutPassword);
    });
};

exports.getReaderById = (req, res) => {
    const { readerId } = req.params;
    Reader.findByPk(readerId).then(reader => {
        if(!reader) {
            res.status(404).json({ error: 'The reader could not be found.' });
        } else {
            const readerWithoutPassword = removePassword(reader.dataValues);
            res.status(200).json(readerWithoutPassword);
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