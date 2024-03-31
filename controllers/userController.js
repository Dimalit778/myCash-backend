import User from '../models/userSchema.js';
import Income from '../models/incomeSchema.js';
import Expense from '../models/expenseSchema.js';
import asyncHandler from 'express-async-handler';
// import bcrypt from 'bcryptjs';
import { errorHandler } from '../middleware/errorMiddleware.js';
import cloudinary from '../cloudinary.js';

//? ---- >  < GET ALL > users
// route   GET /api/users/getAll
const getAll = asyncHandler(async (req, res) => {
  const userId = req.id;
  const user = await User.findById(userId);
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
  const userId = req.id;
  const user = await User.findById(userId);

  res.status(200).json({
    name: user.name,
    email: user.email,
    isVerified: user?.isVerified,
    isAdmin: user?.isAdmin,
  });
});
// ----------------------------------------------------------------- //
//? ---- >  < UPDATE > user
//route   PATCH /api/users/updateUser
const updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.id;
  try {
    const updateUser = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      req.body,
      { new: true }
    );
    if (req.body.password) {
      await updateUser.save();
    }

    const { password, ...rest } = updateUser;
    if (updateUser)
      return res.status(200).json({
        name: updateUser.name,
        email: updateUser.email,
        isVerified: updateUser?.isVerified,
        isAdmin: updateUser?.isAdmin,
        imageUrl: updateUser?.imageUrl,
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
// ----------------------------------------------------------------- //
//? ---- >   < LOGOUT > user / clear cookie
// route   POST /api/users/logout
const logoutUser = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refToken');

  res.status(200).json({ message: 'Logged out successfully' });
};
//? ---- >   Delete user and his Transactions
const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const userId = req.id;

  let deleteId = '';
  if (id) {
    deleteId = id;
  } else {
    deleteId = userId;
  }

  try {
    const deleteIncomes = await Income.deleteMany({ user: deleteId });
    const deleteExpenses = await Expense.deleteMany({ user: deleteId });
    const deleteUser = await User.findByIdAndDelete(deleteId);
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
