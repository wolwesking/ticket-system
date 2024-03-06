// sendEmail.js

const nodemailer = require("nodemailer");
require('dotenv').config();

const smptEmail = process.env.SMPT_EMAIL;
const smtpPassword = process.env.SMPT_PASSWORD;
const smtpServer = process.env.SMPT_SERVER;
const smtpPort = process.env.SMPT_PORT  

console.log("smptEmail:" + smptEmail);
console.log("smtpPassword:" + smtpPassword);
console.log("smtpServer:" + smtpServer);

// Set up the transporter
const transporter = nodemailer.createTransport({
  host: smtpServer,
  port: smtpPort,
  secure: false,
  auth: {
    user: smptEmail,
    pass: smtpPassword,
  },
});

// Send an email
function sendEmail(recipientEmail, subject, htmlBody) {
  const emailContent = {
    from: smptEmail,
    to: recipientEmail,
    subject: subject,
    html: htmlBody,
  };

  transporter.sendMail(emailContent, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent successfully:", info);
    }
  });
}

module.exports = sendEmail;