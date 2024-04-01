import mongoose from 'mongoose';

const incomeSchema = mongoose.Schema({
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
    default: Date.now(),
  },
  category: {
    type: String,
    enum: ['Work', 'Online Business', 'rent', 'Other'],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
export default mongoose.model.Incomes || mongoose.model('Income', incomeSchema);
