import nodemailer from 'nodemailer';

export const mailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_ADD,
      pass: process.env.EMAIL_PASS,
    },
  });
  return transporter;
};
