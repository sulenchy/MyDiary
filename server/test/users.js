import chaiHttp from 'chai-http';
import chai from 'chai';
import dotenv from 'dotenv';
import dummyData from '../models/dummyData';
import app from '../app';
import resetDb from '../models';

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
describe('General user input', () => {
  after((done) => {
    resetDb();
    done();
  });
  describe('POST /api/v1/auth/signup', () => {
    it('Should create new user with valid signup detail', (done) => {
      chai.request(app)
        .post(`${signupUrl}`)
        .send(dummyData.users[4])
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('New user created successfully');
          done();
        });
    });
    it('should not create new user with a wrong email format', (done) => {
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
          expect(res.body.errors.email)
            .to.include('The email format is invalid.');
          done();
        });
    });
    it('Should not create new user with an existing email address', (done) => {
      chai.request(app)
        .post(`${signupUrl}`)
        .send(dummyData.users[4])
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Email already exists');
          done();
        });
    });
    it('Should not create new user if the fullname is too long', (done) => {
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
          expect(res.body.errors.fullname)
            .to.include('The fullname must not be greater than 20 characters.');
          done();
        });
    });
    it('Should create new user with right signup details', (done) => {
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
          expect(res.body.message).to.equal('New user created successfully');
          expect(res.body).to.have.property('user');
          done();
        });
    });
    it('should not create new user if fullname contains special characters', (done) => {
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
          expect(res.body.errors.fullname)
            .to.include('The fullname format is invalid.');
          done();
        });
    });
    it('should not create ne user if the fullname is empty', (done) => {
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
          expect(res.body.errors.fullname)
            .to.include('The fullname field is required.');
          done();
        });
    });
    it('should not create new user if  fullname is less than 3 characters', (done) => {
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
          expect(res.body.errors.fullname)
            .to.include('The fullname must not be less than 3 characters.');
          done();
        });
    });
    it('should not create new user if fullname is more than 20 characters', (done) => {
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
          expect(res.body.errors.fullname)
            .to.include('The fullname must not be greater than 20 characters.');
          done();
        });
    });
    it('should not create a user if the fullname is wierd characters', (done) => {
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
          expect(res.body.errors.fullname)
            .to.include('The fullname format is invalid.');
          done();
        });
    });
    it('should not create new user if the password is less than 8 password characters', (done) => {
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
          expect(res.body.errors.password)
            .to.include('The password must not be less than 8 characters.');
          done();
        });
    });
    it('should not create new user if the email field is empty', (done) => {
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
          expect(res.body.errors.email)
            .to.include('The email field is required.');
          done();
        });
    });
    it('should not create new user if the password field is empty', (done) => {
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
          expect(res.body.errors.password)
            .to.include('The password field is required.');
          done();
        });
    });
    it('should not create new user if any of the fields is empty', (done) => {
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
          expect(res.body.errors.gender)
            .to.include('The gender field is required.');
          done();
        });
    });
    it('Should create new user with right signup details', (done) => {
      chai.request(app)
        .post(`${signupUrl}`)
        .send({
          fullname: 'sulenchy abiodun',
          email: 'sulaiman@sulenchy.com',
          password: 'sulenchy12',
          gender: 'male',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('New user created successfully');
          expect(res.body).to.have.property('user');
          done();
        });
    });
  });
  describe('POST /api/v1/auth/login', () => {
    it('Should login a user with right login details', (done) => {
      chai.request(app)
        .post(`${loginUrl}`)
        .send({
          email: 'ngozi@ekekwe.com',
          password: 'ngozi1234',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User logged in successfully');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('token');
          expect(res.body.data).to.have.property('user');
          done();
        });
    });
    it('Should not login a user if the password is invalid', (done) => {
      chai.request(app)
        .post(`${loginUrl}`)
        .send({
          email: 'ngozi@ekekwe.com',
          password: 'load4life1234',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Password or username is incorrect. Please try again');
          done();
        });
    });
    it('Should login user with right login details', (done) => {
      chai.request(app)
        .post(`${loginUrl}`)
        .send({
          email: 'sulaiman@sulenchy.com',
          password: 'sulenchy12',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User logged in successfully');
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
          email: 'sulaiman@sulenchy.com',
          password: 'sulenchy',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Password or username is incorrect. Please try again');
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
          expect(res.body.message).to.equal('User not found. Please, register now');
          done();
        });
    });
  });
});
