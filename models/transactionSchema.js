import mongoose from 'mongoose';

const transactionsSchema = mongoose.Schema(
  {
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
    type: {
      type: String,
      enum: ['Income', 'Expense'],
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
        'Loans',
        'Travel',
        'Education',
        'Personal',
        'Bills',
        'Other',
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    description: {
      type: String,
      trim: true,
      maxLength: 20,
    },
    //transaction will created by a user so using "Referencing"
    userOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },

  {
    timestamps: true,
    // toJSON: { virtuals: true },
  }
);

//MODEL
export default mongoose.model.Transactions ||
  mongoose.model('Transactions', transactionsSchema);
