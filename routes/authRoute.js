import express from 'express';
import {
  forgotPassword,
  googleAuth,
  login,
  register,
  renderSite,
  resetPassword,
  verifyEmail,
  verifyLink,
} from '../controllers/authController.js';

const router = express.Router();
router.get('/renderSite/:id', renderSite);

//@ ----> REGISTER
// POST -- /api/auth/register
router.post('/register', register);

//@ ---->LOGIN
//POST -- /api/users/login
router.post('/login', login);

//@ ----> GOOGLE AUTH
//POST -- /api/auth/googleAuth
router.post('/googleAuth', googleAuth);

//@ ----> VERIFY EMAIL
//POST -- /api/auth/verify-email
router.post('/verify-email/:emailToken', verifyEmail);

//@ ----> FORGOT PASSWORD
//POST -- /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

//@ ----> VERIFY RESET LINK
//GET  -- /api/auth/forgot-password/:id/:token
router.get('/reset-password/:id/:token', verifyLink);

//@ ----> RESET PASSWORD
// POST -- /api/auth/reset-password/:id/:token
router.post('/reset-password/:id/:token', resetPassword);

export default router;
