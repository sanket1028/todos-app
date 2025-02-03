const mongoose = require("mongoose");
require("dotenv").config();

const { DATABASE_URL } = process.env;
const connectToDataBase = () =>
  mongoose
    .connect(DATABASE_URL)
    .then(() => console.log("successfully connected to the database"))
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });

module.exports = connectToDataBase;
