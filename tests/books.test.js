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
});