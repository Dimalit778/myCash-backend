import User from '../models/userSchema.js';
import asyncHandler from 'express-async-handler';
import EmailToken from '../models/emailTokenSchema.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/sendEmail.js';
import { errorHandler } from '../middleware/errorMiddleware.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';

// --->   Login user & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //>>1 check if email exist
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // ---> Check if user email is verified
    // if (!user.verified) {
    //   let token = await EmailToken.findOne({ userId: user._id });
    //   if (!token) {
    //     token = await new EmailToken({
    //       userId: user._id,
    //       token: crypto.randomBytes(32).toString('hex'),
    //     }).save();
    //     const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
    //     await sendEmail(user.email, 'Verify Email', url);
    //   }
    //   return res
    //     .status(400)
    //     .send({ message: 'An Email sent to your account please verify' });
    // }
    // ---> Generate tokes
    generateToken(res, user._id);
    generateRefreshToken(res, user._id);

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

// --->   Register a new user
// @route   POST /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // check if user is already registered
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  // create and store a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    generateRefreshToken(res, user._id);
    // --- > Sending Email Verification
    const token = await new EmailToken({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
    }).save();

    const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
    await sendEmail(email, 'Verify Email', url);

    res
      .status(201)
      .send({ message: 'An Email sent to your account please verify' });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});
// --->   Google AUTH
// @route   POST /api/users/register
const googleAuth = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.displayName,
      email: user.email,
    });
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8);
    const user = await User.create({
      name: req.body.displayName,
      email: req.body.email,
      password: generatedPassword,
    });
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  }
});
// --->   VERIFY EMAIL
const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send({ message: 'Invalid link' });

  const token = await EmailToken.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) return res.status(400).send({ message: 'Invalid link' });

  await User.updateOne({ _id: user._id, verified: true });
  await token.remove();

  res.status(200).send({ message: 'Email verified successfully' });
});
export { login, register, googleAuth, verifyEmail };
