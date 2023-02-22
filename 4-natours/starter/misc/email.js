const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.email.split(' ')[0];
    this.url = url;
    this.from = `Honcharov Anton <${process.env.EMAIL_USERNAME}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_API_NAME,
          pass: process.env.SENDGRID_API_KEY
        }
      });
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

  async send(templateName, subject) {
    const htmlProps = {
      firstName: this.firstName,
      url: this.url,
      subject
    };

    const html = pug.renderFile(
      `${__dirname}/../views/email/${templateName}.pug`,
      htmlProps
    );

    // define email template
    const info = {
      from:
        process.env.NODE_ENV === 'production'
          ? process.env.SENDGRID_EMAIL_FROM
          : this.from,
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

  async sendForgotPassword() {
    await this.send(
      'forgotPassword',
      'Your password reset token (valid for 10 min)'
    );
  }
}

module.exports = Email;
