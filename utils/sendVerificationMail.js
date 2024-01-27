import { mailTransporter } from './mailTransporter.js';

const sendVerificationMail = (user) => {
  const transporter = mailTransporter();

  const mailOptions = {
    from: ' "MyCash" <mycash778@outlook.com>',
    to: user.email,
    subject: 'Verify your account... ',
    html: `<p>Hello ${user.name}, verify your email by clicking this link </p>
    <a href = '${process.env.CLIENT_URL}api/v1/auth/verify-email?emailToken=${user.emailToken}'> Verify your email
    Your Email</a>',
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log('Verification email sent');
  });
};
export { sendVerificationMail };
