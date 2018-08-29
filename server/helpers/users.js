import bcrypt from 'bcrypt';
import connection from './connection';

const client = connection();
client.connect();

export default class UsersHelper {
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
          message: 'Sorry, user does not exist. Please, register now.',
        }));
      }
    });
  }

  /**
   * @description get  a user
   *
   * @param {*} id
   *
   * @memberOf UsersHelper Class
   */
  static getUserById(id) {
    const user = `SELECT * FROM users where id = '${id}';`;
    return new Promise((resolve, reject) => {
      const data = client.query(user);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, user does not exist. Please, register now.',
        }));
      }
    });
  }

  /**
   * @description get  all user
   *
   *
   * @memberOf UsersHelper Class
   */
  static getUsers() {
    const user = 'SELECT * FROM users;';
    return new Promise((resolve, reject) => {
      const data = client.query(user);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, no user is available. check back later',
        }));
      }
    });
  }

  static updateUser(userid, fullname, email, gender, passportUrl, notification) {
    const user = `UPDATE users SET fullname = '${fullname}', email = '${email}', gender = '${gender}', passporturl = '${passportUrl}', notification = '${notification}' WHERE id = ${userid}  RETURNING *;`;
    return new Promise((resolve, reject) => {
      const data = client.query(user);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, user profile cannot be updated',
        }));
      }
    });
  }
}
