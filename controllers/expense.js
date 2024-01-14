// import Expense from '../models/expenseSchema.js';
import asyncHandler from 'express-async-handler';
// import expenseSchema from '../models/expenseSchema.js';
import User from '../models/userSchema.js';

// { --- > Get All User Expense < --- }
////** @ method  -->  GET
////** @ route -->   GET = /api/transactions/getAll
export const getAllExpenses = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await Expense.find({ user: userId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
// ----------------------------------------------------------------- //
// { --- >   Get One Expense < --- }
////** @ method  --> GET
////** @route -->   /api/transactions/getExpense/:id
export const getExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  try {
    const result = await Expense.findOne({ _id: expenseId });

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'expense not found' });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});
// ----------------------------------------------------------------- //
// { --- >   Add Expense < --- }
////** @ method  POST
////** @route  -->  = /api/transactions/addExpense/:id
export const addExpense = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const { title, amount, category, description, date } = req.body;

  const expense = expenseSchema({
    title,
    amount,
    date,
    category,
    description,
    user: userId,
  });
  try {
    //----------> validations
    if (!title || !description || !date || !category) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    if (amount <= 0 || !amount === 'number') {
      return res
        .status(400)
        .json({ message: 'Amount must be a positive number!' });
    }

    await expense.save();

    res.status(200).json({ expense });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//  ----------------------------------------------------------------- //
// { --- >   Update Expense < --- }
////** @ method  -->  PATCH
////** @ route -->  /api/transactions/updateExpense/:id
export const updateExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id;
  try {
    const result = await Expense.findOneAndUpdate(
      { _id: expenseId },
      req.body,
      { new: true }
    );
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'error result' });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});
// ----------------------------------------------------------------- //
// { --- >   Delete Expense < --- }
////** @ method  -->  POST
////** @route  -->   = /api/transactions/deleteExpense/:id
export const deleteExpense = asyncHandler(async (req, res) => {
  const expenseId = req.params.id; //get expense id
  try {
    const result = await Expense.findByIdAndDelete({ _id: expenseId });
    res.status(200).json({ message: 'Expense Deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
