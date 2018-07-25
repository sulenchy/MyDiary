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
  password VARCHAR(50) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  passportUrl VARCHAR(255) NOT NULL,
  notification BOOLEAN NOT NULL,
  role status DEFAULT 'user');
INSERT INTO users(fullname,email,password,gender,passportUrl,notifcation,role)
VALUES ('ABUDU ABIODUN SULAIMAN,'sulaiman@gmail.com','${hashedPassword}','sulaiman.jpg', true,'admin');`;


const entrySeed = `
DROP TABLE IF EXISTS diaryEntries CASCADE;
CREATE TABLE requests(
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  entrydate date NOT NULL,
  title VARCHAR(50) NOT NULL,
  content VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id));
INSERT INTO requests(
  user_id,
  entrydate,
  title,
  content)
VALUES (1, '1', 'One with uber driver', 'On 4th of september 2017, I was late in the night and I needed to reach for a business. watch out!!!!');
INSERT INTO requests(
    user_id,
    entrydate,
    title,
    content)
  VALUES (2, '2', 'Amala with amala', 'Malaria drug named the name of a food. Amala is the name of one yoruba food');
  INSERT INTO requests(
    user_id,
    entrydate,
    title,
    content)
  VALUES (3, '3', 'God is good', 'Story of a man standing with God');
  INSERT INTO requests(
    user_id,
    entrydate,
    title,
    content)
  VALUES (4, '4', 'Being a landlord', 'Being a landlord is a serious business in lagos ...');`;


const queries = `${userSeed}${entrySeed}`;

export default queries;
