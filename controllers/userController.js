import User from '../models/userSchema.js';
import generateToken from '../utilits/generateToken.js';
import asyncHandler from 'express-async-handler';

//@desc   Get all users
// @route   GET /api/users/getAll
const getAll = asyncHandler(async (req, res) => {
  const result = await User.find();
  res.send({ Users: result });
});

//@desc   Get User
// @route   GET /api/users/getUser
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const result = await User.findById(userId);
  res.send({ Users: result });
});

//@desc   Update User
// @route   PATCH /api/users/updateUser
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
      new: true,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//@desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
// @desc    Google AUTH
// @route   POST /api/users/register
// @access  Public
export const googleAuth = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    generateToken(user, user._id);
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8);
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

///////////////////////////////
///////////////////////////////
///////////////////////////////
///////////////////////////////
///////////////////////////////
///////////////////////////////
//  ----------------------> דרך קודמת
// READ

//? Not in Use
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
export {
  getAll,
  updateUser,
  getUser,
  authUser,
  registerUser,
  logoutUser,
  updateUserProfile,
};
