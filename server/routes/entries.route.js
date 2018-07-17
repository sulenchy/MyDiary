import express from 'express';
import entriesController from '../controllers/entries.controller';


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200)
    .send('Welcome to my Diary');
});

router.get('/entries', entriesController.getAllEntries);
router.get('/entries/:id', entriesController.getDiaryEntryById);
router.post('/entries', entriesController.addNewDiaryEntry);
router.put('/entries/:id', entriesController.updateDiaryEntry);

export default router;
