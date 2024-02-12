import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
// --- Generate access Token
export const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT, {
    expiresIn: '1d',
  });

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 60000, // 30 days
  });
};
// --- Generate refresh Token
export const generateRefreshToken = (res, id) => {
  const refresh_token = jwt.sign({ id }, process.env.REFRESH_JWT, {
    expiresIn: '10d',
  });
  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict', // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
