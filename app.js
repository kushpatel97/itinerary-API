const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();

const usersRoute = require("./api/routes/users");

const DB_PASSWORD = "KNifQiRComqnGhFY";
const port = process.env.PORT || 8080;
//Database
mongoose
  .connect(
    `mongodb://kushpatel-1:${
      process.env.DB_PASSWORD
    }@itinerary-api-shard-00-00-dtjpg.mongodb.net:27017,itinerary-api-shard-00-01-dtjpg.mongodb.net:27017,itinerary-api-shard-00-02-dtjpg.mongodb.net:27017/itinerary?ssl=true&replicaSet=itinerary-api-shard-0&authSource=admin&retryWrites=true`,
    { useCreateIndex: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connecting to database ...");
  })
  .catch(err => {
    console.log("Error connecting Database instance due to: ", err);
  });

mongoose.Promise = global.Promise;

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo DB Atlas");
});
mongoose.connection.on("error", () => {
  console.log("Error, cannot connect to Mongo DB Atlas");
});

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

//Routes
app.use("/users", usersRoute);

//Error handling
app.use((req, res) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
