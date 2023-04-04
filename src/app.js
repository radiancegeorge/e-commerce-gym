const express = require("express");
const cors = require("cors");
const route = require("./routes");
const errHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);

//static files from uploads
app.use("/", express.static("uploads"));
//error
app.use(errHandler);
module.exports = app;
