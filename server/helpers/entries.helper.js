import dummyData from '../models/dummyData';


export default class entriesHelper {
  static getAllEntries() {
    return new Promise((resolve, reject) => {
      const data = dummyData.entries;
      if (data) {
        resolve(data);
      } else {
        reject({
          message: 'Request unsuccessful',
        });
      }
    });
  }

  static getDiaryEntryById(entryId) {
    return new Promise((resolve, reject) => {
      const data = dummyData.entries[entryId];
      if (data) {
        resolve(data);
      } else {
        reject({
          message: `Diary entry cannot be found`,
        });
      }
    });
  }
}
