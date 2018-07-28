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
          token: createToken(newUser.rows[0]),
        },
        message: 'user created successfully',
        status: 'success',
      }))
      .catch(err => res.status(404)
        .json({
          error: {
            message: err.message,
          },
          status: 'fail',
        }));
  }
}
