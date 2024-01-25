import express from 'express';

import {
  logoutUser,
  getAll,
  getUser,
  updateUser,
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

//POST/api/v1/users/LOGOUT
router.post('/logout', logoutUser);

router.post('/uploadImage', uploadImage);

// router.get('/verifyUser', verifyToken);

export default router;
