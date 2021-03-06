const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const config = require("./config");
// const config = require("dotenv").config();
// const { authenticate } = require("./utils");

const authenticateRouter = require("./routes/authenticate");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");

const app = express();

//set up connection to database called 'watu'
mongoose
  .connect(`${config.MONGO_URL}`, {
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => console.log("Mongo connection successful!"))
  .catch(err => console.log(err));

console.log("Config: ", config);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/authenticate", authenticateRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

console.log(`express on :${process.env.PORT}`);
module.exports = app;
