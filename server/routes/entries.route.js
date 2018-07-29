import express from 'express';
import entriesController from '../controllers/entries.controller';
import usersController from '../controllers/users.controller';
import validateUser from '../middlewares/userValidation';
import validateUserEmail from '../middlewares/checkEmail';


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200)
    .send('Welcome to my Diary');
});

router.get('/entries', entriesController.getAllEntries);
router.get('/entries/:id', entriesController.getDiaryEntryById);
router.post('/entries', entriesController.addNewDiaryEntry);
router.put('/entries/:id', entriesController.updateDiaryEntry);
router.post('/auth/signup', validateUserEmail.checkEmail, validateUser.validateSignupInput, usersController.signupUser);
router.post('/auth/login', usersController.loginUser);

export default router;
