// Imports
const reply = require('../email/replyEmail');

// Functions
async function handleOpenTicket(message)
{
    const clientEmail = message.from.address;
    const messageSubject = message.title;
    const messageHtml = `
    <h1>Error opening ticket</h1>
    <p>You already have an open ticket</p>`;

    reply(clientEmail, messageSubject, messageHtml);
}

module.exports = handleOpenTicket;