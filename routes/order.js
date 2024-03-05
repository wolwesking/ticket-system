const { PrismaClient } = require("@prisma/client");
let express = require("express");
let router = express.Router();

/* GET home page. */

// Get all tickets
const prisma = new PrismaClient();

router.get("/", async function (req, res, next) {
    res.send("Hi");
});

module.exports = router;
