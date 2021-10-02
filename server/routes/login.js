module.exports = function(app, models, jwt, bcryptjs, smsEvents, checkStatus, validations) {
	const User = models.User;
	app.post("/checkUsername", (request, response) => {
		var username = request.body.username;
		if(username) {
			var query = {"account.username": username};
			User.findOne(query).then(user => {
				if(!validations.isEmpty(user)) {
					response.status(200).json({exists: true}).end();
				} else {
					response.status(200).json({exists: false, empty: false}).end();
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({exists: false, empty: true}).end();
		}
	});
	app.post("/login", validations.validateLogin, (request, response) => {
		var errorFields = [];
		var username = request.body.username;
		var password = request.body.password;
		var query = {"account.username": username};
		User.findOne(query).then(user => {
			if(!validations.isEmpty(user)) {
				if(user.confirmation.confirmed) {
					bcryptjs.compare(password, user.account.password, function(error, foundPassword) {
						if(foundPassword) {
							if(user.confirmation.authenticationEnabled) {
								var authenticationToken = Math.floor(100000 + Math.random() * 900000);
								var update = {"confirmation.authenticationToken": authenticationToken};
								var options = {new: true};
								User.findOneAndUpdate(query, update, options).then(updatedUser => {
									smsEvents.emit("sendAuthenticationToken", updatedUser.account.mobileNumber, updatedUser.account.firstName, updatedUser.confirmation.authenticationToken);
									setTimeout(function() { deleteAuthenticationToken(updatedUser.account.username); }, 5 * 60 * 1000);
									response.status(200).json({authentication: true, username: updatedUser.account.username}).end();
								}).catch(error => console.log(error));
							} else {
								var token = jwt.sign({userId: user._id, username: user.account.username}, process.env.JWT_SECRET_KEY);
								response.status(200).json({authentication: false, valid: true, user: user.account.username, token: token, isAdmin: user.account.isAdmin}).end();
							}
						} else {
							response.status(200).json({authentication: false, valid: false, found: true, error: "noPasswordMatch"}).end();
						}
					});
				} else {
					response.status(200).json({authentication: false, valid: false, found: true, error: "notConfirmed"}).end();	
				}
			} else {
				errorFields = [...errorFields, "username"];
				response.status(200).json({authentication: false, valid: false, found: false, errorFields: errorFields}).end();
			}
		}).catch(error => console.log(error));
	});
	app.post("/authenticate", validations.validateAuthentication, (request, response) => {
		var username = request.body.username;
		var query = {"account.username": username};
		User.findOne(query).then(user => {
			if(!validations.isEmpty(user)) {
				if(request.headers["authentication"]) {
					var authenticationToken = request.headers["authentication"];
					if(authenticationToken == user.confirmation.authenticationToken) {
						var token = jwt.sign({userId: user._id, username: user.account.username}, process.env.JWT_SECRET_KEY);
						var update = {"confirmation.authenticationToken": ""};
						var options = {new: true};
						User.findOneAndUpdate(query, update, options).then(updatedUser => {
							response.status(200).json({authenticated: true, user: updatedUser.account.username, token: token, isAdmin: updatedUser.account.isAdmin}).end();
						}).catch(error => console.log(error));
					} else {
						response.status(200).json({authenticated: false}).end();
					}
				} else {
					response.status(200).json({authenticated: false}).end();
				}
			} else {
				response.status(200).json({authenticated: false}).end();
			}
		}).catch(error => console.log(error));
	});
	app.post("/sendAuthenticationToken", (request, response) => {
		var username = request.body.username;
		var query = {"account.username": username};
		User.findOne(query).then(user => {
			if(!validations.isEmpty(user)) {
				if(user.confirmation.authenticationEnabled) {
					var authenticationToken = Math.floor(100000 + Math.random() * 900000);
					var update = {"confirmation.authenticationToken": authenticationToken};
					User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
						smsEvents.emit("sendAuthenticationToken", updatedUser.account.mobileNumber, updatedUser.account.firstName, updatedUser.confirmation.authenticationToken);
						setTimeout(function() {
							deleteAuthenticationToken(updatedUser.account.username);    
						}, 5 * 60 * 1000);
						response.status(200).json({sent: true}).end();
					}).catch(error => console.log(error));
				}
			}
		}).catch(error => console.log(error));
	});
	app.get("/checkStatus", checkStatus.isLoggedIn, (request, response) => {
		response.status(200).json({loggedIn: true}).end();
	});

	function deleteAuthenticationToken(username) {
		var query = {"account.username": username};
		var update = {"confirmation.authenticationToken": ""};
		User.findOneAndUpdate(query, update, {new: true}).then().catch(error => console.log(error));
	}
}
