import jwt from 'jsonwebtoken';
import { errorHandler } from './errorMiddleware.js';
import { generateToken } from '../utils/generateToken.js';

//?  --- Verify Token
export const verifyToken = (req, res, next) => {
  console.log('---- verifyToken ----');
  const { token, refToken } = req.cookies;

  if (token) {
    jwt.verify(String(token), process.env.JWT, (err, user) => {
      if (err) {
        next();
      }

      req.id = user.id;
    });
  } else {
    jwt.verify(String(refToken), process.env.REFRESH_JWT, (err, user) => {
      if (err) return next(errorHandler(403, 'Token Expired'));
      generateToken(res, user.id);
      req.id = user.id;
    });
  }

  next();
};
