import entriesHelper from '../helpers/entries';

export default class EntriesController {
/* @description - Creates a new entry
 * @static
 *  *
 * @param {object} request - HTTP Request
 * @param {object} response- HTTP Response
 *
 * @memberof EntriesController
 *
 */
  static createEntry(req, res) {
    const {
      title, content,
    } = req.body;
    const userid = req.token.user;
    entriesHelper.createEntry(userid, title, content)
      .then(newEntry => res.status(201).json({
        NewEntry: {
          id: newEntry.rows[0].id,
          title,
          content,
          created: newEntry.rows[0].created,
          edited: newEntry.rows[0].edited,
        },
        message: 'New entry created successfully.',
      }))
      .catch((err) => {
        res.status(500)
          .json({
            error: {
              message: err.message,
            },
          });
      });
  }

  /* @description - gets all entries
 * @static
 *  *
 * @param {object} request - HTTP Request
 * @param {object} response- HTTP Response
 *
 * @memberof EntriesController
 *
 */
  static getAllEntry(req, res) {
    const userid = req.token.user;
    entriesHelper.getAllEntry(userid)
      .then((entries) => {
        if (entries.rowCount === 0) {
          return res.status(404).json({
            message: 'No entry is found',
          });
        }
        return res.status(200).json({
          entries: entries.rows,
          length: entries.rowCount,
          message: 'Diary entries gotten successfully',
        });
      })
      .catch((err) => {
        res.status(500)
          .json({
            error: {
              message: err.message,
            },
          });
      });
  }

  /* @description - Get an entry
  * @static
  *  *
  * @param {object} request - HTTP Request
  * @param {object} response- HTTP Response
  *
  * @memberof EntriesController
  *
  */
  static getEntry(req, res) {
    const userid = req.token.user;
    const id = parseInt(req.params.id, 10);
    entriesHelper.getEntry(userid, id)
      .then(entries => res.status(200).json({
        entry: entries.rows,
        length: entries.rowCount,
        message: 'Diary entry gotten successfully',
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
