import Transaction from '../models/transactionSchema.js';
import asyncHandler from 'express-async-handler';
import User from '../models/userSchema.js';

//? { --- > Get All User  < --- }
////** @ method  -->  GET
////** @ route -->   GET = /api/v1/transactions/getAll/:id
export const getTransactions = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await User.findById(userId);

    // const result = await Transaction.find({ user: userId });

    res.status(200).json(result);
  } catch (error) {
    // res.status(500).json({ message: 'Server Error' });
    res.send(error);
  }
});
// // ----------------------------------------------------------------- //

// //? { --- >   Get One Income < --- }
// ////** @ method  --> GET
// ////** @route -->   /api/transactions/getIncome/:id
// export const getIncome = asyncHandler(async (req, res) => {
//   const incomeId = req.params.id;
//   try {
//     const result = await Income.findOne({ _id: incomeId });
//     if (result) {
//       res.json(result);
//     } else {
//       res.status(404).json({ error: 'expense not found' });
//     }
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: err.message });
//   }
// });
// ----------------------------------------------------------------- //
//? { --- >   Add Transaction < --- }
////** @ method  POST
////** @route  -->  = /api/v1/transactions/addTrans/:id
export const addTransaction = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { title, amount, type, category, date, description } = req.body;

  try {
    //1. Find user
    const user = await User.findById(userId);
    if (!user) return 'not found';
    if (!title || !description || !date || !category) {
      return res.status(400).json({ message: 'All fields are required!' });
    }
    if (amount <= 0 || !amount === 'number') {
      return res
        .status(400)
        .json({ message: 'Amount must be a positive number!' });
    }
    //3. Create the transaction
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      description,
      userOwner: userId,
    });
    //4. Push the transaction to the User
    if (transaction.type == 'Expense') {
      user.expenses.push(transaction._id);
    }
    if (transaction.type == 'Income') {
      user.incomes.push(transaction._id);
    }

    //5. Re save the User
    await user.save();
    res.status(200).json({ message: 'Transaction Added ' });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
// //  ----------------------------------------------------------------- //
// //? { --- >   Update Income < --- }
// ////** @ method  -->  PATCH
// ////** @ route -->  /api/transactions/updateIncome/:id
// export const updateIncome = asyncHandler(async (req, res) => {
//   const incomeId = req.params.id;
//   try {
//     const result = await Income.findOneAndUpdate({ _id: incomeId }, req.body, {
//       new: true,
//     });
//     if (result) {
//       res.json(result);
//     } else {
//       res.status(404).json({ error: 'error result' });
//     }
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: err.message });
//   }
// });
// //  ----------------------------------------------------------------- //
// //? { --- >   Delete Income < --- }
// ////** @ method  -->  DELETE
// ////** @route  -->   = /api/transactions/deleteIncome/:id
// export const deleteIncome = asyncHandler(async (req, res) => {
//   const incomeId = req.params.id; //get Income id
//   try {
//     const result = await Income.findByIdAndDelete({ _id: incomeId });
//     res.status(200).json({ message: 'Income Deleted' });
//   } catch (err) {
//     res.status(500).json({ err: err.message });
//   }
// });
