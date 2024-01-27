import nodemailer from 'nodemailer';

export const mailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'mycash778@outlook.com',
      pass: 'Dima144695',
    },
  });
  return transporter;
};
