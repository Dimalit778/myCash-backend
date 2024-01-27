import User from '../models/userSchema.js';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { errorHandler } from '../middleware/errorMiddleware.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendVerificationMail } from '../utils/sendVerificationMail.js';

// --->   Login user & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //>>1 check if email exist
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).send({ message: 'Email Not Exists' });
  }

  if (user && (await user.matchPassword(password))) {
    // ---> Generate tokes
    generateToken(res, user._id);
    generateRefreshToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      isVerified: user.isVerified,
    });
  } else {
    res.status(401);
    throw new Error('Invalid  password');
  }
});

// --->   Register a new user
// @route   POST /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // check if user is already registered
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send({ message: 'User already exists' });
  }
  // create and store a new user
  const user = await User.create({
    name,
    email,
    password,
    emailToken: crypto.randomBytes(64).toString('hex'),
  });

  if (user) {
    // Send verification mail to the user
    sendVerificationMail(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      emailToken: user.emailToken,
      isVerified: user.isVerified,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
// --->   Google AUTH
// @route   POST /api/users/register
const googleAuth = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // if USER Exists
  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.displayName,
      email: user.email,
      imageUrl: user.imageUrl,
      isVerified: user.isVerified,
    });
  } else {
    // if USER don't exist
    const generatedPassword = Math.random().toString(36).slice(-8);
    const user = await User.create({
      name: req.body.displayName,
      email: req.body.email,
      password: generatedPassword,
      isVerified: true,
    });
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      isVerified: user.isVerified,
    });
  }
});
// --->   VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;
    if (!emailToken) return res.status(404).json('Email token not found');
    const user = await User.findOne({ emailToken: emailToken });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      generateToken(res, user._id);
      generateRefreshToken(res, user._id);

      await user.save();

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        isVerified: user?.isVerified,
      });
    } else res.status(404).json('Email verification failed, invalid token');
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};
export { login, register, googleAuth, verifyEmail };
