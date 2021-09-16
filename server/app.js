const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const cron = require("node-cron");
const ejs = require("ejs");
const pdf = require("html-pdf");
const spawn = require("child_process").spawn;
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Vonage = require("@vonage/server-sdk");
const vonage = new Vonage({apiKey: process.env.VONAGE_API_KEY, apiSecret: process.env.VONAGE_API_SECRET});
const models = require("./models/models.js")(mongoose);
const validation = require("./middleware/validation.js");
const uploadImages = require("./middleware/uploadImages.js");
const checkStatus = require("./middleware/checkStatus.js");
const mailer = require("nodemailer");
const emailTransporter = mailer.createTransport({service: "gmail", auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD}});
const EventEmitter = require("events").EventEmitter;
const emailEvent = require("./events/emailEvent.js")(EventEmitter, ejs, fs, path, emailTransporter);
const smsEvent = require("./events/smsEvent.js")(EventEmitter, vonage);

app.use(cors({origin: "*"}));
app.use(express.json());
app.use(express.static(__dirname + "/images/products"));

const registration = require("./routes/registration.js")(app, models, bcryptjs, emailEvent, validation);
const login = require("./routes/login.js")(app, models, jwt, bcryptjs, smsEvent, validation, checkStatus);
const forgotCredentials = require("./routes/forgotCredentials.js")(app, bcryptjs, models, emailEvent, validation);
const profile = require("./routes/profile.js")(app, models, validation);
const setup = require("./routes/setup.js")(app, models, smsEvent);
const checkout = require("./routes/checkout.js")(app, models, stripe, moment, fs, path, ejs, pdf, emailEvent);
const invoices = require("./routes/invoices.js")(app, models, path);
const products = require("./routes/admin/products.js")(app, models, uploadImages, fs, path, moment, validation)
const categories = require("./routes/admin/categories.js")(app, models, validation);
const technicalData = require("./routes/admin/technicalData.js")(app, models, validation);;
const homeSettings = require("./routes/admin/homeSettings.js")(app, models, uploadImages, fs, path, validation);
const contact = require("./routes/admin/contact.js")(app, models, emailEvent, moment, validation);
const chat = require("./chat/chat.js")(io, app, models, moment, validation);
const backup = require("./database/backup.js")(spawn, cron, fs, path, moment);

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.set("useCreateIndex", true);
const database = mongoose.connection;
database.on("error", function(error) {
    console.log("Connection to the database has not been established!");
    console.log(error);
});
database.on("open", function() {
    createAdmin();
    console.log("Connection to the database has been successfully established!");
});

http.listen(process.env.SERVER_PORT, function() {
    console.log("MyShop app listening on " + process.env.BASE_URL + process.env.SERVER_PORT + "!");
});

function createAdmin() {
    const User = models.User;
    var query = {"account.username": "admin"};
    var password = "admin";
    bcryptjs.genSalt(10, (error, salt) => {
        bcryptjs.hash(password, salt, (error, hashedPassword) => {
            var update = {$setOnInsert: {account: {username: "admin", email: "default", password: hashedPassword, firstName: "default", lastName: "default", mobileNumber: 0, isAdmin: true}, address: {street: "default", houseNumber: 0, city: "default", zipCode: 0, country: "default"}, confirmation: {confirmed: true, confirmationToken: "", authenticationEnabled: false, authenticationToken: "", authenticationEnablingToken: ""}}};
            var options = {upsert: true};
            User.findOneAndUpdate(query, update, options).then().catch(error => console.log(error));
        });
    });
}