import bcrypt from 'bcrypt';
import connection from './connection';

const client = connection();
client.connect();

export default class EntriesHelper {
  static signupUser(fullname, email, password, gender) {
    const hashedPassword = bcrypt.hashSync(`${password}`, 10);
    const user = `INSERT INTO users (fullname,email,password,gender) VALUES ('${fullname}','${email}','${hashedPassword}','${gender}') RETURNING *;`;
    return new Promise((resolve, reject) => {
      const data = client.query(user);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, New user cannot be created',
        }));
      }
    });
  }

  static loginUser(email) {
    const user = `SELECT * FROM users where email = '${email}';`;
    return new Promise((resolve, reject) => {
      const data = client.query(user);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, user does not exist',
        }));
      }
    });
  }
}
