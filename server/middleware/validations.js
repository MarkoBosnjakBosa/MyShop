const validations = require("../helpers/validations.js");
const reCaptcha_v2_SecretKey = process.env.RECAPTCHA_v2_SECRET_KEY;
const reCaptcha_v3_SecretKey = process.env.RECAPTCHA_v3_SECRET_KEY;

function validateRegistration(request, response, next) {
    var errors = [];
    var user = request.body.user;
    var account = user.account;
    var address = user.address;
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validations.invalidUsername(account.username)) {
        errors = [...errors, "username"];
    }
    if(validations.invalidEmail(account.email)) {
        errors = [...errors, "email"];
    }
    if(validations.invalidPassword(account.password)) {
        errors = [...errors, "password"];
    }
    if(validations.invalidFirstName(account.firstName)) {
        errors = [...errors, "firstName"];
    }
    if(validations.invalidLastName(account.lastName)) {
        errors = [...errors, "lastName"];
    }
    if(validations.invalidMobileNumber(account.mobileNumber)) {
        errors = [...errors, "mobileNumber"];
    }
    if(validations.invalidStreet(address.street)) {
        errors = [...errors, "street"];
    }
    if(validations.invalidHouseNumber(address.houseNumber)) {
        errors = [...errors, "houseNumber"];
    }
    if(validations.invalidCity(address.city)) {
        errors = [...errors, "city"];
    }
    if(validations.invalidZipCode(address.zipCode)) {
        errors = [...errors, "zipCode"];
    }
    if(validations.invalidCountry(address.country)) {
        errors = [...errors, "country"];
    }
    if(validations.invalidReCaptchaToken(reCaptcha_v2_SecretKey, reCaptchaToken, request.connection.remoteAddress)) {
        errors = [...errors, "reCaptchaToken"];
    }
    if(!errors.length) next();
    else response.status(200).json({registered: false, alreadyExists: false, errors: errors}).end();
}

function validateLogin(request, response, next) {
    var errors = [];
    var username = request.body.username;
    if(validations.invalidUsername(username)) {
        errors = [...errors, "username"];
    }
    var password = request.body.password;
    if(validations.invalidPassword(password)) {
        errors = [...errors, "password"];
    }
    if(!errors.length) next();
    else response.status(200).json({authentication: false, valid: false, found: false, errors: errors}).end();
}

function validateAuthentication(request, response, next) {
    var username = request.body.username;
    var authenticationToken = request.headers["authentication"];
    if(!validations.invalidUsername(username) && !validations.invalidAuthenticationToken(authenticationToken)) next();
    else response.status(200).json({authenticated: false}).end();
}

function validateAuthenticationEnabling(request, response, next) {
    var username = request.body.username;
    var authenticationEnabled = request.body.authenticationEnabled;
    if(authenticationEnabled) {
        var authenticationEnablingToken = request.body.authenticationEnablingToken;
        if(!validations.invalidUsername(username) && !validations.invalidAuthenticationToken(authenticationEnablingToken)) next();
        else response.status(200).json({authenticated: false}).end();
    } else {
        next();
    }
}

function validateForgotCredentials(request, response, next) {
    var email = request.body.email;
    var option = request.body.option;
    if(!validations.invalidEmail(email) && !validations.invalidOption(option)) next();
    else response.status(200).json({sent: false}).end();
}

function validatePasswordReset(request, response, next) {
    var username = request.body.username;
    var password = request.body.password;
    if(!validations.invalidUsername(username) && !validations.invalidPassword(password)) next();
    else response.status(200).json({reset: false}).end();
}

function validateAccountEdit(request, response, next) {
    var errors = [];
    var account = request.body.account;
    var username = account.username;
    var email = account.email;
    if(validations.invalidUsername(username) || validations.invalidEmail(email)) {
        errors = [...errors, "email"];
    }
    var firstName = account.firstName;
    if(validations.invalidFirstName(firstName)) {
        errors = [...errors, "firstName"];
    }
    var lastName = account.lastName;
    if(validations.invalidLastName(lastName)) {
        errors = [...errors, "lastName"];
    }
    var mobileNumber = account.mobileNumber;
    if(validations.invalidMobileNumber(mobileNumber)) {
        errors = [...errors, "mobileNumber"];
    }
    if(!errors.length) next();
    else response.status(200).json({edited: false, errors: errors}).end();
}

