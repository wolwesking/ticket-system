const { PrismaClient } = require("@prisma/client");
let express = require("express");
let router = express.Router();

/* GET home page. */

// Get all tickets
const prisma = new PrismaClient();

router.get("/:id", async function (req, res, next) {
    const ticketIdUrl = parseInt(req.params.id, 10);
    const ticketData = await prisma.tickets.findFirst({
        where: {
            ticketId: ticketIdUrl,
        },
        include:{
            messages: true,
        }
    })

    res.render("ticketThread", { title: `Ticket - ${ticketIdUrl}`, tickets: ticketData});
});

module.exports = router;
