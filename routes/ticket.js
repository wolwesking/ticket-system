const { PrismaClient } = require("@prisma/client");
let express = require("express");
const closeTicket = require("../services/handlers/closeTicket");
let router = express.Router();

/* GET home page. */

// Get all tickets
const prisma = new PrismaClient();

router.get("/:id", async function (req, res, next) {
    const ticketIdUrl = parseInt(req.params.id);
    const ticketData = await prisma.tickets.findFirst({
        where: {
            ticketId: ticketIdUrl,
        },
        include:{
            messages: true,
        }
    })
    prisma.$disconnect();
    if(!ticketData)
    {
        res.status(404).send("Can't find the ticket");
        return;
    }

    const formatedDate = formatReadableDate(ticketData.date);


    res.render("ticketThread", { title: `Ticket - ${ticketIdUrl}`, tickets: ticketData, formattedDate:formatedDate});
});

router.delete("/:id", async function(req,res,next){
    const ticketIdUrl = parseInt(req.params.id);
    closeTicket(ticketIdUrl);
    res.redirect(`/${ticketIdUrl}`);
})

router.post("/:id", async function(req,res,next){
    // Replying to message
    const ticketIdUrl = parseInt(req.params.id);
    

});


function formatReadableDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    const formattedDate = new Date(dateString).toLocaleString('en-US', options);
    return formattedDate;
  }

module.exports = router;
