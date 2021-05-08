var validation = require("../helpers/validation.js");

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
    } else {
        next();
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
    validateEditProduct: validateEditProduct,
    validateDeleteProductImage: validateDeleteProductImage
};