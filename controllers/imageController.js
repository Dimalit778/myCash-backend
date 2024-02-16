import asyncHandler from 'express-async-handler';

import cloudinary from '../cloudinary.js';

export const uploadImage = asyncHandler(async (req, res) => {
  const { userImage } = req.body;

  try {
    const result = await cloudinary.uploader.upload(userImage, {
      folder: 'images',
      resource_type: 'auto',
    });

    return res.status(200).send(result);
  } catch (error) {
    res.status(200).send({ message: error.message });
  }
});
export const deleteImage = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  try {
    await cloudinary.uploader.destroy(imageUrl);

    res.status(200).send(' Image deleted successfully');
  } catch (error) {
    res.status(200).send({ message: error.message });
  }
});
