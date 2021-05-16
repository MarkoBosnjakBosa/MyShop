const validation = require("../helpers/validation.js");
const axios = require("axios");
const reCaptcha_v2_SecretKey = process.env.RECAPTCHA_v2_SECRET_KEY;
const reCaptcha_v3_SecretKey = process.env.RECAPTCHA_v3_SECRET_KEY;

function validateRegistration(request, response, next) {
    var allowRegistration = true;
    var errorFields = [];
    var username = request.body.username;
    if(validation.invalidUsername(username)) {
        errorFields.push("username");
        allowRegistration = false;
    }
    var email = request.body.email;
    if(validation.invalidEmail(email)) {
        errorFields.push("email");
        allowRegistration = false;
    }
    var password = request.body.password;
    if(validation.invalidPassword(password)) {
        errorFields.push("password");
        allowRegistration = false;
    }
    var firstName = request.body.firstName;
    if(validation.invalidFirstName(firstName)) {
        errorFields.push("firstName");
        allowRegistration = false;
    }
    var lastName = request.body.lastName;
    if(validation.invalidLastName(lastName)) {
        errorFields.push("lastName");
        allowRegistration = false;
    }
    var mobileNumber = request.body.mobileNumber;
    if(validation.invalidMobileNumber(mobileNumber)) {
        errorFields.push("mobileNumber");
        allowRegistration = false;
    }
    var street = request.body.street;
    if(validation.invalidStreet(street)) {
        errorFields.push("street");
        allowRegistration = false;
    }
    var houseNumber = request.body.houseNumber;
    if(validation.invalidHouseNumber(houseNumber)) {
        errorFields.push("houseNumber");
        allowRegistration = false;
    }
    var city = request.body.city;
    if(validation.invalidCity(city)) {
        errorFields.push("city");
        allowRegistration = false;
    }
    var zipCode = request.body.zipCode;
    if(validation.invalidZipCode(zipCode)) {
        errorFields.push("zipCode");
        allowRegistration = false;
    }
    var country = request.body.country;
    if(validation.invalidCountry(country)) {
        errorFields.push("country");
        allowRegistration = false;
    }
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validation.invalidReCaptchaToken(reCaptcha_v2_SecretKey, axios, reCaptchaToken, request.connection.remoteAddress)) {
        errorFields.push("reCaptchaToken");
        allowRegistration = false;
    }
    if(allowRegistration) next();
    else response.status(200).json({created: false, alreadyExists: false, errorFields: errorFields}).end();
}

function validateLogin(request, response, next) {
    var username = request.body.username;
    if(validation.validUsername(username)) next();
    else response.status(200).json({authentication: false, valid: false, allowed: false, errorFields: ["username"]}).end();
}

function validateForgotCredentials(request, response, next) {
    var email = request.body.email;
    var option = request.body.option;
    if(validation.validEmail(email) && validation.validOption(option)) next();
    else response.status(200).json({sent: false}).end();
}

function validatePasswordResetting(request, response, next) {
    var username = request.body.username;
    var password = request.body.password;
    if(validation.validUsername(username) && validation.validPassword(password)) next();
    else response.status(200).json({reset: false}).end();
}

function validateAccountEdit(request, response, next) {
    var allowEdit = true;
    var errorFields = [];
    var username = request.body.username;
    var email = request.body.email;
    if(validation.invalidUsername(username) || validation.invalidEmail(email)) {
        errorFields.push("email");
        allowEdit = false;
    }
    var firstName = request.body.firstName;
    if(validation.invalidFirstName(firstName)) {
        errorFields.push("firstName");
        allowEdit = false;
    }
    var lastName = request.body.lastName;
    if(validation.invalidLastName(lastName)) {
        errorFields.push("lastName");
        allowEdit = false;
    }
    var mobileNumber = request.body.mobileNumber;
    if(validation.invalidMobileNumber(mobileNumber)) {
        errorFields.push("mobileNumber");
        allowEdit = false;
    }
    if(allowEdit) next();
    else response.status(200).json({edited: false, errorFields: errorFields}).end();
}

function validateAddressEdit(request, response, next) {
    var allowEdit = true;
    var errorFields = [];
    var username = request.body.username;
    var street = request.body.street;
    if(validation.invalidUsername(username) || validation.invalidStreet(street)) {
        errorFields.push("street");
        allowEdit = false;
    }
    var houseNumber = request.body.houseNumber;
    if(validation.invalidHouseNumber(houseNumber)) {
        errorFields.push("houseNumber");
        allowEdit = false;
    }
    var city = request.body.city;
    if(validation.invalidCity(city)) {
        errorFields.push("city");
        allowEdit = false;
    }
    var zipCode = request.body.zipCode;
    if(validation.invalidZipCode(zipCode)) {
        errorFields.push("zipCode");
        allowEdit = false;
    }
    var country = request.body.country;
    if(validation.invalidCountry(country)) {
        errorFields.push("country");
        allowEdit = false;
    }
    if(allowEdit) next();
    else response.status(200).json({edited: false, errorFields: errorFields}).end();
}

function validateCategoryCreation(request, response, next) {
    var allowCreation = true;
    var errorFields = [];
    var title = request.body.title;
    if(validation.invalidTitle(title)) {
        errorFields.push("title");
        allowCreation = false;
    }
    var icon = request.body.icon;
    if(validation.invalidIcon(icon)) {
        errorFields.push("icon");
        allowCreation = false;
    }
    if(allowCreation) next();
    else response.status(200).json({created: false, errorFields: errorFields}).end();
}

