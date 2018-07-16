import express from 'express';
import entriesController from '../controllers/entries.controller';


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200)
    .send('Welcome to my Diary');
});

router.get('/entries', entriesController.getAllEntries);


export default router;
