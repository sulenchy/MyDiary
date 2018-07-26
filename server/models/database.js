import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


dotenv.config();

const hashedPassword = bcrypt.hashSync(process.env.H_PASSWORD, 10);

const userSeed = `
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS status;
CREATE TYPE status AS ENUM('user','admin');
CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  passportUrl VARCHAR(255) NOT NULL,
  notification BOOLEAN NOT NULL,
  role status DEFAULT 'user');
INSERT INTO users(fullname,email,password,gender,passportUrl,notification,role)
VALUES ('ABUDU ABIODUN SULAIMAN','sulaiman@gmail.com','${hashedPassword}','male','sulaiman.jpg','true','admin');`;


const entrySeed = `
DROP TABLE IF EXISTS entries CASCADE;
CREATE TABLE entries(
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  entrydate date NOT NULL,
  title VARCHAR(50) NOT NULL,
  content VARCHAR(255) NOT NULL,
  FOREIGN KEY (userid) REFERENCES users(id));
  INSERT INTO entries(
    userid,
    entrydate,
    title,
    content)
  VALUES (1, '1999-01-08', 'Being a landlord', 'Being a landlord is a serious business in lagos ...');`;


const queries = `${userSeed}${entrySeed}`;

export default queries;