function validateCategoryEdit(request, response, next) {
    var categoryId = request.body.categoryId;
    var title = request.body.title;
    var icon = request.body.icon;
    if(categoryId && !validation.invalidTitle(title) && !validation.invalidIcon(icon)) next();
    else response.status(200).json({edited: false}).end();
}

function validateTechnicalInformationCreation(request, response, next) {
    var title = request.body.title;
    if(!validation.invalidTitle(title)) next();
    else response.status(200).json({created: false, errorFields: ["title"]}).end();
}

function validateTechnicalInformationEdit(request, response, next) {
    var technicalInformationId = request.body.technicalInformationId;
    var title = request.body.title;
    if(technicalInformationId && !validation.invalidTitle(title)) next();
    else response.status(200).json({edited: false}).end();
}

function validateProductCreation(request, response, next) {
    var allowCreation = true;
    var errorFields = [];
    var title = request.body.title;
    if(validation.invalidTitle(title)) {
        errorFields.push("title");
        allowCreation = false;
    }
    var description = request.body.description;
    if(validation.invalidDescription(description)) {
        errorFields.push("description");
        allowCreation = false;
    }
    var price = request.body.price;
    if(validation.invalidPrice(price)) {
        errorFields.push("price");
        allowCreation = false;
    }
    var quantity = request.body.quantity;
    if(validation.invalidQuantity(quantity)) {
        errorFields.push("quantity");
        allowCreation = false;
    }
    var category = request.body.category;
    if(validation.invalidCategory(category)) {
        errorFields.push("category");
        allowCreation = false;
    }
    var primaryImage = request.files["primaryImage"][0];
    if(validation.invalidPrimaryImage(primaryImage) || request.extensionValidationError) {
        errorFields.push("primaryImage");
        allowCreation = false;
    }
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validation.invalidReCaptchaToken(reCaptcha_v3_SecretKey, axios, reCaptchaToken, request.connection.remoteAddress)) {
        errorFields.push("reCaptchaToken");
        allowCreation = false;
    }
    if(allowCreation) next();
    else response.status(200).json({created: false, errorFields: errorFields}).end();
}

function validateProductEdit(request, response, next) {
    var allowEdit = true;
    var errorFields = [];
    var type = request.body.type;
    if(type == "main") {
        var title = "";
        if(validation.invalidTitle(title)) {
            errorFields.push("title");
            allowEdit = false;
        }
        var description = request.body.description;
        if(validation.invalidDescription(description)) {
            errorFields.push("description");
            allowEdit = false;
        }
        var price = request.body.price;
        if(validation.invalidPrice(price)) {
            errorFields.push("price");
            allowEdit = false;
        }
        var quantity = request.body.quantity;
        if(validation.invalidQuantity(quantity)) {
            errorFields.push("quantity");
            allowEdit = false;
        }
        var category = request.body.category;
        if(validation.invalidCategory(category)) {
            errorFields.push("category");
            allowEdit = false;
        }
        if(allowEdit) next();
        else response.status(200).json({edited: false, errorFields: errorFields}).end();
    } else if(type == "technicalData") {
        next();
    } else if(type == "primaryImage") {
        var primaryImage = request.files["primaryImage"][0];
        if(!validation.invalidPrimaryImage(primaryImage) && !request.extensionValidationError) next();
        else response.status(200).json({edited: false, errorFields: ["primarymage"]}).end();
    } else if(type == "images") {
        next();
    } else {
        response.status(200).json({edited: false}).end();
    }
}

function validateRating(request, response, next) {
    var productId = request.body.productId;
    var username = request.body.username;
    var rating = Number(request.body.rating);
    if(productId && username && !validation.invalidRating(rating)) next();
    else response.status(200).json({rated: false}).end();
}

function validateReviewWriting(request, response, next) {
    var productId = request.body.productId;
    var username = request.body.username;
    var review = request.body.review;
    if(productId && username && !validation.invalidReview(review)) next();
    else response.status(200).json({written: false}).end();
}

function validateReviewEdit(request, response, next) {
    var reviewId = request.body.reviewId;
    var username = request.body.username;
    var review = request.body.review;
    if(reviewId && username && !validation.invalidReview(review)) next();
    else response.status(200).json({edited: false}).end();
}

function validPassword(password) {
    var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(password != "" && passwordFormat.test(password)) return true;
    else return false;
}

function isEmpty(object) {
    return !object || Object.keys(object).length === 0;
}

module.exports = {
    validateRegistration: validateRegistration,
    validateLogin: validateLogin,
    validateForgotCredentials: validateForgotCredentials,
    validatePasswordResetting: validatePasswordResetting,
    validateAccountEdit: validateAccountEdit,
    validateAddressEdit: validateAddressEdit,
    validateCategoryCreation: validateCategoryCreation,
    validateCategoryEdit: validateCategoryEdit,
    validateTechnicalInformationCreation: validateTechnicalInformationCreation,
    validateTechnicalInformationEdit: validateTechnicalInformationEdit,
    validateProductCreation: validateProductCreation,
    validateProductEdit: validateProductEdit,
    validateRating: validateRating,
    validateReviewWriting: validateReviewWriting,
    validateReviewEdit: validateReviewEdit,
    validPassword: validPassword,
    isEmpty: isEmpty
};