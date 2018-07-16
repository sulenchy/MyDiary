import entriesHelper from '../helpers/entries.helper';

export default class entriesController {
  static getAllEntries(req, res) {
    entriesHelper.getAllEntries()
      .then((entries) => {
        if (Object.keys(entries).length === 0) {
          return res.status(200)
            .json({
              data: {
                entries,
                message: 'No dairy entry available currently',
              },
              status: 'success',
            });
        }

        return res.status(200)
          .json({
            data: {
              entries,
              message: 'Diary entries gotten successfully',
            },
            status: 'success',
          });
      })
      .catch((err) => {
        if (err) {
          return res.status(404)
            .json({
              error: {
                message: err.message,
              },
              status: 'fail',
            });
        }
      });
  }
}
