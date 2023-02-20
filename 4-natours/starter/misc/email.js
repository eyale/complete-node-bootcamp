const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

class Email {
  constructor(user, url) {
    console.log('🪬 - user, url', user, url);
    this.to = user.email;
    this.firstName = user.email.split(' ')[0];
    this.url = url;
    this.from = `Honcharov Anton <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    const htmlProps = {
      firstName: this.firstName,
      url: this.url,
      subject
    };

    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}.pug`,
      htmlProps
    );

    // define email template
    const info = {
      from: this.from,
      to: this.to,
      text: htmlToText(html), // plain text body
      subject,
      html
      // html: message // plain text body
    };

    // create transport and send it
    await this.newTransport().sendMail(info);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours family');
  }
}

// const sendEmail = async ({ email, subject, message }) => {
//   // 1 - create transporter
//   const transporter = await nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });
//   // 2 - define options
//   const info = {
//     from: '"Honcharov Anton 🥷🏼" <hello@eyal.com>', // sender address
//     to: email, // list of receivers
//     subject: subject, // Subject line
//     text: message // plain text body
//   };
//   // 1 - send email
//   let res;

//   try {
//     res = await transporter.sendMail(info);
//   } catch (error) {
//     console.error('🪬  error', error);
//   }

//   return res;
// };

module.exports = Email;
