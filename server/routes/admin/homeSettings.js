module.exports = function(app, models, multer, fs, validation) {
    const HomeSettings = models.HomeSettings;
    var storage = multer.diskStorage({
		destination: function (request, file, callback) {
			callback(null, "images/home");
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
    app.get("/getHomeSettings", (request, response) => {
        var query = {};
        HomeSettings.find(query).then(homeSettings => {
            response.status(200).json({id: homeSettings[0]._id, message: homeSettings[0].message, images: homeSettings[0].images}).end();
        }).catch(error => console.log(error));
    });
    app.post("/saveHomeSettingsMessage", (request, response) => {
        var message = request.body.message;
        if(validation.invalidMessage(message)) {
            errorFields.push("message");
            response.status(200).json({saved: false, errorFields: errorFields}).end();
        } else {
            var id = request.body.id;
            var query = {_id: id};
            var update = {message: message};
            var options = {upsert: true, new: true, setDefaultsOnInsert: true};
            HomeSettings.findOneAndUpdate(query, update, options).then(savedMessage => {
                response.status(200).json({saved: true}).end();
            }).catch(error => console.log(error));
        }
    });
    app.post("/saveHomeSettingsImages",  upload.array("images", 10), (request, response) => {
        var id = request.body.id;
        var images = request.files;
        var imagesObjects = [];
        if(images != null && images != "" && images.length > 0 && images.length < 11) {
            for(var image = 0; image < images.length; image++) {
                var imageRead = fs.readFileSync(images[image].path);
                var encodedImage = imageRead.toString("base64");
                var imageObject = {name: images[image].filename, contentType: images[image].mimetype, image: Buffer.from(encodedImage, "base64")};
                imagesObjects.push(imageObject);
            }
        }
        var query = {_id: id};
        var update = {images: imagesObjects};
        var options = {upsert: true, new: true, setDefaultsOnInsert: true};
        HomeSettings.findOneAndUpdate(query, update, options).then(savedImages => {
            response.status(200).json({saved: true}).end();
        }).catch(error => console.log(error));
    });
}