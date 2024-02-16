import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { errorHandler } from './errorMiddleware.js';
import { generateToken } from '../utils/generateToken.js';

//?  --- Verify Token
export const verifyToken = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    if (renewToken(req, res)) {
      return next();
    }
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(accessToken, process.env.JWT, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));
    req.user = user.id;

    next();
  });
});
// //?  --- Re New Token
export const renewToken = (req, res) => {
  let exists = false;
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) return res.status(401).send('Refresh token invalid');

  jwt.verify(refreshToken, process.env.REFRESH_JWT, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    generateToken(res, user.id);

    exists = true;
  });
  return exists;
};
