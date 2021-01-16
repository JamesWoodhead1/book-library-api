const { Reader } = require('../src/models');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('/readers', () => {
    before(async () => {
        try {
            await Reader.sequelize.sync();
        } catch (err) {
            console.log(err);
        }
    });

    beforeEach(async () => {
        try {
            await Reader.destroy({ where: {} });
        } catch (err) {
            console.log(err);
        }
    });
    describe('POST /readers', async () => {
        it('creates a new reader in the database', async () => {
            const response = await request(app).post('/readers').send({
                name: 'J Jonah Jameson',
                email: 'jjjameson@findMeSpiderman.com',
            });
            await expect(response.status).to.equal(201);
            expect(response.body.name).to.equal('J Jonah Jameson');

            const insertedReaderRecords = await Reader.findByPk(response.body.id, { raw: true });
            expect(insertedReaderRecords.name).to.equal('J Jonah Jameson');
            expect(insertedReaderRecords.email).to.equal('jjjameson@findMeSpiderman.com');
        });
    });
});