import connection from '../helpers/connection';

const client = connection();
client.connect();

/**
 * @class Validate User Email
 */
export default class ValidateUserEmail {
/**
   * validate Request input string
   *
   * @param {Object} request
   * @param {Object} response
   *
   * @param {Function} done
   *
   * @return {Object}
   */
  static checkEmail(req, res, next) {
    const { email } = req.body;
    const mailCheck = `
      SELECT * FROM users WHERE email = '${email}'`;
    client.query(mailCheck)
      .then((foundEmail) => {
        if (foundEmail.rows[0]) {
          return res.status(409)
            .json({
              message: 'Email already exists',
            });
        }
        return next();
      }).catch(err => res.status(500).send(err.message));
  }
}
