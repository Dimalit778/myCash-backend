import express from 'express';
import {
  addExpense,
  deleteExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
} from '../controllers/expense.js';
import {
  addIncome,
  deleteIncome,
  getIncome,
  getAllIncomes,
  updateIncome,
} from '../controllers/income.js';

const router = express.Router();

router

  //@ Expenses routes
  .get('/getExpense', getExpense)
  .get('/getAllExpenses', getAllExpenses)
  .post('/addExpense', addExpense)
  .patch('/updateExpense/:id', updateExpense)
  .delete('/deleteExpense/:id', deleteExpense)
  //@ Incomes routes
  .get('/getIncome', getIncome)
  .get('/getAllIncomes', getAllIncomes)
  .post('/addIncome', addIncome)
  .patch('/updateIncome/:id', updateIncome)
  .delete('/deleteIncome/:id', deleteIncome);

export default router;
