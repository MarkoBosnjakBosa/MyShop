function invalidUsername(username) {
    var usernameFormat = /^[a-z0-9_.-]*$/;
    if(username != "" && usernameFormat.test(username)) {
        return false;
    } else {
        return true;
    }
}
function invalidEmail(email) {
    var emailFormat = /\S+@\S+\.\S+/;
    if(email != "" && emailFormat.test(email)) {
        return false;
    } else {
        return true;
    }
}
function invalidPassword(password) {
    var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(password != "" && passwordFormat.test(password)) {
        return false;
    } else {
        return true;
    }
}
function invalidMobileNumber(mobileNumber) {
    var mobileNumberFormat = /^[0-9]\d*$/;
    if(mobileNumber != "" && mobileNumberFormat.test(mobileNumber)) {
        return false;
    } else {
        return true;
    }
}
function invalidHouseNumber(houseNumber) {
    var houseNumberFormat = /^[0-9]\d*$/;
    if(houseNumber != "" && houseNumberFormat.test(houseNumber)) {
        return false;
    } else {
        return true;
    }
}
function invalidZipCode(zipCode) {
    var zipCodeFormat = /^[0-9]\d*$/;
    if(zipCode != "" && zipCodeFormat.test(zipCode)) {
        return false;
    } else {
        return true;
    }
}
function invalidReCaptchaToken(reCaptchaSecretKey, axios, reCaptchaToken, remoteIp) {
    if(reCaptchaToken == "" || reCaptchaToken == undefined || reCaptchaToken == null) {
        return true;
    } else {
        var reCaptchaVerificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + reCaptchaSecretKey + "&response=" + reCaptchaToken + "&remoteip=" + remoteIp;
        axios.get(reCaptchaVerificationUrl).then(reCaptchaResponse => {
            if(reCaptchaResponse.data.success) {
                return false;
            } else {
                return true;
            }
        });
    }
}
function invalidTitle(title) {
    return title == "";
}
function invalidIcon(icon) {
    return icon == "";
}
function invalidDescription(description) { 
    return description == ""; 
}
function invalidPrice(price) {
    var priceFormat = /^[0-9]*\.[0-9]{2}$/;
    if(price != "" && priceFormat.test(price)) {
        return false;
    } else {
        return true;
    }
}
function invalidQuantity(quantity) {
    var quantityFormat = /^[0-9]\d*$/;
    if(quantity != "" && quantityFormat.test(quantity)) {
        return false;
    } else {
        return true;
    }
}
function invalidCategory(category) { 
    return category == ""; 
}
function invalidPrimaryImage(primaryImage) { 
    return primaryImage == ""; 
}
function invalidMessage(message) { 
    return message == ""; 
}
function validUsername(username) {
    var usernameFormat = /^[a-z0-9_.-]*$/;
    if(username != "" && usernameFormat.test(username)) {
        return true;
    } else {
        return false;
    }
}
function validEmail(email) {
    var emailFormat = /\S+@\S+\.\S+/;
    if(email != "" && emailFormat.test(email)) {
        return true;
    } else {
        return false;
    }
}
function validPassword(password) {
    var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(password != "" && passwordFormat.test(password)) {
        return true;
    } else {
        return false;
    }
}
function isEmpty(object) {
    return !object || Object.keys(object).length === 0;
}

module.exports = {
    invalidUsername: invalidUsername, 
    invalidEmail: invalidEmail,
    invalidPassword: invalidPassword,
    invalidMobileNumber: invalidMobileNumber,
    invalidHouseNumber: invalidHouseNumber,
    invalidZipCode: invalidZipCode,
    invalidReCaptchaToken: invalidReCaptchaToken,
    invalidTitle: invalidTitle,
    invalidIcon: invalidIcon,
    invalidDescription: invalidDescription,
    invalidPrice: invalidPrice,
    invalidQuantity: invalidQuantity,
    invalidCategory: invalidCategory,
    invalidPrimaryImage: invalidPrimaryImage,
    invalidMessage: invalidMessage,
    validUsername: validUsername,
    validEmail: validEmail,
    validPassword: validPassword,
    isEmpty: isEmpty
};