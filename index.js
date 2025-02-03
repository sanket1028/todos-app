const express = require("express");
const connectToDataBase = require("./database");
const userRouter = require("./routers/userRouter");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/auth", userRouter);

connectToDataBase();

app.listen(4000, () => console.log("server is up and running at port 4000"));
