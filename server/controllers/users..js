import bcrypt from 'bcrypt';
import createToken from '../helpers/createToken';
import usersHelper from '../helpers/users';

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
      fullname, password, gender,
    } = req.body;
    const email = req.body.email.toLowerCase();
    usersHelper.signupUser(fullname, email, password, gender)
      .then(newUser => res.status(201).json({
        user: {
          id: newUser.rows[0].id,
          fullname,
          email,
          gender,
          notification: newUser.rows[0].notification,
          role: newUser.rows[0].role,
          token: createToken(newUser.rows[0].id),
        },
        message: 'New user created successfully',
      }))
      .catch(err => res.status(500)
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
    const email = !req.body.email ? req.body.email : req.body.email.toLowerCase();
    const { password } = req.body;
    usersHelper.loginUser(email)
      .then((user) => {
        if (user.rowCount === 0) {
          return res.status(404)
            .json({
              message: 'User not found. Please, register now',
            });
        }
        if (!bcrypt.compareSync(password.trim(), user.rows[0].password)) {
          return res.status(401)
            .json({
              message: 'Password or username is incorrect. Please try again',
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
      .catch(() => {
        res.status(500)
          .json({
            error: {
              message: 'Sorry, an error occurred',
            },
          });
      });
  }
}
