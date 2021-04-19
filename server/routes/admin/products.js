module.exports = function(app, models, multer, validation) {
    var storage = multer.diskStorage({
		destination: function (request, file, callback) {
			callback(null, "../images/products");
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
			if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
				callback(null, true);
			} else {
				request.extensionValidationError = true;
				return callback(null, false, request.extensionValidationError);
			}
		},
		limits: {fileSize: 500000}
	});
    app.post("/createProduct", upload.single("images"), (request, response) => {
		var allowRegistration = true;
		var errorFields = [];
		var username = request.body.username;
		if(!username || invalidUsername(username)) {
			errorFields.push("username");
			allowRegistration = false;
		}
		var email = request.body.email;
		if(!email || invalidEmail(email)) {
			errorFields.push("email");
			allowRegistration = false;
		}
		var password = request.body.password;
		if(!password || invalidPassword(password)) {
			errorFields.push("password");
			allowRegistration = false;
		}
		var firstName = request.body.firstName;
		if(!firstName) {
			errorFields.push("firstName");
			allowRegistration = false;
		}
		var lastName = request.body.lastName;
		if(!lastName) {
			errorFields.push("lastName");
			allowRegistration = false;
		}
		var avatar = request.file;
		if(!avatar && request.extensionValidationError) {
			errorFields.push("avatar");
			allowRegistration = false;
		}
		if(allowRegistration) {
			var query = {$or: [{username: username}, {email: email}]};
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					var error = {created: false, alreadyExists: true};
					if(user.username == username) {
						error.field = "username";
					} else {
						error.field = "email";
					}
					response.status(200).json(error);
					response.end();
				} else {
					var sendNewsletters = true;
					var accepted = false;
					var acceptanceToken = Math.floor((Math.random() * 100) + 54);
					var isAdmin = false;
					var avatarImage = fs.readFileSync(avatar.path);
					var encodedAvatarImage = avatarImage.toString("base64");
					var avatarObject = {name: avatar.filename, contentType: avatar.mimetype, image: Buffer.from(encodedAvatarImage, "base64")};
					var newUser = getUserScheme(User, username, email, password, firstName, lastName, avatarObject, sendNewsletters, accepted, acceptanceToken, isAdmin);
					bcryptjs.genSalt(10, (error, salt) => {
						bcryptjs.hash(newUser.password, salt, (error, hash) => {
							newUser.password = hash;
							newUser.save().then(user => {
								sendConfirmationEmail(user.email, user.firstName, user.username, acceptanceToken);
								response.status(200).json({created: true});
								response.end();
							}).catch(error => console.log(error));
						});
					});
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({created: false, alreadyExists: false, errorFields: errorFields});
			response.end();
		}
	});
}