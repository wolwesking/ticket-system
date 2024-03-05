// Imports
const inbox = require("inbox");
const { simpleParser } = require("mailparser");
const emailFormatter = require("./emailFormatter");
const { PrismaClient } = require("@prisma/client");
const manageTicket = require("../handlers/manageTickets");
const handleOpenTicket = require("../handlers/handleOpenTicket");
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
        console.log("New email received:");
        console.log(`From: ${message.from.address}`);
        console.log(`Subject: ${message.title}`);
        console.log(`Object: ${JSON.stringify(message)}`);

        // Fetch the email content using the message's UID
        fetchEmailContent(message.UID, (err, content) => {
          // FLOW start for whole app
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

  // Paraphrase the body
  const newBody = await emailFormatter(body);

  console.log("BODY" + body);
  // Add data to database
  const prisma = new PrismaClient();

  // Fields from header

  const clientEmail = message.from.name;

  // Check if user ever had a ticket
  const existingTicket = await prisma.tickets.findMany({
    where: {
      email: {
        equals: clientEmail,
      },
    },
  });

  // Check if first time
  if (existingTicket) {
    // Check if the user have open

    const existingOpenTicket = await prisma.tickets.findFirst({
      where: {
        isOpen: true,
      },
    });

    console.log(existingOpenTicket);
    // CHECK IF it's a reply
    if (message.inReplyTo) {
      manageTicket(message, newBody);
    } else {
      if (existingOpenTicket) {
        handleOpenTicket(message);
      } else {
        manageTicket(message, newBody);
      }
    }
  } else {
    // Create ticket
    console.log("firstTicket");
    manageTicket(message, newBody);
  }

  await prisma.$disconnect();
}
