// Imports
const inbox = require("inbox");
const { simpleParser } = require("mailparser");
const emailFormatter = require('./emailFormatter');
require("dotenv").config();

// Replace these values with your Outlook email credentials and server details
const imapEmail = process.env.IMAP_EMAIL;
const imapPassword = process.env.IMAP_PASSWORD;
const imapServer = process.env.IMAP_SERVER;
const imapPort = process.env.IMAP_PORT; // For secure connection, adjust accordingly

const client = inbox.createConnection(imapPort, imapServer, {
  secureConnection: true,
  auth: { user: imapEmail, pass: imapPassword },
});

// Connect to the mail server
client.connect();

client.on("connect", () => {
  console.log("Connected to the mail server");

  // Open the INBOX mailbox
  client.openMailbox("INBOX", { readOnly: true }, (error, info) => {
    if (error) {
      console.error("Error opening mailbox:", error);
    } else {
      console.log("Mailbox opened:", info);

      // Start listening for new emails
      client.on("new", (message) => {
        message = JSON.stringify(message);
        console.log("New email received:");
        console.log(`From: ${message.from.address}`);
        console.log(`Subject: ${message.title}`);
        console.log(`Object: ${message}`);

        // Fetch the email content using the message's UID
        fetchEmailContent(message.UID, (err, content) => {
          //
          handleRequest(message, content);
          // Check for errors and output
          if (err) {
            console.error("Error fetching email content:", err);
          } else {
            console.log("Email Content:", content);
          }
          console.log("-------------------------");
        });
      });

      // Enter idle mode to listen for updates
      client.idle();
    }
  });
});

client.on("close", () => {
  console.log("Connection closed");
});

client.on("error", (error) => {
  console.error("Error:", error);
});

// Functions
// Function to fetch email content using the message's UID
function fetchEmailContent(uid, callback) {
  const f = client.createMessageStream(uid);
  let content = "";

  f.on("data", (chunk) => {
    content += chunk;
  });

  f.on("end", () => {
    simpleParser(content, (err, parsed) => {
      if (err) {
        callback(err);
      } else {
        const emailText = parsed.text || parsed.html;
        callback(null, emailText);
      }
    });
  });
}

async function handleRequest(message, body) {
  // Generate id for the Message
  const id = require("../idGenerator");

  // Paraphrase the body
  const newBody = emailFormatter(body);

  // Add data to database

  
  
}
