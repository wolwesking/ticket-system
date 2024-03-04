/*
  Warnings:

  - You are about to drop the column `messageId` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
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

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tickets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL
);
INSERT INTO "new_tickets" ("email", "id", "ticketId") SELECT "email", "id", "ticketId" FROM "tickets";
DROP TABLE "tickets";
ALTER TABLE "new_tickets" RENAME TO "tickets";
CREATE UNIQUE INDEX "tickets_ticketId_key" ON "tickets"("ticketId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
