const express = require('express');

const readerControllers = require('./controllers/readers');
const bookControllers = require('./controllers/books');

const app = express();

app.use(express.json());


app.post('/readers', readerControllers.create);


app.post('/books', bookControllers.create);

module.exports = app;