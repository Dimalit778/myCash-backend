import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userSchema.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT);
      req.user = await User.findById(decoded.userId).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});
