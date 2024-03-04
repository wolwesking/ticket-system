// Imports
const nodemailer = require("nodemailer");
require('dotenv').config();

const smptEmail = process.env.SMPT_EMAIL;
const smtpPassowrd = process.env.SMPT_PASSWORD;
const smtpServer = process.env.SMTP_SERVER;

// Step 1: Set up the transporter
const transporter = nodemailer.createTransport({
  host: smtpServer,
  port: 587,
  secure: false,
  auth: {
    user: smptEmail,
    pass: smtpPassowrd,
  },
});

// Step 2: Send an email
const recipientEmail = "takacspatrik993@gmail.com";

const emailContent = {
  from: smptEmail,
  to: recipientEmail,
  subject: "Hello, this is the subject",
  text: "This is the body of the email.",
};

function sendEmail()
{
    
}

transporter.sendMail(emailContent, (err, info) => {
  if (err) {
    console.error("Error sending email:", err);
  } else {
    console.log("Email sent successfully:", info);
    
    // Step 3: Initiate a reply after sending the email
    replyToEmail(info);
    
  }
});

// Step 6: Reply to the Email
function replyToEmail(emailToReply) {
  // Create a reply email content
  const replyContent = {
    from: smptEmail,
    to: "takacspatrik993@gmail.com",
    subject: "Re: Hello, this is the subject",
    text: "This is the body of the reply.",
  };

  // Use the transporter.sendMail method to send the reply
  transporter.sendMail(replyContent, (err, info) => {
    if (err) {
      console.error("Error sending reply:", err);
    } else {
      console.log("Reply sent successfully:", info);
    }
  });
}
