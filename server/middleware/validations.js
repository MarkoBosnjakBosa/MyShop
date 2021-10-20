const validations = require("../helpers/validations.js");
const reCaptcha_v2_SecretKey = process.env.RECAPTCHA_v2_SECRET_KEY;
const reCaptcha_v3_SecretKey = process.env.RECAPTCHA_v3_SECRET_KEY;

function validateRegistration(request, response, next) {
    var allowRegistration = true;
    var errorFields = [];
    var user = request.body.user;
    var account = user.account;
    var address = user.address;
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validations.invalidUsername(account.username)) {
        errorFields = [...errorFields, "username"];
        allowRegistration = false;
    }
    if(validations.invalidEmail(account.email)) {
        errorFields = [...errorFields, "email"];
        allowRegistration = false;
    }
    if(validations.invalidPassword(account.password)) {
        errorFields = [...errorFields, "password"];
        allowRegistration = false;
    }
    if(validations.invalidFirstName(account.firstName)) {
        errorFields = [...errorFields, "firstName"];
        allowRegistration = false;
    }
    if(validations.invalidLastName(account.lastName)) {
        errorFields = [...errorFields, "lastName"];
        allowRegistration = false;
    }
    if(validations.invalidMobileNumber(account.mobileNumber)) {
        errorFields = [...errorFields, "mobileNumber"];
        allowRegistration = false;
    }
    if(validations.invalidStreet(address.street)) {
        errorFields = [...errorFields, "street"];
        allowRegistration = false;
    }
    if(validations.invalidHouseNumber(address.houseNumber)) {
        errorFields = [...errorFields, "houseNumber"];
        allowRegistration = false;
    }
    if(validations.invalidCity(address.city)) {
        errorFields = [...errorFields, "city"];
        allowRegistration = false;
    }
    if(validations.invalidZipCode(address.zipCode)) {
        errorFields = [...errorFields, "zipCode"];
        allowRegistration = false;
    }
    if(validations.invalidCountry(address.country)) {
        errorFields = [...errorFields, "country"];
        allowRegistration = false;
    }
    if(validations.invalidReCaptchaToken(reCaptcha_v2_SecretKey, reCaptchaToken, request.connection.remoteAddress)) {
        errorFields = [...errorFields, "reCaptchaToken"];
        allowRegistration = false;
    }
    if(allowRegistration) next();
    else response.status(200).json({created: false, alreadyExists: false, errorFields: errorFields}).end();
}

