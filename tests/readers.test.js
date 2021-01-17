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
    describe('with readers in the database', () => {
        let readers;
        beforeEach((done) => {
            Promise.all([
                Reader.create({ name: 'J Jonah Jameson', email: 'jjjameson@findMeSpiderman.com'}),
                Reader.create({ name: 'Peter Parker', email: 'definitelyNotSpiderman@spiderman.com' }),
                Reader.create({ name: 'Norman Osborn', email: 'bigGreen@goblin.com' }),
            ]).then((documents) => {
                readers = documents;
                done();
            });
        });
        describe('GET /readers', () => {
            it('gets all reader records', (done) => {
                request(app).get('/readers').then((res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body.length).to.equal(3);
                    res.body.forEach((reader) => {
                        const expected = readers.find((a) => a.id === reader.id);
                        expect(reader.name).to.equal(expected.name);
                        expect(reader.email).to.equal(expected.email);
                    });
                    done();
                }).catch(done => error(done));
            });
        });
        describe('GET /readers/:readerId', () => {
            it('gets a reader record by Id', (done) => {
                const reader = readers[0];
                request(app)
                    .get(`/readers/${reader.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body.name).to.equal(reader.name);
                        expect(res.body.email).to.equal(reader.email);
                        done();
                    }).catch(error => done(error));
            });
            it('returns a 404 if the reader does not exist', (done) => {
                request(app)
                    .get('/readers/2077')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The reader could not be found.');
                        done();
                    });
            });
        });
        describe('PATCH /readers/:Id', () => {
            it('updates reader name by id', (done) => {
                const reader = readers[0];
                request(app)
                    .patch(`/readers/${reader.id}`)
                    .send({ name: 'J J Jameson' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
                            expect(updatedReader.name).to.equal('J J Jameson');
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('updates reader email by id', (done) => {
                const reader = readers[0];
                request(app)
                    .patch(`/readers/${reader.id}`)
                    .send({ email: 'jjjameson@peterParkerIsSus.com' })
                    .then((res) => {
                        expect(res.status).to.equal(200);
                        Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
                            expect(updatedReader.email).to.equal('jjjameson@peterParkerIsSus.com');
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('returns a 404 if the reader does not exist', (done) => {
                request(app)
                    .patch('/readers/2077')
                    .send({ name: 'Red Goblin' })
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The reader could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });
        describe('DELETE /readers/:readerId', () => {
            it('deletes reader record by id', (done) => {
                const reader = readers[0];
                request(app)
                    .delete(`/readers/${reader.id}`)
                    .then((res) => {
                        expect(res.status).to.equal(204);
                        Reader.findByPk(reader.id, { raw: true }).then((updatedReader) => {
                            expect(updatedReader).to.equal(null);
                            done();
                        });
                    }).catch(error => done(error));
            });
            it('returns a 404 if the reader does not exist', (done) => {
                request(app)
                    .delete('/readers/2077')
                    .then((res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body.error).to.equal('The reader could not be found.');
                        done();
                    }).catch(error => done(error));
            });
        });
    });
});