function validateAddressEdit(request, response, next) {
    var errors = [];
    var username = request.body.username;
    var address = request.body.address;
    var street = address.street;
    if(validations.invalidUsername(username) || validations.invalidStreet(street)) {
        errors = [...errors, "street"];
    }
    var houseNumber = address.houseNumber;
    if(validations.invalidHouseNumber(houseNumber)) {
        errors = [...errors, "houseNumber"];
    }
    var city = address.city;
    if(validations.invalidCity(city)) {
        errors = [...errors, "city"];
    }
    var zipCode = address.zipCode;
    if(validations.invalidZipCode(zipCode)) {
        errors = [...errors, "zipCode"];
    }
    var country = address.country;
    if(validations.invalidCountry(country)) {
        errors = [...errors, "country"];
    }
    if(!errors.length) next();
    else response.status(200).json({edited: false, errors: errors}).end();
}

function validateCategoryCreation(request, response, next) {
    var errors = [];
    var title = request.body.title;
    if(validations.invalidTitle(title)) {
        errors = [...errors, "title"];
    }
    var icon = request.body.icon;
    if(validations.invalidIcon(icon)) {
        errors = [...errors, "icon"];
    }
    if(!errors.length) next();
    else response.status(200).json({created: false, errors: errors}).end();
}

function validateCategoryEdit(request, response, next) {
    var categoryId = request.body.categoryId;
    var title = request.body.title;
    var icon = request.body.icon;
    if(categoryId && !validations.invalidTitle(title) && !validations.invalidIcon(icon)) next();
    else response.status(200).json({edited: false}).end();
}

function validateTechnicalInformationCreation(request, response, next) {
    var title = request.body.title;
    if(!validations.invalidTitle(title)) next();
    else response.status(200).json({created: false, errors: ["title"]}).end();
}

function validateTechnicalInformationEdit(request, response, next) {
    var technicalInformationId = request.body.technicalInformationId;
    var title = request.body.title;
    if(technicalInformationId && !validations.invalidTitle(title)) next();
    else response.status(200).json({edited: false}).end();
}

function validateProductCreation(request, response, next) {
    var errors = [];
    var title = request.body.title;
    if(validations.invalidTitle(title)) {
        errors = [...errors, "title"];
    }
    var description = request.body.description;
    if(validations.invalidDescription(description)) {
        errors = [...errors, "description"];
    }
    var price = request.body.price;
    if(validations.invalidPrice(price)) {
        errors = [...errors, "price"];
    }
    var quantity = request.body.quantity;
    if(validations.invalidQuantity(quantity)) {
        errors = [...errors, "quantity"];
    }
    var category = request.body.category;
    if(validations.invalidCategory(category)) {
        errors = [...errors, "category"];
    }
    if(request.files["primaryImage"] && request.files["primaryImage"][0]) {
        var primaryImage = request.files["primaryImage"][0];
        if(validations.invalidPrimaryImage(primaryImage) || request.extensionValidationError) {
            errors = [...errors, "primaryImage"];
        }
    } else {
        errors = [...errors, "primaryImage"]; 
    }
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validations.invalidReCaptchaToken(reCaptcha_v3_SecretKey, reCaptchaToken, request.connection.remoteAddress)) {
        errors = [...errors, "reCaptchaToken"];
    }
    if(!errors.length) next();
    else response.status(200).json({created: false, errors: errors}).end();
}

function validateProductEdit(request, response, next) {
    var errors = [];
    var productId = request.body.productId;
    if(productId) {
        var type = request.body.type;
        if(type === "main") {
            var title = request.body.title;
            if(validations.invalidTitle(title)) {
                errors = [...errors, "title"];
            }
            var description = request.body.description;
            if(validations.invalidDescription(description)) {
                errors = [...errors, "description"];
            }
            var price = request.body.price;
            if(validations.invalidPrice(price)) {
                errors = [...errors, "price"];
            }
            var quantity = request.body.quantity;
            if(validations.invalidQuantity(quantity)) {
                errors = [...errors, "quantity"];
            }
            var category = request.body.category;
            if(validations.invalidCategory(category)) {
                errors = [...errors, "category"];
            }
            if(!errors.length) next();
            else response.status(200).json({edited: false, errors: errors}).end();
        } else if(type === "technicalData") {
            next();
        } else if(type === "primaryImage") {
            if(request.files["primaryImage"] && request.files["primaryImage"][0]) {
                var primaryImage = request.files["primaryImage"][0];
                if(!validations.invalidPrimaryImage(primaryImage) && !request.extensionValidationError) {
                    next();
                } else {
                    response.status(200).json({edited: false, errors: ["primaryImage"]}).end();
                }
            } else{
                response.status(200).json({edited: false, errors: ["primaryImage"]}).end();
            }
        } else if(type === "images") {
            next();
        } else {
            response.status(200).json({edited: false}).end();
        }
    } else {
        response.status(200).json({edited: false}).end();
    }
}

