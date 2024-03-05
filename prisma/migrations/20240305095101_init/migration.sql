/*
  Warnings:

  - Added the required column `date` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tickets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "isOpen" BOOLEAN NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_tickets" ("email", "fullName", "id", "isOpen", "subject", "ticketId") SELECT "email", "fullName", "id", "isOpen", "subject", "ticketId" FROM "tickets";
DROP TABLE "tickets";
ALTER TABLE "new_tickets" RENAME TO "tickets";
CREATE UNIQUE INDEX "tickets_ticketId_key" ON "tickets"("ticketId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
