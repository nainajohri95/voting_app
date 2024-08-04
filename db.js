//db.js is responsible for settind up the connectivity with nodejs
const mongoose = require("mongoose");
require("dotenv").config();

//define the mongoDB URL
const mongoURL = process.env.MONGODB_URL_LOCAL;
// const mongoURL = process.env.MONGODB_URL;
 
//setup mongodb connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection
const db = mongoose.connection;

//Define event listners for database connection
db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

db.on("error", (err) => {
  console.log("MongoDB connection error", err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconneted");
});

//expoer the database connection
module.exports = db;
