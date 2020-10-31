const nodemailer = require('nodemailer');

// Files
const config = require('./config');
const User = require('./models/User');

const sendMail = async (userId, verificationTokenId, host) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.mail.user, // generated ethereal user
      pass: config.mail.pass, // generated ethereal password
    },
  });

  try {
    const user = await User.findByPk(userId);
    await transporter.sendMail({
      from: 'donotreply@notes-api-2.com',
      to: user.email,
      subject: 'Notes App | Confirm email',
      text: `Welcome to Notes App, http://${host}/api/v1/user/token/confirm/${verificationTokenId}`,
    });
  } catch (err) {
    console.error('ERROR - mail.js - sendMail(): ', err);
  }
};

module.exports.sendMail = sendMail;
