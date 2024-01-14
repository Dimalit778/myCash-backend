import express from 'express';

import {
  registerUser,
  authUser,
  logoutUser,
  getAll,
  getUser,
  updateUser,
  googleAuthFB,
} from '../controllers/userController.js';

import { uploadImage } from '../controllers/imageController.js';

import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//GET/api/v1/users/getAll/:ID
router.get('/getAll', getAll);

//PUT/api/v1/users/updateUser/:ID
router.patch('/updateUser/:id', verifyToken, updateUser);

//GET/api/v1/users/getOne/:ID
router.get('/getOne/:id', getUser);

//POST/api/v1/users/REGISTER
router.post('/register', registerUser);

//POST/api/v1/users/LOGIN
router.post('/login', authUser);

//POST/api/v1/users/LOGOUT
router.post('/logout', logoutUser);

router.post('/uploadImage', uploadImage);
router.post('/googleAuthFB', googleAuthFB);

// router.get('/verifyUser', verifyToken);

export default router;
