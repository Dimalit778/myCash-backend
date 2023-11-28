import FirebaseUser from '../models/FirebaseUserSchema.js';
// import User from '../models/UserSchema.js';
import asyncHandler from 'express-async-handler';

//@desc   Get all users
// @route   GET /api/users/getAll
const AllFirebaseUsers = asyncHandler(async (req, res) => {
  const result = await FirebaseUser.find();
  res.send({ Users: result });
});

//@desc   Get User
// @route   GET /api/users/getUser
const getFirebaseUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const result = await FirebaseUser.findById(userId);
  res.send({ Users: result });
});
const FirebaseAuth = asyncHandler(async (req, res) => {
  const { localId, fullName, email, providerId } = req.body;
  // const userExistsInDB = await User.findOne({ email });
  // // --> Check if the email of google already exists in register with Email and Password
  // if (userExistsInDB) {
  //   res.status(400).json({ message: 'Email is already in the system' });
  // }
  const userExists = await FirebaseUser.findOne({ email });

  if (userExists) {
    return res.json({
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      // imageUrl: userExists.imageUrl,
      providerId: userExists.provider,
      FirebaseId: localId,
    });
  }
  const user = new FirebaseUser({
    FirebaseId: localId,
    name: fullName,
    email: email,
    // imageUrl: photoUrl,
    provider: providerId,
    FirebaseId: localId,
  });
  try {
    const newUser = await user.save();
    return res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      // imageUrl: newUser.imageUrl,
      providerId: newUser.provider,
      FirebaseId: newUser.FirebaseId,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
});
export { AllFirebaseUsers, getFirebaseUser, FirebaseAuth };
