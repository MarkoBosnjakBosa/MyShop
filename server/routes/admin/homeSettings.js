module.exports = function(app, models, multer, fs, path, validation) {
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
            if(!validation.isEmpty(homeSettings)) {
                response.status(200).json({id: homeSettings[0]._id, message: homeSettings[0].message, images: homeSettings[0].images}).end();
            } else {
                response.status(200).json({id: "", message: "", images: []}).end();
            }
        }).catch(error => console.log(error));
    });
    app.post("/saveHomeSettingsMessage", (request, response) => {
        var message = request.body.message;
        if(validation.invalidMessage(message)) {
            response.status(200).json({saved: false}).end();
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
    app.post("/saveHomeSettingsImages",  upload.array("images"), (request, response) => {
        var homeSettingsId = request.body.homeSettingsId;
        var images = request.files;
        if(images != null && images != "" && images.length > 0 && !request.extensionValidationError) {
            var imagesObjects = [];
            for(var image = 0; image < images.length; image++) {
                var imageRead = fs.readFileSync(images[image].path);
                var encodedImage = imageRead.toString("base64");
                var imageObject = {name: images[image].filename, contentType: images[image].mimetype, image: Buffer.from(encodedImage, "base64")};
                imagesObjects.push(imageObject);
            }
            if(homeSettingsId != "") {
                var query = {_id: homeSettingsId};
                HomeSettings.findOne(query).then(homeSettings => {
                    if(!validation.isEmpty(homeSettings)) {
                        if((homeSettings.images.length + imagesObjects.length) < 11) {
                            var update = {$push: {images: imagesObjects}};
                            HomeSettings.findOneAndUpdate(query, update, {new: true}).then(savedHomeSettings => {
                                if(!validation.isEmpty(savedHomeSettings)) {
                                    response.status(200).json({saved: true}).end();
                                } else {
                                    response.status(200).json({saved: false}).end(); 
                                }
                            }).catch(error => console.log(error));
                        } else {
                            response.status(200).json({saved: false}).end();
                        }
                    } else {
                        response.status(200).json({saved: false}).end();
                    }
                }).catch(error => console.log(error));
            } else {
                var message = "";
                var newHomeSettings = getHomeSettingsScheme(HomeSettings, message, imagesObjects);
                newHomeSettings.save().then(savedHomeSettings => {
                    response.status(200).json({saved: true}).end();
                }).catch(error => console.log(error));
            }
        } else {
            response.status(200).json({saved: false}).end();
        }
    });
    app.put("/deleteHomeSettingsImage", (request, response) => {
        var homeSettingsId = request.body.homeSettingsId;
        var imageId = request.body.imageId;
        var imageName = request.body.imageName;
        if(homeSettingsId && imageId) {
            var query = {_id: homeSettingsId};
            var update = {$pull: {images: {_id: imageId}}};
            HomeSettings.findOneAndUpdate(query, update, {new: true}).then(homeSettings => {
                if(!validation.isEmpty(homeSettings)) {
                    fs.unlink(path.join(__dirname, "../../images/home/", imageName), function(error) {});
                    response.status(200).json({deleted: true}).end();
                } else {
                    response.status(200).json({deleted: false}).end(); 
                }
            }).catch(error => console.log(error));
        } else {
            response.status(200).json({deleted: false}).end();
        }
    });

    function getHomeSettingsScheme(HomeSettings, message, images) {
		return new HomeSettings({message: message, images: images});
	}
}