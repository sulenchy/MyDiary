import dotenv from 'dotenv';

// const Cryptr = require('cryptr');
// const cryptr = new Cryptr('myTotalySecretKey');
// const encryptedString = cryptr.encrypt('bacon');

dotenv.config();

const user = `
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS status;
CREATE TYPE status AS ENUM('user','admin');
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  visited DATE DEFAULT NOW(),
  passportUrl VARCHAR(255) DEFAULT 'https://goo.gl/eUu3Qw',
  notification BOOLEAN DEFAULT 'false',
  role status DEFAULT 'user');`;


const entry = `
DROP TABLE IF EXISTS entries CASCADE;
CREATE TABLE entries(
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  title VARCHAR(50) NOT NULL,
  content VARCHAR(255) NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Lagos',NOW()),
  edited TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Lagos',NOW()),
  FOREIGN KEY (userid) REFERENCES users(id));`;


const queries = `${user}${entry}`;

export default queries;
