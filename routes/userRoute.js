import express from 'express';

import {
  logoutUser,
  getAll,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

import { deleteImage, uploadImage } from '../controllers/imageController.js';

import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

//@ GET ALL
// GET/api/users/getAll
router.get('/getAll', verifyToken, getAll);

//@ UPDATE USER
// PUT/api/users/updateUser
router.patch('/updateUser', verifyToken, updateUser);

//@ GET ONE USER
// GET/api/users/getOne
router.get('/getUser', verifyToken, getUser);

//@ LOGOUT
// POST/api/users/LOGOUT
router.post('/logout', logoutUser);

//@ UPLOAD IMAGE
// POST/api/users/uploadImage
router.post('/uploadImage', uploadImage);

//@ DELETE IMAGE FROM CLOUDINARY DATABASE
// POST/api/users/uploadImage
router.post('/deleteImage', deleteImage);

//@ DELETE USER
router.post('/deleteUser', verifyToken, deleteUser);

export default router;
