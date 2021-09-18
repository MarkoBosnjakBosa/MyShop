const validation = require("../helpers/validation.js");
const reCaptcha_v2_SecretKey = process.env.RECAPTCHA_v2_SECRET_KEY;
const reCaptcha_v3_SecretKey = process.env.RECAPTCHA_v3_SECRET_KEY;

function validateRegistration(request, response, next) {
    var allowRegistration = true;
    var errorFields = [];
    var user = request.body.user;
    var account = user.account;
    var address = user.address;
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validation.invalidUsername(account.username)) {
        errorFields = [...errorFields, "username"];
        allowRegistration = false;
    }
    if(validation.invalidEmail(account.email)) {
        errorFields = [...errorFields, "email"];
        allowRegistration = false;
    }
    if(validation.invalidPassword(account.password)) {
        errorFields = [...errorFields, "password"];
        allowRegistration = false;
    }
    if(validation.invalidFirstName(account.firstName)) {
        errorFields = [...errorFields, "firstName"];
        allowRegistration = false;
    }
    if(validation.invalidLastName(account.lastName)) {
        errorFields = [...errorFields, "lastName"];
        allowRegistration = false;
    }
    if(validation.invalidMobileNumber(account.mobileNumber)) {
        errorFields = [...errorFields, "mobileNumber"];
        allowRegistration = false;
    }
    if(validation.invalidStreet(address.street)) {
        errorFields = [...errorFields, "street"];
        allowRegistration = false;
    }
    if(validation.invalidHouseNumber(address.houseNumber)) {
        errorFields = [...errorFields, "houseNumber"];
        allowRegistration = false;
    }
    if(validation.invalidCity(address.city)) {
        errorFields = [...errorFields, "city"];
        allowRegistration = false;
    }
    if(validation.invalidZipCode(address.zipCode)) {
        errorFields = [...errorFields, "zipCode"];
        allowRegistration = false;
    }
    if(validation.invalidCountry(address.country)) {
        errorFields = [...errorFields, "country"];
        allowRegistration = false;
    }
    if(validation.invalidReCaptchaToken(reCaptcha_v2_SecretKey, reCaptchaToken, request.connection.remoteAddress)) {
        errorFields = [...errorFields, "reCaptchaToken"];
        allowRegistration = false;
    }
    if(allowRegistration) next();
    else response.status(200).json({created: false, alreadyExists: false, errorFields: errorFields}).end();
}

function validateLogin(request, response, next) {
    var username = request.body.username;
    if(!validation.invalidUsername(username)) next();
    else response.status(200).json({authentication: false, valid: false, allowed: false, errorFields: ["username"]}).end();
}

function validateAuthentication(request, response, next) {
    var authenticationToken = request.headers["authentication"];
    if(!validation.invalidAuthenticationToken(authenticationToken)) next();
    else response.status(200).json({authenticated: false}).end();
}

function validateForgotCredentials(request, response, next) {
    var email = request.body.email;
    var option = request.body.option;
    if(!validation.invalidEmail(email) && !validation.invalidOption(option)) next();
    else response.status(200).json({sent: false}).end();
}

function validatePasswordResetting(request, response, next) {
    var username = request.body.username;
    var password = request.body.password;
    if(!validation.invalidUsername(username) && !validation.invalidPassword(password)) next();
    else response.status(200).json({reset: false}).end();
}

function validateAccountEdit(request, response, next) {
    var allowEdit = true;
    var errorFields = [];
    var account = request.body.account;
    var username = account.username;
    var email = account.email;
    if(validation.invalidUsername(username) || validation.invalidEmail(email)) {
        errorFields = [...errorFields, "email"];
        allowEdit = false;
    }
    var firstName = account.firstName;
    if(validation.invalidFirstName(firstName)) {
        errorFields = [...errorFields, "firstName"];
        allowEdit = false;
    }
    var lastName = account.lastName;
    if(validation.invalidLastName(lastName)) {
        errorFields = [...errorFields, "lastName"];
        allowEdit = false;
    }
    var mobileNumber = account.mobileNumber;
    if(validation.invalidMobileNumber(mobileNumber)) {
        errorFields = [...errorFields, "mobileNumber"];
        allowEdit = false;
    }
    if(allowEdit) next();
    else response.status(200).json({edited: false, errorFields: errorFields}).end();
}

