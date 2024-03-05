const { PrismaClient } = require("@prisma/client");


async function closeTicket(ticketId)
{
    const prisma = new PrismaClient();

    const query = prisma.tickets.update({
        where:{
            id: ticketId
        },
        data: {
            isOpen:false,
        }
        
    })

    console.log(JSON.stringify(query));

}

module.exports = closeTicket;