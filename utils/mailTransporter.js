import nodemailer from 'nodemailer';

export const mailTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: process.env.EMAIL_ADD,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// import nodemailer from 'nodemailer';

// export const sendEmail = async (email, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       service: 'Gmail',
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//     });
//     // send mail
//     await transporter.sendMail({
//       from: process.env.USER, // sender email
//       to: email, // receiver email
//       subject: subject,
//       text: text,
//     });

//     console.log('email sent successfully');
//   } catch (error) {
//     console.log('email not sent!');
//     console.log(error);
//     return error;
//   }
// };
