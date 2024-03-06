/*
  Warnings:

  - Added the required column `fromUs` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isReply" BOOLEAN NOT NULL,
    "messageId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "fromUs" BOOLEAN NOT NULL,
    "ticketsId" INTEGER,
    CONSTRAINT "message_ticketsId_fkey" FOREIGN KEY ("ticketsId") REFERENCES "tickets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_message" ("date", "id", "isReply", "message", "messageId", "ticketsId") SELECT "date", "id", "isReply", "message", "messageId", "ticketsId" FROM "message";
DROP TABLE "message";
ALTER TABLE "new_message" RENAME TO "message";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
