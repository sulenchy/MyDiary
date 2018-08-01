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
    const userid = req.token.user;
    entriesHelper.createEntry(userid, title, content)
      .then(newEntry => res.status(201).json({
        user: {
          id: newEntry.rows[0].id,
          title,
          content,
          created: newEntry.rows[0].created,
          edited: newEntry.rows[0].edited,
        },
        message: 'New entry created successfully',
      }))
      .catch((err) => {
        res.status(404)
          .json({
            error: {
              message: err.message,
            },
          });
      });
  }

  /* @description - Creates a new entry
 * @static
 *  *
 * @param {object} request - HTTP Request
 * @param {object} response- HTTP Response
 *
 * @memberof EntryController
 *
 */
  static getAllEntry(req, res) {
    const userid = req.token.user;
    entriesHelper.getAllEntry(userid)
      .then(entries => res.status(200).json({
        data: {
          entries: entries.rows,
          length: entries.rowCount,
        },
        message: 'Diary entries gotten successfully',
      }))
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
