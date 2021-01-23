const { Book } = require('../src/models');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('/books', () => {
    before(async () => {
        try {
            await Book.sequelize.sync();
        } catch (err) {
            console.log(err);
        }
    });

    beforeEach(async () => {
        try {
            await Book.destroy({ where: {} });
        } catch (err) {
            console.log(err);
        }
    });
    describe('POST /books', async () => {
        it('creates a new book in the database', async () => {
            const response = await request(app).post('/books').send({
                title: 'Carpe Jugulum',
                author: 'Terry Pratchett',
                genre: 'fantasy',
                ISBN: '9780061020391',
            });
            await expect(response.status).to.equal(201);
            expect(response.body.title).to.equal('Carpe Jugulum');

            const insertedBookRecords = await Book.findByPk(response.body.id, { raw: true });
            expect(insertedBookRecords.title).to.equal('Carpe Jugulum');
            expect(insertedBookRecords.author).to.equal('Terry Pratchett');
            expect(insertedBookRecords.genre).to.equal('fantasy');
            expect(insertedBookRecords.ISBN).to.equal('9780061020391');
        });
    });

    describe('with books in the database', () => {
        let books;
        beforeEach((done) => {
            Promise.all([
                Book.create({ title: 'Carpe Jugulum', author: 'Terry Pratchett', genre: 'fantasy', ISBN: '9780061020391' }),
                Book.create({ title: 'The Final Empire', author: 'Brandon Sanderson', genre: 'fantasy', ISBN: '9780575089914' }),
                Book.create({ title: 'Rivers of London', author: 'Ben Aaronovitch', genre: 'fantasy', ISBN: '9780575097582' }),
            ]).then((documents) => {
                books = documents;
                done();
            });
        });
        describe('GET /books', () => {
            it('gets all book records', (done) => {
                request(app).get('/books').then((res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.length).to.equal(3);
                    res.body.forEach((book) => {
                        const expected = books.find((a) => a.id === book.id);
                        expect(book.title).to.equal(expected.title);
                        expect(book.author).to.equal(expected.author);
                        expect(book.genre).to.equal(expected.genre);
                        expect(book.ISBN).to.equal(expected.ISBN);
                    });
                    done();
                }).catch(error => done(error));
            });
        });
        describe('GET /books/:id', () => {
            it('gets a book record by its id', (done) => {
                const book = books[0];
                request(app)
                    .get(`/books/${book.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.title).to.equal(book.title);
                        expect(res.body.author).to.equal(book.author);
                        expect(res.body.genre).to.equal(book.genre);
                        expect(res.body.ISBN).to.equal(book.ISBN);
                        done();
                    }).catch(error => done(error));
            });
            it('returns a 404 if the book does not exist', (done) => {
                request(app)
                    .get('/books/noBookHere')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The book does not exist.');
                        done();
                    }).catch(error => done(error));
            });
        });
        describe('PATCH /books/:id', () => {
            it('updates book title by id', (done) => {
                const book = books[0];
                request(app)
                    .patch(`/books/${book.id}`)
                    .send({ title: 'The Fifth Elephant' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook.title).to.equal('The Fifth Elephant')
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('updates book author by id', (done) => {
                const book = books[0];
                request(app)
                    .patch(`/books/${book.id}`)
                    .send({ author: 'Neil Gaiman' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook.author).to.equal('Neil Gaiman')
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('updates book genre by id', (done) => {
                const book = books[0];
                request(app)
                    .patch(`/books/${book.id}`)
                    .send({ genre: 'Steam Punk' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook.genre).to.equal('Steam Punk')
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('updates book ISBN by id', (done) => {
                const book = books[0];
                request(app)
                    .patch(`/books/${book.id}`)
                    .send({ ISBN: '2077' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook.ISBN).to.equal('2077')
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('returns a 404 if the book does not exist', (done) => {
                request(app)
                    .patch('/books/666')
                    .send({ name: 'In the footsteps of the Behemoth'})
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The book could not be found.')
                        done();
                    }).catch(error => done(error));
            });
        });
        describe('DELETE /books/:bookId', () => {
            it('deletes a book record by id', (done) => {
                const book = books[0];
                request(app)
                    .delete(`/books/${book.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(204);
                        Book.findByPk(book.id, { raw: true }).then((updatedBook) => {
                            expect(updatedBook).to.equal(null);
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('returns a 404 if the book does not exist', (done) => {
                request(app)
                .delete('/books/666')
                .then((res) => {
                    expect(res.status).to.equal(404);
                    expect(res.body.error).to.equal('The book could not be found.')
                    done();
                }).catch(error => done(error));
            });
        });
    });
});