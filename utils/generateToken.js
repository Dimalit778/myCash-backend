import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// --- Generate access Token
export const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT, {
    expiresIn: '30m',
  });

  res.cookie('token', token, {
    path: '/',
    expires: new Date(Date.now() + 10000 * 30),
    // secure: true, // Use secure cookies in production
    httpOnly: true,
    sameSite: 'None', // Prevent CSRF attacks
  });
};
// --- Generate refresh Token
export const generateRefreshToken = (res, id) => {
  const refToken = jwt.sign({ id }, process.env.REFRESH_JWT, {
    expiresIn: '30d',
  });
  res.cookie('refToken', refToken, {
    path: '/',
    httpOnly: true,
    secure: true, // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    secure: true, // Use secure cookies in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
