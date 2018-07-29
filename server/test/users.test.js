import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import dummyData from '../models/dummyData';
import app from '../app';
import resetDb from '../models/index';

dotenv.config();

const { expect } = chai;

chai.use(chaiHttp);
const signupUrl = '/api/v1/auth/signup';
const loginUrl = '/api/v1/auth/login';

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
describe('Signup and login', () => {
  after((done) => {
    resetDb();
    done();
  });

  describe('POST /api/v1/auth/signup', () => {
    it('It Should create users with right signup details', (done) => {
      chai.request(app)
        .post(`${signupUrl}`)
        .send(dummyData.users[4])
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('email already exists');
          expect(res.body.status).to.equal('fail');
          done();
        });
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
    it('Should create users with right signup details', (done) => {
      chai.request(app)
        .post(`${signupUrl}`)
        .send({
          fullname: 'Ngozi Ekekwe',
          email: 'ngozi@ekekwe.com',
          password: 'ngozi1234',
          gender: 'Female',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('user created successfully');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.have.property('data');
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

  describe('POST /api/v1/auth/login', () => {
    it('Should create users with right signup details', (done) => {
      chai.request(app)
        .post(`${signupUrl}`)
        .send({
          fullname: 'Kelvin Nelson',
          email: 'kelvin@nelson.com',
          password: 'kelvin12345',
          gender: 'male',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('user created successfully');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.have.property('data');
          done();
        });
    });
    it('Should login user with right login details', (done) => {
      chai.request(app)
        .post(`${loginUrl}`)
        .send({
          email: 'kelvin@nelson.com',
          password: 'kelvin12345',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User logged in successfully');
          expect(res.body.status).to.equal('success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('user');
          done();
        });
    });
    it('Should not login the user if the password is invalid', (done) => {
      chai.request(app)
        .post(`${loginUrl}`)
        .send({
          email: 'sulaiman@gmail.com',
          password: 'load4life1234',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Password is incorrect. Please try again');
          expect(res.body.status).to.equal('fail');
          done();
        });
    });
    it('Should not login the user if the email is not supply', (done) => {
      chai.request(app)
        .post(`${loginUrl}`)
        .send({
          email: '',
          password: 'load4life1234',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal(undefined);
          expect(res.body.status).to.equal('fail');
          done();
        });
    });
  });
});
