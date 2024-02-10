import User from '../models/userSchema.js';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { errorHandler } from '../middleware/errorMiddleware.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendForgotPassMail, sendVerificationMail } from '../utils/sendMail.js';

import jwt from 'jsonwebtoken';

//@ --->   < LOGIN > user & get token
// route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check all fields are valid
  if (!email || !password)
    return res
      .status(400)
      .send({ message: 'No user found for this email/password' });

  // Convert the email to lower letters
  let LowerCaseEmail = email.toLowerCase();

  //>>1 check if email exist
  const user = await User.findOne({ email: LowerCaseEmail });

  if (!user) {
    return res.status(400).send({ message: 'Email Not Exists' });
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
      isAdmin: user.isAdmin,
    });
  } else {
    return res.status(400).send({ message: 'Wrong Password' });
  }
});
// ----------------------------------------------------------------- //
//@ --->   < REGISTER > a new user
// route   POST /api/users/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check all fields are valid
  if (!name) return res.status(400).send({ message: 'Enter Your Name' });
  if (!email) return res.status(400).send({ message: 'Enter Your Email' });
  if (!password) return res.status(400).send({ message: 'Enter Password' });

  // check if user is already registered
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send({ message: 'User already exists' });
  }
  // Convert the email to lower letters
  let LowerCaseEmail = email.toLowerCase();
  // create and store a new user
  const user = await User.create({
    name,
    email: LowerCaseEmail,
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
      isAdmin: user.isAdmin,
    });
  } else {
    return res.status(400).send({ message: 'Failed Send You Email' });
  }
});
// ----------------------------------------------------------------- //
//@ --->   < GOOGLE AUTH >
// route   POST /api/users/register
const googleAuth = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  // if USER Exists
  if (user) {
    generateToken(res, user._id);

    return res.status(201).json({
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
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      isVerified: user.isVerified,
    });
  }
});
// ----------------------------------------------------------------- //

//? --->   < VERIFY EMAIL > <----
// route   POST /api/users/register
const verifyEmail = asyncHandler(async (req, res) => {
  const { emailToken } = req.params;

  if (!emailToken) return res.status(404).send('Email token not found');

  const user = await User.findOneAndUpdate(
    { emailToken },
    {
      $set: {
        emailToken: '',
        isVerified: true,
      },
    },
    { new: true }
  );
  if (user) {
    generateToken(res, user._id);
    generateRefreshToken(res, user._id);

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
      isVerified: user?.isVerified,
    });
  } else {
    return res.status(404).send('Email verification failed, invalid token');
  }
});
// ----------------------------------------------------------------- //
//? --->    < FORGOT >  Password <----
//POST -- /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(401).send({ message: 'Enter your email address' });
  // --->  Convert the email to lower letters
  let lowerCaseEmail = email.toLowerCase();

  const user = await User.findOne({ email: lowerCaseEmail });
  if (!user) return res.status(401).send({ message: 'User Not Exist' });

  // generate token for reset password
  const token = jwt.sign({ _id: user._id }, `${process.env.JWT}`, {
    expiresIn: '1d',
  });
  //  set the token to resetPassToken
  const setUserToken = await User.findByIdAndUpdate(
    {
      _id: user._id,
    },
    { resetPassToken: token },
    { new: true }
  );

  // send email to user

  if (setUserToken) {
    sendForgotPassMail(setUserToken);
    return res.status(201).send({ message: 'Email was sent to you' });
  } else {
    return res.status(401).send({ message: 'Network fail' });
  }
});
// ----------------------------------------------------------------- //
//? --->  < VERIFY PASSWORD > reset link
//GET  -- /api/auth/forgot-password/:id/:token
const verifyLink = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  // check that Id and Token are found

  if (!id || !token) return res.status(404).send({ message: 'Invalid Link' });

  const user = await User.findOne({ _id: id, resetPassToken: token });
  if (!user) return res.status(404).send({ message: 'User not found' });

  const verifyToken = jwt.verify(token, `${process.env.JWT}`);
  if (!verifyToken) return res.status(404).send({ message: 'Invalid Token' });

  if (user && verifyToken._id) {
    return res.status(201).send({ message: 'Verified Link' });
  } else {
    return res.status(401).send({ message: 'Network fail' });
  }
});
// ----------------------------------------------------------------- //
//? --->   < RESET >  Password <----
// POST -- /api/auth/reset-password/:id/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { id, token, newPassword } = req.body;
  // check that Id and Token are found
  if (!id || !token) return res.status(404).send({ message: 'Invalid Link' });
  // check that Password found
  if (!newPassword)
    return res.status(404).send({ message: 'Missing Password ' });

  // find the user with the token from the email
  const user = await User.findOne({ _id: id, resetPassToken: token });
  if (!user) return res.status(404).send({ message: 'User not found' });

  // verify the token
  const verifyToken = jwt.verify(token, `${process.env.JWT}`);
  if (!verifyToken)
    return res.status(404).send({ message: 'Token Not Verified' });

  if (user && verifyToken._id) {
    // save the new password and set resetPassToken to null
    user.password = newPassword;
    user.resetPassToken = null;
    await user.save();

    return res.status(201).send({ status: '201', user });
  } else {
    return res.status(401).send({ status: '401', message: 'user not exist' });
  }
});
export {
  login,
  register,
  googleAuth,
  verifyEmail,
  forgotPassword,
  resetPassword,
  verifyLink,
};
