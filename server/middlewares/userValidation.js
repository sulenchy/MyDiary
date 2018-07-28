import Validate from 'validatorjs';

/**
 * @class Validate User SIgn In and Sign Up input
 */
export default class ValidateUser {
  /**
     * validate user sign up input string
     *
     * @param {Object} request
     * @param {Object} response
     * @param {Function} next
     *
     * @return {Object}
     */
  static validateSignupInput(req, res, next) {
    const {
      email, password, fullname, gender,
    } = req.body;
    const data = {
      email, password, fullname, gender,
    };
    const rules = {
      fullname: ['required', 'regex:/^[a-z\\d\\-_,.*()!\\s]+$/i', 'min:3', 'max:20', 'string'],
      email: 'required|email|string',
      password: 'required|min:8|max:30|string',
      gender: 'required|min:4|max:6|string',
    };
    const validations = new Validate(data, rules, {
      'min.password': 'The :attribute must not be less than 8 characters.',
      'max.password': 'The :attribute must not be greater than 30 characters.',
      'min.fullname': 'The :attribute must not be less than 3 characters.',
      'max.fullname': 'The :attribute must not be greater than 20 characters.',
    });
    if (validations.passes()) {
      return next();
    }
    return res.status(406).json({
      status: 'fail',
      data: { errors: validations.errors.all() },
    });
  }
}
