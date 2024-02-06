import User from '../models/userSchema.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../middleware/errorMiddleware.js';

//? ---- >  < GET ALL > users
// route   GET /api/users/getAll
const getAll = asyncHandler(async (req, res) => {
  const result = await User.find();
  res.send(result);
});
// ----------------------------------------------------------------- //
//? ---- >  <GET ONE> user
// route   GET /api/users/getUser
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const result = await User.findById(userId);

  res.send({ Users: result });
});
// ----------------------------------------------------------------- //
//? ---- >  < UPDATE > user
//route   PATCH /api/users/updateUser
const updateUser = asyncHandler(async (req, res, next) => {
  if (req.user !== req.params.id)
    return next(errorHandler(401, ' You can only update your own account'));
  try {
    const updateUser = await User.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      { new: true }
    );
    if (req.body.password) {
      await updateUser.save();
    }

    const { password, ...rest } = updateUser;
    if (updateUser) return res.status(200).json(updateUser);
  } catch (err) {
    next(err);
  }
});
// ----------------------------------------------------------------- //
//? ---- >   < LOGOUT > user / clear cookie
// route   POST /api/users/logout
const logoutUser = (req, res) => {
  res.cookie('access_token', '');
  res.cookie('refresh_token', '');
  res.status(200).json({ message: 'Logged out successfully' });
};

export { getAll, updateUser, getUser, logoutUser };
