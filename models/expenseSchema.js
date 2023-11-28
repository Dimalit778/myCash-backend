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
    trim: true,
    maxLength: 20,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
export default mongoose.model.Expenses ||
  mongoose.model('Expense', expenseSchema);
