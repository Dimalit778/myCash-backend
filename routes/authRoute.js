import express from 'express';
import {
  forgotPassword,
  googleAuth,
  login,
  register,
  resetPassword,
  verifyEmail,
} from '../controllers/authController.js';

const router = express.Router();

//? ----> REGISTER
// POST -- /api/v1/auth/register
router.post('/register', register);

//? ---->LOGIN
//POST -- /api/v1/users/login
router.post('/login', login);

//? ----> GOOGLE AUTH
//POST -- /api/v1/auth/googleAuth
router.post('/googleAuth', googleAuth);

//? ----> VERIFY EMAIL
//POST -- /api/v1/auth/verify-email
router.post('/verify-email', verifyEmail);

//? ----> FORGOT PASSWORD
//POST -- /api/v1/auth/forgot-password
router.post('/forgot-password', forgotPassword);

//? ----> RESET PASSWORD
//patch -- /api/v1/auth/reset-password
router.post('/reset-password', resetPassword);

export default router;
