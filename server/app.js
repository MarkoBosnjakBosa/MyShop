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
const json2csv = require("json2csv").parse;
const spawn = require("child_process").spawn;
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Vonage = require("@vonage/server-sdk");
const vonage = new Vonage({apiKey: process.env.VONAGE_API_KEY, apiSecret: process.env.VONAGE_API_SECRET});
const models = require("./models/models.js")(mongoose);
const validations = require("./middleware/validations.js");
const uploadImages = require("./middleware/uploadImages.js");
const checkStatus = require("./middleware/checkStatus.js");
const checkPermission = require("./middleware/checkPermission.js")(models, validations);
const mailer = require("nodemailer");
const emailTransporter = mailer.createTransport({service: "gmail", auth: {user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD}});
const EventEmitter = require("events").EventEmitter;
const emailEvents = require("./events/emailEvents.js")(EventEmitter, ejs, fs, path, emailTransporter);
const smsEvents = require("./events/smsEvents.js")(EventEmitter, vonage);

app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/temporary", express.static(__dirname + "/temporary"));

const registration = require("./routes/registration.js")(app, models, bcryptjs, emailEvents, validations);
const login = require("./routes/login.js")(app, models, jwt, bcryptjs, smsEvents, checkStatus, validations);
const forgotCredentials = require("./routes/forgotCredentials.js")(app, models, bcryptjs, emailEvents, validations);
const profile = require("./routes/profile.js")(app, models, checkStatus, validations);
const setup = require("./routes/setup.js")(app, models, smsEvents, checkStatus, validations);
const checkout = require("./routes/checkout.js")(app, models, stripe, ejs, pdf, fs, path, emailEvents, checkStatus, validations);
const products = require("./routes/admin/products.js")(app, models, json2csv, fs, path, uploadImages, checkStatus, checkPermission, validations);
const categories = require("./routes/admin/categories.js")(app, models, checkStatus, checkPermission, validations);
const technicalData = require("./routes/admin/technicalData.js")(app, models, checkStatus, checkPermission, validations);
const orders = require("./routes/admin/orders.js")(app, models, json2csv, ejs, pdf, fs, path, emailEvents, checkStatus, checkPermission, validations);
const homeSettings = require("./routes/admin/homeSettings.js")(app, models, fs, uploadImages, checkStatus, checkPermission, validations);
const contact = require("./routes/admin/contact.js")(app, models, emailEvents, checkStatus, checkPermission, validations);
const users = require("./routes/admin/users.js")(app, models, checkStatus, checkPermission, validations);
const chat = require("./chat/chat.js")(app, io, models, validations);
const backup = require("./database/backup.js")(spawn, cron, moment, fs, path);

mongoose.connect(process.env.DATABASE_URL);
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
    var password = process.env.ADMIN_DEFAULT_PASSWORD;
    bcryptjs.genSalt(10, (error, salt) => {
        bcryptjs.hash(password, salt, (error, hashedPassword) => {
            var query = {"account.username": process.env.ADMIN_DEFAULT_USERNAME};
            var update = {$setOnInsert: {account: {username: process.env.ADMIN_DEFAULT_USERNAME, email: "default@default.com", password: hashedPassword, firstName: "default", lastName: "default", mobileNumber: "1", isAdmin: true}, address: {street: "default", houseNumber: 0, city: "default", zipCode: 0, country: "default"}, confirmation: {confirmed: true, confirmationToken: "", authenticationEnabled: false, authenticationToken: "", authenticationEnablingToken: "", resetPasswordToken: ""}}};
            var options = {upsert: true, new: true};
            User.findOneAndUpdate(query, update, options).then().catch(error => console.log(error));
        });
    });
}