import connection from './connection';

const client = connection();
client.connect();

export default class EntriesHelper {
  /**
   * @description create new entry
   *
   * @param {*} userid
   * @param {*} title
   * @param {*} content
   *
   * @memberOf EntriesHelper Class
   */

  static createEntry(userid, title, content) {
    const entry = `INSERT INTO entries (userid, title, content) VALUES (${userid},'${title}','${content}') RETURNING *;`;
    return new Promise((resolve, reject) => {
      const data = client.query(entry);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, New entry cannot be created',
        }));
      }
    });
  }

  /**
 * @description get all entries for a particular user
 *
 * @param {*} userid
 *
 * @memberOf EntriesHelper Class
 */
  static getAllEntry(userid) {
    const entries = `SELECT id, title, content, created, edited, TO_CHAR(created :: DATE, 'Mon dd, yyyy') as date FROM entries WHERE userid= ${userid} ORDER BY date desc;`;

    return new Promise((resolve, reject) => {
      const data = client.query(entries);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, No entry is currently available for the user',
        }));
      }
    });
  }

  /**
   * @description get an entry for a user
   *
   * @param {*} userid
   * @param {*} id
   *
   * @memberOf EntriesHelper Class
   */
  static getEntry(userid, id) {
    const entry = `SELECT id, title, content FROM entries WHERE USERID=${userid} AND id=${id}`;
    return new Promise((resolve, reject) => {
      const data = client.query(entry);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Entry not found',
        }));
      }
    });
  }

  /**
   * @description updates a given entry
   *
   * @param {*} userid
   * @param {*} id
   * @param {*} title
   * @param {*} content
   *
   * @memberOf EntriesHelper Class
   */
  static updateEntry(userid, id, title, content) {
    const entry = `UPDATE entries SET title = '${title}', content = '${content}' WHERE userid = ${userid} AND id = ${id}`;
    return new Promise((resolve, reject) => {
      const data = client.query(entry);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Entry not found',
        }));
      }
    });
  }

  /**
   * @description deletes a given entry for a user
   *
   * @param {*} userId
   * @param {*} id
   *
   * @memberOf EntriesHelper
   */
  static deleteEntry(userId, id) {
    const deleteEntrySql = `DELETE FROM entries where userid = ${userId} AND id = ${id}`;
    return new Promise((resolve, reject) => {
      const data = client.query(deleteEntrySql);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Error encountered during delete operation',
        }));
      }
    });
  }
}
