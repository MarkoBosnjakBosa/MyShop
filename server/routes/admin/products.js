module.exports = function(app, models, multer, fs, path, validation, reCaptcha_v3_SecretKey, axios) {
	const Product = models.Product;
    var storage = multer.diskStorage({
		destination: function (request, file, callback) {
			callback(null, "images/products");
		},
		filename: function (request, file, callback) {
			var fileArray = file.originalname.split(".");
			var fileName = fileArray[0] + "_" + Date.now() + "." + fileArray[1];
			callback(null, fileName);
		},
	});
	var upload = multer({
		storage: storage,
		fileFilter: function (request, file, callback) {
			if(file.mimetype.match("image.*")) {
				callback(null, true);
			} else {
				request.extensionValidationError = true;
				return callback(null, false, request.extensionValidationError);
			}
		}
	});
	app.post("/getProducts", (request, response) => {
		var search = request.body.search;
		var page = Number(request.body.page) - 1; 
		var limit = Number(request.body.limit);
		var skip = page * limit;
		var query;
		if(search != "") {
			query = {$or: [{title: {$regex: search, $options: "i" }}, {description: {$regex: search, $options: "i"}}]};
		} else {
			query = {};
		}
		var productsQuery = Product.find(query).skip(skip).limit(limit);
		var totalQuery = Product.find(productsQuery).countDocuments();
		var queries = [productsQuery, totalQuery];
		Promise.all(queries).then(results => {
			response.status(200).json({products: results[0], total: results[1]}).end();
		});
    });
	app.get("/getProduct/:productId", (request, response) => {
		var productId = request.params.productId;
		var query = {_id: productId};
        Product.findOne(query).then(product => {
            response.status(200).json({product: product}).end();
        }).catch(error => console.log(error));
	});
    app.post("/createProduct", upload.fields([{name: "primaryImage"}, {name: "images", maxCount: 9}]), (request, response) => {
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
            allowRegistration = false;
        }
		if(allowCreation) {
			var technicalData = JSON.parse(request.body.technicalData);
			var primaryImageRead = fs.readFileSync(primaryImage.path);
			var encodedPrimaryImage = primaryImageRead.toString("base64");
			var primaryImageObject = {name: primaryImage.filename, contentType: primaryImage.mimetype, image: Buffer.from(encodedPrimaryImage, "base64")};
			var images = request.files["images"];
			var imagesObjects = [];
			if(images != null && images != "" && images.length > 0) {
				for(var image = 0; image < images.length; image++) {
					var imageRead = fs.readFileSync(images[image].path);
					var encodedImage = imageRead.toString("base64");
					var imageObject = {name: images[image].filename, contentType: images[image].mimetype, image: Buffer.from(encodedImage, "base64")};
					imagesObjects.push(imageObject);
				}
			}
			var review = {votes: 0, rating: 0, averageRating: 0};
			var newProduct = getProductScheme(Product, title, description, price, quantity, category, technicalData, primaryImageObject, imagesObjects, review);
			newProduct.save().then(product => {
				response.status(200).json({created: true}).end();
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({created: false, errorFields: errorFields}).end();
		}
	});
	app.put("/editProduct", upload.fields([{name: "primaryImage"}, {name: "images", maxCount: 9}]), (request, response) => {
		var productId = request.body.productId;
		var query = {_id: productId};
		var type = request.body.type;
		var allowEdit = true;
		var errorFields = [];
		if(type == "main") {
			var title = request.body.title;
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
				var update = {title: title, description: description, price: price, quantity: quantity, category: category};
				Product.findOneAndUpdate(query, update).then(product => {
					response.status(200).json({edited: true}).end();
				}).catch(error => console.log(error));
			} else {
				response.status(200).json({edited: false, errorFields: errorFields}).end();
			}
		} else if(type == "technicalData") {
			var technicalData = JSON.parse(request.body.technicalData);
			var update = {technicalData: technicalData};
			Product.findOneAndUpdate(query, update).then(product => {
				response.status(200).json({edited: true}).end();
			}).catch(error => console.log(error));
		} else if(type == "primaryImage") {
			var primaryImage = request.files["primaryImage"][0];
			if(validation.invalidPrimaryImage(primaryImage) || request.extensionValidationError) {
				errorFields.push("primaryImage");
				allowEdit = false;
			}
			var primaryImageRead = fs.readFileSync(primaryImage.path);
			var encodedPrimaryImage = primaryImageRead.toString("base64");
			var primaryImageObject = {name: primaryImage.filename, contentType: primaryImage.mimetype, image: Buffer.from(encodedPrimaryImage, "base64")};
			var update = {primaryImage: primaryImageObject};
			Product.findOneAndUpdate(query, update).then(product => {
				if(!validation.isEmpty(product.primaryImage.name) && !validation.isEmpty(product.primaryImage.contentType) && !validation.isEmpty(product.primaryImage.image)) {
					fs.unlink(path.join(__dirname, "../../images/products/", product.primaryImage.name), function(error) {});
				}
                response.status(200).json({edited: true, primaryImage: primaryImageObject}).end();
            }).catch(error => console.log(error));
		} else if(type == "images"){
			var images = request.files["images"];
			if(images != null && images != "" && images.length > 0) {
				var imagesObjects = [];
				for(var image = 0; image < images.length; image++) {
					var imageRead = fs.readFileSync(images[image].path);
					var encodedImage = imageRead.toString("base64");
					var imageObject = {name: images[image].filename, contentType: images[image].mimetype, image: Buffer.from(encodedImage, "base64")};
					imagesObjects.push(imageObject);
				}
				Product.findOne(query).then(product => {
					if(!validation.isEmpty(product)) {
						var foundImagesLength = product.images.length;
						if((foundImagesLength + images.length) < 10) {
							var update = {$push: {images: imagesObjects}};
                            Product.findOneAndUpdate(query, update, {new: true}).then(savedProduct => {
                                if(!validation.isEmpty(savedProduct)) {
                                    response.status(200).json({edited: true, images: imagesObjects}).end();
                                } else {
                                    response.status(200).json({edited: false}).end(); 
                                }
                            }).catch(error => console.log(error));
						}
					}
				})
			}
		}
	});
	app.put("/deleteProductImage", (request, response) => {
		var productId = request.body.productId;
		var imageId = request.body.imageId;
        var imageName = request.body.imageName;
        if(productId && imageId) {
            var query = {_id: productId};
            var update = {$pull: {images: {_id: imageId}}};
            Product.findOneAndUpdate(query, update, {new: true}).then(product => {
                if(!validation.isEmpty(product)) {
                    fs.unlink(path.join(__dirname, "../../images/products/", imageName), function(error) {});
                    response.status(200).json({deleted: true}).end();
                } else {
                    response.status(200).json({deleted: false}).end(); 
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({deleted: false}).end();
        }
	});

	function getProductScheme(Product, title, description, price, quantity, category, technicalData, primaryImageObject, imagesObjects, review) {
		return new Product({title: title, description: description, price: price, quantity: quantity, category: category, technicalData: technicalData, primaryImage: primaryImageObject, images: imagesObjects, review: review});
	}
}