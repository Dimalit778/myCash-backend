import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { errorHandler } from './errorMiddleware.js';
import { generateToken } from '../utils/generateToken.js';

//?  --- Verify Token
export const verifyToken = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    if (renewToken(req, res)) {
      console.log(renewToken);
      next();
    }
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(accessToken, process.env.JWT, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));
    req.user = user.id;
    console.log('verify true');

    next();
  });
});
//?  --- Re New Token
export const renewToken = (req, res) => {
  let exists = false;
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) return next(errorHandler(401, 'Unauthorized'));

  jwt.verify(accessToken, process.env.JWT, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));
    generateToken(req, user._id);
    exists = true;
    next();
  });
  return exists;
};
