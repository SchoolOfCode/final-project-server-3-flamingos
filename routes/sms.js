const express = require("express");
const router = express.Router();

const twilio = require("twilio");

var accountSid = process.env.TWILIO_ACCOUNTSID; // Your Account SID from www.twilio.com/console
var authToken = process.env.AUTH_TOKEN; // Your Auth Token from www.twilio.com/console

//var twilio = require("twilio");
var client = new twilio(accountSid, authToken);

router.get("/:id", (req, res, next) => {
  const phoneNumber = req.params.id;
  client.messages
    .create({
      body: `Hello from 3-flamingos! https://github.com/orgs/SchoolOfCode/teams/3-flamingos`,
      to: `${phoneNumber}`, // Text this number
      from: "+447588688297" // From a valid Twilio number
    })
    .then(message => console.log(message.sid));

  res.json({ title: `Link sent to ${phoneNumber}` });
});

module.exports = router;
