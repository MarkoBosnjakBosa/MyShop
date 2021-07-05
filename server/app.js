const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const models = require("./models/models.js")(mongoose);
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const validation = require("./middleware/validation.js");
const uploadImages = require("./middleware/uploadImages.js");
const checkStatus = require("./middleware/checkStatus.js");
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events").EventEmitter;
const mailer = require("nodemailer");
const Vonage = require('@vonage/server-sdk')
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ejs = require("ejs");
const pdf = require("html-pdf");
const vonage = new Vonage({apiKey: process.env.VONAGE_API_KEY, apiSecret: process.env.VONAGE_API_SECRET});
const transporter = getTransporter();
const emailEvent = require("./events/emailEvent.js")(EventEmitter, ejs, fs, path, transporter);
const smsEvent = require("./events/smsEvent.js")(EventEmitter, vonage);
app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.static(__dirname + "/images/products"));

const registration = require("./routes/registration.js")(app, models, bcryptjs, emailEvent, validation);
const login = require("./routes/login.js")(app, models, jwt, bcryptjs, smsEvent, validation, checkStatus);
const forgotCredentials = require("./routes/forgotCredentials.js")(app, bcryptjs, models, emailEvent, validation);
const profile = require("./routes/profile.js")(app, models, validation);
const setup = require("./routes/setup.js")(app, models, smsEvent);
const categories = require("./routes/admin/categories.js")(app, models, validation);
const technicalData = require("./routes/admin/technicalData.js")(app, models, validation);
const products = require("./routes/admin/products.js")(app, models, uploadImages, fs, path, moment, validation);
const homeSettings = require("./routes/admin/homeSettings.js")(app, models, uploadImages, fs, path, validation);
const checkout = require("./routes/checkout.js")(app, models, stripe, moment, fs, path, ejs, pdf, emailEvent);
const invoices = require("./routes/invoices.js")(app, models, path);
const contact = require("./routes/contact.js")(app, models, emailEvent, validation);
const chat = require("./chat/chat.js")(io, app, models, moment, validation);

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set("useCreateIndex", true);
const database = mongoose.connection;
database.on("error", function(error) {
    console.log("Connection to the database has not been established!");
    console.log(error);
});
database.on("open", function() {
    console.log("Connection to the database has been successfully established!");
});

http.listen(process.env.SERVER_PORT, function() {
    console.log("MyShop app listening on " + process.env.BASE_URL + process.env.SERVER_PORT + "!");
});

function getTransporter() {
    return mailer.createTransport({service: "gmail", auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD}});
}