import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secretKey = process.env.JWT_SECRET;

/**
 * @class Authenticate User
 */
export default class AuthenticateUserLogin {
  /**
     * Authenticate Get All Requests
     *
     * @param {Object} request
     * @param {Object} response
     *
     * @param {Function} next
     *
     * @return {Object}
     */
  static authenticateUser(req, res, next) {
    try {
      const token = req.headers['x-access'] || req.headers.token || req.query.token;
      const verifiedToken = jwt.verify(token, secretKey);
      req.token = verifiedToken;
      return next();
    } catch (error) {
      return res.status(401).json({
        status: 'failure',
        message: 'User is unauthorized',
      });
    }
  }
}
