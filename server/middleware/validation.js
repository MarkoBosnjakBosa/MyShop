var validation = require("../helpers/validation.js");
const axios = require("axios");
var reCaptcha_v3_SecretKey = process.env.RECAPTCHA_v3_SECRET_KEY;

function validateCreateProduct(request, response, next) {
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
    if(allowCreation) {
        next();
    } else {
        response.status(200).json({created: false, errorFields: errorFields}).end();
    }
}

function validateEditProduct(request, response, next) {
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
        if(allowEdit) {
            next();
        } else {
            response.status(200).json({edited: false, errorFields: errorFields}).end();
        }
    } else if(type == "technicalData") {
        next();
    } else if(type == "primaryImage") {
        var primaryImage = request.files["primaryImage"][0];
        if(!validation.invalidPrimaryImage(primaryImage) && !request.extensionValidationError) {
            next();
        } else {
            response.status(200).json({edited: false, errorFields: ["primarymage"]}).end();
        }
    } else if(type == "images") {
        next();
    } else {
        response.status(200).json({edited: false}).end();
    }
}

function validateDeleteProductImage(request, response, next) {
    var productId = request.body.productId;
    var imageId = request.body.imageId;
    var imageName = request.body.imageName;
    if(productId && imageId && imageName) {
        next();
    } else {
        response.status(200).json({edited: false, errorFields: errorFields}).end();
    }
}

module.exports = {
    validateCreateProduct: validateCreateProduct,
    validateEditProduct: validateEditProduct,
    validateDeleteProductImage: validateDeleteProductImage
};