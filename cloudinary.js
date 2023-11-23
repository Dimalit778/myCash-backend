import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dx6oxmki4',
  api_key: '572762324321343',
  api_secret: 'f4PIUyyriKoIjz0QjuEWI2A0eLk',
  secure: true,
});

export default cloudinary;
// cloud_name: process.env.CLOUDINARY_NAME,
// api_key: process.env.CLOUDINARY_API_KEY,
// api_secret: process.env.CLOUDINARY_API_SECRET,
