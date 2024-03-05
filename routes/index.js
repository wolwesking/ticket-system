const { PrismaClient } = require("@prisma/client");
let express = require("express");
let router = express.Router();

/* GET home page. */

// Get all tickets
const prisma = new PrismaClient();

router.get("/", async function (req, res, next) {

  const tickets = await prisma.tickets.findMany();

  res.render("index", { title: "Ticket dashboard", tickets:tickets });
});

module.exports = router;
