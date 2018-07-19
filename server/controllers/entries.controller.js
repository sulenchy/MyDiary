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
              },
              message: 'No dairy entry available currently',
              status: 'success',
            });
        }

        return res.status(200)
          .json({
            data: {
              entries,
              Total: entries.length,
            },
            message: 'Diary entries gotten successfully',
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

  static getDiaryEntryById(req, res) {
    const { id } = req.params;
    entriesHelper.getDiaryEntryById(id)
      .then((entry) => res.status(200)
          .json({
            data: {
              entry,
            },
            message: 'Diary entry gotten successfully',
            status: 'success',
          }))
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

  static addNewDiaryEntry(req, res) {
    const {
      date,
      time,
      userId,
      title,
      description,
    } = req.body;

    entriesHelper.addNewDiaryEntry(date, time, userId, title, description)
      .then((newEntry) => {
        if (newEntry === undefined) {
          return res.status(400)
            .json({
              message: 'Invalid diary entry',
              status: 'fail',
            });
        }
        return res.status(201)
          .json({
            data: {
              Entry: newEntry,
            },
            message: 'New diary entry created successfully',
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

  static updateDiaryEntry(req, res) {
    const { ...update } = req.body;
    const { id } = req.params;
    entriesHelper.updateDiaryEntry(id, update)
      .then((updatedEntry) => {
        return res.status(200)
          .json({
            data: {
              Entry: updatedEntry,
            },
            message: 'Diary entry updated successfully',
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
