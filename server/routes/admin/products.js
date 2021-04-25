module.exports = function(app, models, multer, fs, validation) {
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
	app.get("/getProducts", (request, response) => {
        var query = {};
        Product.find(query).then(products => {
            response.status(200).json({products: products}).end();
        }).catch(error => console.log(error));
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

	function getProductScheme(Product, title, description, price, quantity, category, technicalData, primaryImageObject, imagesObjects, review) {
		return new Product({title: title, description: description, price: price, quantity: quantity, category: category, technicalData: technicalData, primaryImage: primaryImageObject, images: imagesObjects, review: review});
	}
}