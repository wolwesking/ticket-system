const { PrismaClient } = require("@prisma/client");
let express = require("express");
let router = express.Router();

/* GET home page. */

// Get all tickets
const prisma = new PrismaClient();

router.post("/:id", async function (req, res, next) {
  const { ticketId, orderId } = req.body;

  // Edit data
  try {
    const query = await prisma.tickets.update({
      where: {
        ticketId: ticketId,
      },
      data: {
        orderId: orderId,
      },
    });
    console.log("Order Id updated successfully: " + query);
  } catch (err) {
    console.log("error editing the orderId: " + err);
  } finally {
    prisma.$disconnect();
  }

  res.redirect("/");
});

module.exports = router;