function validateAddressEdit(request, response, next) {
    var allowEdit = true;
    var errorFields = [];
    var address = request.body.address;
    var username = address.username;
    var street = address.street;
    if(validation.invalidUsername(username) || validation.invalidStreet(street)) {
        errorFields = [...errorFields, "street"];
        allowEdit = false;
    }
    var houseNumber = address.houseNumber;
    if(validation.invalidHouseNumber(houseNumber)) {
        errorFields = [...errorFields, "houseNumber"];
        allowEdit = false;
    }
    var city = address.city;
    if(validation.invalidCity(city)) {
        errorFields = [...errorFields, "city"];
        allowEdit = false;
    }
    var zipCode = address.zipCode;
    if(validation.invalidZipCode(zipCode)) {
        errorFields = [...errorFields, "zipCode"];
        allowEdit = false;
    }
    var country = address.country;
    if(validation.invalidCountry(country)) {
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
    if(validation.invalidTitle(title)) {
        errorFields = [...errorFields, "title"];
        allowCreation = false;
    }
    var icon = request.body.icon;
    if(validation.invalidIcon(icon)) {
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
        errorFields = [...errorFields, "title"];
        allowCreation = false;
    }
    var description = request.body.description;
    if(validation.invalidDescription(description)) {
        errorFields = [...errorFields, "description"];
        allowCreation = false;
    }
    var price = request.body.price;
    if(validation.invalidPrice(price)) {
        errorFields = [...errorFields, "price"];
        allowCreation = false;
    }
    var quantity = request.body.quantity;
    if(validation.invalidQuantity(quantity)) {
        errorFields = [...errorFields, "quantity"];
        allowCreation = false;
    }
    var category = request.body.category;
    if(validation.invalidCategory(category)) {
        errorFields = [...errorFields, "category"];
        allowCreation = false;
    }
    var primaryImage = request.files["primaryImage"][0];
    if(validation.invalidPrimaryImage(primaryImage) || request.extensionValidationError) {
        errorFields = [...errorFields, "primaryImage"];
        allowCreation = false;
    }
    var reCaptchaToken = request.body.reCaptchaToken;
    if(validation.invalidReCaptchaToken(reCaptcha_v3_SecretKey, reCaptchaToken, request.connection.remoteAddress)) {
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
        if(validation.invalidTitle(title)) {
            errorFields = [...errorFields, "title"];
            allowEdit = false;
        }
        var description = request.body.description;
        if(validation.invalidDescription(description)) {
            errorFields = [...errorFields, "description"];
            allowEdit = false;
        }
        var price = request.body.price;
        if(validation.invalidPrice(price)) {
            errorFields = [...errorFields, "price"];
            allowEdit = false;
        }
        var quantity = request.body.quantity;
        if(validation.invalidQuantity(quantity)) {
            errorFields = [...errorFields, "quantity"];
            allowEdit = false;
        }
        var category = request.body.category;
        if(validation.invalidCategory(category)) {
            errorFields = [...errorFields, "category"];
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

function validateContactSettings(request, response, next) {
    var allowSubmission = true;
    var errorFields = [];
    var contactSettings = request.body.contactSettings;
    var latitude = contactSettings.coordinates.lat;
    if(validation.invalidLatitude(latitude)) {
        errorFields = [...errorFields, "latitude"];
        allowSubmission = false;
    }
    var longitude = contactSettings.coordinates.lng;
    if(validation.invalidLongitude(longitude)) {
        errorFields = [...errorFields, "longitude"];
        allowSubmission = false;
    }
    var street = contactSettings.street;
    if(validation.invalidStreet(street)) {
        errorFields = [...errorFields, "street"];
        allowSubmission = false;
    }
    var houseNumber = contactSettings.houseNumber.toString();
    if(validation.invalidHouseNumber(houseNumber)) {
        errorFields = [...errorFields, "houseNumber"];
        allowSubmission = false;
    }
    var city = contactSettings.city;
    if(validation.invalidCity(city)) {
        errorFields = [...errorFields, "city"];
        allowSubmission = false;
    }
    var zipCode = contactSettings.zipCode.toString();
    if(validation.invalidZipCode(zipCode)) {
        errorFields = [...errorFields, "zipCode"];
        allowSubmission = false;
    }
    var country = contactSettings.country;
    if(validation.invalidCountry(country)) {
        errorFields = [...errorFields, "country"];
        allowSubmission = false;
    }
    if(allowSubmission) next();
    else response.status(200).json({saved: false, errorFields: errorFields}).end();
}

function validateContact(request, response, next) {
    var allowSubmission = true;
    var errorFields = [];
    var contact = request.body.contact;
    var firstName = contact.firstName;
    if(validation.invalidFirstName(firstName)) {
        errorFields = [...errorFields, "firstName"];
        allowSubmission = false;
    }
    var lastName = contact.lastName;
    if(validation.invalidLastName(lastName)) {
        errorFields = [...errorFields, "lastName"];
        allowSubmission = false;
    }
    var email = contact.email;
    if(validation.invalidEmail(email)) {
        errorFields = [...errorFields, "email"];
        allowSubmission = false;
    }
    var message = contact.message;
    if(validation.invalidMessage(message)) {
        errorFields = [...errorFields, "message"];
        allowSubmission = false;
    }
    if(allowSubmission) next();
    else response.status(200).json({submitted: false, errorFields: errorFields}).end();
}

function validateMessage(message) {
    if(message) return true;
    else return false;
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
    validateAuthentication: validateAuthentication,
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
    validateMessage: validateMessage,
    validPassword: validPassword,
    isEmpty: isEmpty
};