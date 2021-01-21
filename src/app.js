const express = require('express');

const readerControllers = require('./controllers/readers');
const bookControllers = require('./controllers/books');

const app = express();

app.use(express.json());


app.post('/readers', readerControllers.create);

app.get('/readers', readerControllers.list);

app.get('/readers/:readerId', readerControllers.getReaderById);

app.patch('/readers/:id', readerControllers.update);

app.delete('/readers/:readerId', readerControllers.deleteReader);


app.post('/books', bookControllers.create);

app.get('/books', bookControllers.list);

app.get('/books/:id', bookControllers.getBookById);



module.exports = app;