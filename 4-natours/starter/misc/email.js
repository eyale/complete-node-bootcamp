const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, message }) => {
  // 1 - create transporter
  const transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2 - define options
  const info = {
    from: '"Honcharov Anton 🥷🏼" <hello@eyal.com>', // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: message // plain text body
  };
  // 1 - send email
  let res;

  try {
    res = await transporter.sendMail(info);
  } catch (error) {
    console.error('🪬  error', error);
  }

  return res;
};

module.exports = {
  sendEmail
};
