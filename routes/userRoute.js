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

// import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/getAll', getAll);
router.patch('/updateUser/:id', updateUser);
router.get('/getOne/:id', getUser);
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

router.post('/uploadImage', uploadImage);
router.post('/googleAuthFB', googleAuthFB);

// router.get('/verifyUser', verifyToken);

export default router;
