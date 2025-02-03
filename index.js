const express = require("express");
const connectToDataBase  = require("./database");

const app = express();

connectToDataBase();

app.listen(4000, () => console.log("server is up and running at port 4000"));
