import express from 'express';
import User from '../modules/userSchema.js';
import admin from '../FireBaseAdmin/firebase.config.js';
// import jwt from 'jsonwebtoken';
const router = express.Router();

export const loginWithGoogle = async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(500).send({ message: 'Invalid Token' });
  }
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodeValue = await admin.auth().verifyIdToken(token);
    if (!decodeValue) {
      return res.status(505).json({ message: 'not Authorized' });
    } else {
      // check if user exists
      const userExists = await User.findOne({ user_id: decodeValue.user_id });
      if (!userExists) {
        newUserDB(decodeValue, req, res);
      } else {
        updateGoogleUser(decodeValue, req, res);
      }
    }
  } catch (error) {
    return res.status(505).json({ message: error });
  }
};
// ! --- > create new user with google
export const newGoogleUser = async (decodeValue, req, res) => {
  const newUser = new User({
    name: decodeValue.name,
    email: decodeValue.email,
    user_id: decodeValue.user_id,
    imageUrl: decodeValue.picture,
    email_verified: decodeValue.email_verified,
    isAdmin: false,
    auth_time: decodeValue.auth_time,
  });
  try {
    const savedUser = await newUser.save();

    return res.status(200).json({ user: savedUser });
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};

// ! --- > update google user auth time

export const updateGoogleUser = async (decodeValue, req, res) => {
  const filter = { user_id: decodeValue.user_id };

  const options = {
    upsert: true,
    new: true,
  };
  try {
    const result = await User.findOneAndUpdate(
      filter,
      { auth_time: decodeValue.auth_time },
      options
    );
    res.status(200).send({ user: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error });
  }
};
export default router;
