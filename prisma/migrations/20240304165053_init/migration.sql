-- CreateTable
CREATE TABLE "tickets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isReply" BOOLEAN NOT NULL,
    "messageId" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "ticketsId" INTEGER,
    CONSTRAINT "message_ticketsId_fkey" FOREIGN KEY ("ticketsId") REFERENCES "tickets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tickets_ticketId_key" ON "tickets"("ticketId");
