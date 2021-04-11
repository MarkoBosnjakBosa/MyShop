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
function invalidReCaptchaToken(reCaptchav2SecretKey, axios, reCaptchaToken, remoteIp) {
    if(reCaptchaToken == "" || reCaptchaToken == undefined || reCaptchaToken == null) {
        return true;
    } else {
        var reCaptchaVerificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + reCaptchav2SecretKey + "&response=" + reCaptchaToken + "&remoteip=" + remoteIp;
        axios.get(reCaptchaVerificationUrl).then(reCaptchaResponse => {
            if(reCaptchaResponse.data.success) {
                return false;
            } else {
                return true;
            }
        });
    }
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
    validUsername: validUsername,
    validEmail: validEmail,
    validPassword: validPassword,
    isEmpty: isEmpty
};