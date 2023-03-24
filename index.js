const express = require("express");
const mongoose = require("mongoose");
const connectDb = require("./config/dbConnection");
const modelRoutes = require("./routes/model");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

app.use(express.json());
app.use("/api", modelRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
