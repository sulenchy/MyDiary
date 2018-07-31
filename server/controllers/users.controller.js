import bcrypt from 'bcrypt';
import createToken from '../helpers/createToken';
import usersHelper from '../helpers/users.helper';

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
 *  *
 * @param {object} request - HTTP Request
 * @param {object} response- HTTP Response
 *
 * @memberof userController
 *
 */
  static signupUser(req, res) {
    const {
      fullname, email, password, gender,
    } = req.body;
    usersHelper.signupUser(fullname, email, password, gender)
      .then(newUser => res.status(201).json({
        data: {
          user: {
            id: newUser.rows[0].id,
            fullname,
            email,
            gender,
            notification: newUser.rows[0].notification,
            role: newUser.rows[0].role,
          },
          token: createToken(newUser.rows[0].id),
        },
        message: 'user created successfully',
      }))
      .catch(err => res.status(404)
        .json({
          error: {
            message: err.message,
          },
        }));
  }

  /**
 * @description - Logs in an existing user
 * @static
 *  *
 * @param {object} request - HTTP Request
 * @param {object} response- HTTP Response
 *
 * @memberof userController
 *
 */
  static loginUser(req, res) {
    const {
      email, password,
    } = req.body;
    usersHelper.loginUser(email)
      .then((user) => {
        if (!bcrypt.compareSync(password.trim(), user.rows[0].password)) {
          return res.status(401)
            .json({
              message: 'Password is incorrect. Please try again',
            });
        }
        return res.status(200).json({
          data: {
            user: {
              id: user.rows[0].id,
              email,
            },
            token: createToken(user.rows[0].id),
          },
          message: 'User logged in successfully',
        });
      })
      .catch((err) => {
        res.status(404)
          .json({
            error: {
              message: err.message,
            },
          });
      });
  }
}
