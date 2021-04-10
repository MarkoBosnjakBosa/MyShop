module.exports = function(app, jwt, bcryptjs, models, smsEvent) {
    const User = models.User;
    app.post("/checkUsername", (request, response) => {
		var username = request.body.username;
		if(username) {
			var query = {username: username};
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					response.status(200).json({exists: true}).end();
				} else {
					response.status(200).json({exists: false, empty: false}).end();
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({exists: false, empty: true}).end();
		}
	});
	app.post("/login", (request, response) => {
		var errorFields = [];
		var username = request.body.username;
		if(validUsername(username)) {
			var query = {username: username};
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					if(user.accepted) {
						if(user.authenticationEnabled) {
							if(request.headers["authentication"]) {
								var authenticationToken = request.headers["authentication"];
								if(authenticationToken == user.authenticationToken) {
									const token = jwt.sign({userId: user._id, username: user.username}, "newSecretKey", {expiresIn: "2h"});
									var update = {authenticationToken: ""};
									User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
										response.status(200).json({authentication: true, valid: true, token: token, user: updatedUser.username}).end();
									}).catch(error => console.log(error));
								} else {
									response.status(200).json({authentication: true, valid: false, authenticationToken: false}).end();
								}
							} else {
								var authenticationToken = Math.floor(100000 + Math.random() * 900000);
            					var update = {authenticationToken: authenticationToken};
								User.findOneAndUpdate(query, update, {new: true}).then(updatedUser => {
									//smsEvent.emit("sendAuthenticationToken", updatedUser.mobileNumber, updatedUser.firstName, updatedUser.authenticationToken);
									response.status(200).json({authentication: true, valid: false, authenticationToken: true, username: user.username}).end();
								}).catch(error => console.log(error));
							}
						} else {
							var password = request.body.password;
							if(validPassword(password)) {
								bcryptjs.compare(password, user.password, function(error, foundPassword) {
									if(foundPassword) {
										const token = jwt.sign({userId: user._id, username: user.username}, "newSecretKey", {expiresIn: "2h"});
										response.status(200).json({authentication: false, valid: true, token: token, user: user.username}).end();
									} else {
										response.status(200).json({authentication: false, valid: false, allowed: true}).end();
									}
								});
							} else {
								errorFields.push("password");
								response.status(200).json({authentication: false, valid: false, allowed: false, errorFields: errorFields}).end();
							}
						}
					} else {
						errorFields.push("username");
						response.status(200).json({authentication: false, valid: false, allowed: false, errorFields: errorFields}).end();
					}
				} else {
					errorFields.push("username");
					response.status(200).json({authentication: false, valid: false, allowed: false, errorFields: errorFields}).end();
				}
			}).catch(error => console.log(error));
		} else {
			errorFields.push("username");
			response.status(200).json({authentication: false, valid: false, allowed: false, errorFields: errorFields}).end();
		}
	});
	app.get("/checkStatus", (request, response) => {
		try {
			const token = request.headers.authorization.split(" ")[1];
			const decodedToken = jwt.verify(token, "newSecretKey");
			request.userData = decodedToken;
			response.status(200).json({loggedIn: true}).end();
		} catch(error) {
			response.status(401).json({loggedIn: false}).end();
		}
	});

    function validUsername(username) {
		var usernameFormat = /^[a-z0-9_.-]*$/;
		if(username != "" && usernameFormat.test(username)) {
			return true;
		} else {
			return false;
		}
	}
	function validPassword(password) {
		var passwordFormat = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if(password != "" && passwordFormat.test(password)) {
			return true;
		} else {
			return false;
		}
	}
 	function isEmpty(object) {
		return !object || Object.keys(object).length === 0;
 	}
}
