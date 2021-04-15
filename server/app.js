const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const models = require("./models/models.js")(mongoose);
const EventEmitter = require("events").EventEmitter;
const mailer = require("nodemailer");
const axios = require("axios");
const Nexmo = require("nexmo");
const dotenv = require("dotenv").config();
const baseUrl = process.env.BASE_URL;
const serverPort = process.env.SERVER_PORT;
const clientPort = process.env.CLIENT_PORT;
const databaseUrl = process.env.DATABASE_URL;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const reCaptchav2SecretKey = process.env.RECAPTCHA_v2_SECRET_KEY;
const nexmo = new Nexmo({apiKey: process.env.NEXMO_API_KEY, apiSecret: process.env.NEXMO_API_SECRET});
const transporter = getTransporter();
const emailEvent = require("./events/emailEvent.js")(EventEmitter, transporter, emailUser, baseUrl, clientPort);
const smsEvent = require("./events/smsEvent.js")(EventEmitter, nexmo);
const validation = require("./helpers/validation.js");
app.use(cors({origin: "*"}));
app.use(express.json());

const registration = require("./routes/registration.js")(app, bcryptjs, models, emailEvent, validation, reCaptchav2SecretKey, axios);
const login = require("./routes/login.js")(app, jwt, bcryptjs, models, smsEvent, validation);
const forgotCredentials = require("./routes/forgotCredentials.js")(app, bcryptjs, models, emailEvent, validation);
const profile = require("./routes/profile.js")(app, models, validation);
const setup = require("./routes/setup.js")(app, models, smsEvent);

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

app.listen(serverPort, function() {
    console.log("MyShop app listening on " + baseUrl + serverPort + "!");
});

function getTransporter() {
    return mailer.createTransport({service: "gmail", auth: {user: emailUser, pass: emailPassword}});
}