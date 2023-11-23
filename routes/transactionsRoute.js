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
  //Expenses routes
  .get('/getExpense/:id', getExpense)
  .get('/getAllExpenses/:id', getAllExpenses)
  .post('/addExpense/:id', addExpense)
  .patch('/updateExpense/:id', updateExpense)
  .delete('/deleteExpense/:id', deleteExpense)
  //Incomes routes
  .get('/getIncome/:id', getIncome)
  .post('/addIncome/:id', addIncome)
  .get('/getAllIncomes/:id', getAllIncomes)
  .patch('/updateIncome/:id', updateIncome)
  .delete('/deleteIncome/:id', deleteIncome);

export default router;
