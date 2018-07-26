import bcrypt from 'bcrypt';
import connection from '../helpers/connection';


const client = connection();
client.connect();

/**
 * @class userController
 *
 * @export
 *
 */
export default class UsersController {
  /**
   * @description - Creates a new user
   * @static
   *
   * @param {object} request - HTTP Request
   * @param {object} response- HTTP Response
   *
   * @memberof userController
   *
   */
  static signupUser(req, res) {
    const password = bcrypt.hashSync(req.body.password.trim(), 10);
    const {
      fullname,
      email,
      gender,
    } = req.body;

    const user = `
    INSERT INTO users (
        fullname,
        email,
        password,
        gender
    )
    VALUES (
      '${fullname}',
      '${email}',
      '${password}',
      '${gender}'
    ) RETURNING *;`;
    client.query(user)
      .then((newUser) => {
        return res.status(201)
          .json({
            data: {
              user: {
                id: newUser.rows[0].id,
                fullname,
                email,
                gender,
                notification: newUser.rows[0].notification,
                role: newUser.rows[0].role,
              },
            },
            message: 'user created successfully',
            status: 'success',
          });
      }).catch((err) => {
        res.status(500).send(err);
      });
  }
}
