const express = require("express");
const router = express.Router();
const EmailEntry = require("../models/EmailEntry");
const MessageLog = require("../models/MessageLog");

router.post("/", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!email || !firstName || !lastName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await EmailEntry.updateOne(
      { email },
      { firstName, lastName, email },
      { upsert: true }
    );

    await MessageLog.create({ firstName, lastName, email, message });

    res.status(200).json({ message: "Submission received" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/email-list", async (req, res) => {
  try {
    const list = await EmailEntry.find(
      {},
      { _id: 0, email: 1 }
    );
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch email list" });
  }
});

module.exports = router;
