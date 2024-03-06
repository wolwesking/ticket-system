const { PrismaClient } = require("@prisma/client");
let express = require("express");
const closeTicket = require("../services/handlers/closeTicket");
const respondToEmail = require("../services/email/replyEmail");
let router = express.Router();

/* GET home page. */

// Get all tickets
const prisma = new PrismaClient();

router.get("/:id", async function (req, res, next) {
  const ticketIdUrl = parseInt(req.params.id);
  let ticketData;
  try {
    ticketData = await prisma.tickets.findFirst({
      where: {
        ticketId: ticketIdUrl,
      },
      include: {
        messages: true,
      },
    });
  } catch (err) {
    console.log("Error with ticket: " + err);
  } finally {
    await prisma.$disconnect();
  }

  if (!ticketData) {
    res.redirect("/");
    return;
  }

  console.log("TIDKET DATA: " + JSON.stringify(ticketData));

  const formatedDate = formatReadableDate(ticketData.date);

  res.render("ticketThread", {
    title: `Ticket - ${ticketIdUrl}`,
    tickets: ticketData,
    formattedDate: formatedDate,
  });
});

router.delete("/:id", async function (req, res, next) {
  const ticketIdUrl = parseInt(req.params.id);
  closeTicket(ticketIdUrl);
  res.redirect(`/${ticketIdUrl}`);
});

router.post("/:id", async function (req, res, next) {
  // Replying to message
  let { messageId, email, ticketId, message, subject } = req.body;
  ticketId = parseInt(ticketId);
  let updateTciket;
  try {
    updateTciket = await prisma.tickets.update({
      where: {
        ticketId: ticketId,
        email: email,
      },
      data: {
        messages: {
          create: {
            isReply: true,
            messageId: messageId,
            date: new Date(),
            message: message,
            fromUs: true,
          },
        },
      },
    });
    const newSubject = `${subject} - [Ticket#: ${ticketId}]`
    console.log(newSubject);
    // Sending reply to email
    respondToEmail(email, newSubject, message);

  } catch (err) {
    console.log("error in reply: " + err);
  } finally {
    res.redirect(`/ticket/${ticketId}`);
    prisma.$disconnect();
  }
});

function formatReadableDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  };
  const formattedDate = new Date(dateString).toLocaleString("en-US", options);
  return formattedDate;
}

module.exports = router;
