import incomeSchema from '../models/incomeSchema.js';
import Income from '../models/incomeSchema.js';
import asyncHandler from 'express-async-handler';
import User from '../models/userSchema.js';
import FirebaseUser from '../models/FirebaseUserSchema.js';
//? { --- > Get All User Incomes < --- }
////** @ method  -->  GET
////** @ route -->   GET = /api/transactions/getIncomes/:id
export const getAllIncomes = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await Income.find({ user: userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
// ----------------------------------------------------------------- //
//? { --- >   Get One Income < --- }
////** @ method  --> GET
////** @route -->   /api/transactions/getIncome/:id
export const getIncome = asyncHandler(async (req, res) => {
  const incomeId = req.params.id;
  try {
    const result = await Income.findOne({ _id: incomeId });
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
//? { --- >   Add Income < --- }
////** @ method  POST
////** @route  -->  = /api/transactions/addIncome/:id
export const addIncome = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const { title, amount, category, description, date } = req.body;
  const income = incomeSchema({
    title,
    amount,
    date,
    category,
    description,
    user: userId,
  });
  try {
    if (!title || !description || !date || !category) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    if (amount <= 0 || !amount === 'number') {
      return res
        .status(400)
        .json({ message: 'Amount must be a positive number!' });
    }
    await income.save();
    res.status(200).json({ message: 'Income Added' });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
//  ----------------------------------------------------------------- //
//? { --- >   Update Income < --- }
////** @ method  -->  PATCH
////** @ route -->  /api/transactions/updateIncome/:id
export const updateIncome = asyncHandler(async (req, res) => {
  const incomeId = req.params.id;
  try {
    const result = await Income.findOneAndUpdate({ _id: incomeId }, req.body, {
      new: true,
    });
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
//  ----------------------------------------------------------------- //
//? { --- >   Delete Income < --- }
////** @ method  -->  DELETE
////** @route  -->   = /api/transactions/deleteIncome/:id
export const deleteIncome = asyncHandler(async (req, res) => {
  const incomeId = req.params.id; //get Income id
  try {
    const result = await Income.findByIdAndDelete({ _id: incomeId });
    res.status(200).json({ message: 'Income Deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});