function validateRating(request, response, next) {
    var productId = request.body.productId;
    var username = request.body.username;
    var rating = Number(request.body.rating);
    if(productId && username && !validations.invalidRating(rating)) next();
    else response.status(200).json({rated: false}).end();
}

function validateReviewWriting(request, response, next) {
    var productId = request.body.productId;
    var username = request.body.username;
    var review = request.body.review;
    if(productId && username && !validations.invalidReview(review)) next();
    else response.status(200).json({written: false}).end();
}

function validateReviewEdit(request, response, next) {
    var reviewId = request.body.reviewId;
    var username = request.body.username;
    var review = request.body.review;
    if(reviewId && username && !validations.invalidReview(review)) next();
    else response.status(200).json({edited: false}).end();
}

function validateContactSettings(request, response, next) {
    var errors = [];
    var contactSettings = request.body.contactSettings;
    var latitude = contactSettings.coordinates.lat;
    if(validations.invalidLatitude(latitude)) {
        errors = [...errors, "latitude"];
    }
    var longitude = contactSettings.coordinates.lng;
    if(validations.invalidLongitude(longitude)) {
        errors = [...errors, "longitude"];
    }
    var street = contactSettings.street;
    if(validations.invalidStreet(street)) {
        errors = [...errors, "street"];
    }
    var houseNumber = contactSettings.houseNumber;
    if(validations.invalidHouseNumber(houseNumber)) {
        errors = [...errors, "houseNumber"];
    }
    var city = contactSettings.city;
    if(validations.invalidCity(city)) {
        errors = [...errors, "city"];
    }
    var zipCode = contactSettings.zipCode;
    if(validations.invalidZipCode(zipCode)) {
        errors = [...errors, "zipCode"];
    }
    var country = contactSettings.country;
    if(validations.invalidCountry(country)) {
        errors = [...errors, "country"];
    }
    var mobileNumber = contactSettings.mobileNumber;
    if(validations.invalidMobileNumber(mobileNumber)) {
        errors = [...errors, "mobileNumber"];
    }
    var email = contactSettings.email;
    if(validations.invalidEmail(email)) {
        errors = [...errors, "email"];
    }
    if(!errors.length) next();
    else response.status(200).json({saved: false, errors: errors}).end();
}

function validateContact(request, response, next) {
    var errors = [];
    var contact = request.body.contact;
    var firstName = contact.firstName;
    if(validations.invalidFirstName(firstName)) {
        errors = [...errors, "firstName"];
    }
    var lastName = contact.lastName;
    if(validations.invalidLastName(lastName)) {
        errors = [...errors, "lastName"];
    }
    var email = contact.email;
    if(validations.invalidEmail(email)) {
        errors = [...errors, "email"];
    }
    var mobileNumber = contact.mobileNumber;
    if(validations.invalidMobileNumber(mobileNumber)) {
        errors = [...errors, "mobileNumber"];
    }
    var message = contact.message;
    if(validations.invalidMessage(message)) {
        errors = [...errors, "message"];
    }
    if(!errors.length) next();
    else response.status(200).json({submitted: false, errors: errors}).end();
}

function validateHomeSettingsMessage(request, response, next) {
    var message = request.body.message;
    if(!validations.invalidMessage(message)) next();
    else response.status(200).json({saved: false}).end();
}

function validateMessage(message) {
    if(!validations.invalidMessage(message)) return true;
    else return false;
}

function isEmpty(object) {
    return !object || Object.keys(object).length === 0;
}

module.exports = {
    validateRegistration: validateRegistration,
    validateLogin: validateLogin,
    validateAuthentication: validateAuthentication,
    validateAuthenticationEnabling: validateAuthenticationEnabling,
    validateForgotCredentials: validateForgotCredentials,
    validatePasswordReset: validatePasswordReset,
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
    validateContactSettings: validateContactSettings,
    validateContact: validateContact,
    validateHomeSettingsMessage: validateHomeSettingsMessage,
    validateMessage: validateMessage,
    isEmpty: isEmpty
};