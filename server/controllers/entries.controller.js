import entriesHelper from '../helpers/entries.helper';

export default class EntriesController {
/* @description - Creates a new entry
 * @static
 *  *
 * @param {object} request - HTTP Request
 * @param {object} response- HTTP Response
 *
 * @memberof EntryController
 *
 */
  static createEntry(req, res) {
    const {
      title, content,
    } = req.body;
    const userid = req.token.data.id;
    entriesHelper.createEntry(userid, title, content)
      .then(newEntry => res.status(201).json({
        data: {
          user: {
            id: newEntry.rows[0].id,
            title,
            content,
            created: newEntry.rows[0].created,
            edited: newEntry.rows[0].edited,
          },
        },
        message: 'New entry created successfully',
        status: 'success',
      }))
      .catch((err) => {
        res.status(404)
          .json({
            error: {
              message: err.message,
            },
            status: 'fail',
          });
      });
  }
}
