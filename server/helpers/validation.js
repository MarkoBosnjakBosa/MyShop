const axios = require("axios");

function invalidUsername(username) {
    var usernameFormat = /^[a-z0-9_.-]*$/;
    if(username != "" && usernameFormat.test(username)) return false;
    else return true;
}
function invalidEmail(email) {
    var emailFormat = /\S+@\S+\.\S+/;
    if(email != "" && emailFormat.test(email)) return false;
    else return true;
}
function invalidPassword(password) {
    var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(password != "" && passwordFormat.test(password)) return false;
    else return true;
}
function invalidFirstName(firstName) {
    return firstName == "";
}
function invalidLastName(lastName) {
    return lastName == "";
}
function invalidMobileNumber(mobileNumber) {
    var mobileNumberFormat = /^[1-9]\d*$/;
    if(mobileNumber != "" && mobileNumberFormat.test(mobileNumber)) return false;
    else return true;
}
function invalidStreet(street) {
    return street == "";
}
function invalidHouseNumber(houseNumber) {
    var houseNumberFormat = /^[1-9]\d*$/;
    if(houseNumber != "" && houseNumberFormat.test(houseNumber)) return false;
    else return true;
}
function invalidCity(city) {
    return city == "";
}
function invalidZipCode(zipCode) {
    var zipCodeFormat = /^[1-9]\d*$/;
    if(zipCode != "" && zipCodeFormat.test(zipCode)) return false;
    else return true;
}
function invalidCountry(country) {
    return country == "";
}
function invalidReCaptchaToken(reCaptchaSecretKey, reCaptchaToken, remoteIp) {
    if(reCaptchaToken == "" || reCaptchaToken == undefined || reCaptchaToken == null) return true;
    else {
        var reCaptchaVerificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + reCaptchaSecretKey + "&response=" + reCaptchaToken + "&remoteip=" + remoteIp;
        axios.get(reCaptchaVerificationUrl).then(reCaptchaResponse => {
            if(reCaptchaResponse.data.success) return false;
            else return true;
        });
    }
}
function invalidAuthenticationToken(authenticationToken) {
    var authenticationTokenFormat = /^\d{6}$/;
    if(authenticationToken != "" && authenticationTokenFormat.test(authenticationToken)) return false;
    else return true;
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
    var priceFormat = /^[1-9]*\.[0-9]{2}$/;
    if(price != "" && priceFormat.test(price))  return false;
    else return true;
}
function invalidQuantity(quantity) {
    var quantityFormat = /^[1-9]\d*$/;
    if(quantity != "" && quantityFormat.test(quantity)) return false;
    else return true;
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
function invalidRating(rating) {
    return rating < 1 || rating > 5;
}
function invalidReview(review) {
    return review == "";
}
function invalidOption(option) {
    if(option != "password" && option != "username" && option != "confirmation") return true;
    else return false;
}
function invalidLatitude(latitude) {
    if(latitude && !isNaN(latitude)) return false;
    else return true;
}
function invalidLongitude(longitude) {
    if(longitude && !isNaN(longitude)) return false;
    else return true;
}

module.exports = {
    invalidUsername: invalidUsername, 
    invalidEmail: invalidEmail,
    invalidPassword: invalidPassword,
    invalidFirstName: invalidFirstName,
    invalidLastName: invalidLastName,
    invalidMobileNumber: invalidMobileNumber,
    invalidStreet: invalidStreet,
    invalidHouseNumber: invalidHouseNumber,
    invalidCity: invalidCity,
    invalidZipCode: invalidZipCode,
    invalidCountry: invalidCountry,
    invalidReCaptchaToken: invalidReCaptchaToken,
    invalidAuthenticationToken: invalidAuthenticationToken,
    invalidTitle: invalidTitle,
    invalidIcon: invalidIcon,
    invalidDescription: invalidDescription,
    invalidPrice: invalidPrice,
    invalidQuantity: invalidQuantity,
    invalidCategory: invalidCategory,
    invalidPrimaryImage: invalidPrimaryImage,
    invalidMessage: invalidMessage,
    invalidRating: invalidRating,
    invalidReview: invalidReview,
    invalidOption: invalidOption,
    invalidLatitude: invalidLatitude,
    invalidLongitude: invalidLongitude
};