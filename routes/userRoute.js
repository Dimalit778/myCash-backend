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

//@ GET ALL
// GET/api/users/getAll
router.get('/getAll', getAll);

//@ UPDATE USER
// PUT/api/users/updateUser/:ID
router.patch('/updateUser/:id', verifyToken, updateUser);

//@ GET ONE USER
// GET/api/users/getOne/:ID
router.get('/getOne/:id', getUser);

//@ LOGOUT
// POST/api/users/LOGOUT
router.post('/logout', logoutUser);

//@ UPLOAD IMAGE
// POST/api/users/uploadImage
router.post('/uploadImage', uploadImage);

// router.get('/verifyUser', verifyToken);

export default router;
