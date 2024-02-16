import mongoose from 'mongoose';

const expenseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  amount: {
    type: Number,
    required: true,
    maxLength: 20,
  },
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      'Food',
      'Shopping',
      'Online Purchases',
      'Events',
      'Utilities',
      'Party',
      'Bills',
      'Loans',
      'Other',
    ],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
export default mongoose.model.Expenses ||
  mongoose.model('Expense', expenseSchema);
