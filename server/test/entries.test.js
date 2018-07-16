import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';
import dummyData from '../models/dummyData';

const { expect } = chai;

chai.use(chaiHttp);

describe('Diary Entries', () => {
  beforeEach((done) => { // Before each test we empty the database
    dummyData.entries = {};
    done();
  });

  describe('Undefined or empty diary entries object', () => {
    // it('it should return error message when entries object is undefined', (done) => {
    //   dummyData.entries = undefined;
    //   chai.request(app)
    //     .get('/api/v1/entries')
    //     .type('form')
    //     .end((err, res) => {
    //       expect(res).to.have(404);
    //       expect(res.body).to.be.an('object');
    //       expect(res.body).to.have.property('error');
    //       expect(res.body.error.message).to.be.equal('Request unsucessful');
    //       done();
    //     });
    // });

    it('should GET empty diary entry when the entries object is {}', (done) => {
      chai.request(app)
        .get('/api/v1/entries')
        .type('form')
        .end((err, res) => {
          expect(res).to.have(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.be.equal('{}');
          expect(res.body).to.have.property('status');
          expect(res.body.error.status).to.be.equal('fail');
          expect(res.body.message).to.be.equal('No dairy entry available currently');
          done();
        });
    });
  });

  describe('/api/v1/entries', () => {
    it('it should POST a diary entry', (done) => {
      const entry = {
        date: '1st may 2010',
        time: '9:30 AM',
        userId: 1000,
        title: 'Last time I ate bread',
        description: 'The last time I ate bread was Feb 22nd 2009',
      };
      chai.request(app)
        .post('/api/v1/entries')
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status');
          expect(res.body.message).to.equal('success');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.include({ userId: 1000 });
          expect(res.body.data).to.be.an('object');
          expect(res.body.message).to.equal('New diary entry created successfully');
          done();
        });
    });

    it('should GET entries object with one entry', (done) => {
      chai.request(app)
        .get('/api/v1/entries')
        .type('form')
        .end((err, res) => {
          expect(res).to.have(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(Object.keys(res.body.data)).to.have.lengthOf(1);
          expect(res.body.message).to.be.equal('Request gotten sucessfully');
          done();
        });
    });

    it('it should POST a diary entry', (done) => {
      const entry = {
        date: '2nd may 2010',
        time: '9:00 PM',
        userId: 3000,
        title: 'I woke up late',
        description: 'On this day, I woke up late. I could not believe it',
      };
      chai.request(app)
        .post('/api/v1/entries')
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.include({ userId: 3000 });
          expect(res.body.message).to.equal('New diary entry created successfully');
          done();
        });
    });

    it('should GET entries object with two entries', (done) => {
      chai.request(app)
        .get('/api/v1/entries')
        .type('form')
        .end((err, res) => {
          expect(res).to.have(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(Object.keys(res.body.data)).to.have.lengthOf(2);
          expect(res.body.message).to.be.equal('Request gotten sucessfully');
          done();
        });
    });
  });

  describe('/api/v1/entries/:entryId', () => {
    it('should GET entries object with one entry', (done) => {
      chai.request(app)
        .get('/api/v1/entries/1')
        .type('form')
        .end((err, res) => {
          expect(res).to.have(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(Object.keys(res.body.data)).to.have.lengthOf(1);
          expect(res.body.message).to.be.equal('Request gotten sucessfully');
          done();
        });
    });

    it('should GET entries object with one entry', (done) => {
      chai.request(app)
        .get('/api/v1/entries/10')
        .type('form')
        .end((err, res) => {
          expect(res.status).to.have(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.be.equal('fail');
          expect(res.body.error.message).to.be.equal('Diary entry cannot be found');
          done();
        });
    });

    it('it should PUT (update) a specific diary entry', (done) => {
      const entry = {
        date: '3rd may 2010',
        time: '1:00 AM',
        userId: 3000,
        title: 'I woke up late',
        description: 'I woke up late. I could not believe it',
      };
      chai.request(app)
        .put('/api/v1/entries/2')
        .send(entry)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body.message).to.equal('request updated successfully');
          expect(res.body.status).to.be.equal('success');
          done();
        });
    });
  });
});
