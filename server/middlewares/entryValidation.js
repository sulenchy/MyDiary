import Validate from 'validatorjs';

/**
 * @class Validate User SIgn In and Sign Up input
 */
export default class ValidateEntry {
  /**
     * validate user sign up input string
     *
     * @param {Object} request
     * @param {Object} response
     * @param {Function} next
     *
     * @return {Object}
     */
  static validateCreateEntryInput(req, res, next) {
    const {
      title, content,
    } = req.body;
    const data = {
      title, content,
    };
    const rules = {
      title: ['required', 'regex:/^[a-z\\d\\-_,.*()!\\s]+$/i', 'min:3', 'max:50', 'string'],
      content: ['required', 'regex:/^[a-z\\d\\-_,.*()!\\s]+$/i', 'min:10', 'max:255', 'string'],
    };
    const validations = new Validate(data, rules, {
      'min.title': 'The :attribute must not be less than 3 characters.',
      'max.title': 'The :attribute must not be greater than 50 characters.',
      'min.content': 'The :attribute must not be less than 10 characters.',
      'max.content': 'The :attribute must not be greater than 255 characters.',
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