function validateLogin(request, response, next) {
    var allowLogin = true;
    var errorFields = [];
    var username = request.body.username;
    if(validations.invalidUsername(username)) {
        errorFields = [...errorFields, "username"];
        allowLogin = false;
    }
    var password = request.body.password;
    if(validations.invalidPassword(password)) {
        errorFields = [...errorFields, "password"];
        allowLogin = false;
    }
    if(allowLogin) next();
    else response.status(200).json({authentication: false, valid: false, allowed: false, errorFields: errorFields}).end();
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

function validatePasswordResetting(request, response, next) {
    var username = request.body.username;
    var password = request.body.password;
    if(!validations.invalidUsername(username) && !validations.invalidPassword(password)) next();
    else response.status(200).json({reset: false}).end();
}

function validateAccountEdit(request, response, next) {
    var allowEdit = true;
    var errorFields = [];
    var account = request.body.account;
    var username = account.username;
    var email = account.email;
    if(validations.invalidUsername(username) || validations.invalidEmail(email)) {
        errorFields = [...errorFields, "email"];
        allowEdit = false;
    }
    var firstName = account.firstName;
    if(validations.invalidFirstName(firstName)) {
        errorFields = [...errorFields, "firstName"];
        allowEdit = false;
    }
    var lastName = account.lastName;
    if(validations.invalidLastName(lastName)) {
        errorFields = [...errorFields, "lastName"];
        allowEdit = false;
    }
    var mobileNumber = account.mobileNumber;
    if(validations.invalidMobileNumber(mobileNumber)) {
        errorFields = [...errorFields, "mobileNumber"];
        allowEdit = false;
    }
    if(allowEdit) next();
    else response.status(200).json({edited: false, errorFields: errorFields}).end();
}

function validateAddressEdit(request, response, next) {
    var allowEdit = true;
    var errorFields = [];
    var username = request.body.username;
    var address = request.body.address;
    var street = address.street;
    if(validations.invalidUsername(username) || validations.invalidStreet(street)) {
        errorFields = [...errorFields, "street"];
        allowEdit = false;
    }
    var houseNumber = address.houseNumber;
    if(validations.invalidHouseNumber(houseNumber)) {
        errorFields = [...errorFields, "houseNumber"];
        allowEdit = false;
    }
    var city = address.city;
    if(validations.invalidCity(city)) {
        errorFields = [...errorFields, "city"];
        allowEdit = false;
    }
    var zipCode = address.zipCode;
    if(validations.invalidZipCode(zipCode)) {
        errorFields = [...errorFields, "zipCode"];
        allowEdit = false;
    }
    var country = address.country;
    if(validations.invalidCountry(country)) {
        errorFields = [...errorFields, "country"];
        allowEdit = false;
    }
    if(allowEdit) next();
    else response.status(200).json({edited: false, errorFields: errorFields}).end();
}

function validateCategoryCreation(request, response, next) {
    var allowCreation = true;
    var errorFields = [];
    var title = request.body.title;
    if(validations.invalidTitle(title)) {
        errorFields = [...errorFields, "title"];
        allowCreation = false;
    }
    var icon = request.body.icon;
    if(validations.invalidIcon(icon)) {
        errorFields = [...errorFields, "icon"];
        allowCreation = false;
    }
    if(allowCreation) next();
    else response.status(200).json({created: false, errorFields: errorFields}).end();
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
    else response.status(200).json({created: false, errorFields: ["title"]}).end();
}

function validateTechnicalInformationEdit(request, response, next) {
    var technicalInformationId = request.body.technicalInformationId;
    var title = request.body.title;
    if(technicalInformationId && !validations.invalidTitle(title)) next();
    else response.status(200).json({edited: false}).end();
}

function validateProductCreation(request, response, next) {
    var allowCreation = true;
    var errorFields = [];
    var title = request.body.title;
    if(validations.invalidTitle(title)) {
        errorFields = [...errorFields, "title"];
        allowCreation = false;
    }
    var description = request.body.description;
    if(validations.invalidDescription(description)) {
        errorFields = [...errorFields, "description"];
        allowCreation = false;
    }
    var price = request.body.price;
    if(validations.invalidPrice(price)) {
        errorFields = [...errorFields, "price"];
        allowCreation = false;
    }
    var quantity = request.body.quantity;
    if(validations.invalidQuantity(quantity)) {
        errorFields = [...errorFields, "quantity"];
        allowCreation = false;
    }
    var category = request.body.category;
    if(validations.invalidCategory(category)) {
        errorFields = [...errorFields, "category"];
        allowCreation = false;
    }
    var primaryImage = request.files["primaryImage"][0];
    if(validations.invalidPrimaryImage(primaryImage) || request.extensionValidationError) {
        errorFields = [...errorFields, "primaryImage"];
        allowCreation = false;
    }
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validations.invalidReCaptchaToken(reCaptcha_v3_SecretKey, reCaptchaToken, request.connection.remoteAddress)) {
        errorFields = [...errorFields, "reCaptchaToken"];
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
        var title = request.body.title;
        if(validations.invalidTitle(title)) {
            errorFields = [...errorFields, "title"];
            allowEdit = false;
        }
        var description = request.body.description;
        if(validations.invalidDescription(description)) {
            errorFields = [...errorFields, "description"];
            allowEdit = false;
        }
        var price = request.body.price;
        if(validations.invalidPrice(price)) {
            errorFields = [...errorFields, "price"];
            allowEdit = false;
        }
        var quantity = request.body.quantity;
        if(validations.invalidQuantity(quantity)) {
            errorFields = [...errorFields, "quantity"];
            allowEdit = false;
        }
        var category = request.body.category;
        if(validations.invalidCategory(category)) {
            errorFields = [...errorFields, "category"];
            allowEdit = false;
        }
        if(allowEdit) next();
        else response.status(200).json({edited: false, errorFields: errorFields}).end();
    } else if(type == "technicalData") {
        next();
    } else if(type == "primaryImage") {
        var primaryImage = request.files["primaryImage"][0];
        if(!validations.invalidPrimaryImage(primaryImage) && !request.extensionValidationError) next();
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
    var allowSaving = true;
    var errorFields = [];
    var contactSettings = request.body.contactSettings;
    var latitude = contactSettings.coordinates.lat;
    if(validations.invalidLatitude(latitude)) {
        errorFields = [...errorFields, "latitude"];
        allowSaving = false;
    }
    var longitude = contactSettings.coordinates.lng;
    if(validations.invalidLongitude(longitude)) {
        errorFields = [...errorFields, "longitude"];
        allowSaving = false;
    }
    var street = contactSettings.street;
    if(validations.invalidStreet(street)) {
        errorFields = [...errorFields, "street"];
        allowSaving = false;
    }
    var houseNumber = contactSettings.houseNumber;
    if(validations.invalidHouseNumber(houseNumber)) {
        errorFields = [...errorFields, "houseNumber"];
        allowSaving = false;
    }
    var city = contactSettings.city;
    if(validations.invalidCity(city)) {
        errorFields = [...errorFields, "city"];
        allowSaving = false;
    }
    var zipCode = contactSettings.zipCode;
    if(validations.invalidZipCode(zipCode)) {
        errorFields = [...errorFields, "zipCode"];
        allowSaving = false;
    }
    var country = contactSettings.country;
    if(validations.invalidCountry(country)) {
        errorFields = [...errorFields, "country"];
        allowSaving = false;
    }
    var mobileNumber = contactSettings.mobileNumber;
    if(validations.invalidMobileNumber(mobileNumber)) {
        errorFields = [...errorFields, "mobileNumber"];
        allowSaving = false;
    }
    var email = contactSettings.email;
    if(validations.invalidEmail(email)) {
        errorFields = [...errorFields, "email"];
        allowSaving = false;
    }
    if(allowSaving) next();
    else response.status(200).json({saved: false, errorFields: errorFields}).end();
}

function validateContact(request, response, next) {
    var allowSubmission = true;
    var errorFields = [];
    var contact = request.body.contact;
    var firstName = contact.firstName;
    if(validations.invalidFirstName(firstName)) {
        errorFields = [...errorFields, "firstName"];
        allowSubmission = false;
    }
    var lastName = contact.lastName;
    if(validations.invalidLastName(lastName)) {
        errorFields = [...errorFields, "lastName"];
        allowSubmission = false;
    }
    var email = contact.email;
    if(validations.invalidEmail(email)) {
        errorFields = [...errorFields, "email"];
        allowSubmission = false;
    }
    var mobileNumber = contact.mobileNumber;
    if(validations.invalidMobileNumber(mobileNumber)) {
        errorFields = [...errorFields, "mobileNumber"];
        allowSubmission = false;
    }
    var message = contact.message;
    if(validations.invalidMessage(message)) {
        errorFields = [...errorFields, "message"];
        allowSubmission = false;
    }
    if(allowSubmission) next();
    else response.status(200).json({submitted: false, errorFields: errorFields}).end();
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
    validateContactSettings: validateContactSettings,
    validateContact: validateContact,
    validateHomeSettingsMessage: validateHomeSettingsMessage,
    validateMessage: validateMessage,
    isEmpty: isEmpty
};