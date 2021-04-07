const express = require("express");
const app = express();
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const models = require("./models/models.js")(mongoose);
const EventEmitter = require("events").EventEmitter;
const mailer = require("nodemailer");
const axios = require("axios");
const Nexmo = require("nexmo");
const dotenv = require("dotenv").config();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
const loginUrl = process.env.LOGIN_URL;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const reCaptchav2SecretKey = process.env.RECAPTCHA_v2_SECRET_KEY;
const nexmo = new Nexmo({apiKey: process.env.NEXMO_API_KEY, apiSecret: process.env.NEXMO_API_SECRET});
const transporter = getTransporter();
const emailEvent = require("./events/emailEvent.js")(EventEmitter, transporter, emailUser, baseUrl, port);
app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/favicon", express.static("favicon"));
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

const registration = require("./routes/registration.js")(app, reCaptchav2SecretKey, axios, bcryptjs, models, emailEvent, baseUrl, port, loginUrl, emailUser);
const login = require("./routes/login.js")(app, models, nexmo);

mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set("useCreateIndex", true);
const database = mongoose.connection;
database.on("error", function(error) {
    console.log("Connection to the database has not been established!");
    console.log(error);
});
database.on("open", function() {
    console.log("Connection to the database has been successfully established!");
});

app.listen(port, function() {
    console.log("MyShop app listening on " + baseUrl + port + "!");
});

function getTransporter() {
    return mailer.createTransport({service: "gmail", auth: {user: emailUser, pass: emailPassword}});
}