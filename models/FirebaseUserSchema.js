import mongoose from 'mongoose';

const FirebaseUserSchema = mongoose.Schema(
  {
    FirebaseId: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    provider: {
      type: String,
    },
  },
  { timestamps: true }
);
export default mongoose.model.FirebaseUser ||
  mongoose.model('FirebaseUser', FirebaseUserSchema);
