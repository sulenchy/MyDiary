import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';
import resetDb from '../models/index';


const { expect } = chai;

chai.use(chaiHttp);
const signupUrl = '/api/v1/auth/signup';

describe('Test default route', () => {
  it('Should return 200 for the default route', (done) => {
    chai.request(app)
      .get('/api/v1/')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
  it('Should return 404 for routes not specified', (done) => {
    chai.request(app)
      .get('/another/undefined/route')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });
  it('Undefined Routes Should Return 404', (done) => {
    chai.request(app)
      .post('/another/undefined/route')
      .send({
        random: 'random',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
describe('POST /api/v1/auth/signup', () => {
  beforeEach((done) => {
    resetDb();
    done();
  });
  it('should not register user with a wrong email format', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon.com',
        fullname: 'Solomon Kingsley',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.email)
          .to.include('The email format is invalid.');
        done();
      });
  });
  it('should take required character format error', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: 'Solomon Kingsleysddfsdfsdfdffgewerttecvnvbnbdrtdfghfgtetert',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        done();
      });
  });
  it('should not register user with an empty fullname field ', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        fullname: '',
        email: 'maureen@gmailcom',
        password: 'maureen123',
        gender: 'female',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        done();
      });
  });
  it('should not register user with an fullname field that is not letters ', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: '123h99902%^*()',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.fullname)
          .to.include('The fullname format is invalid.');
        done();
      });
  });
  it('should not register user with an empty fullname field ', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: '',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.fullname)
          .to.include('The fullname field is required.');
        done();
      });
  });
  it('should not register fullname with less than 3 characters', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: 'so',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.fullname)
          .to.include('The fullname must not be less than 3 characters.');
        done();
      });
  });
  it('should not register a fullname with more than 20 characters', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: 'solllomon kingsleysgfgsasadsd',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.fullname)
          .to.include('The fullname must not be greater than 20 characters.');
        done();
      });
  });
  it('should not register a fullname with wierd characters', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: '@$@%#!^!',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.fullname)
          .to.include('The fullname format is invalid.');
        done();
      });
  });
  it('should not register with less than 8 password characters', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: 'Solomon',
        password: 'solom',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.password)
          .to.include('The password must not be less than 8 characters.');
        done();
      });
  });
  it('should not register user with an empty email field ', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: '',
        fullname: 'solomon',
        password: 'solomon123',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.email)
          .to.include('The email field is required.');
        done();
      });
  });
  it('should not register user with an empty password field ', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: 'soloomon',
        password: '',
        gender: 'Male',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.password)
          .to.include('The password field is required.');
        done();
      });
  });
  it('should not register user with an empty string field ', (done) => {
    chai.request(app)
      .post(`${signupUrl}`)
      .send({
        email: 'solomon@kingsley.com',
        fullname: 'solomon',
        password: '123456',
        gender: '',
        passportUrl: '/sk.jpg',
        notification: false,
        role: 'user',
      })
      .end((err, res) => {
        expect(res).to.have.status(406);
        expect(res.body).to.be.an('object');
        expect(res.body.data.errors.gender)
          .to.include('The gender field is required.');
        done();
      });
  });
});
