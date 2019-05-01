const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const imagesRouter = require("./routes/images");

const app = express();

//set up connection to database called 'watu'
mongoose.connect("mongodb://localhost:27017/watu", { useNewUrlParser: true });

app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/images", imagesRouter);

module.exports = app;
