module.exports = function(app, models, uploadImages, fs, path, validation) {
	const Product = models.Product;
	app.post("/getProducts", (request, response) => {
		var search = request.body.search;
		var category = request.body.category;
		var page = Number(request.body.page) - 1; 
		var limit = Number(request.body.limit);
		var skip = page * limit;
		var orderBy = request.body.orderBy;
		var sort = {};
		switch(orderBy) {
			case "titleAsc":
				sort = {"title": 1};
				break;
			case "titleDesc":
				sort = {"title": -1};
				break;
			case "priceAsc":
				sort = {"price": 1};
				break;
			case "priceDesc":
				sort = {"price": -1};
				break;
			default:
			  	sort = {};
		}
		var categoryQuery = category != "" ? {category: category} : {};
		var query = search != "" ? {$and: [categoryQuery, {$or: [{title: {$regex: search, $options: "i" }}, {description: {$regex: search, $options: "i"}}]}]} : categoryQuery;
		var productsQuery = Product.find(query).sort(sort).skip(skip).limit(limit);
		var totalQuery = Product.find(query).countDocuments();
		var queries = [productsQuery, totalQuery];
		Promise.all(queries).then(results => {
			var total = results[1];
			var pagesNumber = 1;
			if(total >= limit) pagesNumber = Math.ceil(total / limit);
			response.status(200).json({products: results[0], total: total, pagesNumber: pagesNumber}).end();
		});
    });
	app.get("/getProduct/:productId", (request, response) => {
		var productId = request.params.productId;
		var query = {_id: productId};
        Product.findOne(query).then(product => {
            response.status(200).json({product: product}).end();
        }).catch(error => console.log(error));
	});
    app.post("/createProduct", uploadImages.fields([{name: "primaryImage"}, {name: "images", maxCount: 9}]), validation.validateProductCreation, (request, response) => {
		var title = request.body.title;
		var description = request.body.description;
		var price = request.body.price;
		var quantity = request.body.quantity;
		var category = request.body.category;
		var primaryImage = request.files["primaryImage"][0];
		var technicalData = JSON.parse(request.body.technicalData);
		var primaryImageRead = fs.readFileSync(primaryImage.path);
		var encodedPrimaryImage = primaryImageRead.toString("base64");
		var primaryImageObject = {name: primaryImage.filename, contentType: primaryImage.mimetype, image: Buffer.from(encodedPrimaryImage, "base64")};
		var images = request.files["images"];
		var imagesObjects = [];
		if(images != null && images != "" && images.length > 0 && images.length < 10) {
			for(var image = 0; image < images.length; image++) {
				var imageRead = fs.readFileSync(images[image].path);
				var encodedImage = imageRead.toString("base64");
				var imageObject = {name: images[image].filename, contentType: images[image].mimetype, image: Buffer.from(encodedImage, "base64")};
				imagesObjects.push(imageObject);
			}
		} else {
			response.status(200).json({created: false, errorFields: ["images"]}).end();
		}
		var review = {votes: 0, rating: 0, averageRating: 0};
		var newProduct = getProductScheme(Product, title, description, price, quantity, category, technicalData, primaryImageObject, imagesObjects, review);
		newProduct.save().then(product => {
			response.status(200).json({created: true}).end();
		}).catch(error => console.log(error));
	});
	app.put("/editProduct", uploadImages.fields([{name: "primaryImage"}, {name: "images", maxCount: 9}]), validation.validateProductEdit, (request, response) => {
		var productId = request.body.productId;
		var query = {_id: productId};
		var type = request.body.type;
		if(type == "main") {
			var title = request.body.title;
			var description = request.body.description;
			var price = request.body.price;
			var quantity = request.body.quantity;
			var category = request.body.category;
			var update = {title: title, description: description, price: price, quantity: quantity, category: category};
			Product.findOneAndUpdate(query, update).then(product => {
				response.status(200).json({edited: true}).end();
			}).catch(error => console.log(error));
		} else if(type == "technicalData") {
			var technicalData = JSON.parse(request.body.technicalData);
			var update = {technicalData: technicalData};
			Product.findOneAndUpdate(query, update).then(product => {
				response.status(200).json({edited: true}).end();
			}).catch(error => console.log(error));
		} else if(type == "primaryImage") {
			var primaryImage = request.files["primaryImage"][0];
			var primaryImageRead = fs.readFileSync(primaryImage.path);
			var encodedPrimaryImage = primaryImageRead.toString("base64");
			var primaryImageObject = {name: primaryImage.filename, contentType: primaryImage.mimetype, image: Buffer.from(encodedPrimaryImage, "base64")};
			var update = {primaryImage: primaryImageObject};
			Product.findOneAndUpdate(query, update).then(product => {
				fs.unlink(path.join(__dirname, "../../images/products/", product.primaryImage.name), function(error) {});
                response.status(200).json({edited: true, primaryImage: primaryImageObject}).end();
            }).catch(error => console.log(error));
		} else if(type == "images"){
			var images = request.files["images"];
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
			});
		}
	});
	app.put("/deleteProductImage", (request, response) => {
		var productId = request.body.productId;
		var imageId = request.body.imageId;
        var imageName = request.body.imageName;
		if(productId && imageId && imageName) {
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
	app.delete("/deleteProduct/:productId", (request, response) => {
		var productId = request.params.productId;
		if(productId) {
			var query = {_id: productId};
			Product.findOneAndRemove(query).then(product => {
				if(!validation.isEmpty(product)) {
					var primaryImage = product.primaryImage;
					fs.unlink(path.join(__dirname, "../../images/products/", primaryImage.name), function(error) {});
					var images = product.images;
					for(var image = 0; image < images.length; image++) {
						fs.unlink(path.join(__dirname, "../../images/products/", images[image].name), function(error) {});
					}
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