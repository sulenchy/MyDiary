import express from 'express';
import entriesController from '../controllers/entries';
import usersController from '../controllers/users.';
import validateUser from '../middlewares/userValidation';
import validateEntry from '../middlewares/entryValidation';
import validateUserEmail from '../middlewares/checkEmail';
import authenticatedUserLogin from '../middlewares/authenticateUser';


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200)
    .send('Welcome to MyDiary');
});


router.post('/entries', authenticatedUserLogin.authenticateUser, validateEntry.validateCreateEntryInput, entriesController.createEntry);
router.get('/entries/:id', authenticatedUserLogin.authenticateUser, entriesController.getEntry);
router.delete('/entries/:id', authenticatedUserLogin.authenticateUser, entriesController.deleteEntry);
router.put('/entries/:id', authenticatedUserLogin.authenticateUser, validateEntry.validateCreateEntryInput, entriesController.updateEntry);
router.get('/entries', authenticatedUserLogin.authenticateUser, entriesController.getAllEntry);
router.post('/auth/signup', validateUserEmail.checkEmail, validateUser.validateSignupInput, usersController.signupUser);
router.put('/user', authenticatedUserLogin.authenticateUser, validateUser.validateUpdateInput, usersController.updateUser);
router.get('/user', authenticatedUserLogin.authenticateUser, usersController.getUser);
router.get('/users', usersController.getUsers);
router.post('/auth/login', usersController.loginUser);


export default router;
