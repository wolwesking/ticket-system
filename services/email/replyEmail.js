// respondEmail.js

const nodemailer = require("nodemailer");
require('dotenv').config();

const smptEmail = process.env.SMPT_EMAIL;
const smtpPassword = process.env.SMPT_PASSWORD;
const smtpServer = process.env.SMPT_SERVER;

// Set up the transporter
const transporter = nodemailer.createTransport({
  host: smtpServer,
  port: 587,
  secure: false,
  auth: {
    user: smptEmail,
    pass: smtpPassword,
  },
});

// Reply to the Email
function respondToEmail(recipientEmail, subjectToReply, messageHtml) {
  const replyContent = {
    from: smptEmail,
    to: recipientEmail,
    subject: `Re: ${subjectToReply}`,
    html: messageHtml,
  };

  transporter.sendMail(replyContent, (err, info) => {
    if (err) {
      console.error("Error sending reply:", err);
    } else {
      console.log("Reply sent successfully:", info);
    }
  });
}

module.exports = respondToEmail;
