const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const models = require("./models/models.js")(mongoose);
const validation = require("./middleware/validation.js");
const uploadImages = require("./middleware/uploadImages.js");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events").EventEmitter;
const mailer = require("nodemailer");
const Nexmo = require("nexmo");
const moment = require("moment");
const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ejs = require("ejs");
const pdf = require("html-pdf");
const baseUrl = process.env.BASE_URL;
const serverPort = process.env.SERVER_PORT;
const clientPort = process.env.CLIENT_PORT;
const databaseUrl = process.env.DATABASE_URL;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const nexmo = new Nexmo({apiKey: process.env.NEXMO_API_KEY, apiSecret: process.env.NEXMO_API_SECRET});
const transporter = getTransporter();
const emailEvent = require("./events/emailEvent.js")(EventEmitter, transporter, emailUser, baseUrl, clientPort);
const smsEvent = require("./events/smsEvent.js")(EventEmitter, nexmo);
app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.static(__dirname + "/images/products"));

const registration = require("./routes/registration.js")(app, bcryptjs, models, emailEvent, validation);
const login = require("./routes/login.js")(app, jwt, bcryptjs, models, smsEvent, validation);
const forgotCredentials = require("./routes/forgotCredentials.js")(app, bcryptjs, models, emailEvent, validation);
const profile = require("./routes/profile.js")(app, models, validation);
const setup = require("./routes/setup.js")(app, models, smsEvent);
const categories = require("./routes/admin/categories.js")(app, models, validation);
const technicalData = require("./routes/admin/technicalData.js")(app, models, validation);
const products = require("./routes/admin/products.js")(app, models, uploadImages, fs, path, moment, validation);
const homeSettings = require("./routes/admin/homeSettings.js")(app, models, uploadImages, fs, path, validation);
const checkout = require("./routes/checkout.js")(app, models, stripe, moment, fs, path, ejs, pdf);
const invoices = require("./routes/invoices.js")(app, models, path);

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