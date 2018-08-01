import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

let userToken = '';
let expiredToken = 'shgsgasfdhjdsfhjkh.hdfurnjdghgrsd.tefgsfdgfgsd';
const entriesUrl = '/api/v1/entries';
const userSignup = '/api/v1/auth/signup';
const userLogin = '/api/v1/auth/login';

describe('Diary Entries', () => {
  describe('/api/v1/entries', () => {
    it('Unauthorised user should not  be able to POST a diary entry', (done) => {
      const entry = {
        title: 'Last time I ate bread',
        content: 'The last time I ate bread was Feb 22nd 2009',
      };
      chai.request(app)
        .post(`${entriesUrl}`)
        .set('token', userToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User is unauthorized');
          done();
        });
    });
    it('User should be able to signup with right signup details', (done) => {
      chai.request(app)
        .post(`${userSignup}`)
        .send({
          fullname: 'Ngolo Kante',
          email: 'ngolo@kante.com',
          password: 'ngozi1234',
          gender: 'Female',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('New user created successfully');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('token');
          userToken = res.body.user.token;
          done();
        });
    });
    it('Authorised user should be able to GET all diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}`)
        .set('token', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('No entry is found');
          done();
        });
    });
    it('Authorised user should be able to POST a diary entry', (done) => {
      const entry = {
        title: 'Last time I ate bread',
        content: 'The last time I ate bread was Feb 22nd 2009',
      };
      chai.request(app)
        .post(`${entriesUrl}`)
        .set('token', userToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('NewEntry');
          expect(res.body.NewEntry).to.be.an('object');
          expect(res.body.message).to.equal('New entry created successfully.');
          done();
        });
    });
    it('Authorised user should not POST if title is less than 3 letters', (done) => {
      const entry = {
        title: 'La',
        content: 'The last time I ate bread was Feb 22nd 2009',
      };
      chai.request(app)
        .post(`${entriesUrl}`)
        .set('token', userToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(406);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('fail');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.errors.title[0]).to.equal('The title must not be less than 3 characters.');
          done();
        });
    });
    it('Authorised user should not POST if the content is less than 10 character', (done) => {
      const entry = {
        title: 'Last time I saw you',
        content: 'The last',
      };
      chai.request(app)
        .post(`${entriesUrl}`)
        .set('token', userToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(406);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('fail');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.errors.content[0]).to.equal('The content must not be less than 10 characters.');
          done();
        });
    });
    it('Unauthorised user should not be able to GET all diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}`)
        .set('token', expiredToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User is unauthorized');
          done();
        });
    });
    it('User should login to be authorised', (done) => {
      chai.request(app)
        .post(`${userLogin}`)
        .send({
          email: 'ngolo@kante.com',
          password: 'ngozi1234',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User logged in successfully');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          userToken = res.body.data.token;
          done();
        });
    });
    it('Authorised user should be able to GET all diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}`)
        .set('token', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Diary entries gotten successfully');
          done();
        });
    });
  });

  describe('/entries/:id', () => {
    it('User should not be able to GET a diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}/1`)
        .set('token', expiredToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User is unauthorized');
          done();
        });
    });
    it('Authenticate user should be able to update only his entry', (done) => {
      const entry = {
        title: 'Last time I ate bread updated',
        content: 'The last time I ate bread was Feb 22nd 2009 updated',
      };
      chai.request(app)
        .put(`${entriesUrl}/1`)
        .set('token', userToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('No Entry is found');
          done();
        });
    });
    it('Unauthenticate user should be able to update only his entry', (done) => {
      const entry = {
        title: 'Last time I ate bread updated',
        content: 'The last time I ate bread was Feb 22nd 2009 updated',
      };
      chai.request(app)
        .put(`${entriesUrl}/1`)
        .set('token', expiredToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User is unauthorized');
          done();
        });
    });
    it('Authenticate user should be able to update only his entry', (done) => {
      const entry = {
        title: 'Last time I ate bread',
        content: 'The last time I ate bread was Feb 22nd 2009',
      };
      chai.request(app)
        .put(`${entriesUrl}/3`)
        .set('token', userToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('No Entry is found');
          done();
        });
    });
    it('Authenticate user should be able to update only his entry', (done) => {
      const entry = {
        title: 'Last time I ate bread updated',
        content: 'The last time I ate bread was Feb 22nd 2009 updated',
      };
      chai.request(app)
        .put(`${entriesUrl}/2`)
        .set('token', userToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Diary entry updated successfully');
          done();
        });
    });
  });
  describe('GET /entries', () => {
    it('should be able to signup with right signup details', (done) => {
      chai.request(app)
        .post(`${userLogin}`)
        .send({
          email: 'ngolo@kante.com',
          password: 'ngozi1234',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User logged in successfully');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          userToken = res.body.data.token;
          done();
        });
    });

    it('User should be able to GET a diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}/2`)
        .set('token', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.entry).to.be.an('array');
          expect(res.body.message).to.equal('Diary entry gotten successfully');
          done();
        });
    });
  });
});
