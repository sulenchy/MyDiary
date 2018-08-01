import connection from './connection';

const client = connection();
client.connect();


export default class EntriesHelper {
  
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

  static getEntry(userid, id) {
    const entry = `SELECT id, title, content FROM entries WHERE userid= ${userid} AND id= ${id};`;
    return new Promise((resolve, reject) => {
      const data = client.query(entry);
      if (data) {
        resolve(data);
      } else {
        reject(new Error({
          message: 'Sorry, entry not found',
        }));
      }
    });
  }
}
