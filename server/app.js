const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const mailer = require("nodemailer");
const countryCodes = require("country-codes-list");
console.log(countryCodes.customArray(fields = {name: "{countryNameEn} ({countryCode})", value: "{countryCallingCode}"}, {sortBy, sortDataBy, filter} = {}));
const Nexmo = require("nexmo");
const dontenv = require("dotenv").config();
const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const nexmo = new Nexmo({apiKey: process.env.NEXMO_API_KEY, apiSecret: process.env.NEXMO_API_SECRET});
const transporter = getTransporter();
app.use(cors({origin: "*"}));
app.use(express.json());

const login = require("./routes/login.js")(app, nexmo);

mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
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