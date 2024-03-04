const { PrismaClient } = require("@prisma/client");
const generatedTicketId = require("../idGenerator");

async function createTicket(message, body) {
  // Check if reply or create new ticket

  if (message.inReplyTo) {
    console.log("it's a reply");
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
          messages: {
            create: {
              date: messageDate,
              isReply: false,
              messageId: messageId,
              replyId: "",
            },
          },
        },
      });
      console.log("Query: " + JSON.stringify(querry));
    } 
    catch (err) 
    {
        console.log("Error while creating DATABASE: " + err);
    }
    finally
    {
        await prisma.$disconnect();
    }
  }
}

module.exports = createTicket;
