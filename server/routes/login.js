module.exports = function(app, jwt, bcryptjs, nexmo, models) {
    const User = models.User;
    app.post("/checkUsername", (request, response) => {
		var username = request.body.username;
		if(username) {
			var query = {username: username};
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					response.status(200).json({exists: true});
					response.end();
				} else {
					response.status(200).json({exists: false, empty: false});
					response.end();
				}
			}).catch(error => console.log(error));
		} else {
			response.status(200).json({exists: false, empty: true});
			response.end();
		}
	});
	app.post("/login", (request, response) => {
		var errorFields = [];
		var username = request.body.username;
		if(username && validUsername(username)) {
			var query = {username: username};
			User.findOne(query).then(user => {
				if(!isEmpty(user)) {
					if(user.accepted) {
						if(user.authenticationEnabled) {
							if(request.headers["Authentication"]) { 
								var authenticationToken = request.headers["Authentication"];
								if(authenticationToken == user.authenticationToken) {
									const token = jwt.sign({userId: user._id, username: user.username}, "newSecretKey", {expiresIn: "2h"});
									response.status(200).json({authentication: true, valid: true, token: token, user: user.username});
									response.end();
								} else {
									response.status(200).json({authentication: true, valid: false, otpToken: false});
									response.end();
								}
							} else {
								response.status(200).json({authentication: true, valid: false, otpToken: true, username: user.username});
								response.end();
							}
						} else {
							var password = request.body.password;
							if(password && validPassword(password)) {
								bcryptjs.compare(password, user.password, function(error, foundPassword) {
									if(foundPassword) {
										const token = jwt.sign({userId: user._id, username: user.username}, "newSecretKey", {expiresIn: "2h"});
										response.status(200).json({authentication: false, valid: true, token: token, user: user.username});
										response.end();
									} else {
										response.status(200).json({authentication: false, valid: false, allowed: true});
										response.end();
									}
								});
							} else {
								errorFields.push("password");
								response.status(200).json({authentication: false, valid: false, allowed: false});
								response.end();
							}
						}
					} else {
						errorFields.push("username");
						response.status(200).json({authentication: false, valid: false, allowed: false});
						response.end();
					}
				} else {
					errorFields.push("username");
					response.status(200).json({authentication: false, valid: false, allowed: false});
					response.end();
				}
			}).catch(error => console.log(error));
		} else {
			errorFields.push("username");
			response.status(200).json({authentication: false, valid: false, allowed: false});
			response.end();
		}
	});
	app.get("/checkStatus", (request, response) => {
		try {
			const token = request.headers.authorization.split(" ")[1];
			const decodedToken = jwt.verify(token, "newSecretKey");
			request.userData = decodedToken;
			response.status(200).json({loggedIn: true});
		} catch(error) {
			response.status(401).json({loggedIn: false});
		}
	});

    app.get("/send", (request, response) => {
        console.log("23");
		const from = 'Vonage APIs';
        const to = '491733857104';
        const text = 'Hello from Vonage SMS API';
        console.log("45");
        console.log(nexmo);
        nexmo.message.sendSms(from, to, text);
        response.status(200).json({artists: "success"});
        response.end();
        console.log("46");
	});

    function isEmpty(object) {
		return !object || Object.keys(object).length === 0;
 	}
}
