const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function closeTicket(ticketId) {
    try {
        const existingTicket = await prisma.tickets.findUnique({
            where: {
                ticketId: ticketId,
            },
        });

        if (!existingTicket) {
            console.error(`Ticket with id ${ticketId} not found.`);
            return;
        }

        const query = await prisma.tickets.update({
            where: {
                ticketId: ticketId,
            },
            data: {
                isOpen: false,
            },
        });

        console.log(`Ticket ${ticketId} closed successfully.`);
        console.log(query);
    } catch (error) {
        console.error(`Error closing ticket ${ticketId}: ${error}`);
    } finally {
        await prisma.$disconnect();
    }
}

module.exports = closeTicket;
