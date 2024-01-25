import User from '../models/userSchema.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../middleware/errorMiddleware.js';

// ---- >  Get all users
// @route   GET /api/users/getAll
const getAll = asyncHandler(async (req, res) => {
  const result = await User.find();
  res.send(result);
});

// ---- >  Get User
// @route   GET /api/users/getUser
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const result = await User.findById(userId);

  res.send({ Users: result });
});

// ---- >  Update User
// @route   PATCH /api/users/updateUser
const updateUser = asyncHandler(async (req, res, next) => {
  if (req.user !== req.params.id)
    return next(errorHandler(401, ' You can only update your own account'));

  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          imageUrl: req.body.imageUrl,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser;
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// ---- >   Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('access_token', '');
  res.cookie('refresh_token', '');
  res.status(200).json({ message: 'Logged out successfully' });
};

// ---- >   Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export { getAll, updateUser, getUser, logoutUser, updateUserProfile };
