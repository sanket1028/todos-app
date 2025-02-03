const mongoose = require("mongoose");
 const connectToDataBase = () =>
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("successfully connected to the database"))
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });

module.exports = connectToDataBase;
