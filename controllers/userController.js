import User from '../models/userSchema.js';
import Income from '../models/incomeSchema.js';
import Expense from '../models/expenseSchema.js';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../middleware/errorMiddleware.js';
import cloudinary from '../cloudinary.js';

//? ---- >  < GET ALL > users
// route   GET /api/users/getAll
const getAll = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) return res.status(404).send({ message: 'User not found' });
  if (!user?.isAdmin)
    return res.status(404).send({ message: 'Not authorized' });
  const allUsers = await User.find({ isAdmin: false });

  return res.status(200).send(allUsers);
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
//? ---- >   Delete user and his Transactions
const deleteUser = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  try {
    const deleteIncomes = await Income.deleteMany({ user: id });
    const deleteExpenses = await Expense.deleteMany({ user: id });
    const deleteUser = await User.findByIdAndDelete(id);
    if (deleteUser.imageUrl)
      await cloudinary.uploader.destroy(deleteUser.imageUrl);

    if (deleteExpenses && deleteIncomes && deleteUser) {
      return res.status(200).json('All user data has been deleted');
    }
  } catch (err) {
    return res.status(200).json({ message: err.message });
  }
});

export { getAll, updateUser, getUser, logoutUser, deleteUser };
