const { PrismaClient } = require("@prisma/client");
const generatedTicketId = require("../idGenerator");
const sendEmail = require("../email/sendEmail");
const getSubjectID = require("./getIdFromSubject");

async function createTicket(message, bodyFromClient) {
  // Check if reply or create new ticket

  if (message.inReplyTo) {
    console.log("it's a reply");
    const clientEmail = message.from.address;
    const messageSubject = message.title;
    const messageDate = message.date;
    const messageId = message.messageId;
    const ids = await getSubjectID(messageSubject);
    const newTicketID = await parseInt(ids);

    // Find the ticket in the database:
    const prisma = new PrismaClient();

    console.log(messageSubject);
    let existingTicket;
    try {
      // Find parent ticket thread

      if (newTicketID) {
        existingTicket = await prisma.tickets.findUnique({
          where: {
            email: clientEmail,
            isOpen: true,
            ticketId: newTicketID,
          },
        });
      }
      else
      {
        console.log("No match found");
        return;
      }

      if (!existingTicket) {
        console.log("No match found");
        return;
      }

      // Add the reply to the thread
      const updateTciket = await prisma.tickets.update({
        where: {
          ticketId: newTicketID,
          email: clientEmail,
          isOpen: true,
        },
        data: {
          messages: {
            create: {
              isReply: true,
              messageId: messageId,
              date: messageDate,
              message: bodyFromClient,
              fromUs: false
            },
          },
        },
      });

      console.log("message added: " + JSON.stringify(updateTciket));
    } catch (err) {
      console.log("Error with prisma: " + err);
    } finally {
      prisma.$disconnect();
    }
  } else {
    console.log("it's a newTicket");
    // Get data from json
    const clientEmail = message.from.address;
    const clientFullName = message.from.name;
    const ids = await generatedTicketId();
    const messageSubject = message.title;
    const messageDate = message.date;
    const messageId = message.messageId;

    const prisma = new PrismaClient();
    try {
      const querry = await prisma.tickets.create({
        data: {
          email: clientEmail,
          fullName: clientFullName,
          isOpen: true,
          subject: messageSubject,
          ticketId: ids,
          date: new Date(),
          orderId: "",
          messages: {
            create: {
              date: messageDate,
              isReply: false,
              messageId: messageId,
              message: bodyFromClient,
              fromUs: false,
            },
          },
        },
      });
      console.log("Query: " + JSON.stringify(querry));

      // Sending email back
      const subject = `${messageSubject} - [Ticket#: ${ids}]`;
      const body = `
      <h1>Thank you for reaching out!</h1>
      <p>Help is on the way!</p>
      <p>Your Ticket#: ${ids}</p>
      <p>Our college will reply shortly</p>
      <h2>You problem was:</h2>
      <p>${bodyFromClient}</p>
      <br/>
      <p>Please keep the conversation in the thread</p>
      `;

      sendEmail(clientEmail, subject, body);
    } catch (err) {
      console.log("Error while creating DATABASE: " + err);
    } finally {
      await prisma.$disconnect();
    }
  }
}

module.exports = createTicket;
