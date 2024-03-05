const { PrismaClient } = require("@prisma/client");
let express = require("express");
let router = express.Router();

/* GET home page. */

// Get all tickets
const prisma = new PrismaClient();

router.get("/:id", async function (req, res, next) {
    const ticketIdUrl = parseInt(req.params.id, 10);
    const ticketData = 

    res.render("index", { title: `Ticket - ${ticketId}`,  });
});

module.exports = router;
