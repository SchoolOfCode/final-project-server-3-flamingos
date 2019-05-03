const express = require("express");
const router = express.Router();
const Post = require("../models/posts");

router.get("/", (req, res) => {
  res.send("Welcome to posts!");
});

module.exports = router;
