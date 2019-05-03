const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const imagesRouter = require("./routes/images");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

const app = express();

//set up connection to database called 'watu'
mongoose.connect(`${process.env.MONGO_URL}`, { useNewUrlParser: true });

app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/images", imagesRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

module.exports = app;
