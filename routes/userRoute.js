import express from 'express';

import {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAll,
  getUser,
  updateUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { uploadImage } from '../controllers/imageController.js';
import {
  AllFirebaseUsers,
  FirebaseAuth,
} from '../controllers/firebaseUsersController.js';

const router = express.Router();

router.get('/getAll', getAll);
router.patch('/updateUser/:id', updateUser);
router.get('/getOne/:id', getUser);
router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

router.post('/uploadImage', uploadImage);
router.post('/firebaseAuth', FirebaseAuth);
router.get('/allFirebaseUsers', AllFirebaseUsers);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
