const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Authentication', () => {
    it('should login a user with valid credentials', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({ username: 'super', password: '123' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('ok').that.is.true;
                done();
            });
    });

    it('should not login a user with invalid credentials', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({ username: 'invalidUser', password: 'wrongPass' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('ok').that.is.false;
                done();
            });
    });

    it('should register a new user', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({ userid: '4', username: 'user2', userbirthdate: '1990-01-01', userage: 34 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
