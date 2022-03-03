import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

let validToken = '';
const invalidToken = 'shgsgasfdhjdsfhjkh.hdfurnjdghgrsd.tefgsfdgfgsd';
const entriesUrl = '/api/v1/entries';
const userSignup = '/api/v1/auth/signup';
const userLogin = '/api/v1/auth/login';
const updateUserUrl = '/api/v1/user';
const usersUrl = '/api/v1/users';

describe('Diary Entries', () => {
  describe('/api/v1/entries', () => {
    it('Unauthorised user should not  be able to POST a diary entry', (done) => {
      const entry = {
        title: 'Last time I ate bread',
        content: 'The last time I ate bread was Feb 22nd 2009',
      };
      chai.request(app)
        .post(`${entriesUrl}`)
        .set('token', validToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User is unauthorized');
          done();
        });
    });
    it('/api/v1/users Should get users', (done) => {
      chai.request(app)
        .get(`${usersUrl}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Sorry, no user is available check back later.');
          done();
        });
    });
    it('User should be able to signup with valid signup details', (done) => {
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
          validToken = res.body.user.token;
          done();
        });
    });
    it('Authorised user should be able to GET all diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}`)
        .set('token', validToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('No entry. Pls, add one now');
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
        .set('token', validToken)
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
    it('User should be able to signup with valid signup details', (done) => {
      chai.request(app)
        .post(`${userSignup}`)
        .send({
          fullname: 'bailey white',
          email: 'bailey@white.com',
          password: 'bailyman222',
          gender: 'Male',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('New user created successfully');
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('token');
          validToken = res.body.user.token;
          done();
        });
    });
    it('Authorised user should be able to POST a diary entry', (done) => {
      const entry = {
        title: 'MY Best food',
        content: 'My best food is ogbolo and appu',
      };
      chai.request(app)
        .post(`${entriesUrl}`)
        .set('token', validToken)
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
        .set('token', validToken)
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
        .set('token', validToken)
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
        .set('token', invalidToken)
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
          validToken = res.body.data.token;
          done();
        });
    });
    it('Should not post on /api/v1/user', (done) => {
      chai.request(app)
        .post(`${updateUserUrl}`)
        .set('token', validToken)
        .send({
          fullname: 'Ngolo Kante',
          email: 'ngolo@kante.com',
          gender: 'female',
          notification: false,
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal(undefined);
          done();
        });
    });
    it('Should get user details', (done) => {
      chai.request(app)
        .get(`${updateUserUrl}`)
        .set('token', validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User details gotten successfully');
          done();
        });
    });
    it('Should get user details', (done) => {
      chai.request(app)
        .get(`${updateUserUrl}`)
        .set('token', invalidToken)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User is unauthorized');
          done();
        });
    });
    it('Should get user details', (done) => {
      chai.request(app)
        .delete(`${updateUserUrl}`)
        .set('token', validToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal(undefined);
          done();
        });
    });
    it('Should modify existing user profile', (done) => {
      chai.request(app)
        .put(`${updateUserUrl}`)
        .set('token', validToken)
        .send({
          fullname: 'Ngolo Kante',
          email: 'ngolo@kante.com',
          gender: 'female',
          notification: false,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User profile updated successfully');
          expect(res.body).to.have.property('user');
          expect(res.body.user.notification).to.equal(false);
          expect(res.body.user.passportUrl).to.equal(undefined);
          done();
        });
    });
    it('Should modify existing user profile', (done) => {
      chai.request(app)
        .put(`${updateUserUrl}`)
        .set('token', validToken)
        .send({
          fullname: 'Ngolo Kante',
          email: 'ngolo@kante.com',
          gender: 'female',
          passportUrl: 'ngolo.jpg',
          notification: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User profile updated successfully');
          expect(res.body).to.have.property('user');
          expect(res.body.user.notification).to.equal(true);
          done();
        });
    });
    it('Should modify existing user profile', (done) => {
      chai.request(app)
        .put(`${updateUserUrl}`)
        .set('token', validToken)
        .send({
          fullname: 'Ngolo Messi',
          email: 'ngolo@kante.com',
          gender: 'male',
          passportUrl: 'ngolo.jpg',
          notification: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User profile updated successfully');
          expect(res.body).to.have.property('user');
          expect(res.body.user.notification).to.equal(true);
          expect(res.body.user.fullname).to.equal('Ngolo Messi');
          expect(res.body.user.gender).to.equal('male');
          done();
        });
    });
    it('Should not modify existing user profile email is not provided', (done) => {
      chai.request(app)
        .put(`${updateUserUrl}`)
        .set('token', validToken)
        .send({
          fullname: 'Ngolo Messi',
          gender: 'male',
          passportUrl: 'ngolo.jpg',
          notification: true,
        })
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors.email).to.be.an('array');
          expect(res.body.errors.email[0]).to.equal('The email field is required.');
          done();
        });
    });
    it('Authorised user should be able to GET all diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}`)
        .set('token', validToken)
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
        .set('token', invalidToken)
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
        .set('token', validToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Diary entry updated successfully');
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
        .set('token', invalidToken)
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
        .put(`${entriesUrl}/2`)
        .set('token', validToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Entry cannot be updated by you');
          done();
        });
    });
    it('Authenticate user should be able to delete only his entry', (done) => {
      chai.request(app)
        .delete(`${entriesUrl}/1`)
        .set('token', validToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Diary entry deleted successfully');
          done();
        });
    });
    it('Authenticate user should be able to delete only his entry', (done) => {
      chai.request(app)
        .delete(`${entriesUrl}/2`)
        .set('token', validToken)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Entry cannot be deleted by you');
          done();
        });
    });
    it('Unauthenticate user should not be able to delete entry', (done) => {
      chai.request(app)
        .delete(`${entriesUrl}/1`)
        .set('token', invalidToken)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User is unauthorized');
          done();
        });
    });
    it('Unauthenticate user should not be able to delete entry', (done) => {
      chai.request(app)
        .delete(`${entriesUrl}/2`)
        .set('token', invalidToken)
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
        .put(`${entriesUrl}/2`)
        .set('token', validToken)
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Entry cannot be updated by you');
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
          validToken = res.body.data.token;
          done();
        });
    });

    it('User should be able to GET a diary entries', (done) => {
      chai.request(app)
        .get(`${entriesUrl}/2`)
        .set('token', validToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('No Entry is found');
          done();
        });
    });
  });
});
