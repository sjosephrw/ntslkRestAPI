const express = require("express");

const { sendMail } = require("../controllers/email");

const router = express.Router();

router.post("/contact", sendMail);

module.exports = router;
