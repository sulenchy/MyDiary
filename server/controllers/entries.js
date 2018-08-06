import entriesHelper from '../helpers/entries';
import usersHelper from '../helpers/users';

export default class EntriesController {
/**
 * @description create new entry
 *
 * @param {Obeject} req
 * @param {Object} res
 *
 * @memberOf Entries Controller
 */
  static createEntry(req, res) {
    const {
      title, content,
    } = req.body;
    const userid = req.token.user;
    usersHelper.getUserById(userid)
      .then((user) => {
        if (user.rows.length <= 0) {
          return res.status(401)
            .json({
              error: {
                message: 'Sorry, user doesn\'t exist',
              },
            });
        }

        return entriesHelper.createEntry(userid, title, content)
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
          .catch(() => {
            res.status(500)
              .json({
                error: {
                  message: 'Sorry, an error occurred',
                },
              });
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

  /**
  * @description get all entries
  *
  * @param {*} req
  * @param {*} res
  *
  * @memberOf EntriesController Class
  */
  static getAllEntry(req, res) {
    const userid = req.token.user;
    entriesHelper.getAllEntry(userid)
      .then((entries) => {
        if (entries.rowCount === 0) {
          return res.status(200).json({
            message: 'No entry. Pls, add one now',
          });
        }
        return res.status(200).json({
          entries: entries.rows,
          length: entries.rowCount,
          message: 'Diary entries gotten successfully',
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

  /**
   * @description get an entry for a user
   *
   * @param {*} req
   * @param {*} res
   *
   * @memberOf EntriesController Class
   */
  static getEntry(req, res) {
    const userid = req.token.user;
    const id = parseInt(req.params.id, 10);
    entriesHelper.getEntry(userid, id)
      .then((entry) => {
        if (entry.rowCount === 0) {
          return res.status(404).json({
            message: 'No Entry is found',
          });
        }
        return res.status(200).json({
          entry: entry.rows,
          message: 'Diary entry gotten successfully',
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


  static updateEntry(req, res) {
    const userid = req.token.user;
    const {
      title, content,
    } = req.body;
    const id = parseInt(req.params.id, 10);
    entriesHelper.updateEntry(userid, id, title, content)
      .then((entry) => {
        if (entry.rowCount === 0) {
          return res.status(403).json({
            message: 'Entry cannot be updated by you',
          });
        }
        return res.status(200).json({
          message: 'Diary entry updated successfully',
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

  static deleteEntry(req, res) {
    const userId = req.token.user;

    const id = parseInt(req.params.id, 10);

    entriesHelper.deleteEntry(userId, id)
      .then((entry) => {
        if (entry.rowCount === 0) {
          return res.status(403).json({
            message: 'Entry cannot be deleted by you',
          });
        }
        return res.status(200).json({
          message: 'Diary entry deleted successfully',
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
