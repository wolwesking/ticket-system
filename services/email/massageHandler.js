const inbox = require("inbox");
const { simpleParser } = require("mailparser");

// Replace these values with your Outlook email credentials and server details
const email = "takacspatrik993@outlook.com";
const password = "CSwR747o";

const server = "outlook.office365.com";
const port = 993; // For secure connection, adjust accordingly

const client = inbox.createConnection(port, server, {
  secureConnection: true,
  auth: { user: email, pass: password },
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

