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
const mailer = require("nodemailer");
const emailTransporter = mailer.createTransport({service: "gmail", auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD}});
const EventEmitter = require("events").EventEmitter;
const emailEvents = require("./events/emailEvents.js")(EventEmitter, ejs, fs, path, emailTransporter);
const smsEvents = require("./events/smsEvents.js")(EventEmitter, vonage);

app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/exports", express.static(__dirname + "/exports"));
app.use("/images/products", express.static(__dirname + "/images/products"));

const registration = require("./routes/registration.js")(app, models, bcryptjs, emailEvents, validations);
const login = require("./routes/login.js")(app, models, jwt, bcryptjs, smsEvents, checkStatus, validations);
const forgotCredentials = require("./routes/forgotCredentials.js")(app, models, bcryptjs, emailEvents, validations);
const profile = require("./routes/profile.js")(app, models, validations);
const setup = require("./routes/setup.js")(app, models, smsEvents, validations);
const checkout = require("./routes/checkout.js")(app, models, stripe, moment, ejs, pdf, fs, path, emailEvents);
const products = require("./routes/admin/products.js")(app, models, moment, json2csv, fs, path, uploadImages, validations);
const categories = require("./routes/admin/categories.js")(app, models, validations);
const technicalData = require("./routes/admin/technicalData.js")(app, models, validations);
const orders = require("./routes/admin/orders.js")(app, models, moment, json2csv, fs, path, emailEvents, validations);
const homeSettings = require("./routes/admin/homeSettings.js")(app, models, fs, path, uploadImages, validations);
const contact = require("./routes/admin/contact.js")(app, models, moment, emailEvents, validations);
const users = require("./routes/admin/users.js")(app, models, validations);
const chat = require("./chat/chat.js")(app, io, models, moment, validations);
const backup = require("./database/backup.js")(spawn, cron, moment, fs, path);

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
    var password = process.env.ADMIN_DEFAULT_PASSWORD;
    bcryptjs.genSalt(10, (error, salt) => {
        bcryptjs.hash(password, salt, (error, hashedPassword) => {
            var query = {"account.username": "admin"};
            var update = {$setOnInsert: {account: {username: "admin", email: "default", password: hashedPassword, firstName: "default", lastName: "default", mobileNumber: "", isAdmin: true}, address: {street: "default", houseNumber: 0, city: "default", zipCode: 0, country: "default"}, confirmation: {confirmed: true, confirmationToken: "", authenticationEnabled: false, authenticationToken: "", authenticationEnablingToken: "", resetPasswordToken: ""}}};
            var options = {upsert: true, new: true};
            User.findOneAndUpdate(query, update, options).then().catch(error => console.log(error));
        });
    });
}