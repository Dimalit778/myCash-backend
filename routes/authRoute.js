import express from 'express';
import {
  googleAuth,
  login,
  register,
  verifyEmail,
} from '../controllers/authController.js';

const router = express.Router();

// POST -- /api/v1/auth/register
router.post('/register', register);

//POST -- /api/v1/users/login
router.post('/login', login);

//POST -- /api/v1/auth/googleAuth
router.post('/googleAuth', googleAuth);

//POST -- /api/v1/auth/verify-email
router.post('/verify-email', verifyEmail);

export default router;
