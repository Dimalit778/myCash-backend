import { mailTransporter } from './mailTransporter.js';

//@ ----> Verify Email
const sendVerificationMail = (user) => {
  const transporter = mailTransporter();
  // ${process.env.CLIENT_URL} for production
  const mailOptions = {
    from: ' "MyCash" <mycash778@outlook.com>',
    to: user.email,
    subject: 'Verify your account... ',
    html: `<p>Hello ${user.name}, verify your email by clicking this link </p>
    <a href = '${process.env.CLIENT_URL}/api/auth/verify-email/${user.emailToken}'> Verify your email
    Your Email</a>,
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log('Verification email sent');
  });
};
//@ ----> Reset Password
const sendForgotPassMail = (user) => {
  const transporter = mailTransporter();

  const mailOptions = {
    from: ' "MyCash" <mycash778@outlook.com>',
    to: user.email,
    subject: 'Reset Password... ',
    html: `<p>Hello ${user.name}, Click this links to reset your Password </p>
    <a href = '${process.env.CLIENT_URL}api/auth/reset-password/${user.id}/${user.resetPassToken}'> Reset Password
    </a>,
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log(error);
    console.log('reset password email sent');
  });
};

export { sendVerificationMail, sendForgotPassMail };
